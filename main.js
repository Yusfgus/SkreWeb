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

const distributionsTime = 1000
const showFirstTwoCardsTime = 1000

let commandCardActivated = ''
let inCommand = false

function wait(Function, ms) {
    return new Promise(resoleve => {
        Function()
        setTimeout(() => {
            resoleve()
        }, ms)
    })
} 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

loadGame()

function tempCreateCards() {
    let cardIndex = 0
    for(let i=0; i<=50; ++i){
        initCard('lookAll', 10, getOwnerContainer(0), cardIndex++)
    }
}

function loadGame() {
    attatchClickEventHandlerToDecks()
    
    createCards()
    // tempCreateCards()
    shuffleCards()

    initRound()
}

async function initRound() {
    addCardsToPrimaryDeck()
    await wait(distributeCards, distributionsTime)
    await wait(showFirstTwoCards, showFirstTwoCardsTime + 500)
    putFirstCard()
    roundStarted = true
    changeTurn(1000)
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

    await sleep(showFirstTwoCardsTime)

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

function changeTurn(ms = 1500) {

    setTimeout(() => {
        ////console.log('Change Turn')
        playerTurn = playerTurn % maxPlayersNum + 1
        currentPlayer = currentPlayer% maxPlayersNum + 1
    
        primaryDeckClicked = false
        secondaryDeckClicked = false
    
        console.log(`player ${playerTurn} turn`)
    }, ms)
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
            // putFirstCard()
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
        for(let i=7; i<=10; ++i) 
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

        if(inCommand){
            console.log('in command')
        }
        else if(commandCardActivated !== ''){
            commandActivate(card)
        }
        else if(card.cardOwnerContainer === getOwnerContainer(playerTurn)){
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
    return (roundStarted && playerTurn != 0 && currentPlayer == playerTurn && !inCommand)
}

function primaryDeckClick() {
    if(!canChooseCard()){
        return
    }
    
    if(commandCardActivated === '' && !primaryDeckClicked && primaryDeckcards.length > 0) {
        const card = primaryDeckcards[primaryDeckcards.length - 1]
        card.flipCard()
        primaryDeckClicked = true
    }
}

function addCardsToSecondaryDeck(myCard, choosedCard) {
    const playerContainer = getOwnerContainer(playerTurn)
    const myCardIndex = Array.from(playerContainer.children).indexOf(myCard.cardDivElem)
    
    changeCardOwner(choosedCard, playerContainer, true, false) 
    insertCardInIndex(choosedCard, playerContainer, myCardIndex)
    
    secondaryDeckcards.push(myCard)
    changeCardOwner(myCard, secondaryDeckCardContainer, true, true) 
}

function chooseCard(card) 
{
    if(!canChooseCard()) {
        return
    }
    // ////console.log('in chooseCard() can choose')
    if(primaryDeckClicked) {
        const choosedCard = primaryDeckcards.pop()
        primaryDeckClicked = false
    
        addCardsToSecondaryDeck(card, choosedCard)
    }
    else if (secondaryDeckcards.length > 0)
    {
        if(secondaryDeckClicked)
        {
            // from second deck to player container       
            const choosedCard = secondaryDeckcards.pop()
            secondaryDeckClicked = false

            addCardsToSecondaryDeck(card, choosedCard)
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
                    card.flipCard()
                    secondaryDeckcards.pop()
                    changeCardOwner(lastSecondaryCard, getOwnerContainer(playerTurn), true)
                }
            }, 1500)
        }
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
        
        commandCardActivated = victimCard.cardCommand
        
        if(commandCardActivated === ''){
            console.log('not command then change turn')
            changeTurn()
        }
        // else {
        //     console.log('command is', commandCardActivated)
        // }
    }
    else if(secondaryDeckcards.length > 0 && commandCardActivated === '')
    {
        // from secondary to player
        secondaryDeckClicked = true
    }
}

async function commandActivate(selectedCard) {
    console.log('command is', commandCardActivated)

    await wait(() => 
    {
        if(commandCardActivated === 'lookYours') {
            commandLookYours(selectedCard)
        }
        else if(commandCardActivated === 'lookOthers') {
            commandLookOthers(selectedCard)
        }
        else if(commandCardActivated === 'exchange') {
            commandExchangeCard(selectedCard)
        }
        else if(commandCardActivated === 'lookAll') {
            commandLookAll(selectedCard)
        }
        else if(commandCardActivated === 'pasra') {
            commandPasra(selectedCard)
        }
    }, 0)
}

function finishCommand(ms) {
    console.log('command finished')
    commandCardActivated = ''
    setTimeout(() => {
        inCommand = false
        changeTurn(0)
    }, ms)
}

async function commandLookYours(card) {
    if(card.cardOwnerContainer !== getOwnerContainer(playerTurn)){
        return
    }

    inCommand = true
    
    card.flipCard()
    console.log('here1')
    await wait(() => {
        console.log('in wait funtion')
        setTimeout(() => {
            card.flipCard()
        }, 3000)
    },3100)

    finishCommand(3000)
}

async function commandLookOthers(card) {
    console.log('in commandLookOthers()')
    if(card.cardOwnerContainer === getOwnerContainer(playerTurn)
        || card.cardOwnerContainer === primaryDeckCardContainer
        || card.cardOwnerContainer === secondaryDeckCardContainer)
    {
        return
    }

    inCommand = true

    card.flipCard()
    await wait(() => {
        setTimeout(() => {
            card.flipCard()
        }, 3000)
    },0)

    finishCommand(3000)
}

function insertCardInIndex(card, parent, index) {
    const referenceNode = parent.children.item(index);
    // Insert the new child before the reference node
    parent.insertBefore(card.cardDivElem, referenceNode);
}

function exchangeTwoCards(card1, card2, flip = true) {

    const card1Container = card1.cardOwnerContainer
    const card2Container = card2.cardOwnerContainer
    
    const card1CurrentIndex = Array.from(card1Container.children).indexOf(card1.cardDivElem)
    const card2CurrentIndex = Array.from(card2Container.children).indexOf(card2.cardDivElem)
    
    changeCardOwner(card1, card2Container, flip, false) 
    insertCardInIndex(card1, card2Container, card2CurrentIndex)
    
    changeCardOwner(card2, card1Container, flip, false)
    insertCardInIndex(card2, card1Container, card1CurrentIndex)
}

let cardToExchange = null
function commandExchangeCard(card) {

    if(card.cardOwnerContainer === primaryDeckCardContainer
        || card.cardOwnerContainer === secondaryDeckCardContainer)
    {
        return
    }

    if(cardToExchange == null)
    {
        cardToExchange = card
        return
    }

    const playerContainer = getOwnerContainer(playerTurn)
    const cardContainer = card.cardOwnerContainer
    const cardToExchangeContainer = cardToExchange.cardOwnerContainer
    if(cardContainer === cardToExchangeContainer
        || (cardContainer !== playerContainer && cardToExchangeContainer !== playerContainer)
        )
    {
         return
    }

    inCommand = true

    console.log('call exchange')
    exchangeTwoCards(cardToExchange, card, false)
    cardToExchange = null
    finishCommand(500)
}

let lookedCards = []
function commandLookAll(card) {
    const cardOwner = card.cardOwnerContainer
    if(cardOwner === primaryDeckCardContainer
        || cardOwner === secondaryDeckCardContainer)
    {
        return
    }

    let can = true
    lookedCards.forEach((lookedCardParent) => {
        if(lookedCardParent === cardOwner){
            console.log('cant not look here again')
            can = false
            return
        }
    })

    if(!can){
        return
    }
    
    card.flipCard()
    setTimeout(() => {
        card.flipCard()
    }, 3000)
    
    if(lookedCards.length == 3){
        inCommand = true
        lookedCards = []
        finishCommand(3000)
        return
    }
    lookedCards.push(cardOwner)
}

function commandPasra(card) {
    if(card.cardOwnerContainer !== getOwnerContainer(playerTurn)){
        return
    }

    inCommand = true

    card.flipCard()
    changeCardOwner(card, secondaryDeckCardContainer, false)

    finishCommand(500)
}