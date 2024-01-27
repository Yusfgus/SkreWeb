
export default class Card {
    constructor(name, value, command, owner) {
        this.name = name
        this.value = value
        this.command = command
        this.owner = owner
        this.cardElem = this.creatCard()
    }

    creatCard() {

        // <div class="card">
        //     <div class="card-inner">
        //         <div class="card-front">
        //             <img src="images/card-JackClubs.png" alt="king image" class="card-img">
        //         </div>
        //         <div class="card-back">
        //             <img src="images/card-back-Blue.png" alt="back image" class="card-img">
        //         </div>
        //     </div>
        // </div> 
        
        // <div class="card">
        const newCardElem = createElement('div')
        addClassToElement(newCardElem, 'card')
        addIdToElement(newCardElem, this.name)
        
        // <div class="card-inner">
        const cardInnerElem = createElement('div')
        addClassToElement(cardInnerElem, 'card-inner')

        // <div class="card-front">
        const cardFrontElem = createElement('div')
        addClassToElement(cardFrontElem, 'card-front')
        updateInnerHTML(cardFrontElem, this.name)

        // <div class="card-back">
        const cardBackElem = createElement('div')
        addClassToElement(cardBackElem, 'card-back')

        // <img src="images/card-JackClubs.png" class="card-img">
        const cardFrontImg = createElement('img')
        addSrcToImageElem(cardFrontImg, '')
        addClassToElement(cardFrontImg, 'card-img')

        // <img src="images/card-back-Blue.png" class="card-img">
        const cardBackImg = createElement('img')
        addSrcToImageElem(cardBackImg, '')
        addClassToElement(cardBackImg, 'card-img')

        // Add childs
        addchildElement(cardFrontElem, cardFrontImg)
        addchildElement(cardBackElem, cardBackImg)

        addchildElement(cardInnerElem, cardFrontElem)
        addchildElement(cardInnerElem, cardBackElem)
        
        addchildElement(newCardElem, cardInnerElem)

        this.attatchClickEventHandlerToCard(newCardElem)
        this.assignCardToPlayer(newCardElem)
        
        return newCardElem
    }

    get cardDivElem() { 
        return this.cardElem
    }
    
    assignCardToPlayer(card) {
        const parent = document.getElementById('primaryDeck')
        addchildElement(parent, card)
    }

    attatchClickEventHandlerToCard(card) {
        card.addEventListener('click', () => chooseCard(card))
    }

    chooseCard(card) {
        if(canChooseCard())
        {
            flipCard(card, false)
        }
    }

    canChooseCard() {
        // return gameInProgress && !shufflingInProgress && !cardsRevealed
        return true
    }

    flipCard(card, flipToBack) {
        // const innerCardElem = card.firstChild
        // const isInnerCardElemContainsClassFlipIt = innerCardElem.classList.contains('flip-it')
    
        // if(flipToBack && !isInnerCardElemContainsClassFlipIt) {
        //     innerCardElem.classList.add('flip-it')
        // }
        // else if(isInnerCardElemContainsClassFlipIt){
        //     innerCardElem.classList.remove('flip-it')
        // }
    }
}


function updateInnerHTML(elem, innerHTML) {
    elem.innerHTML = innerHTML
}

function createElement(elemType) {
    return document.createElement(elemType)
}

function addClassToElement(elem, className) {
    elem.classList.add(className)
}

function addIdToElement(elem, id) {
    elem.id = id
}

function addSrcToImageElem(imgElem, src) {
    imgElem.src = src
}

function addchildElement(parentElem, childElem) {
    parentElem.appendChild(childElem)
}

function addCardToGridCell(card) {
    const cardPositionClassName = mapCardIdToGridCell(card.id)
    const cardPosElem = document.querySelector(cardPositionClassName)
    addchildElement(cardPosElem, card)
}