const { io } = require("socket.io-client");
const screenshot = require('screenshot-desktop')

const socket = io("http://localhost:3000"); // the main namespace
socket.on("connect", () => { 
    console.log("connected to server")
 }); 
 socket.on('disconnect', (reason) => {
    console.log(`Disconnected: ${    reason}`);
     
 });

setInterval(function(){
    screenshot().then((img) => {
        socket.emit("screen",img.toString("base64"), (response) => {
            console.log(response); // "got it"
          });
      }).catch((err) => {
        // ...
      })
},100)

