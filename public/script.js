const chatForm = document.getElementById("chat-form")
const playBtn = document.getElementById("playBtn")
const socket = io()

socket.on("message", message => {
  console.log(message)
})

chatForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const msg = e.target.elements.msg.value
  socket.emit("chatMessage", msg)
})

playBtn.addEventListener("click", (e)=> {
  socket.emit("audioSrc", "./babyShark.mp3")
  // const playSong = new Audio("./babyShark.mp3")
  // playSong.play()
})

