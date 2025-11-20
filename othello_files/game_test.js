import { expect } from "jsr:@std/expect";

function setupDomMock() {
  const elementsById = {
    board: {
      children: [],
      get firstChild() {
        return this.children[0] ?? null;
      },
      appendChild(node) {
        this.children.push(node);
        if (node.id) {
          elementsById[node.id] = node;
        }
      },
      removeChild(node) {
        const idx = this.children.indexOf(node);
        if (idx >= 0) this.children.splice(idx, 1);
      },
    },
    playerOne: { textContent: "" },
    playerTwo: { textContent: "" },
    status: { textContent: "" },
    result: { textContent: "" },
  };

  globalThis.document = {
    getElementById(id) {
      return elementsById[id];
    },
    createElement(_tag) {
      const div = {
        id: "",
        classes: [],
        classList: {
          add(cls) {
            div.classes.push(cls);
          },
        },
        addEventListener(_event, _handler) {
        },
        removeEventListener(_event, _handler) {
        },
      };
      return div;
    },
  };

  return elementsById;
}

let gameModulePromise;

async function loadGameModule() {
  if (!globalThis.document) {
    setupDomMock();
  }
  if (!gameModulePromise) {
    gameModulePromise = import("./game.js");
  }
  return await gameModulePromise;
}


function withMockedRandom(value, fn) {
  const original = Math.random;
  Math.random = () => value;
  try {
    fn();
  } finally {
    Math.random = original;
  }
}

Deno.test("fieldId baut ID aus row und col", async () => {
  const { fieldId } = await loadGameModule();
  expect(fieldId(2, 5)).toBe("2-5");
});

Deno.test("deleteChildren entfernt alle", async () => {
  const { deleteChildren } = await loadGameModule();

  const child1 = {};
  const child2 = {};
  const container = {
    children: [child1, child2],
    get firstChild() {
      return this.children[0] ?? null;
    },
    removeChild(node) {
      const idx = this.children.indexOf(node);
      if (idx >= 0) this.children.splice(idx, 1);
    },
  };

  deleteChildren(container);
  expect(container.children.length).toBe(0);
});

Deno.test("randomElement wirft bei leerem Array", async () => {
  const { randomElement } = await loadGameModule();
  expect(() => randomElement([])).toThrow(RangeError);
});

Deno.test("randomElement wählt Elemente gemäss Math.random", async () => {
  const { randomElement } = await loadGameModule();
  const arr = ["a", "b", "c"];

  withMockedRandom(0.0, () => {
    expect(randomElement(arr)).toBe("a");
  });
  withMockedRandom(0.999, () => {
    expect(randomElement(arr)).toBe("c");
  });
});

// Fake-Boards
class FakeBoardNoMoves {
  validMoves() {
    return new Set();
  }
}

class FakeBoardSomeMoves {
  constructor() {
    this.calls = [];
  }
  validMoves(player) {
    this.calls.push(player);
    return new Set([
      [0, 1],
      [2, 3],
    ]);
  }
}

Deno.test("randomMove liefert undefined, wenn keine Züge möglich sind", async () => {
  const { randomMove } = await loadGameModule();
  const board = new FakeBoardNoMoves();
  const move = randomMove(board, 1);
  expect(move).toBeUndefined();
});

Deno.test("randomMove liefert einen Zug aus der Menge", async () => {
  const { randomMove } = await loadGameModule();
  const board = new FakeBoardSomeMoves();

  withMockedRandom(0.0, () => {
    const move = randomMove(board, 2);
    expect(move).toEqual([0, 1]);
  });
  expect(board.calls).toEqual([2]);
});

Deno.test("opponentMove delegiert an randomMove", async () => {
  const { opponentMove } = await loadGameModule();
  const board = new FakeBoardSomeMoves();

  withMockedRandom(0.999, () => {
    const move = opponentMove(board, 1);
    expect(move).toEqual([2, 3]);
  });
  expect(board.calls).toEqual([1]);
});