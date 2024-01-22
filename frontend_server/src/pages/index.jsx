import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import io from 'socket.io-client'
import { Dexie } from 'dexie'

//Firebase 
import { provider, auth } from "../global/config.js";
import { signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";

//Pages
import Login_view from "./login/Login";
import Index_view from "./index/index_view";
import Chat_view from "./chat/chat_view.jsx";

//css
import './css/style.css'
import './css/login.css'
import './css/chat.css'

//Global variables
import global from "../global/global.js";



//Creating the database
const db = new Dexie('Tujuane')
db.version(1).stores({
  messages: '++id,message_id,sender_id,recipient_id,body,media_url,message_type,reaction_id,status',
  users: "email,_id,display_name,phone,profile_photo_url,sid,status,createdAt,updatedAt,__v"
})



const socket = io(global.Socketio_server)

export default function Index() {
  const [page, set_page] = useState('login')
  const [my_details, set_my_details] = useState({ 'display_name': null, 'email': null, 'sid': null })
  const [friends_data, set_friends_data] = useState([])
  const [friends_data_status_detected, set_friends_data_status_detected] = useState("No")
  const [current_recipient, set_current_recipient] = useState(null)
  const [my_sid, set_sid] = useState(null)
  const [messages, set_messages] = useState([])
  const [message_change_detected, set_message_change_detected] = useState(false)


  useEffect((() => {
    get_user_details()
    get_friends_data()
    console.log('The Main Index Page is now loaded', global.Socketio_server)
  }), [])




  useEffect((() => {
    send_connection_status()
  }), [my_sid])
  useEffect(() => {
    send_connection_status()
  }, [my_details])
  useEffect((()=>{
    if(friends_data_status_detected==="Yes"){
      set_friends_data_status_detected("Updating...")
      get_friends_data()
      
    }
  }),[friends_data_status_detected])




  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected id:', socket.id)
      set_sid(socket.id)
      socket.emit('greeting', "HI")

    })

    socket.on('likeupdate', (count) => {
      console.log(count)
    })

    socket.on('disconnect', () => {
      console.log('I have disconnected from socketio, sending status data')
    })

    function check_connection() {
      console.log(socket.connected)
      return socket.connected;
    }

    socket.on("connect_error", () => {
      console.log('Connection to the server has some issues')
      socket.connect();
    });

    function reconnect() {
      socket.connect()
      console.log('Socket reconnected')
    }

    function get_session_count() {
      socket.emit('get_users_count', 101)
    }

    socket.on('receive_user_count', (data) => {
      console.log(data)
    })

    socket.on('sent_confirmation', (data) => {
      console.log(data)
      handle_received_confirmation(data)
    })

    socket.on('message_from_server', (message) => {
      console.log(message)
    })

    socket.on('message_from_group', (message) => {
      console.log(message)
    })

    socket.on('broadcast_connectivity_status', (message) => {
      console.log(message)
      handle_broadcast_status(message)
    })

    socket.on('received_message', (message) => {
      //Add message to the data base
      handle_received_messages(message)
    })

  }, [socket])


  //Detect on backpress
  window.history.pushState(null, null, document.URL);
  window.addEventListener('popstate', function (event) {
    set_page('index');
  });














  //Functions That handle initialization data**************************************************************************************************
  function get_user_details() {
    //The auth data is saved in local storage, if its not there then authenticate again
    if (localStorage.getItem('my_details')) {
      var item = localStorage.getItem('my_details')
      var stored_data = JSON.parse(item)
      console.log('stored data', stored_data)
      send_auth_data(stored_data)
      set_my_details({ ...my_details, 'display_name': stored_data['display_name'], 'email': stored_data['email'] })
      set_page('index')

    } else {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        // The user is authenticated.
        console.log(user)

        set_page('index')
      } else {
        // The user is not authenticated.
        //console.log(user)
        set_page('login')
      }
    }

  }

  async function auth_result_data(data) {
    console.log(data)
    set_my_details({ ...my_details, 'display_name': data['display_name'], 'email': data['email'] })
    localStorage.setItem('my_details', JSON.stringify({ 'display_name': data['display_name'], 'email': data['email'], 'sid': null, 'photoURL': data['photoURL'] }))
    send_auth_data(data)
    set_page('index')
  }


  function chat_with_individual(user_data) {
    console.log('I am chatting with:', user_data)
    set_current_recipient(user_data)
    set_page('chat')
  }



  function send_connection_status() {
    if (my_details.email != null && my_sid != null) {
      console.log('I am connected,Sending connectivity status')
      //Backend_server
      ai_send_api('/index/socketio_connection_confirmation', { 'email': my_details.email, 'sid': my_sid })
      //Socketio_server
      socket.emit('auth_data', { 'email': my_details.email, 'sid': my_sid })

    } else {
      console.log('Not all the data was found, I will send it when loaded', { my_details, my_sid })
    }
  }

  function send_disconnection_status() {
    if (my_details.email != null && my_sid != null) {
      console.log('I am disconnected,Sending connectivity status')
      ai_send_api('/index/socketio_connection_confirmation', { 'email': my_details.email })

    } else {
      console.log('Not all the data was found', { my_details, my_sid })
    }
  }

  async function send_auth_data(data) {
    console.log('sending auth data', data)
    var responce = await ai_send_api('/auth/sign_in', data)
    //Handle if the responce is not successfull
    await set_my_details(responce.data)
    localStorage.setItem('my_details', JSON.stringify(responce.data))
    //Sending auth data to socketio server to broadcast the data

  }

  async function get_friends_data() {
    var response_data = await ai_send_api('/index/get_users', my_details)
    console.log("Getting users data",response_data)
    set_friends_data(response_data.data)
    bulk_users_add(response_data.data)
    console.log(response_data, friends_data)

    set_friends_data_status_detected("No")
  }













  //************SWITCHES************************************************************************************** */
  function navy(page) {
    set_page(page)
  }

  function switch_message_change_detected(bool) {
    set_message_change_detected(bool)
  }















  //***************************Handle other peoples change in status************************************************************************************ */
  function handle_broadcast_status(data) {
    console.log('This will be handled in a minute', data)
    update_user_sid(data.data['_id'], data.data['sid'])
    set_friends_data_status_detected("Yes")

  }








  //********************************************PAGES************************************************** */
  return (
    <>
      {(() => {
        if (page === 'login') {
          return (<Login_view auth_result_data={auth_result_data} />)
        } else if (page === 'index') {
          return (<Index_view my_details={my_details} send_api={send_api} friends_data={friends_data} chat_with_individual={chat_with_individual} friends_data_status_detected={friends_data_status_detected}/>)
        } else if (page === 'chat') {
          return (<Chat_view my_details={my_details} message_change_detected={message_change_detected} db={db} send_message={send_message} current_recipient={current_recipient} chat_with_individual={chat_with_individual} messages={messages} navy={navy} switch_message_change_detected={switch_message_change_detected} friends_data_status_detected={friends_data_status_detected} />)
        }
      })()}
    </>
  )





  //Universal Functions
  function send_api(api_url, data) {
    var headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    api_url = global.Backend_server + api_url
    var result_data = null
    var result_data = axios.post(api_url, data, headers)
      .then(res => {
        console.log(res.data)
        result_data = res.data
        return res.data
        if (result_data['status'] === 'success') {
          console.log('Success')
        }
      })
      .catch(e => { console.error(e) })
    console.log(result_data)
    return result_data
  }

  async function ai_send_api(api_url, data) {
    try {
      const headers = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };
      api_url = global.Backend_server + api_url;

      const response = await axios.post(api_url, data, headers);
      const result_data = response.data;

      console.log(result_data);

      if (result_data['status'] === 'success') {
        console.log('Success');
      }

      return result_data; // Return the response data
    } catch (error) {
      console.error('API request failed:', error);
      throw error; // Rethrow the error to allow handling by caller
    }
  }


  function get_api(api_url, data) {
    var headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    api_url = global.Backend_server + api_url
    var result_data = null
    var result_data = axios.post(api_url, data, headers)
      .then(res => {
        console.log(res.data)
        result_data = res.data
        if (result_data['status'] === 'success') {
          props.nav('/index')
          console.log('Going to the index page')
        }
      })
      .catch(e => { console.error(e) })
    console.log(result_data)
    return result_data
  }





  //**************Functions using socketIO Handling Sending and receiving messages*************************************************************************************** */
  async function send_message(message) {
    var message_local_id = await add_message(message)
    message['local_message_id'] = message_local_id
    //Check if connected
    if (socket.connected) {
      socket.emit('relay_2_individual', message, (err) => {
        if (!err) {
          console.log('1 Message sent to socketio server or not, I dono')
        } else {
          console.log('2 Message sent to socketio server or not, I dono')
        }
      })
    } else {
      console.log('I cant send a message, Im disconnected')
      update_status_message(message_local_id, 'not sent')
      set_message_change_detected(true)
    }
    set_message_change_detected(true)
  }


  async function handle_received_confirmation(id) {
    //Update the database
    await update_status_message(id, "sent")
    console.log('Updating sent message:', id)
    set_message_change_detected(true)
  }

  async function handle_received_messages(message) {
    console.log('Handling received message')
    await add_message(message)
    await set_message_change_detected(true)
  }











  //**Database functions************************************************************************************** */
  //Database Syncronyzation
  async function messages_update_needed() {
    console.log("The main message updater has failed me")
  }

  //Functions to handle messages in the database
  async function add_message(message) {
    console.log(message)
    var messages_count = await db.messages.count();
    db.messages.add({ id: messages_count + 1, 'message_id': "To be decided", sender_id: message.sender_id, recipient_id: message.recipient_id, body: message.body, media_url: message.media_url, message_type: message.message_type, reaction_id: message.reaction_id, status: message.status, date: message.date })
    return messages_count + 1
  }

  async function update_status_message(id, new_status) {
    await db.messages.update(id, { 'status': new_status });
  }

  async function delete_message(id) {
    await db.messages.delete(id)

  }

  async function clear_messages_table() {
    db.messages.clear()

  }

  async function bulk_messages_add(data) {
    db.messages.bulkAdd(data).then(() => {
      console.log('Items added successfully!');
    }).catch(error => {
      console.error('Error adding items:', error);
    });
  }

  async function bulk_users_add(data) {
    console.log('Getting users data', data)
    db.users.clear()
    db.users.bulkAdd(data).then(() => {
      console.log('Items added successfully!');
    }).catch(error => {
      console.error('Error adding items:', error);
    });
  }

  async function update_user_sid(id, new_sid) {
    await db.users.update(id, { 'sid': new_sid });
  }

}