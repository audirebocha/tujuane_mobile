import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Contact_conainer from './components/contact_container'

import global from "../../global/global";

export default function Index_view(props) {
    
    const [search_item, set_search_item] = useState('')
    const [friends_data, set_friends_data] = useState([])

    useEffect((() => {
        console.log('Index page now loaded:', props.my_details)
    }), [])

    useEffect((() => {
        get_friends_data()
    }), [])

    useEffect((()=>{
        get_friends_data()
    }),[props.friends_data_status_detected])

    return (
        <div className="body">
            <div className="mv_main">



                <div className="search_bar">
                    <div className="search_container">
                        <input placeholder="search" type="text" onChange={(e) => { console.log(e.target.value); set_search_item(e.target.value) }} value={search_item}></input>
                        <img src="./assets/search.svg" alt=""></img>
                    </div>
                </div>

                <div className="contacted_contacts_container">

                    {(() => {
                        return friends_data.map((user, index) => {
                            if (user.email != props.my_details['email']) {
                                return (
                                    <Contact_conainer key={index} user={user} profilepic_url={user.photo_url} display_name={user.display_name} index={index} chat_with_individual={props.chat_with_individual} />
                                )
                            }
                        })
                    })()}

                </div>

                <div className="control_bar">
                    <div>
                        <img onClick={() => { navigate('/chat') }} src="./assets/groups.svg" alt="" />
                    </div>
                    <div>
                        <img src="./assets/settings.svg" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )




    //universal functions
    async function ai_send_api(api_url, data) {
        try {
            const headers = {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            };
            api_url = global.Backend_server + api_url;

            const response = await axios.post(api_url, data, headers);
            const result_data = response.data;

            if (result_data['status'] === 'success') {
                //console.log('Success');
            }

            return result_data; // Return the response data
        } catch (error) {
            console.error('API request failed:', error);
            throw error; // Rethrow the error to allow handling by caller
        }
    }



    async function get_friends_data() {
        var response_data = await ai_send_api('/index/get_users', { "one": 1 })
        console.log(response_data)
        set_friends_data(response_data.data)
        console.log(response_data, friends_data)
    }
}