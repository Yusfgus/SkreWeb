// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, update, remove, onValue,
        // set, child, onDisconnect, onChildRemoved, onChildChanged
        } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
// import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
  
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
// const auth = getAuth(app)

let newRoomCodeRef = ref(db, 'Rooms/newRoomCode')
let roomRef

let gameInfoRef
let clickedCardIndexRef
let shuffledCardsRef
let secondaryDeckClickedRef
let saidSrewRef

let playersRef
let playersCntRef
let maxPlayersNumRef
let playersNameRef

let currentPlayer
let playerName
let roomCode
let startTime

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
        initPlayerNameContainer,
        replacePlayersContainers,
        } from './main.js'

// document.addEventListener('DOMContentLoaded', () => {
//     testListener()
// })

// function testListener() {
//     onValue(ref(db, 'test'), (snapshot) => {
//         //console.log(snapshot.val())
//     })
// }

// export function fireTest(){
//     update(ref(db), {test: true})
// }

function setStartTime(){
    const currentDate = new Date();
    // Get the current date
    // const year = currentDate.getFullYear();
    // const month = currentDate.getMonth() + 1; // Months are zero-based (0 for January, 11 for December)
    // const day = currentDate.getDate();

    // Get the current time
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    // const seconds = currentDate.getSeconds();

    hours %= 12
    const period = hours >= 12 ? 'PM' : 'AM';
    if (hours === 0) {
        hours = 12;
    }

    startTime = `${hours}:${minutes} ${period}`
}

export function addToHistory(totalScore)
{
    const result = {};
    for (let i = 0; i < maxPlayersNum; i++) {
        const player = playersName[i];
        const score = totalScore[i];
        result[player] = score;
    }

    const data = {
        date: startTime,
        scores: result,
    }

    const currentDate = new Date();
    // Get the current date
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are zero-based (0 for January, 11 for December)
    const day = currentDate.getDate();

    const dayRef = ref(db, `History/${year}/${month}/${day}/`)
    update(dayRef, { [roomCode]: data })
}

export function removeRoom(){
    // if(currentPlayer == 1){
        // setTimeout(()=>{
            // remove(roomRef)
        // }, 600)
    // }
    remove(roomRef)
}

export function playerLeaves(){
    if(roomRef !== undefined){
        firePlayersCnt(-1)
        removeRoom()
    }
}

function setMaxPlayersNum(){
    let radioButtons = document.getElementsByName('players-num');
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            console.log('Checked option:', radioButtons[i].value);
            setter('maxPlayersNum', Number(radioButtons[i].value))
            break; 
        }
    }
}

async function getMaxPlayersNum(){
    if(currentPlayer == 1){
        return
    }

    await get(maxPlayersNumRef).then((snapshot) => {
        setter('maxPlayersNum', snapshot.val())
    })
}

export async function initPlayer(name, code) {
    setRefrences(code)
    await getMaxPlayersNum()
    setter('currentPlayer', currentPlayer)
    replacePlayersContainers()
    playerName = name
    // playersName = new Array(maxPlayersNum).fill('');
    await firePlayerName()
    addEventListeners()
    firePlayersCnt()
}

// function signIn() {
//     signInAnonymously(auth).then(() => {
//         initPlayer()
//     }).catch((error) => {
//         //console.log(error.code, error.message)
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
}

export function fireSecondaryDeckClick(value = true){
    update(gameInfoRef, { secondaryDeckClicked: value })
}

export function fireSaySkrew(value = true){
    update(gameInfoRef, { saidSrew: value })
}

export function fireShuffleCards(shuffledCards)
{
    update(gameInfoRef, { shuffledCards: shuffledCards })
}

async function firePlayerName(){
    let names
    await get(playersNameRef).then((snapshot) => {
        if (snapshot.exists()) {
            names = snapshot.val()
        }
    })
    names[currentPlayer-1] = playerName
    update(playersRef, { playersName: names })
}

function firePlayersCnt(value = currentPlayer){
    update(playersRef, { playersCnt: value })
}

async function incrementNewRoomCode(){
    let newRoomCode
    await get(newRoomCodeRef).then((snapshot) => {
        if (snapshot.exists()) {
            newRoomCode = snapshot.val()
            //console.log(newRoomCode)
            update(ref(db, 'Rooms/'), { newRoomCode: newRoomCode+1 })
        }
    })
    return newRoomCode
}

export async function initRoom(name) {
    currentPlayer = 1
    setMaxPlayersNum()
    setStartTime()
    const newRoomCode = await incrementNewRoomCode()
    //console.log(newRoomCode)
    const names = new Array(maxPlayersNum).fill('');
    names[0] = name
    const newRoom = {
        players: {
            playersCnt: 1,
            maxPlayersNum: maxPlayersNum,
            playersName: names,
        },
        gameInfo: {
            clickedCardIndex: -1,
            secondaryDeckClicked: false,
            saidSrew: false,
            shuffledCards: [],
        },
    };
    //console.log(newRoom)
    update(ref(db, 'Rooms/'), { [newRoomCode]: newRoom })
    return newRoomCode
}

function addEventListeners() {
    // maxPlayersNumListener()
    setTimeout(() =>{
        playersNamesListerner()
        playersCntListener()
    }, 1000)

    cardClickedIndexListener()
    shuffledCardsListener()
    secondaryDeckClickedListener()
    saidSrewListener()
}

function cardClickedIndexListener() {
    onValue(clickedCardIndexRef, (snapshot) => {
        // cardClickIndex
        const cardIndex = snapshot.val()
        //console.log('cardClickedIndex =', cardIndex)
        if(cardIndex >= 0){
            cardClicked(cardIndex)
        }
    })  
}

function playersCntListener() {
    onValue(playersCntRef, async (snapshot) => {
        //playerCnt
        const playersCnt = snapshot.val()
        if(playersCnt == maxPlayersNum){
            //console.log('load game')
            // await getPlayesName()
            setTimeout(()=>{
                loadGame()
            },2000)
        }
        else if(playersCnt == -1){
            alert('someone lift the room')
            removeRoom()
            location.reload()
        }
    })
}

// function maxPlayersNumListener() {
//     onValue(maxPlayersNumRef, async (snapshot) => {
//         setter('maxPlayersNum', snapshot.val())
//     })
// }

// async function getPlayesName() {
//     let names
//     await get(playersRef).then((snapshot) => {
//         names = snapshot.val().playersName
//     })
//     for(let i=0; i<maxPlayersNum; ++i){
//         playersName[i] = names[i]
//     }
// }

function playersNamesListerner() {
    onValue(playersNameRef, (snapshot) => {
        if(snapshot.exists()){
            let names
            names = snapshot.val()
            for(let i=0; i<maxPlayersNum; ++i){
                playersName[i] = names[i]
            }
            initPlayerNameContainer()
        }
    }) 
}

function shuffledCardsListener() {
    onValue(shuffledCardsRef, (snapshot) => {
        //shuffleCards
        const shuffledCards = snapshot.val()
        if(shuffledCards != null){
            // console.log(shuffledCards)
            setter('cardsShuffled', true)
            reOrderCards(shuffledCards)
        }
    })
}

function secondaryDeckClickedListener(){
    onValue(secondaryDeckClickedRef, (snapshot) => {
        //secondaryDeckClickedRef
        if(snapshot.val() != false){
            secondaryDeckClick()
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

export async function isRoomValid(code) {
    const roomCodeRef = ref(db, `Rooms/${code}/`)
    let valid = false
    await get(roomCodeRef).then((snapshot) => {
        const exists = snapshot.exists()
        //console.log('snapshot.exists()=', exists)
        if(snapshot.exists()){
            const playersCnt = snapshot.val().players.playersCnt
            //console.log('playersCnt=', playersCnt)
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
    maxPlayersNumRef = ref(db, `Rooms/${code}/players/maxPlayersNum`)
    playersNameRef = ref(db, `Rooms/${code}/players/playersName`)
}
