import Card from "./cards.js";
import { addchildElement } from "./cards.js";

let primaryDeckcards = []
let secondaryDeckcards = []

const primaryDeckCardContainer = document.getElementById('primaryDeck')
const secondaryDeckCardContainer = document.getElementById('secondaryDeck')

const maxPlayersNum = 4
let currentPlayer = 1
let playerTurn = 1

let primaryDeckClicked = false
let secondaryDeckClicked = false

let selectedCard = null

loadGame()

function loadGame() {
    
    attatchClickEventHandlerToDecks()
    
    createCards()

    initRound()
}

function initRound() {
    distributeCards()
}

function putFirstCard() {
    const firstCard = primaryDeckcards.pop()
    secondaryDeckcards.push(firstCard)
    changeCardOwner(firstCard, secondaryDeckCardContainer, true)
}

function changeTurn() {
    //console.log('Change Turn')
    playerTurn = playerTurn % maxPlayersNum + 1
    currentPlayer = currentPlayer% maxPlayersNum + 1

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
    }, 600)
}

function createCards() {
    // normal cards
    for(let j=1; j<=4; ++j) 
    {
        for(let i=1; i<=10; ++i) 
        {
            const normalCard = new Card(`${i}`, i, getOwnerContainer(0))
            primaryDeckcards.push(normalCard)
            attatchClickEventHandlerToCard(normalCard)
        }
    }

    // command cards
    for(let i=1; i<=4; ++i) 
    {
        const exchangeCard = new Card("exchange", 10, getOwnerContainer(0))
        primaryDeckcards.push(exchangeCard)
        attatchClickEventHandlerToCard(exchangeCard)

        const plus20Card = new Card("20", 20, getOwnerContainer(0))
        primaryDeckcards.push(plus20Card)
        attatchClickEventHandlerToCard(plus20Card)
    }

    for(let i=1; i<=2; ++i) 
    {
        const lookAllCard = new Card("lookAll", 10, getOwnerContainer(0))
        primaryDeckcards.push(lookAllCard)
        attatchClickEventHandlerToCard(lookAllCard)

        const pasraCard = new Card("pasra", 10, getOwnerContainer(0))
        primaryDeckcards.push(pasraCard)
        attatchClickEventHandlerToCard(pasraCard)

        const redSkrewCard = new Card("redSkrew", 25, getOwnerContainer(0))
        primaryDeckcards.push(redSkrewCard)
        attatchClickEventHandlerToCard(redSkrewCard)

        const skrewDriverCard = new Card("skrewDriver", 0, getOwnerContainer(0))
        primaryDeckcards.push(skrewDriverCard)
        attatchClickEventHandlerToCard(skrewDriverCard)
    }

    const negativeOneCard = new Card("-1", -1, getOwnerContainer(0))
    primaryDeckcards.push(negativeOneCard)
    attatchClickEventHandlerToCard(negativeOneCard)

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
        if(selectedCard.cardOwnerContainer === getOwnerContainer(playerTurn)){
            chooseCard(card)
        }
    })
}

function changeCardOwner(card, owner, flip) {
    if(flip){
        card.flipCard()
    }
    card.setOwnerContainer(owner)
    card.assignCardToOwner()
}

function canChooseCard() {
    return (currentPlayer == playerTurn)
}

function primaryDeckClick() {
    if(!primaryDeckClicked && primaryDeckcards.length > 0) {
        const card = primaryDeckcards[primaryDeckcards.length - 1]
        card.flipCard()
        primaryDeckClicked = true
    }
}

function chooseCard(card) 
{
    if(!canChooseCard()) {
        return
    }
    // //console.log('in chooseCard() can choose')
    if(primaryDeckClicked) {
        // from primary deck to secondary deck
        const choosedCard = primaryDeckcards.pop()

        changeCardOwner(card, secondaryDeckCardContainer, true)
        secondaryDeckcards.push(card)

        changeCardOwner(choosedCard, getOwnerContainer(playerTurn), true)
        primaryDeckClicked = false
    
        setTimeout(() => {
            changeTurn()
        }, 2000)
    }
    else if (secondaryDeckcards.length > 0)
    {
        if(secondaryDeckClicked)
        {
            const choosedCard = secondaryDeckcards.pop()
            // choose from second deck
            changeCardOwner(choosedCard, getOwnerContainer(playerTurn), true)
            changeCardOwner(card, secondaryDeckCardContainer, true)
            secondaryDeckcards.push(card)
            secondaryDeckClicked = false
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
        setTimeout(() => {
            changeTurn()
        }, 2000)
    }
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

