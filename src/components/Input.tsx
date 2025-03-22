import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
}  
const Input: React.FC<InputProps> = ({ type = "text", placeholder }) => {
    return (
      <input
        type={type}
        className="w-full border border-gray-300 bg-black rounded-full px-4 py-2 text-right placeholder:text-xs focus:outline-none focus:ring-2 focus:primary"
        placeholder={placeholder}
      />
    );
  }; 
  export default Input;
