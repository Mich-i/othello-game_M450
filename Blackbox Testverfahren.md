# Blackbox-Testverfahren, Aufgaben 3 und 4

## Aufgabe 3 – Zustandsbasierter Test

### Testfall 1 – Negativtest: unerlaubter Spielzug

- **Vorbedingung:**  
  Standard-Startzustand des Spiels (8×8-Brett).  
  Belegte Felder:  
  `[3,4]=Schwarz(1), [4,3]=Schwarz(1), [3,3]=Weiss(2), [4,4]=Weiss(2)`.  
  Spieler am Zug: **Schwarz (1)**.

- **Ereignis:**  
  Aufruf `play(0, 0, 1)` (Ecke oben links).

- **Sollreaktion:**  
  Ausnahme (`RangeError`), da der Zug nicht in `validMoves(1)` enthalten ist.  
  Fehlermeldung:  
  `move [0/0] is not valid for player 1`.

- **Nachbedingung:**  
  Das Spielfeld bleibt unverändert (Immutabilität).  
  Zähler: Schwarz = 2, Weiss = 2.

---

### Testfall 2 – Positivtest: erlaubter Spielzug

- **Vorbedingung:**  
  Standard-Startzustand wie oben.  
  Spieler am Zug: **Schwarz (1)**.

- **Ereignis:**  
  Aufruf `play(2, 3, 1)` – ein gültiger Zug im Startzustand.

- **Sollreaktion:**  
  - Feld `[2,3]` wird Schwarz (1).  
  - Richtung **Süd**: `[3,3]` (Weiss) wird zu Schwarz (1) umgedreht, da ein eigener Stein `[4,3]=1` folgt.

- **Nachbedingung:**  
  Neues Board-Objekt mit aktualisiertem Zustand.  
  Zähler: **Schwarz = 4**, **Weiss = 1**.  
  Keine weiteren Richtungen werden in diesem Zug verändert.

---

## Aufgabe 4 – Entscheidungstabellentest

### Beschreibung
Die Methode `Board.result()` gibt das Spielergebnis des aktuellen Spielzustands zurück.  
Das Feld `tied` zeigt, ob das Spiel **unentschieden** ist.

Für den Test wird eine **Entscheidungstabelle** erstellt, die Kombinationen der Bedingungen „Board voll?“ und „Steine gleich?“ betrachtet.  
Es müssen **nur die Bedingungen und die Tabelle** erstellt werden, keine Implementierung.

---

### Bedingungen

| Kürzel | Bedingung |
|:-------|:-----------|
| **B1** | Board voll (keine leeren Felder) |
| **B2** | Anzahl Steine gleich (`playerOne == playerTwo`) |

---

### Ergebnisse

| Kürzel | Ergebnis |
|:-------|:----------
| **E1** | Spiel **nicht fertig** (`finished=false`, `tied=false`, `winner=0`) |
| **E2** | **Unentschieden** (`finished=true`, `tied=true`, `winner=0`) |
| **E3** | **Sieg** (`finished=true`, `tied=false`, `winner ∈ {1,2}`) |

---

### Wahrheits- und Wirkungsmatrix

| Bedingung | **K1** | **K2** | **K3** | **K4** |
|------------|:------:|:------:|:------:|:------:|
| **B1: Board voll?** | w | w | f | f |
| **B2: Steine gleich?** | w | f | w | f |
| **Ergebnis E1: nicht fertig** | – | – | x | x |
| **Ergebnis E2: unentschieden** | x | – | – | – |
| **Ergebnis E3: Sieg** | – | x | – | – |


- **K1 (B1 = w, B2 = w):** Board voll und gleiche Steine → **Unentschieden** (`E2`)  
- **K2 (B1 = w, B2 = f):** Board voll und ungleiche Steine → **Sieg** (`E3`)  
- **K3 (B1 = f, B2 = w):** Board nicht voll und gleiche Steine → **nicht fertig** (`E1`)  
- **K4 (B1 = f, B2 = f):** Board nicht voll und ungleiche Steine → **nicht fertig** (`E1`)