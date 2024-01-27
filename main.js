import Card from "./cards.js";

const owners = [
    0, //primary deck
    1,2,3,4,
    5 //secondary deck
]

const cardsNum = 4
let cards = []


loadGame()

function loadGame() {
    createCards()
}

function createCards() {
    // normal cards
    for(let i=1; i<=10; ++i) {
        const normalCard = new Card(`${i}`, i, getOwnerCardContainerId(owners[1]))
        cards.push(normalCard)
    }

    // // normmand cards
    // let num = 7
    // for(let i=0; i<2; ++i) {
    //     let normmandCard = new Card(`${num}`, num++, commands[i], getOwnerCardContainerId(owners[0]))
    //     cards.push(normmandCard)
    // }
    // const normmandCard8 = new Card(`8`, 8, commands[0], getOwnerCardContainerId(owners[0]))
    // cards.push(normmandCard8)
    // const normmandCard9 = new Card(`9`, 9, commands[1], getOwnerCardContainerId(owners[0]))
    // cards.push(normmandCard9)
    // const normmandCard10 = new Card(`10`, 10, commands[1], getOwnerCardContainerId(owners[0]))
    // cards.push(normmandCard10)


    Card.shuffle()
}

function getOwnerCardContainerId(ownerId) {
    if(ownerId == 0) {
        return 'primaryDeck'
    }
    else if(ownerId == 5) {
        return 'secondaryDeck'
    }
    else {
        return `player${ownerId}-cards-container`
    }
}