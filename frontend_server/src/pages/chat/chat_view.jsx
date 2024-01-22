import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

//Components
import Message from "./components/message";

export default function Chat_view(props) {
    const [current_recipient, set_current_recipient] = useState({display_name: "Loading...",email:null,profile_photo_url:"https://lh3.googleusercontent.com/a/AAcHTteSC-C7cjFHMXbMCJvQt8-njAoUxbs8hqo5RNV0K0gu=s96-c",sid: null,status:"Loading...",_id: null})
    const [messeges, set_messeges] = useState([])
    const [my_messege, set_my_messege] = useState('')



    useEffect((() => {
        set_current_recipient(props.current_recipient)
        console.log('I am currently chatting with:',props.current_recipient)
    }), [])

    useEffect((() => {
        //Messages update detected
        console.log('Messages change detected')
        messages_update_needed()
        props.switch_message_change_detected(false)
    }), [props.message_change_detected])

    useEffect((() => { set_current_recipient(props.current_recipient) }), [props.current_recipient])
    useEffect((() => { check_recipient_status()}), [props.friends_data_status_detected])
    useEffect((() => { messages_update_needed() }), [current_recipient])


    async function messages_update_needed() {
        if (current_recipient != null) {
            console.log('Updating messages...')
            var message_items = await props.db.messages.where('recipient_id').equals(current_recipient['_id']).or('recipient_id').equals(props.my_details['_id']).toArray();
            console.log('Found messages')
            set_messeges(message_items)
            console.log('Updating messages done.')
        } else {
            console.log('Action not permited, error, a recipient must be selected first', current_recipient)
        }
    }

    


    function send_messege() {
        console.log('Sending message')
        var date = new Date()
        props.send_message({ sender_id: props.my_details['_id'], recipient_id: current_recipient['_id'], recipient_sid: current_recipient['sid'], body: my_messege, media_url: null, message_type: 'message', reaction_id: null, status: 'sending', 'date': date.toISOString() })
        set_my_messege('')
    }

    async function check_recipient_status() {
            if (current_recipient != null) {
                if (props.friends_data_status_detected==="Yes") {
                    console.log('Users table update in progress')
                } else {
                    console.log('Updating users status after change...',props.friends_data_status_detected)
                    var user = await props.db.users.where('_id').equals(current_recipient['_id']).toArray();
                    console.log('Found User:',user)
                    set_current_recipient(user[0])
                    console.log('Updating user done.')
                }
            } else {
                console.log('Action not permited, error, a recipient must be selected first', current_recipient)
            }
    }

    function handle_onKeyPressed(key) {
        if (key === "Enter") {
            send_messege()
        }
    }


    return (
        <div className="body">
            <div className="mv_main">

                <div className="party_2_container">
                    <div className="contact_container">
                        <img src="./assets/back_icon.svg" alt="" onClick={(e) => { props.navy('index') }} />

                        <img src={current_recipient.profile_photo_url} alt=""></img>
                        <div className="chat_details">
                            <span>{current_recipient.display_name}</span>
                            <span>{current_recipient.status}</span>
                        </div>
                        <div>
                            <img style={{ width: '35px' }} src="./assets/main_logo.svg" alt=""></img>
                        </div>
                    </div>
                </div>

                <div className="game_controls">
                    <div>
                        <span>Hello world</span>
                    </div>
                    <button>Next</button>
                </div>

                <div className="sent_received_messages_container" id='messageContainer'>

                    {(() => {
                        return messeges.map((messege) => {
                            return (<Message key={messege.id} my_details={props.my_details} messege={messege} />)
                        })
                    })()}



                </div>

                <div className="message_bar">
                    <div className="message_bar_container">
                        <div className="message_container">
                            <input type="text" name="" id="" placeholder="Message" value={my_messege} onChange={(e) => { set_my_messege(e.target.value); }} onKeyPress={(e) => { handle_onKeyPressed(e.key) }} />
                            <img src="./assets/plus_icon.svg" alt="" />
                        </div>
                        <img src="./assets/mic_icon.svg" alt="" onClick={(e) => { send_messege() }} />
                    </div>
                </div>

            </div>
        </div>
    )
}