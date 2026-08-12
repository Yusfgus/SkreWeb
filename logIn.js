import { isRoomValid, initPlayer, initRoom } from "./firebase.js"

let playerName

document.addEventListener('DOMContentLoaded', logIn)

function logIn() {
    loadUsername()
    addEventHandlers()
}

let clicked = false
function addEventHandlers() {
    document.getElementById('join-room-btn').addEventListener('click', joinRoom)
    document.getElementById('create-room-btn').addEventListener('click', createRoom)
}

async function createRoom() {
    if (clicked) return
    // clicked = true

    const playerName = getPlayerName()
    ////console.log('name is', playerName)
    if (playerName == "") {
        alert('name can not be empty')
        return false
    }
    clicked = true
    saveUsername(playerName)
    const code = await initRoom(playerName)
    initPlayer(playerName, code)
    goToWaitingRoom(code)
}

async function canJoinRoom(name, code) {
    ////console.log('name is', name)
    if (name == "") {
        alert('name can not be empty')
        return false
    }

    ////console.log('code is', code)
    const exist = await isRoomValid(code)
    if (!exist) {
        alert('Room is full or does\'t exist')
        return false
    }

    return true
}

async function joinRoom() {
    if (clicked) return
    // clicked = true

    const playerName = getPlayerName()
    const code = getRoomCode()

    const canJoin = await canJoinRoom(playerName, code)
    if (!canJoin) {
        return
    }
    clicked = true
    saveUsername(playerName)
    initPlayer(playerName, code)
    goToWaitingRoom(code)
}

function getPlayerName() {
    return document.getElementById('player-name-txt').value
}

function getRoomCode() {
    return document.getElementById('room-code-txt').value
}

function goToWaitingRoom(code) {
    document.getElementById('main-area').style.visibility = 'visible'
    document.getElementById('room-code').innerHTML += code
    document.getElementById('log-in-page').style.top = '-100%'
}

function saveUsername(username) {
    localStorage.setItem('username', username);
}

function loadUsername() {
    const username = localStorage.getItem('username')
    if (username !== null)
        document.getElementById('player-name-txt').value = username
}