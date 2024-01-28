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
    constructor(name, value, owner, cardIndex) {
        this.name = name
        this.value = value
        this.owner = owner
        this.cardIndex = cardIndex
        this.isFlipped = false // back is up

        this.command = this.getCardCommand()
        this.cardElem = this.creatCard()
        this.assignCardToOwner()
    }

    creatCard() {

        // <div class="card" id="this.name">
        //     <div class="card-inner">
        //         <div class="card-front">
        //             <img src="images/card-JackClubs.png" alt="king image" class="card-img">
        //         </div>
        //         <div class="card-back">
        //             <img src="images/card-back-Blue.png" alt="back image" class="card-img">
        //         </div>
        //     </div>
        // </div> 
        
        // <div class="card" id="this.name">
        const newCardElem = createElement('div')
        addClassToElement(newCardElem, 'card')
        addIdToElement(newCardElem, this.name)
        addDataValueToElement(newCardElem, this.cardIndex)
        
        // <div class="card-inner">
        const cardInnerElem = createElement('div')
        addClassToElement(cardInnerElem, 'card-inner')

        // <div class="card-front">
        const cardFrontElem = createElement('div')
        addClassToElement(cardFrontElem, 'card-front')
        // updateInnerHTML(cardFrontElem, this.name)

        // <div class="card-back">
        const cardBackElem = createElement('div')
        addClassToElement(cardBackElem, 'card-back')

        // <img src="images/card-JackClubs.png" class="card-img">
        const cardFrontImg = createElement('img')
        addSrcToImageElem(cardFrontImg, `images/${this.name}.png`)
        addClassToElement(cardFrontImg, 'card-img')
        
        // <img src="images/card-back-Blue.png" class="card-img">
        const cardBackImg = createElement('img')
        addSrcToImageElem(cardBackImg, 'images/back.png')
        addClassToElement(cardBackImg, 'card-img')

        // Add childs
        addchildElement(cardFrontElem, cardFrontImg)
        addchildElement(cardBackElem, cardBackImg)

        addchildElement(cardInnerElem, cardFrontElem)
        addchildElement(cardInnerElem, cardBackElem)
        
        addchildElement(newCardElem, cardInnerElem)

        return newCardElem
    }

    getCardCommand() {
        if(this.value >= 7 && this.value <=10)
        {
            return commands[this.name]
        }
        return ''
    }
    
    assignCardToOwner() {
        addchildElement(this.owner, this.cardElem)
    }

    flipCard() {
        const innerCardElem = this.cardElem.firstChild

        if(!this.isFlipped) {
            innerCardElem.style.transform = 'rotateY(180deg)'
        }
        else {
            innerCardElem.style.transform = ''
        }
        this.isFlipped = !this.isFlipped
    }

    static shuffle() {

    }

    setOwnerContainer(owner) {this.owner = owner}
    
    get cardName() {return this.name}
    get cardDivElem() {return this.cardElem}
    get cardOwnerContainer() {return this.owner}
    get cardIsFlipped() {return this.isFlipped}
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

function addDataValueToElement(elem, value) {
    elem.dataset.value = value
}

function addSrcToImageElem(imgElem, src) {
    imgElem.src = src
}

export function addchildElement(parentElem, childElem) {
    parentElem.appendChild(childElem)
}

function addCardToGridCell(card) {
    const cardPositionClassName = mapCardIdToGridCell(card.id)
    const cardPosElem = document.querySelector(cardPositionClassName)
    addchildElement(cardPosElem, card)
}