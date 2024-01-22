import React from "react";

export default function Message(props) {
    const type = 'received'
    const date= props.messege['date']
    var hour = date.split('T')[1].split(':')[0]
    var min = date.split('T')[1].split(':')[1]
    const time= hour+":"+min
    


    return (
        <>
            {(() => {
                if (props.messege['sender_id'] === props.my_details['_id']) {
                    return (
                        <>
                            <div className="sent_message_container" onFocus={(e)=>{console.log("Message with id "+messege+" has been sent")}}>
                                <div className="sent_message_content">
                                    <div className="sent_message">
                                        <span>{props.messege['body']}</span>
                                    </div>
                                    <span>{time} {props.messege['status']}</span>
                                </div>
                            </div>
                        </>
                    )
                } else {
                    return (
                        <>
                            <div className="received_message_container">
                                <div className="received_message_content">
                                    <div className="received_message" >
                                        <span>{props.messege['body']}</span>
                                    </div>
                                    <span>{time}</span>
                                </div>
                            </div>

                        </>
                    )
                }
            })()}
        </>
    )
}