const commands = {
    '7': 'lookYours',
    '8': 'lookYours',
    '9': 'lookOthers',
    '10': 'lookOthers',
    'exchange': 'exchange',
    'lookAll': 'lookAll',
    'pasra': 'pasra'
}

export default class Card {
    constructor(name, value, owner) {
        this.name = name
        this.value = value
        this.owner = owner

        this.command = this.getCardCommand()
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
        updateInnerHTML(cardFrontElem, this.command)

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

    getCardCommand() {
        if(this.value >= 7 && this.value <=10)
        {
            return commands[this.name]
        }
        return ''
    }

    get cardDivElem() { 
        return this.cardElem
    }
    
    assignCardToPlayer(card) {
        const parent = document.getElementById(this.owner)
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

    static shuffle() {

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