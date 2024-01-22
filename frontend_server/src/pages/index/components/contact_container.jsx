import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contact_conainer(props) {
    const navigate = useNavigate()
    const [my_details,set_my_details]=useState({_id: '65351ab56afcddc2b52d88f0', email: 'audire.bocha@gmail.com', display_name: 'audire bocha', phone: null, profile_photo_url: "",updatedAt: "2000-00-00T00:00:00.000Z"})
    

    useEffect((() => {
        var date_n_time = props.user.updatedAt
        //last_seen_date_time(props.data.updatedAt)
        set_my_details(props.user)
    }), [])


    return (
        <div className="contact_container">
            <img src={props.user.profile_photo_url} alt=""></img>

            <div className="chat_details" onClick={(e) => { props.chat_with_individual(props.user) }}>
                <span>{my_details.display_name}</span>
                <span></span>
            </div>
            <div>
                <span className="time_status" >{(()=>{
                    if(props.user.status==="connected" || props.user.status==="online"){
                        return ("online") 
                    }else{
                        return last_seen_date_time(props.user.updatedAt)
                    }
                })()}</span>
            </div>
        </div>
    )

    //If its less than a hour, display in minutes
    //If its less than 24hours , 
    //Easiy way:
    //If its today last seen time
    //If its more than 24hours use the date
    function last_seen_date_time(data) {
        var year = parseInt(data.split('T')[0].split('-')[0])
        var month = parseInt(data.split('T')[0].split('-')[1])
        var day = parseInt(data.split('T')[0].split('-')[2])
        var hour = parseInt(data.split('T')[1].split(':')[0])
        var min = parseInt(data.split('T')[1].split(':')[1])

        var last_update = new Date(year, month - 1, day, hour, min, 0, 0)
        var now = new Date()

        if ((Math.abs(now - last_update)) > 8.64e+7) {
            return data.split('T')[0]
        } else {
            return hour + ":" + min
        }
    }
}