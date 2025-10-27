import React from "react";
// Justin: Showing you how to reuse button components

interface ButtonProps{
    label:string;
    color?:string; // optional prop
    padding?:string; // optional prop
    borderRadius?:string; // optional prop
    onClick: ()=>void;  
}

const Button:React.FC<ButtonProps> = ({label, color="blue", 
    padding="10px",
    borderRadius="5px", onClick}) => {
    return (
        <button
            style={{backgroundColor: color, color: "white", 
                padding: padding, border: "none", 
                borderRadius: borderRadius, cursor: "pointer"}}
            onClick={onClick}
        >
            {label}
        </button>
    );
}
export default Button;