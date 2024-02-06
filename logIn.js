import { isRoomValid, initPlayer } from "./firebase.js"

const createRoomButton = document.getElementById('create-room-btn')

let playerName

document.addEventListener('DOMContentLoaded', logIn)

function logIn() {
    addEventHandlers()
}

function addEventHandlers() {
    document.getElementById('join-room-btn').addEventListener('click', joinRoom)
}

async function canJoinRoom(name, code) {
    console.log('name is', name)
    if(name == ""){
        alert('name can not be empty')
        return false
    }
    
    console.log('code is', code)
    const exist  = await isRoomValid(code)
    if(!exist){
        alert('Room does\'t exist')
        return false
    }

    return true
}

async function joinRoom() {
    const playerName = getPlayerName()
    const code = getRoomCode()

    const canJoin = await canJoinRoom(playerName, code)
    if(!canJoin){
        return
    }
    console.log('can join room')
    initPlayer(playerName, code)
    goToWaitingRoom(code)
}

function getPlayerName(){
    return document.getElementById('player-name-txt').value
}

function getRoomCode(){
    return document.getElementById('room-code-txt').value
}

function goToWaitingRoom(code){
    document.getElementById('log-in-page').style.top = '-100%'
    document.getElementById('room-code').innerHTML += code
}