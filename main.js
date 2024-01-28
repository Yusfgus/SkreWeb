import Card from "./cards.js";
import { addchildElement } from "./cards.js";

let cards = []
let primaryDeckcards = []
let secondaryDeckcards = []

const primaryDeckCardContainer = document.getElementById('primaryDeck')
const secondaryDeckCardContainer = document.getElementById('secondaryDeck')

const maxPlayersNum = 4
let currentPlayer = 0
let playerTurn = 0

let primaryDeckClicked = false
let secondaryDeckClicked = false

let roundStarted = false
let selectedCard = null

const distributionsTime = 10000
const showFirstTwoCardsTime = 4000

function wait(Function, ms) {
    return new Promise(resoleve => {
        Function()
        setTimeout(() => {
            //console.log('lol')
            resoleve()
        }, ms)
    })
} 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

loadGame()

function loadGame() {
    
    attatchClickEventHandlerToDecks()
    
    createCards()
    shuffleCards()

    initRound()
}

async function initRound() {
    addCardsToPrimaryDeck()
    await wait(distributeCards, distributionsTime)
    await wait(showFirstTwoCards, 4500)
    roundStarted = true
    changeTurn()
}

function addCardsToPrimaryDeck() {
    cards.forEach((card) => {
        primaryDeckcards.push(card)
        card.assignCardToOwner()
    })
}

async function showFirstTwoCards() {

    const cardContainers = document.querySelectorAll('.player')
    cardContainers.forEach((container) => {
        const firstChild = getDivChild(container, 0)
        const secondChild = getDivChild(container, 1)

        getCardClass(firstChild).flipCard()
        getCardClass(secondChild).flipCard()
    })

    await sleep(4000)

    cardContainers.forEach((container) => {
        const firstChild = getDivChild(container, 0)
        const secondChild = getDivChild(container, 1)

        getCardClass(firstChild).flipCard()
        getCardClass(secondChild).flipCard()
    })
}

function getDivChild(paretDiv, index) {
    return paretDiv.children.item(index)
}

function getCardClass(cardElem) {
    return cards[cardElem.dataset.value]
}

function putFirstCard() {
    const firstCard = primaryDeckcards.pop()
    secondaryDeckcards.push(firstCard)
    changeCardOwner(firstCard, secondaryDeckCardContainer, true)
}

function changeTurn() {
    ////console.log('Change Turn')
    playerTurn = playerTurn % maxPlayersNum + 1
    currentPlayer = currentPlayer% maxPlayersNum + 1
    console.log(playerTurn)

    primaryDeckClicked = false
    secondaryDeckClicked = false
    selectedCard = null

    // alert(`player ${playerTurn} turn`)
}

function attatchClickEventHandlerToDecks() {
    primaryDeckCardContainer.addEventListener('click', () => {primaryDeckClick()})
    secondaryDeckCardContainer.addEventListener('click', () => {secondaryDeckClick()})
}

function distributeCards() {
    //console.log('here')

    let ctr = 0
    let maxCards = maxPlayersNum * 4
    const id = setInterval(() => {
        const card = primaryDeckcards.pop()
        const playerContainer = getOwnerContainer(ctr++ % maxPlayersNum + 1)
        changeCardOwner(card, playerContainer, false)
        // addchildElement(playerContainer, card)
        if(--maxCards == 0) {
            clearInterval(id)
            putFirstCard()
        }
    }, distributionsTime/(4*4 + 1))
}

function initCard(name, value, owner, cardIndex) {
    const card = new Card(name, value, owner, cardIndex)
    cards.push(card)
    // primaryDeckcards.push(card)
    attatchClickEventHandlerToCard(card)
}

function shuffleCards() {
    const maxIndex = cards.length
    let ctr = 200
    while(ctr-- > 0)
    {
        const random1 = Math.floor(Math.random() * maxIndex)
        const random2 = Math.floor(Math.random() * maxIndex)

        const temp = cards[random1]
        cards[random1] = cards[random2]
        cards[random2] = temp

        cards[random1].setDataValue(random1)
        cards[random2].setDataValue(random2)
    }
    //console.log(cards)
}

function createCards() {
    let cardIndex = 0
    // normal cards
    for(let j=1; j<=4; ++j) 
    {
        for(let i=1; i<=10; ++i) 
        {
            initCard(`${i}`, i, getOwnerContainer(0), cardIndex++)
        }
    }

    // command cards
    for(let i=1; i<=4; ++i) 
    {
        initCard("exchange", 10, getOwnerContainer(0), cardIndex++)

        initCard("20", 20, getOwnerContainer(0), cardIndex++)
    }

    for(let i=1; i<=2; ++i) 
    {
        initCard("lookAll", 10, getOwnerContainer(0), cardIndex++)

        initCard("pasra", 10, getOwnerContainer(0), cardIndex++)

        initCard("redSkrew", 25, getOwnerContainer(0), cardIndex++)

        initCard("skrewDriver", 0, getOwnerContainer(0), cardIndex++)
    }

    initCard("-1", -1, getOwnerContainer(0), cardIndex++)

    // Card.shuffle()
}

function getOwnerContainer(ownerId) {
    if(ownerId == 0) {
        return primaryDeckCardContainer
    }
    else if(ownerId == 5) {
        return secondaryDeckCardContainer
    }
    else {
        return document.getElementById(`player${ownerId}-cards-container`)
    }
}

function attatchClickEventHandlerToCard(card) {
    card.cardDivElem.addEventListener('click', () => {
        selectedCard = card
        ////console.log('card name =', selectedCard.cardName)   
        // const parent = card.cardOwnerContainer
        // console.log(Array.from(parent.children).indexOf(card.cardDivElem))

        if(selectedCard.cardOwnerContainer === getOwnerContainer(playerTurn)){
            chooseCard(card)
        }
    })
}

function changeCardOwner(card, owner, flip, assing = true) {
    if(flip){
        card.flipCard()
    }

    card.setOwnerContainer(owner)

    if(assing){
        card.assignCardToOwner()
    }
}

function canChooseCard() {
    //console.log(roundStarted)
    return (roundStarted && currentPlayer == playerTurn)
}

function primaryDeckClick() {
    if(!canChooseCard()){
        return
    }
    
    if(!primaryDeckClicked && primaryDeckcards.length > 0) {
        const card = primaryDeckcards[primaryDeckcards.length - 1]
        card.flipCard()
        primaryDeckClicked = true
    }
}

function insertCardInIndex(card, parent, index) {
    const referenceNode = parent.children.item(index);
    // Insert the new child before the reference node
    parent.insertBefore(card.cardDivElem, referenceNode);
}

function exchangeCard(myCard, choosedCard, toSecondaryDeck = false) {

    const myCardContainer = myCard.cardOwnerContainer
    const otherCardContainer = toSecondaryDeck? secondaryDeckCardContainer: choosedCard.cardOwnerContainer
    
    const index1 = Array.from(myCardContainer.children).indexOf(myCard.cardDivElem)
    changeCardOwner(myCard, otherCardContainer, true, toSecondaryDeck)
    changeCardOwner(choosedCard, myCardContainer, true, false)

    insertCardInIndex(choosedCard, myCardContainer, index1)
    
    if(!toSecondaryDeck){
        const index2 = Array.from(otherCardContainer.children).indexOf(choosedCard.cardDivElem)
        insertCardInIndex(myCard, otherCardContainer, index2)
    }
    
}

function chooseCard(card) 
{
    if(!canChooseCard()) {
        return
    }
    // ////console.log('in chooseCard() can choose')
    if(primaryDeckClicked) {
        const choosedCard = primaryDeckcards.pop()
        secondaryDeckcards.push(card)
        primaryDeckClicked = false
    
        exchangeCard(card, choosedCard, true)
    
        // setTimeout(() => {
        //     changeTurn()
        // }, 2000)
    }
    else if (secondaryDeckcards.length > 0)
    {
        if(secondaryDeckClicked)
        {
            // from second deck to player container       
            const choosedCard = secondaryDeckcards.pop()
            secondaryDeckcards.push(card)
            secondaryDeckClicked = false

            exchangeCard(card, choosedCard, true)
        }
        else {
            //pasra
            const lastSecondaryCard = secondaryDeckcards[secondaryDeckcards.length - 1]
            card.flipCard()
            setTimeout(() => {
                if(card.cardName === lastSecondaryCard.cardName)
                {
                    //succeded
                    secondaryDeckcards.push(card)
                    changeCardOwner(card, secondaryDeckCardContainer, false)
                }
                else {
                    // failed
                    // card.flipCard()
                    card.flipCard()
                    secondaryDeckcards.pop()
                    changeCardOwner(lastSecondaryCard, getOwnerContainer(playerTurn), true)
                }
            }, 1500)
        }
        // setTimeout(() => {
        //     changeTurn()
        // }, 2000)
    }
    setTimeout(() => {
        changeTurn()
    }, 2000)
}

function secondaryDeckClick() {
    if(!canChooseCard()) {
        return
    }

    if(primaryDeckClicked) {
        // from primary deck to secondary deck
        const victimCard = primaryDeckcards.pop()
        changeCardOwner(victimCard, secondaryDeckCardContainer, false)
        secondaryDeckcards.push(victimCard)
        primaryDeckClicked = false
        changeTurn()
    }
    else if(secondaryDeckcards.length > 0 )
    {
        // from secondary to player
        secondaryDeckClicked = true
    }
}

