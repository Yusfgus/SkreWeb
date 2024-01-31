import Card from "./cards.js";

// const cardNames = ['skrewDriver', '1', '2', '3', '4', '5','6', '7', '8', '9', '10', 'exchange', 'lookAll', 'pasra', '-1', '20', 'redSkrew']
//                 //       0         1    2    3    4    5   6    7    8    9    10       11         12         13     14    15       16

let cards = []
let primaryDeckcards = []
let secondaryDeckcards = []

let totalPlayersScore = []
let playersScore = []

const primaryDeckCardContainer = document.getElementById('primaryDeck')
const secondaryDeckCardContainer = document.getElementById('secondaryDeck')
const skrewButton = document.getElementById('skrew-button')
const skrewAudio = new Audio('audio/skrew.mp3')

const maxPlayersNum = 4
const maxRoundNum = 2
const minTurnsNumBeforSkrew = 1

let currentPlayer = 0
let playerTurn = 0
let playerSaidSkrew = 0

let primaryDeckClicked = 0
let secondaryDeckClicked = false

// let roundStarted = false
let roundCounter = 0
let turnCounter = 0
let turnsAfterSkrew = -1

const distributionsTime = 1000
const showCardsTime = 1000

let commandCardActivated = ''
// let inCommand = false

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
        initCard('exchange', 10, getOwnerContainer(0), cardIndex++)
    }
}

function loadGame() {
    attatchClickEventHandler()
    
    createCards()
    // tempCreateCards()
    
    startGame()
}

function startGame() {
    initGame()
    startRound()
}

function initGame() {
    totalPlayersScore = [0, 0, 0, 0]
    roundCounter = 0
}

async function startRound() {

    if(++roundCounter > maxRoundNum)
    {
        alert("game is finished")
        return
    }

    await wait(initRound, distributionsTime + showCardsTime + 500)
    putFirstCard()
    // roundStarted = true
    // roundCounter++

    changeTurn(800)
}

async function initRound() {
    shuffleCards()
    
    // skrewButton.style.display = 'none'
    // skrewButton.removeEventListener('click', endRoundClickHandler)
    playersScore = [0, 0, 0, 0]
    // playerTurn = 0
    turnCounter = 0
    turnsAfterSkrew = -1
    currentPlayer = 0
    commandCardActivated = ''
    // inCommand = false

    addCardsToPrimaryDeck()
    await wait(distributeCards, distributionsTime)
    console.log('initial players scores =', playersScore)

    await wait(showFirstTwoCards, showCardsTime + 500)
}

function changeTurn(ms = 1500) {

    if(turnsAfterSkrew != -1 && turnsAfterSkrew++ == maxPlayersNum-1){
        endRound()
        return
    }

    turnCounter++

    setTimeout(() => {
        if(playerTurn != 0){
            // getPlayerTurnLine(playerTurn).style.backgroundColor = ''
            getPlayerTurnLine(playerTurn).style.animation = ''
        }
        playerTurn = playerTurn % maxPlayersNum + 1
        currentPlayer = currentPlayer% maxPlayersNum + 1
    
        primaryDeckClicked = 0
        secondaryDeckClicked = false
    
        getPlayerTurnLine(playerTurn).style.animation = 'glow 2.5s ease-in-out infinite'
        // console.log(`player ${playerTurn} turn`)
    }, ms)
}

function getPlayerTurnLine(playerIndex) {
    return document.getElementById(`player${playerIndex}-turn-line`)
}

function winOrPunish() {
        
    let minScorePlayerIndex = [0]
    let minScore = playersScore[minScorePlayerIndex[0]]

    playersScore.forEach((score, index) => {
        minScore = playersScore[minScorePlayerIndex[0]]
        if(score < minScore){
            minScorePlayerIndex = [index]
        }
        else if(score == minScore){
            minScorePlayerIndex.push(index)
        }
    })

    console.log('round scores is', playersScore)
    console.log('min score is', minScore)

    for(let i = maxPlayersNum; i>=0; --i) {
        if(playersScore[i] == minScore){
            playersScore[i] = 0
            playerTurn = i
        }
    }

    if(roundCounter == maxRoundNum) {
        for(let i=0; i<maxPlayersNum; ++i){
            playersScore[i] *= 2
        }
    }

    if(playersScore[playerSaidSkrew] != 0) {
        // double
        playersScore[playerSaidSkrew] *= 2
        playerTurn = playerSaidSkrew
    }
}

function calculateScores() {
    
    winOrPunish()
    
    playersScore.forEach((score, index) => {
        totalPlayersScore[index] += score
    })

    console.log("total players scores =", totalPlayersScore)
}

function endRound() {

    removeCardsFrom(primaryDeckCardContainer)
    removeCardsFrom(secondaryDeckCardContainer, true)
    for(let i=1; i<=maxPlayersNum; ++i) {
        removeCardsFrom(document.getElementById(`player${i}-cards-container`))
        removeCardsFrom(document.getElementById(`player${i}-cards-container2`))
    }

    calculateScores()

    startRound()
    // console.log("primary deck lenght", primaryDeckCardContainer.children.length)
}

async function saySkrew() {

    if(turnsAfterSkrew == -1 && playerTurn == currentPlayer && turnCounter/maxPlayersNum > minTurnsNumBeforSkrew)
    {
        turnsAfterSkrew = 0
        playerSaidSkrew = playerTurn - 1
        await wait(() => {
            skrewAudio.play()
        }, 2000)
        // skrewButton.style.display = 'inline-block'
        changeTurn(0)
    }
}

function removeCardsFrom(parentDiv, flip = false) {
    while (parentDiv.firstChild) {
        if(flip){
            getCardClass(parentDiv.firstChild).flipCard()
        }
        parentDiv.removeChild(parentDiv.firstChild);
    }
}

function addCardsToPrimaryDeck() {
    cards.forEach((card) => {
        primaryDeckcards.push(card)
        card.setOwnerContainer(primaryDeckCardContainer)
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

    await sleep(showCardsTime)

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

function attatchClickEventHandler() {
    primaryDeckCardContainer.addEventListener('click', primaryDeckClick)
    secondaryDeckCardContainer.addEventListener('click', secondaryDeckClick)
    skrewButton.addEventListener('click', saySkrew)
}

function distributeCards() {

    let ctr = 0
    let maxCards = maxPlayersNum * 4
    const id = setInterval(() => {
        const card = primaryDeckcards.pop()
        const playerIndex = ctr++ % maxPlayersNum
        playersScore[playerIndex] += card.cardValue
        const playerContainer = getOwnerContainer(playerIndex + 1)
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
    let ctr = 1000
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
    console.log(cards)
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

    initCard('-1', -1, getOwnerContainer(0), cardIndex++)

    // Card.shuffle()
}

function updateScore(playerIndex, valueToAdd) {
    playersScore[playerIndex] += valueToAdd
}

function getOwnerContainer(ownerId, secondContainer = false) {
    if(ownerId == 0) {
        return primaryDeckCardContainer
    }
    else if(ownerId == 5) {
        return secondaryDeckCardContainer
    }
    else {
        if(!secondContainer)
            return document.getElementById(`player${ownerId}-cards-container`)
        else
            return document.getElementById(`player${ownerId}-cards-container2`)
    }
}

function getPlayerIndex(playerCardsContainer) {
    return playerCardsContainer.id[6] - 1
}

function attatchClickEventHandlerToCard(card) {
    card.cardDivElem.addEventListener('click', () => {

        console.log('card clicked')
        /*if(inCommand){
            console.log('in command')
        }
        else*/ if(commandCardActivated !== ''){
            console.log('in command')
            commandActivate(card)
        }
        else if(card.cardOwnerContainer === getOwnerContainer(playerTurn)
                || card.cardOwnerContainer === getOwnerContainer(playerTurn, true))
        {
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
    return (turnsAfterSkrew != 0 && playerTurn != 0 && currentPlayer == playerTurn && commandCardActivated === '')
}

function primaryDeckClick() {
    if(!canChooseCard()){
        return
    }
    console.log('primary deck clicked')
    if(commandCardActivated === '' && primaryDeckClicked == 0 && primaryDeckcards.length > 0) {
        const card = primaryDeckcards[primaryDeckcards.length - 1]
        card.flipCard()
        primaryDeckClicked++
    }
}

function addCardsToSecondaryDeck(myCard, choosedCard) {
    const playerContainer = myCard.cardOwnerContainer
    const myCardIndex = Array.from(playerContainer.children).indexOf(myCard.cardDivElem)
    
    changeCardOwner(choosedCard, playerContainer, true, false) 
    insertCardInIndex(choosedCard, playerContainer, myCardIndex)
    
    secondaryDeckcards.push(myCard)
    changeCardOwner(myCard, secondaryDeckCardContainer, true, true) 

    updateScore(playerTurn - 1, choosedCard.cardValue - myCard.cardValue)
}

function chooseCard(card) 
{
    if(!canChooseCard()) {
        return
    }

    if(primaryDeckClicked == 1) {
        console.log('from primary deck to player', playerTurn)
        const choosedCard = primaryDeckcards.pop()
        primaryDeckClicked++
    
        addCardsToSecondaryDeck(card, choosedCard)
        changeTurn(300)
    }
    else if (secondaryDeckcards.length > 0)
    {
        if(secondaryDeckClicked)
        {
            console.log('from secondary deck to player', playerTurn)    
            const choosedCard = secondaryDeckcards.pop()
            secondaryDeckClicked = false

            addCardsToSecondaryDeck(card, choosedCard)
            changeTurn(300)
        }
        else {
            //pasra
            const lastSecondaryCard = secondaryDeckcards[secondaryDeckcards.length - 1]
            card.flipCard()
            setTimeout(() => {
                if(card.cardName === lastSecondaryCard.cardName)
                {
                    console.log('pasra succeded') 
                    //succeded
                    secondaryDeckcards.push(card)
                    changeCardOwner(card, secondaryDeckCardContainer, false)
                    updateScore(playerTurn - 1, - card.cardValue)
                }
                else {
                    console.log('pasra failed') 
                    // failed
                    card.flipCard()
                    secondaryDeckcards.pop()
                    
                    changeCardOwner(lastSecondaryCard, getOwnerContainer(playerTurn, true), true)
                    updateScore(playerTurn - 1, lastSecondaryCard.cardValue)
                }
            }, 1300)
            changeTurn(1500)
        }
    }
}

function secondaryDeckClick() {
    if(!canChooseCard()) {
        return
    }

    if(primaryDeckClicked == 1) {
        console.log('from primary deck to secondary deck')
        const victimCard = primaryDeckcards.pop()
        changeCardOwner(victimCard, secondaryDeckCardContainer, false)
        secondaryDeckcards.push(victimCard)
        primaryDeckClicked++
        
        commandCardActivated = victimCard.cardCommand
        
        if(commandCardActivated === ''){
            console.log('not command then change turn')
            changeTurn(300)
        }
    }
    else if(secondaryDeckcards.length > 0 && commandCardActivated === '')
    {
        console.log('secondary deck clicked')
        secondaryDeckClicked = true
    }
    else {
        console.log('secondaryDeckcards.length =', secondaryDeckcards.length)
        console.log('commandCardActivated =', commandCardActivated)
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
    setTimeout(() => {
        commandCardActivated = ''
        // inCommand = false
        changeTurn(0)
    }, ms)
}

async function commandLookYours(card) {
    if(card.cardOwnerContainer !== getOwnerContainer(playerTurn)
        && card.cardOwnerContainer !== getOwnerContainer(playerTurn, true)){
        return
    }

    // inCommand = true
    
    card.flipCard()
    await wait(() => {
        setTimeout(() => {
            card.flipCard()
        }, showCardsTime)
    },showCardsTime)

    finishCommand(0)
}

async function commandLookOthers(card) {
    if(card.cardOwnerContainer === getOwnerContainer(playerTurn)
        || card.cardOwnerContainer === getOwnerContainer(playerTurn, true)
        || card.cardOwnerContainer === primaryDeckCardContainer
        || card.cardOwnerContainer === secondaryDeckCardContainer)
    {
        return
    }

    // inCommand = true

    card.flipCard()
    await wait(() => {
        setTimeout(() => {
            card.flipCard()
        }, showCardsTime)
    },showCardsTime)

    finishCommand(0)
}

async function animationExchange(card1, card2)
{
    card1.cardDivElem.style.transform = 'rotateZ(20deg)'
    card2.cardDivElem.style.transform = 'rotateZ(20deg)'
    await wait(() => {
        setTimeout(() => {
            card1.cardDivElem.style.transform = ''
            card2.cardDivElem.style.transform = ''
        }, 1500)
    }, 2000)
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

    const playerContainer1 = getOwnerContainer(playerTurn)
    const playerContainer2 = getOwnerContainer(playerTurn, true)
    const cardContainer = card.cardOwnerContainer
    const cardToExchangeContainer = cardToExchange.cardOwnerContainer

    const noOneOfThemIsHis = (cardContainer !== playerContainer1 
                            && cardToExchangeContainer !== playerContainer1 
                            && cardContainer !== playerContainer2 
                            && cardToExchangeContainer !== playerContainer2)

    if(cardContainer === cardToExchangeContainer || noOneOfThemIsHis)
    {
         return
    }

    // inCommand = true

    const value1 = cardToExchange.cardValue - card.cardValue
    const value2 = card.cardValue - cardToExchange.cardValue

    if(cardContainer === playerContainer1 || cardContainer === playerContainer2) {
        updateScore(playerTurn - 1, value1)
        updateScore(getPlayerIndex(cardToExchangeContainer), value2)
    }
    else {
        updateScore(playerTurn - 1, value2)
        updateScore(getPlayerIndex(cardContainer), value1)
    }

    exchangeTwoCards(cardToExchange, card, false)

    animationExchange(cardToExchange, card)

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
    }, showCardsTime)
    
    if(lookedCards.length == 3){
        // inCommand = true
        lookedCards = []
        finishCommand(3000)
        return
    }
    lookedCards.push(cardOwner)
}

function commandPasra(card) {
    if(card.cardOwnerContainer !== getOwnerContainer(playerTurn)
        && card.cardOwnerContainer !== getOwnerContainer(playerTurn, true)){
        return
    }

    // inCommand = true

    card.flipCard()
    changeCardOwner(card, secondaryDeckCardContainer, false)

    finishCommand(500)
}
