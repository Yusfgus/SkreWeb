import { isRoomValid } from "./firebase.js"


const playerNameTextBox = document.getElementById('player-name-txt')
const joinButton = document.getElementById('join-room-btn')
const roomCodeTextBox = document.getElementById('room-code-txt')
const createRoomButton = document.getElementById('create-room-btn')

let playerName

document.addEventListener('DOMContentLoaded', logIn)

function logIn() {
    addEventHandlers()
}

function addEventHandlers() {
    joinButton.addEventListener('click', joinRoom)
}

async function canJoinRoom() {
    const name = playerNameTextBox.value
    console.log('name is', name)
    if(name == ""){
        console.log('name can not be empty')
        return false
    }
    
    const code = roomCodeTextBox.value
    console.log('code is', code)
    const exist  = await isRoomValid(code)
    console.log('exists=', exist)
    if(!exist){
        console.log('here')
        return false
    }

    return true
}

async function joinRoom() {
    const canJoin = await canJoinRoom()
    if(!canJoin){
        console.log('cant join room')
    }
    else {
        console.log('can join room')
    }
}
