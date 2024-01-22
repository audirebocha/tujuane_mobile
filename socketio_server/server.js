import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";
import global from "./global.js";

//Database files
import User from './Models/users.js'

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.get("/", (req, res) => {
  res.json({ message: "Hi am a socketio server, how can I help you" })
})

io.on("connection", (socket) => {
  console.log('Client ' + socket.id + ' connected')


  socket.on('disconnect', async (reason) => {
    console.log("Client " + socket.id + " Disconnected")
    //Updating database that user has disconnected
    var resp = await ai_send_api("/socket_support/disconnect", { "sid": socket.id })
    if (resp['status'] === "success") {
      socket.broadcast.emit('broadcast_connectivity_status', { status: 'success', message: 'A user has disconnected , check and update your database', 'data': resp['data'] })
    } else {
      console.log("Error,disconnection update failed")
    }
  })

  socket.on('auth_data', async (data) => {
    console.log('Client ' + data['email'] + " has connected, updating ad broadcasting status")

    var resp = await ai_send_api("/socket_support/auth_data", { "email": data['email'] })
    //Updating database that user has connected
    if (resp['status'] === "success") {
      socket.broadcast.emit('broadcast_connectivity_status', { status: 'success', message: 'A user has connected , check and update your database', 'data': resp['data'] })
    }

  })

  socket.on('get_users_count', (data) => {
    socket.emit('receive_user_count', io.engine.clientsCount)
  })



  socket.on('relay_2_individual', (message) => {
    console.log('Relaying message')
    //Sending confirmation back to the user that the server has been received
    io.to(socket.id).emit('sent_confirmation', message['local_message_id'], (err) => {
      if (!err) {
        console.log('Error,not sent')
        //Store in the buffer
      } else {
        console.log('Confirmation Successfully sent to the sender')
      }
    })

    //Sending the message to the recipient
    io.to(message.recipient_sid).emit('received_message', message, async (err) => {
      if (!err) {
        console.log('Error something happened, in sending to the recipient')
        //Check for the correct recipient sid in the database using the recipient id
        if (io.sockets.sockets[message.recipient_sid] != undefined) {
          console.log(io.sockets.sockets[message.recipient_sid]);
        } else {
          console.log("User Socket not connected");
          //User sid not connected, finding the status and sid of the user

          var result = await ai_send_api("received_message1",{ _id: message.recipient_id })
          if (result['status']==='success') {
            //If the status is connected,Attempt to send to the recipient
            console.log("Looking up SID and resending message...");
            if (result.data['status'] === 'connected' || result.data['status'] === 'online') {
              //Sending to recipient
              io.to(result.data['sid']).emit('received_message', message, async (err) => {
                if (!err) {
                  console.log("Recipient is assumed to be disconnected, storing message in the buffer");
                  //The connection has a propblem , Update the database and broadcast to everyone that user is disconnected
                  //Updating the users status as disconnected and broadcasting it
                  let user_doc = await ai_send_api("received_message2",{ 'recipient_id': message.recipient_id })
                  if (user_doc['status']==="success") {
                    socket.broadcast.emit('broadcast_connectivity_status', { status: 'success', message: 'A user has been deemed disconnected , check and update your database', 'data': result['data'] })
                  } else {
                    console.log('Error in updating user connected status')
                  }
                  //Store the message on the buffer for when the user is reconnected


                }
              })
            } else {
              //User is disconnected , store in the buffer to send when user is connnected
              console.log("User is definetly disconnected");
            }


          }
        }
      } else {
        console.log('Successfully sent to the recipient')
      }
    })
  })
});







io.on('greeting', (socket) => {
  console.log('Server said hi')
})



async function ai_send_api(api_url, data) {
  try {
    const headers = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    api_url = global.Backend_server + api_url;

    const response = await axios.post(api_url, data, headers);
    const result_data = response.data;

    return result_data; // Return the response data
  } catch (error) {
    console.error('API request failed:', error);
    throw error; // Rethrow the error to allow handling by caller
  }
}



httpServer.listen(5001,()=>{console.log("Server started on port 5001")});