/// @ts-check
/// <reference path=".gitpod/p5.global-mode.d.ts" />
"use strict";

/* Game opdracht
   Informatica - Emmauscollege Rotterdam
   Template voor een game in JavaScript met de p5 library

   Begin met dit template voor je game opdracht,
   voeg er je eigen code aan toe.
 */

// globale variabelen die je gebruikt in je game

const HOME = 0
const SPELEN = 1;
const GAMEOVER = 2;
var spelStatus = SPELEN;

const TetriminoVariaties = [  // Alle verschillende soorten blokjes die je kunt hebben
    [[1, 1, 1, 1], [0, 0, 0, 0]], // Straight tetromino
    [[1, 1, 0, 0], [1, 1, 0, 0]], // Square tetromino
    [[0, 1, 0, 0], [1, 1, 1, 0]], // T-tetromino
    [[1, 0, 0, 0], [1, 1, 1, 0]], // J-tetromino
    [[0, 0, 1, 0], [1, 1, 1, 0]], // L-tetromino
    [[0, 1, 1, 0], [1, 1, 0, 0]], // S-tetromino
    [[1, 1, 0, 0], [0, 1, 1, 0]]  // Z-tetromino
];

var score = 0; // aantal behaalde punten
var curBlock = Array.from(Array(4), () => new Array(4));
var curBlockPos = new Array(3);
var bord = Array.from(Array(16), () => new Array(10)); // 2D array - 16 hoog en 10 breed

// functies die je gebruikt in je game

// Reset het spel naar beginstand
var reset = function () {
    //zet var bord naar 0
    for (var i = 0; i < 16; i++) {      // bord is 16 hoog
        for (var j = 0; j < 10; j++) {  // bord is 10 breed
            bord[i][j] = 0;
        }
    }
    newCurBlock();
    curBlockPos = [0, 0, 0];
}

/* setup
   de code in deze functie wordt één keer uitgevoerd door
   de p5 library, zodra het spel geladen is in de browser
 */
function setup() {
    // Maak een canvas (rechthoek) waarin je je speelveld kunt tekenen
    createCanvas(1280, 720);

    // Kleur de achtergrond wit, zodat je het kunt zien
    background('white');

    //Zet alle variabelen naar de beginstand
    reset();
}

var newCurBlock = function () {
    curBlock = TetriminoVariaties[Math.floor(Math.random() * 7)]; // Pakt 1 van de 7 variaties random
}


var rotateBlock = function () {
    var TempCurBlockPos = Array.from(Array(4), () => new Array(4));
    
            // Normale blokken
    TempCurBlockPos[0][2] = curBlock[0][0]; // Eng patroon ineens (misschien ga ik dit ooit efficient doen)
    TempCurBlockPos[2][2] = curBlock[0][2]; // Nog niet uitgewerkt hoe tho
    TempCurBlockPos[2][0] = curBlock[2][2];
    TempCurBlockPos[0][0] = curBlock[2][0];

    TempCurBlockPos[1][2] = curBlock[0][1];
    TempCurBlockPos[2][1] = curBlock[1][2];
    TempCurBlockPos[1][0] = curBlock[2][1];
    TempCurBlockPos[0][1] = curBlock[1][0];
    
    curBlock = TempCurBlockPos;
}


/**
 * draw
 * de code in deze functie wordt meerdere keren per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
/*function draw() {
  switch (spelStatus) {
      case SPELEN:
          
      break;
  }
}*/

function draw() {

    // Zet het huidige blokje in het bord
    // Alle vakjes van rij 1
    for (var i = 0; i < 4; i++) {
        if (curBlock[0][i] === 1) {
            bord[curBlockPos[0]][curBlockPos[1] + i] = 1;
        }
    }
    // Alle vakjes van rij 2
    for (var i = 0; i < 4; i++) {
        if (curBlock[1][i] === 1) {
            bord[curBlockPos[0]+1][curBlockPos[1] + i] = 1;
        }
    }
    
    // Tekent het bord
    for (var i = 0; i < 16; i++) {      // bord is 16 hoog
        for (var j = 0; j < 10; j++) {  // bord is 10 breed
            if (bord[i][j] != 0) { // Vraag niet waarom dit is de enige manier hoe ik dit heb kunnen laten werken
                fill("black");
            } else {
                fill("white");
            }
            rect(j * 45, i * 45, 45, 45); // Tekent veld per blokje
        }
    }


    // Verwijderd het huidige blokje uit het bord
    fill(0, 0, 0);
    //@ts-ignore
    text(curBlock, 10, 710, 70, 80);


}