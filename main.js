import Card from "./cards.js";

let primaryDeckcards = []
let secondaryDeckcards = []

const primaryDeckCardContainer = document.getElementById('primaryDeck')
const secondaryDeckCardContainer = document.getElementById('secondaryDeck')

const maxPlayersNum = 4
let currentPlayer = 1
let playerTurn = 1

let primaryDeckClicked = false

let selectedCard = null

loadGame()

function loadGame() {
    
    attatchClickEventHandlerToDecks()
    
    createCards()
}

function initRound() {

}

function changeTurn() {
    //console.log('Change Turn')
    playerTurn = playerTurn % maxPlayersNum + 1
    currentPlayer = currentPlayer% maxPlayersNum + 1
}

function attatchClickEventHandlerToDecks() {
    primaryDeckCardContainer.addEventListener('click', () => {primaryDeckClick()})
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
    card.cardDivElem.addEventListener('click', () => {
        selectedCard = card
        //console.log('card name =', selectedCard.cardName)
        chooseCard(card)
    })
}

function changeCardOwner(card, owner) {
    card.setOwnerContainer(owner)
    card.assignCardToOwner()
}

function canChooseCard() {
    return (
            currentPlayer == playerTurn && 
            (selectedCard.cardOwnerContainer === primaryDeckCardContainer || selectedCard.cardOwnerContainer === secondaryDeckCardContainer)
            )
}

function chooseCard(card) 
{
    if(!canChooseCard()) {
        // //console.log('in chooseCard() can not choose')
        return
    }
    // //console.log('in chooseCard() can choose')

}

function primaryDeckClick() {
    if(!canChooseCard()) {
        // //console.log('in primaryDeckClick() can not choose')
        return
    }
    // console.log('in primaryDeckClick() can choose')

    if(!primaryDeckClicked && primaryDeckcards.length) {
        const card = primaryDeckcards[primaryDeckcards.length - 1]
        card.flipCard()
        primaryDeckClicked = true
    }
    else if(primaryDeckClicked) {
        const card = primaryDeckcards[primaryDeckcards.length - 1]
        card.flipCard()
        changeCardOwner(card, getOwnerContainer(playerTurn))
        primaryDeckcards.pop()
        primaryDeckClicked = false
        changeTurn()
    }
}

function secondaryDeckClick() {
    //console.log('in secondaryDeckClick =', primaryDeckClicked)
    if(!canChooseCard()) {
        //console.log('in secondaryDeckClick() can not choose')
        return
    }
    //console.log('in secondaryDeckClick() can choose')

    if(primaryDeckClicked) {
        // from primary deck to secondary deck
        const victimCard = primaryDeckcards.pop()
        changeCardOwner(victimCard, secondaryDeckCardContainer)
        secondaryDeckcards.push(victimCard)
        primaryDeckClicked = false
        changeTurn()
    }
    else if (secondaryDeckcards.length > 0)
    {
        const card = secondaryDeckcards[secondaryDeckcards.length - 1]
        // choose from second deck
        card.flipCard()
        changeCardOwner(card, getOwnerContainer(playerTurn))
        secondaryDeckcards.pop()
        changeTurn()
    }
}

