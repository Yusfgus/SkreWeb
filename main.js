import Card from "./cards.js";
import { fireCardClicked, fireSecondaryDeckClick, 
        fireShuffleCards, fireSaySkrew, 
        initFirebase 
        } from "./firebase.js";

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
const dashboard = document.getElementById('dashboard')
const roundName = document.getElementById('round-name')
// const scoreTable = document.getElementById('score-table')
const rowToRight = document.querySelectorAll('.row-to-right')
const rowToLeft = document.querySelectorAll('.row-to-left')
const player1ScoreRow = document.getElementById('player1-score-row')
const player2ScoreRow = document.getElementById('player2-score-row')
const player3ScoreRow = document.getElementById('player3-score-row')
const player4ScoreRow = document.getElementById('player4-score-row')

let roundColumnIndex = 5

export const maxPlayersNum = 4
const maxRoundNum = 5
const minTurnsNumBeforSkrew = 0

let roomCode
let currentPlayer = 0
let turnPlayer = 0
let playerSaidSkrew = 0
let startTurn = 1

let primaryDeckClicked = 0
let secondaryDeckClicked = false
let cardsShuffled = false

// let roundStarted = false
let roundCounter = 0
let turnCounter = 0
let turnsAfterSkrew = -1

const distributionsTime = 5000
const showCardsTime = 2000
const insertCardTime = 50
const dashBoardDelayTime = 600
const showRoundNameTime = 3000
const showScoreTableTime = 5000
const showPlayersCardsTime = 5000

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

export function setter(str, value) {
    if(str === 'currentPlayer'){
        currentPlayer = value
    }
    else if(str === 'cardsShuffled'){
        cardsShuffled = value
    }
}

export function getter(str){
    if(str === 'currentPlayer'){
        return currentPlayer
    }
}

function tempCreateCards() {
    let cardIndex = 0
    for(let i=0; i<=50; ++i){
        initCard('lookAll', 10, getOwnerContainer(0), cardIndex++)
    }
}
// loadGame()
export function loadGame() {

    console.log('currentPlayer =', currentPlayer)

    replacePlayersContainers()

    initScoreTable()

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
    // startTurn = 0
    // initturnPlayer()
}

// function initturnPlayer() {
//     if(currentPlayer == 1){
//         startTurn = 1
//     }
//     else if(currentPlayer == 2){
//         startTurn = 4
//     }
//     else if(currentPlayer == 3){
//         startTurn = 3
//     }
//     else if(currentPlayer == 4){
//         startTurn = 2
//     }
//     currentPlayer = startTurn
// }

async function startRound() {

    let waitTime = dashBoardDelayTime + showRoundNameTime + 2000
    if(++roundCounter > maxRoundNum)
    {
        await wait(() => {
            showDashBoard(true, false)
            // showDashBoard(true, false)
        }, waitTime)
        alert("game is finished")
        return
    }

    if(roundCounter > 1) {
        waitTime += dashBoardDelayTime + showScoreTableTime
    }
    await wait(() => {
        showDashBoard(roundCounter > 1, true)
        // showDashBoard(true, true)
    }, waitTime)

    await wait(initRound, distributionsTime + showCardsTime + 2000 + 3000)
    putFirstCard()
    // roundStarted = true
    // roundCounter++

    changeTurn(800)
}

function waitUnitShuffling(){
    const id = setInterval(() => {
        if(cardsShuffled){
            clearInterval(id)
            cardsShuffled = false
        }
    }, 12)
}

async function initRound() {
    initFirebase(false)
    shuffleCards()
    await wait(waitUnitShuffling, 3000)
    // reOrderCards()
    
    playersScore = [0, 0, 0, 0]
    turnPlayer = 0
    // currentPlayer = 0
    turnCounter = 0
    turnsAfterSkrew = -1
    commandCardActivated = ''
    // inCommand = false

    addCardsToPrimaryDeck()
    console.log('distribute')
    await wait(distributeCards, distributionsTime)
    console.log('initial players scores =', playersScore)

    await wait(showFirstTwoCards, showCardsTime + 1000)
}

function changeTurn(ms = 1500) {

    if(turnsAfterSkrew != -1 && turnsAfterSkrew++ == maxPlayersNum-1){
        turnOffturnPlayerLine()
        endRound()
        return
    }

    turnCounter++

    setTimeout(() => {
        
        if(turnPlayer == 0){
            turnPlayer = startTurn
        }
        else {
            turnOffturnPlayerLine()
            turnPlayer = turnPlayer % maxPlayersNum + 1
        }
        
        // currentPlayer = turnPlayer

        primaryDeckClicked = 0
        secondaryDeckClicked = false
    
        console.log(`player ${turnPlayer} turn`)
        getturnPlayerLine(turnPlayer).style.animation = 'glow 2.5s ease-in-out infinite'
    }, ms)
}

function turnOffturnPlayerLine() {
    // for(let i=1; i<=maxPlayersNum; ++i){
    //     getturnPlayerLine(i).style.animation = ''
    // }
    getturnPlayerLine(turnPlayer).style.animation = ''
}

function getturnPlayerLine(playerIndex) {
    return document.getElementById(`player${playerIndex}-turn-line`)
}

function showRoundName() {
    const imgPath = `url('images/round${roundCounter}-background.png')`
    // console.log(imgPath)
    roundName.style.backgroundImage = (imgPath)
    roundName.style.height = '30rem'
    roundName.style.width = '30rem'

    setTimeout(() => {
        roundName.style.height = '0'
        roundName.style.width = '0'
    }, showRoundNameTime)
}

function showScoreTable() {
    rowToRight.forEach(function(element) {
        element.style.right = '0';
    });
    rowToLeft.forEach(function(element) {
        element.style.left = '0';
    });

    setTimeout(() => {
        rowToRight.forEach(function(element) {
            element.style.right = '-150%';
        });
        rowToLeft.forEach(function(element) {
            element.style.left = '-150%';
        });
    }, showScoreTableTime)
}

async function showDashBoard(flag1 = false, flag2 = true) {
    // dashboard.style.top = '0'
    dashboard.style.bottom = '0'

    await sleep(dashBoardDelayTime)

    if(flag1) {
        await wait(showScoreTable, showScoreTableTime + dashBoardDelayTime)
    }

    if(flag2){
        await wait(showRoundName, showRoundNameTime + 200)
    }

    // dashboard.style.top = '-100%'
    dashboard.style.bottom = '-100%'
}

// function editScoreTableCell(table, column, value) {
//     table.rows[0].cells[column].textContent = value
// }

function replacePlayersContainers()
{
    const containersId = ['bottom', 'right', 'top', 'left']
    for(let j=0, i=currentPlayer; j<4; i=(i+1)%4, ++j)
    {
        const index = (i ? i: 4)
        document.getElementById(`${containersId[j]}-container`).appendChild(getOwnerContainer(index, true))
        document.getElementById(`${containersId[j]}-container`).appendChild(getOwnerContainer(index, false))
        document.getElementById(`${containersId[j]}-container`).appendChild(document.getElementById(`player${index}-turn-line`))
    }
}

function initScoreTable() {
    roundColumnIndex = 5
    player1ScoreRow.rows[0].cells[6].textContent = 'Player1'
    player2ScoreRow.rows[0].cells[6].textContent = 'Player2'
    player3ScoreRow.rows[0].cells[6].textContent = 'Player3'
    player4ScoreRow.rows[0].cells[6].textContent = 'Player4'
}

function getScore(arr, min) {
    let ScorePlayerIndex = [0]
    let Score = arr[ScorePlayerIndex[0]]

    for(let i = 1; i<maxPlayersNum; ++i) 
    {
        const score = arr[i]
        if(min && score < Score){
            ScorePlayerIndex = [i]
        }
        else if(!min && score > Score){
            ScorePlayerIndex = [i]
        }
        else if(score == Score){
            ScorePlayerIndex.push(i)
        }
        Score = arr[ScorePlayerIndex[0]]
        // console.log(score)
    }

    return Score
}

// function getMinScores(arr) {
//     let minScorePlayerIndex = [0]
//     let minScore = arr[minScorePlayerIndex[0]]

//     for(let i = 1; i<maxPlayersNum; ++i) 
//     {
//         const score = arr[i]
//         if(score < minScore){
//             minScorePlayerIndex = [i]
//         }
//         else if(score == minScore){
//             minScorePlayerIndex.push(i)
//         }
//         minScore = arr[minScorePlayerIndex[0]]
//         // console.log(score)
//     }

//     return minScore
// }

function colorScoreTableCells(columnsIndex) {

    const arr = columnsIndex == 0? totalPlayersScore: playersScore 

    const maxScore = getScore(arr, false)
    // console.log('max score is', maxScore)
    const minScore = getScore(arr, true)

    arr.forEach((score, index) => {
        if(score == minScore)
        {
            const wonPlayerRow = document.getElementById(`player${index+1}-score-row`)
            wonPlayerRow.rows[0].cells[columnsIndex].style.backgroundColor = '#51A500'

            if(columnsIndex == 0){
                for(let i=1; i<7; ++i){
                    wonPlayerRow.rows[0].cells[i].style.backgroundColor = '#51A500'
                }
            }

        }
        else if(score == maxScore)
        {
            const losePlayerRow = document.getElementById(`player${index+1}-score-row`)
            losePlayerRow.rows[0].cells[columnsIndex].style.backgroundColor = '#6A0102'
        }
    })
}

function updateScoreTable() {
    player1ScoreRow.rows[0].cells[roundColumnIndex].textContent = playersScore[0]
    player2ScoreRow.rows[0].cells[roundColumnIndex].textContent = playersScore[1]
    player3ScoreRow.rows[0].cells[roundColumnIndex].textContent = playersScore[2]
    player4ScoreRow.rows[0].cells[roundColumnIndex].textContent = playersScore[3]

    player1ScoreRow.rows[0].cells[0].textContent = totalPlayersScore[0]
    player2ScoreRow.rows[0].cells[0].textContent = totalPlayersScore[1]
    player3ScoreRow.rows[0].cells[0].textContent = totalPlayersScore[2]
    player4ScoreRow.rows[0].cells[0].textContent = totalPlayersScore[3]
    
    colorScoreTableCells(roundColumnIndex)
    if(roundCounter == maxRoundNum){
        colorScoreTableCells(0)
    }
    roundColumnIndex--
}

function winOrPunish() {
    playersScore = [5, 7, 1, 0]
    let minScore = getScore(playersScore, true)
    console.log('min score is', minScore)

    for(let i = maxPlayersNum-1 ; i>=0; --i) {
        if(playersScore[i] == minScore){
            playersScore[i] = 0
            startTurn = i+1
        }
    }

    if(roundCounter == maxRoundNum) {
        for(let i=0; i<maxPlayersNum; ++i){
            playersScore[i] *= 2
        }
        console.log('roundCounter = maxRoundNum = ', maxRoundNum)
    }

    if(playersScore[playerSaidSkrew] != 0) {
        // double
        playersScore[playerSaidSkrew] *= 2
    }
    else{
        startTurn = playerSaidSkrew+1
    }

    // console.log('round scores is', playersScore)
}

function calculateScores() {
    
    winOrPunish()
    
    playersScore.forEach((score, index) => {
        totalPlayersScore[index] += score
    })

    updateScoreTable()

    console.log("total players scores =", totalPlayersScore)
}

function showCards(parentDiv) {
    for (let i = 0; i < parentDiv.children.length; ++i) {
        const card = parentDiv.children[i]
        getCardClass(card).flipCard()
    }
}

function showPlayersCards() {
    for(let i=1; i<=maxPlayersNum; ++i) {
        showCards(document.getElementById(`player${i}-cards-container`))
        showCards(document.getElementById(`player${i}-cards-container2`))
    }
    
    setTimeout(() => {
        for(let i=1; i<=maxPlayersNum; ++i) {
            showCards(document.getElementById(`player${i}-cards-container`))
            showCards(document.getElementById(`player${i}-cards-container2`))
        }
    }, showPlayersCardsTime)
}

async function endRound() 
{
    await sleep(2000)
    await wait(showPlayersCards, showPlayersCardsTime + 100)
    await sleep(1000)
    // playersScore = [20, 25, 1, 20]
    console.log('round scores is', playersScore)
    calculateScores()

    removeCardsFrom(primaryDeckCardContainer)
    removeCardsFrom(secondaryDeckCardContainer, true)
    for(let i=1; i<=maxPlayersNum; ++i) {
        removeCardsFrom(document.getElementById(`player${i}-cards-container`))
        removeCardsFrom(document.getElementById(`player${i}-cards-container2`))
    }
    // await wait(showDashBoard, 6000)  // show score table

    startRound()
    // console.log("primary deck lenght", primaryDeckCardContainer.children.length)
}

function canSaySkrew() {
    return  canChooseCard() && turnsAfterSkrew == -1 && turnCounter/maxPlayersNum > minTurnsNumBeforSkrew
}

export async function saySkrew() {

    // if(!canSaySkrew()){
    //     return
    // }

    // if(turnsAfterSkrew == -1 && turnPlayer == currentPlayer && turnCounter/maxPlayersNum > minTurnsNumBeforSkrew)
    {
        turnsAfterSkrew = 0
        playerSaidSkrew = turnPlayer - 1
        console.log('player sad skrew', turnPlayer)
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
    // primaryDeckcards = cards
}

async function showFirstTwoCards() {
    const cardsContainer = getOwnerContainer(currentPlayer)
    const firstChild = getDivChild(cardsContainer, 0)
    const secondChild = getDivChild(cardsContainer, 1)

    await wait( () => {
        setTimeout(() => {
            getCardClass(firstChild).flipCard()
            getCardClass(secondChild).flipCard()
        }, 800)
    },showCardsTime + 800)

    getCardClass(firstChild).flipCard()
    getCardClass(secondChild).flipCard()
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

function distributeCards() {

    console.log('cards before distributing', cards)
    let ctr = startTurn - 1
    let maxCards = maxPlayersNum * 4
    const id = setInterval(() => 
    {
        const card = primaryDeckcards.pop()
        const playerIndex = ctr++ % maxPlayersNum
        playersScore[playerIndex] += card.cardValue
        const playerContainer = getOwnerContainer(playerIndex + 1)
        // console.log('playerIndex + 1=',playerIndex + 1)
        changeCardOwner(card, playerContainer, false)
        // addchildElement(playerContainer, card)
        if(--maxCards == 0) {
            clearInterval(id)
            console.log('cards after distributing', cards)
            // putFirstCard()
        }
    }, distributionsTime/(4*4))

}

function initCard(name, value, owner, cardIndex) {
    const card = new Card(name, value, owner, cardIndex)
    cards.push(card)
    attatchClickEventHandlerToCard(card)
}

export function reOrderCards(shuffledCardsStr) {
    const cardsIndex = shuffledCardsStr.split(',').map(Number);
    let tempCards = []
    for(let i=0; i<cards.length; ++i) {
        const index = cardsIndex[i]
        tempCards.push(cards[index])
        tempCards[i].setDataValue(i)
    }
    cards = tempCards
    console.log(cards)
}

export function shuffleCards() {
    if(currentPlayer != 1){
        return
    }
    console.log("shuffling")
    let cardsIndex = []
    for(let i=0; i<cards.length; ++i){
        cardsIndex.push(i)
    }
    // console.log(cardsIndex)
    const maxIndex = cardsIndex.length
    let ctr = 1000
    while(ctr-- > 0)
    {
        const random1 = Math.floor(Math.random() * maxIndex)
        const random2 = Math.floor(Math.random() * maxIndex)

        const temp = cardsIndex[random1]
        cardsIndex[random1] = cardsIndex[random2]
        cardsIndex[random2] = temp

        // cardsIndex[random1].setDataValue(random1)
        // cardsIndex[random2].setDataValue(random2)
    }
    // console.log(cards)
    fireShuffleCards(cardsIndex)
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

export function getOwnerContainer(ownerId, secondContainer = false) {
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

export function cardClicked(cardIndex) {
    const card = cards[cardIndex]
    console.log('card clicked')
    const cardOwnerElem = card.cardOwnerContainer
    if(commandCardActivated !== ''){
        console.log('in command')
        commandActivate(card)
    }
    else if(card.cardOwnerContainer === getOwnerContainer(turnPlayer)
    || card.cardOwnerContainer === getOwnerContainer(turnPlayer, true))
    {
        console.log('call choosCard')
        chooseCard(card)
    }
    else if(cardOwnerElem === primaryDeckCardContainer){
        primaryDeckClick()
    }
    // else if(cardOwnerElem === secondaryDeckCardContainer){
    //     secondaryDeckClick()
    // }
}

function cheating(card) {

    if(card.cardOwnerContainer === getOwnerContainer(currentPlayer)
    || card.cardOwnerContainer === getOwnerContainer(currentPlayer, true))
    {
        alert(`player ${currentPlayer} is cheating`)
        // console.log(playersScore)
        playersScore[currentPlayer-1] += 10
        // console.log(playersScore)
    }
}

function attatchClickEventHandlerToCard(card) {
    card.cardDivElem.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        cheating(card)
    })
    card.cardDivElem.addEventListener('click', () => { 
        if(canChooseCard()){
            fireCardClicked(card.cardIndex) 
        }
    })
}

function attatchClickEventHandler() {
    // primaryDeckCardContainer.addEventListener('click', primaryDeckClick)
    secondaryDeckCardContainer.addEventListener('click', () => {
        if(canChooseCard()) {
            fireSecondaryDeckClick()
        }
    })
    skrewButton.addEventListener('click', () => {
        fireSaySkrew()
        if(canSaySkrew()){
            saySkrew()
        }
    })
}

function changeCardOwner(card, owner, flip, assign = true, hide = false) {
    if(flip){
        card.flipCard()
    }

    card.setOwnerContainer(owner)
    console.log('hide=', hide)
    console.log(card)
    if(hide){
        const cardInnerElem = card.cardDivElem.firstChild
        cardInnerElem.style.height = '0'
        cardInnerElem.style.width = '0'
    }

    if(assign){
        card.assignCardToOwner()
    }
}

function canChooseCard() {
    // console.log('turnPlayer =', turnPlayer)
    // console.log('currentPlayer =', currentPlayer)
    // console.log('commandCardActivated =', commandCardActivated)
    return (turnsAfterSkrew != 0 && /*turnPlayer != 0 &&*/ currentPlayer == turnPlayer/* && commandCardActivated === ''*/)
}

function primaryDeckClick() {
    // if(!canChooseCard()){
    //     return
    // }
    console.log('primary deck clicked')
    if(commandCardActivated === '' && primaryDeckClicked == 0 && primaryDeckcards.length > 0) {
        const card = primaryDeckcards[primaryDeckcards.length - 1]
        if(currentPlayer == turnPlayer){
            card.flipCard()
        }
        primaryDeckClicked++
    }
}

function addCardsToSecondaryDeck(myCard, choosedCard) 
{
    //from primary to player and from player to secondary
    //or 
    //from secondary to player and from player to secondary

    const playerContainer = myCard.cardOwnerContainer
    const myCardIndex = Array.from(playerContainer.children).indexOf(myCard.cardDivElem)
    
    const flip = (currentPlayer==turnPlayer || choosedCard.cardOwnerContainer == secondaryDeckCardContainer)
    changeCardOwner(choosedCard, playerContainer, flip, false, true) 
    insertCardInIndex(choosedCard, playerContainer, myCardIndex)
    
    secondaryDeckcards.push(myCard)
    changeCardOwner(myCard, secondaryDeckCardContainer, true, true, false) 

    updateScore(turnPlayer - 1, choosedCard.cardValue - myCard.cardValue)
}

function chooseCard(card) 
{
    // if(!canChooseCard()) {
    //     console.log('cant choose')
    //     return
    // }

    if(primaryDeckClicked == 1) {
        console.log('from primary deck to player', turnPlayer)
        const choosedCard = primaryDeckcards.pop()
        primaryDeckClicked++
    
        addCardsToSecondaryDeck(card, choosedCard)
        changeTurn(300)
    }
    else if (secondaryDeckcards.length > 0)
    {
        if(secondaryDeckClicked)
        {
            console.log('from secondary deck to player', turnPlayer)    
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
                    updateScore(turnPlayer - 1, - card.cardValue)
                }
                else {
                    console.log('pasra failed') 
                    // failed
                    card.flipCard()
                    secondaryDeckcards.pop()
                    
                    changeCardOwner(lastSecondaryCard, getOwnerContainer(turnPlayer, true), true)
                    updateScore(turnPlayer - 1, lastSecondaryCard.cardValue)
                }
            }, 1300)
            changeTurn(1500)
        }
    }
}

export function secondaryDeckClick() {
    // if(!canChooseCard()) {
    //     return
    // }

    if(primaryDeckClicked == 1) {
        console.log('from primary deck to secondary deck')
        const victimCard = primaryDeckcards.pop()
        changeCardOwner(victimCard, secondaryDeckCardContainer, currentPlayer!=turnPlayer)
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
    // else {
    //     console.log('secondaryDeckcards.length =', secondaryDeckcards.length)
    //     console.log('commandCardActivated =', commandCardActivated)
    // }
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
    // if(card.cardOwnerContainer !== getOwnerContainer(currentPlayer) 
    //     && card.cardOwnerContainer !== getOwnerContainer(currentPlayer, true))
    // {
    //     return
    // }

    // inCommand = true
    commandCardActivated = 'wait'
    
    card.flipCard(currentPlayer == turnPlayer)
    await wait(() => {
        setTimeout(() => {
            card.flipCard(currentPlayer == turnPlayer)
        }, showCardsTime)
    },showCardsTime)

    finishCommand(0)
}

async function commandLookOthers(card) {
    if( /*card.cardOwnerContainer === getOwnerContainer(currentPlayer)
        || card.cardOwnerContainer === getOwnerContainer(currentPlayer, true)
        || */card.cardOwnerContainer === primaryDeckCardContainer
        || card.cardOwnerContainer === secondaryDeckCardContainer)
    {
        return
    }

    // inCommand = true
    commandCardActivated = 'wait'

    card.flipCard(currentPlayer == turnPlayer)
    await wait(() => {
        setTimeout(() => {
            card.flipCard(currentPlayer == turnPlayer)
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

    console.log(card.cardDivElem)
    const cardInnerElem = card.cardDivElem.firstChild
    // cardInnerElem.style.height = '0'
    // cardInnerElem.style.width = '0'
    
    const referenceNode = parent.children.item(index);
    // Insert the new child before the reference node
    parent.insertBefore(card.cardDivElem, referenceNode);
    setTimeout(() => {
        cardInnerElem.style.width = '100%'
        cardInnerElem.style.height = '100%'
    }, insertCardTime)
}

function exchangeTwoCards(card1, card2, flip = true) {

    const card1Container = card1.cardOwnerContainer
    const card2Container = card2.cardOwnerContainer
    
    const card1CurrentIndex = Array.from(card1Container.children).indexOf(card1.cardDivElem)
    const card2CurrentIndex = Array.from(card2Container.children).indexOf(card2.cardDivElem)
    
    changeCardOwner(card1, card2Container, flip, false, true) 
    insertCardInIndex(card1, card2Container, card2CurrentIndex)
    
    changeCardOwner(card2, card1Container, flip, false, true)
    insertCardInIndex(card2, card1Container, card1CurrentIndex)
}

let card1 = null
function commandExchangeCard(card) {

    if(card.cardOwnerContainer === primaryDeckCardContainer
        || card.cardOwnerContainer === secondaryDeckCardContainer)
    {
        return
    }

    if(card1 == null)
    {
        card1 = card
        return
    }
    let card2 = card

    const playerContainer1 = getOwnerContainer(turnPlayer)
    const playerContainer2 = getOwnerContainer(turnPlayer, true)
    const card1Container = card1.cardOwnerContainer
    const card2Container = card2.cardOwnerContainer

    const noOneOfThemIsHis = (card2Container !== playerContainer1 
                            && card1Container !== playerContainer1 
                            && card2Container !== playerContainer2 
                            && card1Container !== playerContainer2)

    if(card2Container === card1Container || noOneOfThemIsHis)
    {
         return
    }

    // inCommand = true
    commandCardActivated = 'wait'

    const value1 = card1.cardValue - card2.cardValue
    const value2 = card2.cardValue - card1.cardValue

    if(card1Container === playerContainer1 || card1Container === playerContainer2) {
        updateScore(turnPlayer - 1, value2)
        updateScore(getPlayerIndex(card2Container), value1)
    }
    else {
        updateScore(turnPlayer - 1, value1)
        updateScore(getPlayerIndex(card1Container), value2)
    }

    exchangeTwoCards(card1, card2, false)

    // animationExchange(card1, card)

    card1 = null
    finishCommand(500)
}

let lookedCards = []
function commandLookAll(card) {
    const cardOwner = card.cardOwnerContainer
    if( cardOwner === primaryDeckCardContainer
        || cardOwner === secondaryDeckCardContainer)
    {
        return
    }

    let can = true
    lookedCards.forEach((lookedCardParent) => {
        if(lookedCardParent === cardOwner){
            console.log('card owner is', lookedCardParent)
            console.log('cant not look here again')
            can = false
            return
        }
    })

    if(!can){
        return
    }
    
    card.flipCard(currentPlayer == turnPlayer)
    setTimeout(() => {
        card.flipCard(currentPlayer == turnPlayer)
    }, showCardsTime)
    
    if(lookedCards.length == 3){
        // inCommand = true
        commandCardActivated = 'wait'
        lookedCards = []
        finishCommand(3000)
        return
    }
    lookedCards.push(cardOwner)
}

function commandPasra(card) {
    if(card.cardOwnerContainer !== getOwnerContainer(turnPlayer)
        && card.cardOwnerContainer !== getOwnerContainer(turnPlayer, true)){
        return
    }

    // inCommand = true
    commandCardActivated = 'wait'

    // card.flipCard()
    changeCardOwner(card, secondaryDeckCardContainer, true)

    finishCommand(500)
}
