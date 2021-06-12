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
var mainColor = "green";
var secondaryColor = "black";
var spelStatus = SPELEN;

// aantal behaalde punten
var score = 0;
var rotationOffset1;
var rotationOffset2;

/* curBlock is een twee-dimentionale array van 4 breed en 4 hoog
 * - Deze array houd de huidige blok, wat gebruikt en veranderd kan worden waar nodig
 * - De functie newCurBlock geeft een voorgegeven preset aan curBlock
 * - Metadata van curBlock (positie, rotatie, etc) word gehouden in de variabele CurBlockPos
 */
var curBlock = Array.from(Array(4), () => new Array(4));

/* curBlockPos slaat belangerijke info op over de staat van de curBlock
 * - curBlockPos heeft 6 stukken info:
 * - 1: de y coordinaat van linksboven
 * - 2: de x coordinaat van linksboven
 * - 3: de rotatie (1 - 4, waarvan 1 geen rotatie is, en 4 driekwart gedraad is)
 * - 4: de soort tetromino
 * - 5: de y coordinaat van rechtsonder
 * - 6: de x coordinaat van rechtsonder
 */
var curBlockPos = new Array(6);

/* bord is een 16x10 twee-dimentionale array
 * - bord houd het bord vast, wat gebruikt word om te tekenen en om collision op te checken
*/
 var bord = Array.from(Array(16), () => new Array(10)); // 2D array - 16 hoog en 10 breed

const TetriminoVariaties = [  // Alle verschillende soorten blokjes die je kunt hebben
    [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // Straight tetromino
    [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // Square tetromino
    [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // T-tetromino
    [[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // J-tetromino
    [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // L-tetromino
    [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // S-tetromino
    [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]  // Z-tetromino
];

/* 
 * Alle functies die aan het begin gedaan moeten woredn
 */

/* setup
   de code in deze functie wordt één keer uitgevoerd door
   de p5 library, zodra het spel geladen is in de browser
 */
function setup() {
    // Maak een canvas (rechthoek) waarin je je speelveld kunt tekenen
    createCanvas(1280, 720);

    // Kleur de achtergrond wit, zodat je het kunt zien
    background(secondaryColor);
    stroke(mainColor);

    spelStatus = HOME;

    //Zet alle variabelen naar de beginstand
    reset();
}

// Reset het spel naar beginstand
var reset = function () {
    // Zet var bord naar 0
    for (var i = 0; i < 16; i++) {      // bord is 16 hoog
        for (var j = 0; j < 10; j++) {  // bord is 10 breed
            bord[i][j] = 0;
        }
    }

    // Pakt een nieuw blok
    newCurBlock();
}

// Pakt een nieuw curBlock
var newCurBlock = function () {

    // Pakt een random waarde van 1 tot 7
    // De const TetriminoVariaties (lijn 29) heeft 7 verschillende arrays voor blokken
    // Deze var neemt dus 1 van de 7 blokken
    var randomTetrimino = Math.floor(Math.random() * 7); 

    // Zet de net gepakte tetrimino in de curBlock
    curBlock = TetriminoVariaties[randomTetrimino];

    // Reset de CurBlockPos Variabele naar de beginstand
    // Zie lijn 72 voor de 
    curBlockPos = [0, 4, 1, randomTetrimino, 0, 0];
}

/*
 * Alle functies die curBlock veranderen
 */

// Draait het blok
var rotateBlock = function () {
    // Tijdelijke variabele om curBlock mee op te slaan
    // Aan het einde van de functie word curBlock overschreven door deze var
    var TempCurBlock = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    // Gaat na welk soort tetromino het is en draait het blok
    // Ik weet dat dit inefficient is
    // Normale blokken (T, J, L, S, Z)
    if(curBlockPos[3] > 1) {                    
        TempCurBlock[0][2] = curBlock[0][0];
        TempCurBlock[2][2] = curBlock[0][2];
        TempCurBlock[2][0] = curBlock[2][2];
        TempCurBlock[0][0] = curBlock[2][0];

        TempCurBlock[1][2] = curBlock[0][1];
        TempCurBlock[2][1] = curBlock[1][2];
        TempCurBlock[1][0] = curBlock[2][1];
        TempCurBlock[0][1] = curBlock[1][0];
        TempCurBlock[1][1] = 1;


    } 
    // Straight Tetrimino
    else if (curBlockPos[3] === 0) {          
        TempCurBlock[0][0] = curBlock[0][0];
        TempCurBlock[1][0] = curBlock[0][1];
        TempCurBlock[2][0] = curBlock[0][2];
        TempCurBlock[3][0] = curBlock[0][3];

        TempCurBlock[0][0] = curBlock[0][0];
        TempCurBlock[0][1] = curBlock[1][0];
        TempCurBlock[0][2] = curBlock[2][0];
        TempCurBlock[0][3] = curBlock[3][0];


    }
    // Square Tetrimino 
    else {                                    
        TempCurBlock = [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    }

    // Hier word de curBlock overschreven door TempCurBlock
    curBlock = TempCurBlock;

    // Update de rotatievariabele in curBlockPos
    if (curBlockPos[2] === 4) {
        curBlockPos[2] = 1;
    } else {
        curBlockPos[2]++;
    }
}

// Zet het blok vast in het bord
var placeBlock = function() {
    
    // Zet curBlock in het bord (Gepakt van de eerste for loop in de draw functie)
    for (var i = 0; i < curBlock.length; i++) {
        for (var j = 0; j < curBlock[i].length; j++) {
            if (curBlock[i][j] === 1) {
                bord[curBlockPos[0] + i][curBlockPos[1] + j] = 1;
            }
        }
    }

    // Pakt een nieuw blok
    newCurBlock();
}

/* 
 * Alle functies die dingen berekenen
 */

// Berekent met variabelen waar het meest rechtse en onderste punt is van curBlock
var calcRightBottomPos = function () {

    // Straight
    if (curBlockPos[3] === 0) {

        //Kijkt naar de verschillende mogelijke rotaties
        switch (curBlockPos[2]) {
            // Blok staat evenwijdig naar de grond, x waarde heeft 3 verschil, y waarde heeft geen verschil
            case 1:
                curBlockPos[4] = curBlockPos[0];
                curBlockPos[5] = curBlockPos[1] + 3;
                break;
            // Blok staat loodrecht aan grond, x waarde heeft geen verschil, y waarde heeft 3 verschil
            case 2:
                curBlockPos[4] = curBlockPos[0] + 3;
                curBlockPos[5] = curBlockPos[1];
                break;
            // Blok staat evenwijdig naar de grond, x waarde heeft 3 verschil, y waarde heeft geen verschil
            case 3:
                curBlockPos[4] = curBlockPos[0];
                curBlockPos[5] = curBlockPos[1] + 3;
                break;
            // Blok staat loodrecht aan grond, x waarde heeft geen verschil, y waarde heeft 3 verschil
            case 4:
                curBlockPos[4] = curBlockPos[0] + 3;
                curBlockPos[5] = curBlockPos[1];
                break;
        }
    }


    // Alle blokken met een 3x3 grid (2 - 7)
    else if (curBlockPos[3] != 0 || 1) {
         switch (curBlockPos[2]) {
             case 1:
                 curBlockPos[4] = curBlockPos[0] + 1;
                 curBlockPos[5] = curBlockPos[1] + 2;
                 break;
             case 2:
                 curBlockPos[4] = curBlockPos[0] + 2;
                 curBlockPos[5] = curBlockPos[1] + 1;
                 break;
             case 3:
                 curBlockPos[4] = curBlockPos[0] + 1;
                 curBlockPos[5] = curBlockPos[1] + 2;
                 break;
             case 4:
                 curBlockPos[4] = curBlockPos[0] + 2;
                 curBlockPos[5] = curBlockPos[1] + 1;
                 break;
         }
    }

    // Square, blijft altijd hetzelfde
    else {
        curBlockPos[4] = curBlockPos[0] + 1;
        curBlockPos[5] = curBlockPos[1] + 1;
    }
}

// Check of curBlock iets raakt
var checkCollision = function () {
    calcRightBottomPos();

    // als de curBlock de grond raakt
    if (curBlockPos[4] === 15) {
        placeBlock();
    };

    // als de curBlock een ander blok raakt
    for (var i = 0; i < 4; i++){
        if(bord[curBlockPos[4] + 1][i + curBlockPos[1]] === 1 && curBlock[curBlockPos[4] - curBlockPos[0]][i] === 1){
                placeBlock();
                break;
        };
    };


    // Checkt of er lijnen gevuld zijn en haalt ze dan weg
    // Loopt door alle lijnen
    for(var i = 0; i < 16; i++) {
        // Checkt of ze vol zijn
        if(bord[i].toString() == "1,1,1,1,1,1,1,1,1,1"){ // Geen idee wrm maar js wilt dat je eerst de array naar een string maakt maar het normaal doen wil hij niet :(

            // Haalt de volledige rij weg
            bord[i] = [0,0,0,0,0,0,0,0,0,0];

            // Zet alle rijen erboven goed
            for(var x = 0; x < i; x++){
                bord[i - x] = bord[i - x - 1] 
            }
            bord[0] = [0,0,0,0,0,0,0,0,0,0];

            // Voegt 1 punt toe
            score++;

            // Veranderd de kleuren
            // @ts-ignore
            mainColor = color(random(0, 255), random(0, 255), random(0, 255));
            // @ts-ignore
            secondaryColor = color(random(0, 255) - 200, random(0, 255) - 200, random(0, 255) - 200); 
            break;
        }
    }

    // Checkt of je verloren hebt
    for(var i = 0; i < 4; i++){
        if(bord[0 || 1][3 + i] === 1) {
            spelStatus = GAMEOVER;
        } 
    }
};

// Kijkt hoeveel de curBlock afwijkt van de 4x4 grid 
// Is nodig om gedraaide blokken bij de randen te kunnen krijgen
// Omdat blokken draaien vanaf het middelpunt gebeurt, kan het zijn dat de meest linker kant van het blok verder rechts is dan de 4x4 grid van de array
var getBlockRotationOffset = function () {
    if(curBlockPos[3] === 0) { // Straight
        switch (curBlockPos[2]) {
            case 1:
                rotationOffset1 = 0;
                rotationOffset2 = -1;
                break;
            case 2:
                rotationOffset1 = 0;
                rotationOffset2 = 2;
                break;
            case 3:
                rotationOffset1 = 0;
                rotationOffset2 = -1;
                break;
            case 4:
                rotationOffset1 = 0;
                rotationOffset2 = 2;
                break;
        }

    } else if(curBlockPos[3] === 1) { // Square
        rotationOffset1 = 0;
        rotationOffset2 = 1;

    } else {
        switch (curBlockPos[2]) {
            case 1:
                rotationOffset1 = 0;
                rotationOffset2 = 0;
                break;
            case 2:
                rotationOffset1 = 1;
                rotationOffset2 = 0;
                break;
            case 3:
                rotationOffset1 = 0;
                rotationOffset2 = 0;
                break;
            case 4:
                rotationOffset1 = 0;
                rotationOffset2 = 1;
                break;
        }
    }
}

/*
 * Overige functies
 */

// Controls
function keyPressed() {
    switch (keyCode) {
        // blokkenrotatie, keycode 88 staat voor x
        case 88:
            rotateBlock();
            break;

        // blok naar links bewegen
        case 37:
            if (curBlockPos[1] + rotationOffset1 > 0) {
                curBlockPos[1]--;
            }
            break;

        // blok naar rechts bewegen
        case 39:
            if (curBlockPos[1] - rotationOffset2 < 7) {
                curBlockPos[1]++;
            }
            break;

        // Blok naar beneden
        case 40:
            curBlockPos[0]++;
            checkCollision();
            break;
        // Hard drop (pijltje naar boven)
        case 38:
            do {
                curBlockPos[0]++;
                checkCollision();
            } while(curBlockPos[0] != 0)
            break;
        // Hard drop (space)
        case 32:
            do {
                curBlockPos[0]++;
                checkCollision();
            } while(curBlockPos[0] != 0)
            break;
        // Press enter to play stuff
        case 13:
            reset();
            spelStatus = SPELEN;
            break;
    }
}

/**
 * draw
 * de code in deze functie wordt meerdere keren per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
    // Tekent de achtergrond
    fill(secondaryColor)
    rect(0, 0, 1280, 720)
    switch (spelStatus) {
        case HOME:
            // Home menu tekenen

            textSize(40);
            fill(mainColor);
            text("TETRIS", 550, 240, 426, 240);
            text("Press enter to play :)", 426, 360, 426, 240);
            break;

        case SPELEN:
            // Zet het huidige blokje in het bord (niet permanent, wordt na het tekenen van het bord er weer uit gehaald)
            // Loopt door de hele curBlock array
            for(var i = 0; i < curBlock.length; i++){
                for(var j = 0; j < curBlock[i].length; j++){
                    // Als een nummer 1 is, zet hij die ook in het bord
                    if (curBlock[i][j] === 1) {
                        bord[curBlockPos[0]+i][curBlockPos[1] + j] = 1;
                    }
                }
            }

            // Tekent het bord
            // Loopt door heel het bord array
            for (var i = 0; i < 16; i++) {
                for (var j = 0; j < 10; j++) {
                    // Als een nummer 1 is, zet hij de kleuren naar vol
                    // als het nummer 0 is, zet hij de kleuren naar leeg
                    if (bord[i][j] === 1) {
                        stroke(secondaryColor);
                        fill(mainColor);
                    } else {
                        stroke(mainColor);
                        fill(secondaryColor);
                    }
                    // Tekent veld per blokje
                    rect(j * 45 + 426, i * 45, 45, 45);
                }
            }

            // Precies hetzelfde als voor de draw, maar dan zet hij het naar 0, zodat hij niet het bord opneemt wanneer het blokje op een andere positie is
            for(var i = 0; i < curBlock.length; i++){
               for(var j = 0; j < curBlock[i].length; j++){
                    if (curBlock[i][j] === 1) {
                       bord[curBlockPos[0]+i][curBlockPos[1] + j] = 0;
                    }
               }
            }

            // Deze functie doet iets aan het begin van elke seconden
            if (frameCount % 50 == 0) {
                // Beweegt het blok naar beneden
                curBlockPos[0]++;
            }
            // Deze functie doet iets aan het einde van elke seconden
            if (frameCount % 50 == 49) {
                // Berekent heel veel nodige dingen
                checkCollision();
                calcRightBottomPos();
                getBlockRotationOffset();
            }

            // Tekent de score
            stroke(secondaryColor);
            fill(secondaryColor);
            rect(100, 100, 200, 100);
            stroke(secondaryColor);
            fill(mainColor);
            textSize(50);
            text("Score: " + score, 100, 100, 1000, 100);
            break;

        case GAMEOVER: {
            // Tekent het bord
            for (var i = 0; i < 16; i++) {      // bord is 16 hoog
                for (var j = 0; j < 10; j++) {  // bord is 10 breed
                    if (bord[i][j] === 1) {
                        stroke(secondaryColor);
                        fill(mainColor);
                    } else {
                        stroke(mainColor);
                        fill(secondaryColor);
                    }
                    rect(j * 45 + 426, i * 45, 45, 45); // Tekent veld per blokje
                }
            }

            // Tekent de overlay
            fill(secondaryColor);
            rect(320, 130, 640, 360)
            textSize(100);
            fill(mainColor);
            stroke(secondaryColor);
            text("GAME OVER", 340, 160, 1000, 1000);
            textSize(50);
            text("Score: " + score, 550, 300, 1000, 1000);
            text("Press enter to restart", 410, 390, 1000, 1000)
            stroke(mainColor);
            fill(secondaryColor);
            break;
        }   
    }
}