import Card from "./cards.js";

const cardsNum = 4

loadGame()

function loadGame() {
    for(let i=0; i<cardsNum; ++i) {
        new Card(`card ${i}`, 10, '', '')
    }
}