import React from "react";
interface prop {
    text:string,
    bgColor?:string
}
const Btn: React.FC<prop> = ({text, bgColor = "blue"}) => {
    return(
        <button style={{backgroundColor:`${bgColor}`}}>
            {text}
        </button>
    )
}
export default Btn;