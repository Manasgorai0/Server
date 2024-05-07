const Database = require("./Database");
const Room = require("./Room");
const db = new Database();
const room = new Room();
// db.add() db.update() db.delete() db.find(); db.display() db.displayByNo()
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const Port = 3000 || process.env.PORT;
// socket connection
io.on("connection", socket => {
    console.log("A user connected");
    var len = room.ObjLength();
    if (len > 0) {
        var rooms = room.display("all");
        for(var i = 0;i<rooms.length;i++){
        socket.emit("room", rooms[i]);
    }}

    // signup data
    socket.on("signup", signup => {
        generateRandomID();
        function generateRandomID() {
            var randomNumber = "";
            var characters = "0123456789";
            for (var i = 0; i < 7; i++) {
                randomNumber += characters.charAt(
                    Math.floor(Math.random() * characters.length)
                );
            }
            var chake = db.find("Id", randomNumber);
            if (chake.found) {
                generateRandomID();
            } else {
                signup.Id = randomNumber;
                signup.Gold = 0;
                signup.Diamond = 0;
                var usr_name = db.find("Username ", signup.Username);
                if (usr_name.found) {
                    socket.emit("err", "Username is already exists");
                } else {
                    if (db.addByObj(signup)) {
                        socket.emit("signup_user", signup);
                    }
                }
            }
        }
    });
    // login data
    socket.on("login", (login)=>{
      var username = db.find('Username',login.Username);
      var password = db.find('Password',login.Password);
      if(username.found){
        if(password.found){
           socket.emit('login_user',db.displayByNo(username.No));
        }else{
        socket.emit('err',"Invalid Password");
      }
      }else{
        socket.emit('err',"Invalid Username");
      }
    });
    // room data
    socket.on("data", data => {
        generateRandomId();
        function generateRandomId() {
            // Define the length of the ID
            const idLength = 6;
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let result = "";
            // Generate a random string of characters
            for (let i = 0; i < idLength; i++) {
                result += characters.charAt(
                    Math.floor(Math.random() * characters.length)
                );
            }
            var chake = room.find("Id", result);
            if (chake.found) {
                generateRandomId();
            } else {
                data.Id = result;
                data.JoinPlayer = "10";
                if (room.addByObj(data)) {
                    console.log("data insert successful");
                  
                        io.emit("room", data);
                    
                }
            }
        }
    });
    // socket message area
    socket.on("chat message", msg => {
        console.log("message: " + msg);
        io.emit("chat message", msg); // Broadcast the message to all clients
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
server.listen(Port, () => {
    console.log("listening on *:3000");
});
