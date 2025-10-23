import React from "react";

interface prop {
    text:string,
    bgColor?:string,
    btnType?:HTMLButtonElement["type"],
    fSize?:string,
    width?:string
}
const Btn: React.FC<prop> = ({text, bgColor = "blue",btnType,fSize = 1,width}) => {
    return(
        <button type={btnType} style={{backgroundColor:`${bgColor}`,fontSize:`${fSize}rem`,width:`${width}%`}} id="btn">
            {text}
        </button>
    )
}
export default Btn;