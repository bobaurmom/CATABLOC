import React from "react";
interface prop{
    label:string,
    placeHolder:string,
    name:string,
    type:string
}
const Input: React.FC<prop> = ({label,type,name, placeHolder}) => {
    return(
        <div>
        <label htmlFor={name}>{label}</label><br />
        <input type={type} placeholder={placeHolder} style={{width:"550px",border:"1px solid blue",borderRadius:"20px",padding:"10px 0",textIndent:"10px"}}/><br />
        </div>
    )
}
export default Input;

