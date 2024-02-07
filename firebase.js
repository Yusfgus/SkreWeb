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

let newRoomCodeRef = ref(db, 'Rooms/newRoomCode')
let roomRef

let gameInfoRef
let clickedCardIndexRef
let shuffledCardsRef
let secondaryDeckClickedRef
let saidSrewRef

let playersRef
let playersCntRef
let player1NameRef
let player2NameRef
let player3NameRef
let player4NameRef

let currentPlayer
let playerName
let roomCode

const fireSafeTime = 2000

/*
clickedCardIndex: -1,
playersCnt: 0,
shuffledCards: "",
secondaryDeckClicked: 0,
*/

//==================================================================================

import {loadGame, setter, getter,
        cardClicked, playersName,
        maxPlayersNum, reOrderCards, 
        secondaryDeckClick, saySkrew,
        } from './main.js'

// document.addEventListener('DOMContentLoaded', () => {
//     // initPlayer()
//     // signIn()
// })

window.addEventListener('beforeunload', playerLeaves)

function playerLeaves(){
    if(roomRef !== undefined){
        firePlayersCnt(-1)
        remove(roomRef)
    }
}

export function initPlayer(name, code) {
    setRefrences(code)
    playerName = name
    addEventListeners()
    firePlayersCnt()
    firePlayerName()
    setter('currentPlayer', currentPlayer)
}

// function signIn() {
//     signInAnonymously(auth).then(() => {
//         initPlayer()
//     }).catch((error) => {
//         console.log(error.code, error.message)
//     })
// }

// export function initFirebase(firstTime = false) {
//     if(currentPlayer == 1)
//     {
//         if(firstTime) {
//             set(roomsRef, {
//                 clickedCardIndex: -1,
//                 playersCnt: 1,
//                 shuffledCards: "",
//                 secondaryDeckClicked: 0,
//                 saidSrew: false,
//             })
//         }
//         else {
//             update(roomsRef, { saidSrew: false })
//         }
//     }
// }

// async function setCurrentPlayer() {
//     await get(playersCntRef).then((snapshot) => {
//         if (snapshot.exists() && snapshot.val() < 4) {
//             currentPlayer = snapshot.val() + 1
//         }
//         else {
//             currentPlayer = 1 
//         }
//     })
//     initFirebase(true)
//     setter('currentPlayer', currentPlayer)
//     update(roomsRef, { playersCnt: currentPlayer })
// }

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
    update(gameInfoRef, { clickedCardIndex: cardIndex })
    setTimeout(()=>{
        update(gameInfoRef, { clickedCardIndex: -1 })
    }, fireSafeTime)
}

export function fireSecondaryDeckClick(){
    update(gameInfoRef, { secondaryDeckClicked: true })
    setTimeout(()=>{
        update(gameInfoRef, { secondaryDeckClicked: false })
    }, fireSafeTime)
}

export function fireSaySkrew(){
    update(gameInfoRef, { saidSrew: true })
    // setTimeout(()=>{
    //     update(gameInfoRef, { saidSrew: false })
    // }, fireSafeTime)
}

export function fireShuffleCards(shuffledCards)
{
    const shuffledCardsStr = shuffledCards.join(',');
    // const shuffledCardsStr = '40,14,34,42,33,54,29,32,2,51,21,43,15,37,45,52,49,4,47,0,22,41,18,12,36,27,35,38,11,48,10,30,5,16,8,55,50,39,7,3,24,20,56,13,1,46,9,17,19,53,25,26,6,31,28,44,23';
    update(gameInfoRef, { shuffledCards: shuffledCardsStr })
    setTimeout(()=>{
        update(gameInfoRef, { shuffledCards: ""})
    }, 10000)
}

function firePlayerName(){
    if(currentPlayer == 1){
        update(playersRef, { player1Name: playerName })
    }
    else if(currentPlayer == 2){
        update(playersRef, { player2Name: playerName })
    }
    else if(currentPlayer == 3){
        update(playersRef, { player3Name: playerName })
    }
    else if(currentPlayer == 4){
        update(playersRef, { player4Name: playerName })
    }
}

function firePlayersCnt(value = currentPlayer){
    update(playersRef, { playersCnt: value })
}

async function incrementNewRoomCode(){
    let newRoomCode
    await get(newRoomCodeRef).then((snapshot) => {
        if (snapshot.exists()) {
            newRoomCode = snapshot.val()
            console.log(newRoomCode)
            update(ref(db, 'Rooms/'), { newRoomCode: newRoomCode+1 })
        }
    })
    return newRoomCode
}

export async function initRoom(name) {
    currentPlayer = 1
    const newRoomCode = await incrementNewRoomCode()
    console.log(newRoomCode)
    const newRoom = {
        players: {
            playersCnt: 1,
            player1Name: name,
            player2Name: "",
            player3Name: "",
            player4Name: "",
        },
        gameInfo: {
            clickedCardIndex: -1,
            secondaryDeckClicked: false,
            saidSrew: false,
            shuffledCards: "",
        }
    };
    console.log(newRoom)
    update(ref(db, 'Rooms/'), { [newRoomCode]: newRoom })
    return newRoomCode
}

function addEventListeners() {
    playersCntListener()
    // playersNamesListerner()
    cardClickedIndexListener()
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
            // fireCardClicked(-1)
        }
    })  
}

function playersCntListener() {
    onValue(playersCntRef, async (snapshot) => {
        //playerCnt
        const playersCnt = snapshot.val()
        if(playersCnt == maxPlayersNum){
            console.log('load game')
            await getPlayesName()
            loadGame()
        }
        else if(playersCnt == -1){
            alert('someone lift the room')
            location.reload()
        }
    })
}

async function getPlayesName() {
    await get(playersRef).then((snapshot) => {
        playersName[0] = snapshot.val().player1Name
        playersName[1] = snapshot.val().player2Name
        playersName[2] = snapshot.val().player3Name
        playersName[3] = snapshot.val().player4Name
    })
}

// function playersNamesListerner() {
//     onValue(player1NameRef, (snapshot) => {
//         const name = snapshot.val()
//         playersName[0] = name
//     }) 
//     onValue(player2NameRef, (snapshot) => {
//         const name = snapshot.val()
//         playersName[1] = name
//     }) 
//     onValue(player3NameRef, (snapshot) => {
//         const name = snapshot.val()
//         playersName[2] = name
//     }) 
//     onValue(player4NameRef, (snapshot) => {
//         const name = snapshot.val()
//         playersName[3] = name
//     }) 
// }

function shuffledCardsListener() {
    onValue(shuffledCardsRef, (snapshot) => {
        //shuffleCards
        const shuffledCards = snapshot.val()
        if(shuffledCards !== ""){
            setter('cardsShuffled', true)
            reOrderCards(shuffledCards)
            // fireShuffleCards([])
        }
    })
}

function secondaryDeckClickedListener(){
    onValue(secondaryDeckClickedRef, (snapshot) => {
        //secondaryDeckClickedRef
        if(snapshot.val() != false){
            secondaryDeckClick()
            // fireSecondaryDeckClick(false)
        }
    })
}

function saidSrewListener(){
    onValue(saidSrewRef, (snapshot) => {
        //saidSrewRef
        if(snapshot.val() == true){
            saySkrew()
            // fireSaySkrew(false)
        }
    })
}

export async function isRoomValid(code) {
    const roomCodeRef = ref(db, `Rooms/${code}/`)
    let valid = false
    await get(roomCodeRef).then((snapshot) => {
        const exists = snapshot.exists()
        console.log('snapshot.exists()=', exists)
        if(snapshot.exists()){
            const playersCnt = snapshot.val().players.playersCnt
            console.log('playersCnt=', playersCnt)
            if(playersCnt < 4){
                currentPlayer = playersCnt + 1
                valid = true
            }
        }
    })
    return valid
}

function setRefrences(code) {
    roomCode = code
    roomRef = ref(db, `Rooms/${code}/`)

    gameInfoRef = ref(db, `Rooms/${code}/gameInfo/`)
    clickedCardIndexRef = ref(db, `Rooms/${code}/gameInfo/clickedCardIndex`)
    shuffledCardsRef = ref(db, `Rooms/${code}/gameInfo/shuffledCards`)
    secondaryDeckClickedRef = ref(db, `Rooms/${code}/gameInfo/secondaryDeckClicked`)
    saidSrewRef = ref(db, `Rooms/${code}/gameInfo/saidSrew`)

    playersRef = ref(db, `Rooms/${code}/players/`)
    playersCntRef = ref(db, `Rooms/${code}/players/playersCnt`)
    player1NameRef = ref(db, `Rooms/${code}/players/player1Name`)
    player2NameRef = ref(db, `Rooms/${code}/players/player2Name`)
    player3NameRef = ref(db, `Rooms/${code}/players/player3Name`)
    player4NameRef = ref(db, `Rooms/${code}/players/player4Name`)
}
