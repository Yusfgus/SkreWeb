import Card from "./cards.js";

let primaryDeckcards = []
let secondaryDeckcards = []

const primaryDeckCardContainer = document.getElementById('primaryDeck')
const secondaryDeckCardContainer = document.getElementById('secondaryDeck')

const maxPlayersNum = 4
let currentPlayer = 1
let playerTurn = 1

let primaryDeckClicked = false
let secondaryDeckClicked = false

loadGame()

function loadGame() {
    
    attatchClickEventHandlerToDecks()
    
    createCards()
}

function changeTurn() {
    playerTurn = playerTurn % maxPlayersNum + 1
    currentPlayer = currentPlayer% maxPlayersNum + 1
}

function attatchClickEventHandlerToDecks() {
    // primaryDeckCardContainer.addEventListener('click', () => {primaryDeckClicked = true})
    secondaryDeckCardContainer.addEventListener('click', () => {secondaryDeckClick()})
}

function createCards() {
    // normal cards
    for(let i=1; i<=10; ++i) {
        const normalCard = new Card(`${i}`, i, getOwnerContainer(0))
        primaryDeckcards.push(normalCard)
        attatchClickEventHandlerToCard(normalCard)
    }



    Card.shuffle()
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
    card.cardDivElem.addEventListener('click', () => chooseCard(card))
}

function chooseCard(card) 
{
    if(canChooseCard(card))
    {
        // console.log('can choose', card.cardName)
        // console.log(card.cardOwnerContainer.id)
        if(card.cardOwnerContainer.id == primaryDeckCardContainer.id)
        {
            if(!primaryDeckClicked&& primaryDeckcards.length) {
                card.flipCard()
                primaryDeckClicked = true
            }
            else if(primaryDeckClicked) {
                card.flipCard()
                card.setOwnerContainer(getOwnerContainer(playerTurn))
                card.assignCardToOwner()
                primaryDeckcards.pop()
                primaryDeckClicked = false
                changeTurn()
            }
        }
    }
    else{
        console.log('can not choose')
    }
}

function canChooseCard(card) {
    return (
            currentPlayer == playerTurn && 
            card.cardOwnerContainer === getOwnerContainer(0) || card.cardOwnerContainer === getOwnerContainer(5)
            )
}

function secondaryDeckClick() {
    // console.log('in secondaryDeckClick =', primaryDeckClicked)
    if(primaryDeckClicked) {
        const victimCard = primaryDeckcards.pop()
        victimCard.setOwnerContainer(secondaryDeckCardContainer)
        victimCard.assignCardToOwner()
        secondaryDeckcards.push(victimCard)
        primaryDeckClicked = false
        changeTurn()
    }
}

