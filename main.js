const express = require('express');
const eapp = express();
const http = require('http');
const fs = require('fs');
const server = http.createServer(eapp);
const { Server } = require("socket.io");
const io = new Server(server,{maxHttpBufferSize:1e8,cors:{origin:true} });
var robot = require("robotjs");
const { app, BrowserWindow } = require('electron')
const path = require('path')
const screenshot = require('screenshot-desktop')

let room_id="test";
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

eapp.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected'+socket.id);
   

  
  socket.on('disconnect', (reason) => {
    console.log(`Disconnected: ${    reason}`);
     
 });
    
 socket.on("join-room", (room_id, callback) => {
  
  socket.join(room_id)
  
   callback("joined:"+room_id)
  
  });

 socket.on("control:mouse", (data, callback) => {
  

console.log("from client:"+data.x+" "+data.y)


  var x=data.x;
  var y=data.y;

  //robot.moveMouse(x,y)
  

 // callback("moved mouse")

});
socket.on("control:click", (data, callback) => {
  

  console.log("click from client:"+data.x+" "+data.y)
  
  
    var x=data.x;
    var y=data.y;

    socket.broadcast.to(room_id).emit("control:click",data)
  
     
      robot.moveMouse(x,y)
      robot.mouseClick("left")
    
    
    
  
    callback("server:got clicked done")
  
  });

  socket.on("control:key", (key, callback) => {
  

    robot.keyToggle(key)
    callback("key recvd on server")

  });

  



    setInterval(function(){
      screenshot().then((img) => {
        socket.broadcast.to(room_id).emit("screen",img.toString("base64"), (response) => {
             // console.log(response); // "got it"
            });
        }).catch((err) => {
          // ...
        })
  },1000)


});

server.listen(3000, () => {
  console.log('listening on *:3000');
});


 