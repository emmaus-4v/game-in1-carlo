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

var score = 0; // aantal behaalde punten
var curBlockPos = new Array(3);
var bord = Array.from(Array(16), () => new Array(10)) // 2D array - 16 hoog en 10 breed

// functies die je gebruikt in je game

// Reset het spel naar beginstand
var reset = function () {
    //zet var bord naar 0
    for (var i = 0; i < 16; i++) {      // bord is 16 hoog
        for (var j = 0; j < 10; j++) {  // bord is 10 breed
            bord[i][j] = 0;
        }
    }
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
    for (var i = 0; i < 16; i++) {      // bord is 16 hoog
        for (var j = 0; j < 10; j++) {  // bord is 10 breed
            if (bord[i][j] != 0) { // Vraag niet waarom dit is de enige manier hoe ik dit heb kunnen laten werken
                fill("black");
            } else {
                fill("white");
            }
            rect(j * 45, i * 45, 45, 45); // Tekent veld per blokje (1280 / 3 is om het veld in het midden van de window te plakken)
        }
    }
}