import React from "react";
import { provider, auth } from "../../../global/config.js";
import { signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import global from "../../../global/global";
import axios from "axios";

function Login_button(props) {

    function Sign_in() {
        signInWithPopup(auth, provider).then((data) => {
            console.log(data.user.displayName)
            var user_details = data['user']
            let display_name = data.user.displayName
            console.log(display_name)
            var user_data = {
                'display_name': display_name,
                'email': user_details['email'],
                'display_name': user_details['phoneNumber'],
                'photoURL': user_details['photoURL'],
                'phone': user_details['phoneNumber']
            }
            user_data.display_name = display_name
            //send_user_details(user_data)
            props.auth_result_data(user_data)
            
        })
    }


    function send_user_details(user_data) {
        console.log(user_data)

        send_api('/auth/sign_in', user_data)
        
    }


    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        // The user is authenticated.
        console.log(user)
        //nav('/index')
    } else {
        // The user is not authenticated.
        //console.log(user)
    }

    return (
        <div className="login_button" onClick={() => { Sign_in() }}>
            <img src="assets/google_logo.svg" alt="" />
            <span >Continue with google</span>
        </div>
    );



    function send_api(api_url,data){
        var headers={headers: {'Content-Type': 'application/json'},withCredentials: true}
        api_url=global.Backend_server+api_url
        var result_data=null
        var result_data =axios.post(api_url, data,headers)
                .then(res => { 
                    console.log(res.data)
                    result_data= res.data
                    if (result_data['status'] === 'success') {
                        props.nav('/index')
                        console.log('Going to the index page')
                    }
                 })
                .catch(e => { console.error(e) })
        console.log(result_data)
        return result_data
    }
}

export default Login_button;