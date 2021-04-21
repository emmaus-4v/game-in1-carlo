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
    [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // Straight tetromino
    [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // Square tetromino
    [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // T-tetromino
    [[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // J-tetromino
    [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // L-tetromino
    [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // S-tetromino
    [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]  // Z-tetromino
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

// CurBlockPos slaat belangerijke info op over de staat van de curBlock
// CurBlockPos heeft 4 stukken info
// 1: de y coordinaat
// 2: de x coordinaat
// 3: de soort tetromino
// 4: de rotatie (1 - 4, waarvan 1 geen rotatie is, en 4 driekwart gedraad is)
var newCurBlock = function () {
    var randomTetrimino = Math.floor(Math.random() * 7); // Pakt een random tetrimino
    curBlock = TetriminoVariaties[randomTetrimino];      // Zet de random tetrimino in curBlock
    curBlockPos = [0, 0, randomTetrimino, 0]
}


var rotateBlock = function () {
    var TempCurBlockPos = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    
    if(curBlockPos[3] > 1) {                // Normale blokken (T, J, L, S, Z)
    TempCurBlockPos[0][2] = curBlock[0][0]; // Eng patroon ineens (misschien ga ik dit ooit efficient doen)
    TempCurBlockPos[2][2] = curBlock[0][2]; // Nog niet uitgewerkt hoe tho
    TempCurBlockPos[2][0] = curBlock[2][2];
    TempCurBlockPos[0][0] = curBlock[2][0];

    TempCurBlockPos[1][2] = curBlock[0][1];
    TempCurBlockPos[2][1] = curBlock[1][2];
    TempCurBlockPos[1][0] = curBlock[2][1];
    TempCurBlockPos[0][1] = curBlock[1][0];
    TempCurBlockPos[1][1] = 1;
    } else if (curBlockPos[3] === 0) {      // Straight Tetrimino
    TempCurBlockPos[0][0] = curBlock[0][0];
    TempCurBlockPos[1][0] = curBlock[0][1];
    TempCurBlockPos[2][0] = curBlock[0][2];
    TempCurBlockPos[3][0] = curBlock[0][3];

    TempCurBlockPos[0][0] = curBlock[0][0];
    TempCurBlockPos[0][1] = curBlock[1][0];
    TempCurBlockPos[0][2] = curBlock[2][0];
    TempCurBlockPos[0][3] = curBlock[3][0];
    } else {                                // Square Tetrimino
    TempCurBlockPos = [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    }
    
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

function keyPressed() {
    switch (keyCode) {
        // blokkenrotatie, keycode 88 staat voor x
        case 88:
            rotateBlock();
            break;
        // blok naar links bewegen
        case 37:
            if (curBlockPos[1] > 0) {
                curBlockPos[1]--;
            }
            break;
        // blok naar rechts bewegen
        case 39:
            if (curBlockPos[1] < 7) {
                curBlockPos[1]++;
            }
            break;
    }
}

 
function draw() {

    // Zet het huidige blokje in het bord, het werkt vgm best goed ik heb geen idee meer hoe lol
    for(var i = 0; i < curBlock.length; i++){
        for(var j = 0; j < curBlock[i].length; j++){
            if (curBlock[i][j] === 1) {
                bord[curBlockPos[0]+i][curBlockPos[1] + j] = 1;
            }
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

    // Precies hetzelfde als voor de draw, maar dan zet ie hem naar 0, zodat hij niet het bord opneemt wanneer het blokje op een andere positie is
    for(var i = 0; i < curBlock.length; i++){
        for(var j = 0; j < curBlock[i].length; j++){
            if (curBlock[i][j] === 1) {
                bord[curBlockPos[0]+i][curBlockPos[1] + j] = 0;
            }
        }
    }

    // Functie doet iets elke seconden
    if (frameCount % 50 == 0) {

        // Beweegt het blok naar beneden
        curBlockPos[0]++;
    }


    // Verwijderd het huidige blokje uit het bord
    fill(0, 0, 0);
    //@ts-ignore
    text(curBlock, 10, 710, 70, 80);


}