import { expect } from "jsr:@std/expect";
import { Board } from "./board.js";

// Hilfsfunktion Feld mit Wert füllen
function fullBoard(value) {
  const rows = [];
  for (let r = 0; r < 8; r++) {
    const row = [];
    for (let c = 0; c < 8; c++) {
      row.push(value);
    }
    rows.push(row);
  }
  return rows;
}

Deno.test("Board constructor setzt Startstellung korrekt", () => { // Grundzustand 
  const board = new Board();
  expect(board.fields[3][3]).toBe(2);
  expect(board.fields[3][4]).toBe(1);
  expect(board.fields[4][3]).toBe(1);
  expect(board.fields[4][4]).toBe(2);

  const empties = board.fieldsWithState(0);
  expect(empties.length).toBe(64 - 4);
});

Deno.test("Board.of wirft bei falscher Zeilenanzahl", () => {
  const wrong = [[0]]; // nur 1 Zeil
  expect(() => Board.of(wrong)).toThrow(RangeError);
});

Deno.test("Board.of wirft bei falscher Spaltenanzahl", () => {
  const rows = [];
  for (let r = 0; r < 8; r++) {
    rows.push([0, 0, 0]); // zu wenig Spalten
  }
  expect(() => Board.of(rows)).toThrow(RangeError);
});

Deno.test("Board.of wirft bei illegalem Feldwert", () => {
  const rows = fullBoard(0);
  rows[0][0] = 99;
  expect(() => Board.of(rows)).toThrow(RangeError);
});

Deno.test("Board.of erzeugt Board mit gültigen Werten", () => {
  const rows = fullBoard(1);
  const board = Board.of(rows);
  expect(board.fields[0][0]).toBe(1);
  expect(board.fields[7][7]).toBe(1);
});

Deno.test("fieldsWithState findet alle Felder mit bestimmtem Zustand", () => {
  const rows = fullBoard(0);
  rows[1][2] = 1;
  rows[3][4] = 1;
  const board = Board.of(rows);

  const ones = board.fieldsWithState(1);
  expect(ones).toEqual([[1, 2], [3, 4]]);
});

Deno.test("opponent liefert jeweils den anderen Spieler", () => {
  const board = new Board();
  expect(board.opponent(1)).toBe(2);
  expect(board.opponent(2)).toBe(1);
  expect(() => board.opponent(0)).toThrow(RangeError);
});

Deno.test("result unfinished: kein Gewinner, finished=false", () => {
  const board = new Board();
  const result = board.result();
  expect(result.finished).toBe(false);
  expect(result.winner).toBe(0);
  expect(result.tied).toBe(false);
});

Deno.test("result finished: Spieler 1 gewinnt", () => {
  const rows = fullBoard(1); // nur Spieler 1
  const board = Board.of(rows);
  const result = board.result();
  expect(result.finished).toBe(true);
  expect(result.winner).toBe(1);
  expect(result.tied).toBe(false);
});

Deno.test("result finished: Spieler 2 gewinnt", () => {
  const rows = fullBoard(2); // nur Spieler 2
  const board = Board.of(rows);
  const result = board.result();
  expect(result.finished).toBe(true);
  expect(result.winner).toBe(2);
  expect(result.tied).toBe(false);
});

Deno.test("result finished: Gleichstand", () => {
  const rows = fullBoard(1);
  // oben Player 1, unten Player 2
  for (let r = 4; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      rows[r][c] = 2;
    }
  }
  const board = Board.of(rows);
  const result = board.result();
  expect(result.finished).toBe(true);
  expect(result.winner).toBe(0);
  expect(result.tied).toBe(true);
});


Deno.test("copy erzeugt tiefe Kopie des Boards", () => {
  const board = new Board();
  const clone = board.copy();

  expect(clone.fields[3][3]).toBe(board.fields[3][3]);

  board.fields[3][3] = 0;
  expect(clone.fields[3][3]).toBe(2);
});


Deno.test("validMoves wirft bei illegalem Spieler", () => {
  const board = new Board();
  expect(() => board.validMoves(0)).toThrow(RangeError);
});

Deno.test("validMoves für Startstellung Spieler 1 liefert vier Züge", () => {
  const board = new Board();
  const moves = board.validMoves(1);
  const asArray = [...moves];
  const expected = [
    [2, 3],
    [3, 2],
    [4, 5],
    [5, 4],
  ];
  expect(asArray).toEqual(expected);
});

Deno.test("validMoves kann auch keine möglichen Züge liefern", () => {
  // voller Board nur mit Spieler 1, Spieler 2 keine Züge
  const board = Board.of(fullBoard(1));
  const moves = board.validMoves(2);
  expect(moves.size).toBe(0);
});


Deno.test("play wirft bei illegalem Spieler", () => {
  const board = new Board();
  expect(() => board.play(0, 0, 0)).toThrow(RangeError);
});

Deno.test("play wirft bei nichtnumerischen Koordinaten", () => {
  const board = new Board();
  expect(() => board.play("0", 0, 1)).toThrow(TypeError);
});

Deno.test("play wirft bei Zug außerhalb des Bretts", () => {
  const board = new Board();
  expect(() => board.play(-1, 0, 1)).toThrow(RangeError);
  expect(() => board.play(0, 8, 1)).toThrow(RangeError);
});

Deno.test("play wirft bei Zug, der nicht in validMoves enthalten ist", () => {
  const board = new Board();
  expect(() => board.play(0, 0, 1)).toThrow(RangeError);
});

Deno.test("play führt gültigen Zug aus und kippt Steine korrekt", () => {
  const board = new Board();
  const newBoard = board.play(2, 3, 1);

  expect(newBoard.fields[2][3]).toBe(1);

  expect(board.fields[3][3]).toBe(2);
  expect(newBoard.fields[3][3]).toBe(1);
});