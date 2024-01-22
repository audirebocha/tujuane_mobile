import React from "react";
import { useNavigate } from "react-router-dom";
import Login_button from "./components/login_button";

export default function Login_view(props) {
    const navigate = useNavigate()
    
    function nav(url) {
        navigate(url);
    }

    return (
        <div className="body">
            <div className="mv_main_login">
                <div className="logo_display">
                    <img src="assets/main_logo.png" alt="" />
                    <span>TD++</span>
                </div>

                <div className="login_content" >
                    <Login_button auth_result_data={props.auth_result_data} />

                    <span>Please Wait...</span>
                    <span>Error, Try again</span>
                </div>
            </div>
        </div>
    )
}