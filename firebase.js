// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, child, get, set, update, remove, onDisconnect, onChildRemoved, onChildChanged, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwDL3yypzhVQ8ibWewlY4AnGK7nuvvKzE",
    authDomain: "skreweb.firebaseapp.com",
    databaseURL: "https://skreweb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "skreweb",
    storageBucket: "skreweb.appspot.com",
    messagingSenderId: "122835235907",
    appId: "1:122835235907:web:99248a8fc4761c9b6cd0f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase()
const auth = getAuth(app)
const gameRef = ref(db, 'game/')
const clickedCardIndexRef = ref(db, 'game/clickedCardIndex')
const playersCntRef = ref(db, 'game/playersCnt')
const shuffledCardsRef = ref(db, 'game/shuffledCards')
const secondaryDeckClickedRef = ref(db, 'game/secondaryDeckClicked')
const saidSrewRef = ref(db, 'game/saidSrew')

let currentPlayer;

/*
clickedCardIndex: -1,
playersCnt: 0,
shuffledCards: "",
secondaryDeckClicked: 0,
*/

//==================================================================================

import {loadGame, setter, getter,
        cardClicked, 
        maxPlayersNum, reOrderCards, 
        secondaryDeckClick, saySkrew,
        } from './main.js'

document.addEventListener('DOMContentLoaded', () => {
    // initPlayer()
    signIn()
})

async function initPlayer() {

    initFirebase()
    await setCurrentPlayer()
    addEventListeners()
}

function signIn() {
    signInAnonymously(auth).then(() => {
        initPlayer()
    }).catch((error) => {
        console.log(error.code, error.message)
    })
}

export function initFirebase(firstTime = false) {
    if(currentPlayer == 1)
    {
        if(firstTime) {
            set(gameRef, {
                clickedCardIndex: -1,
                playersCnt: 1,
                shuffledCards: "",
                secondaryDeckClicked: 0,
                saidSrew: false,
            })
        }
        else {
            update(gameRef, { saidSrew: false })
        }
    }
}

async function setCurrentPlayer() {
    await get(playersCntRef).then((snapshot) => {
        if (snapshot.exists() && snapshot.val() < 4) {
            currentPlayer = snapshot.val() + 1
        }
        else {
            currentPlayer = 1 
        }
    })
    initFirebase(true)
    setter('currentPlayer', currentPlayer)
    update(gameRef, { playersCnt: currentPlayer })
}

// function changeGridCardContainers() {
//     const mainDiv = document.getElementById('main-area')
//     const currentPlayerNum = getter('currentPlayer')
//     if(currentPlayerNum == 1){
//         mainDiv.style.gridTemplateAreas = '"p4 p3 p2" "p4 d p2" "p4 p1 p2"'
//     }
//     else if(currentPlayerNum == 2){
//         mainDiv.style.gridTemplateAreas = '"p1 p4 p3" "p1 d p3" "p1 p2 p3"'
        
//     }
//     else if(currentPlayerNum == 3){
//         mainDiv.style.gridTemplateAreas = '"p2 p1 p4" "p2 d p4" "p2 p3 p4"'
//     }
//     else if(currentPlayerNum == 4){
//         mainDiv.style.gridTemplateAreas = '"p3 p2 p1" "p3 d p1" "p3 p4 p1"'
//     }
// }

export function fireCardClicked(cardIndex) {
    update(gameRef, { clickedCardIndex: cardIndex })
}

export function fireSecondaryDeckClick(value = true){
    update(gameRef, { secondaryDeckClicked: value })
}

export function fireSaySkrew(){
    update(gameRef, { saidSrew: true })
}

export function fireShuffleCards(shuffledCards)
{
    const shuffledCardsStr = shuffledCards.join(',');
    // const shuffledCardsStr = '40,14,34,42,33,54,29,32,2,51,21,43,15,37,45,52,49,4,47,0,22,41,18,12,36,27,35,38,11,48,10,30,5,16,8,55,50,39,7,3,24,20,56,13,1,46,9,17,19,53,25,26,6,31,28,44,23';
    update(gameRef, {
        shuffledCards: shuffledCardsStr
    })
}

function addEventListeners() {
    cardClickedIndexListener()
    playersCntListener()
    shuffledCardsListener()
    secondaryDeckClickedListener()
    saidSrewListener()
}

function cardClickedIndexListener() {
    onValue(clickedCardIndexRef, (snapshot) => {
        // cardClickIndex
        const cardIndex = snapshot.val()
        console.log('cardClickedIndex =', cardIndex)
        if(cardIndex >= 0){
            cardClicked(cardIndex)
            fireCardClicked(-1)
        }
    })  
}

function playersCntListener() {
    onValue(playersCntRef, (snapshot) => {
        //playerCnt
        const playersCnt = snapshot.val()
        if(playersCnt == maxPlayersNum){
            console.log('load game')
            loadGame()
        }
    })
}

function shuffledCardsListener() {
    onValue(shuffledCardsRef, (snapshot) => {
        //shuffleCards
        const shuffledCards = snapshot.val()
        if(shuffledCards !== ""){
            setter('cardsShuffled', true)
            reOrderCards(shuffledCards)
            fireShuffleCards([])
        }
    })
}

function secondaryDeckClickedListener(){
    onValue(secondaryDeckClickedRef, (snapshot) => {
        //secondaryDeckClickedRef
        if(snapshot.val() != false){
            secondaryDeckClick()
            fireSecondaryDeckClick(false)
        }
    })
}

function saidSrewListener(){
    onValue(saidSrewRef, (snapshot) => {
        //saidSrewRef
        if(snapshot.val() == true){
            saySkrew()
        }
    })
}
