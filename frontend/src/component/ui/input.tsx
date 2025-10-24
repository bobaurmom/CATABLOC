import React from "react";
type require = "required";
interface input{
    label:string,
    placeHolder:string,
    name:string,
    type:string,
    required?:require,
    // value?:string,
    // onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const Input: React.FC<input> = ({label,type,name, placeHolder,required}) => {
    return(
        <div>
        <label htmlFor={name}>{label}</label><br />
        <input
            type={type}
            placeholder={placeHolder}
            style={{width:"550px",border:"1px solid blue",borderRadius:"20px",padding:"15px 0",textIndent:"10px"}}
            required={required === "required"}
            name={name}
            // value={value}
            // onChange={onChange}
        /><br />
        </div>
    )
}
export default Input;

