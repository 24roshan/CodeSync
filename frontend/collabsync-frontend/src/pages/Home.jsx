import React,{useState} from "react";
import {useNavigate}from "react-router-dom";
import {v4 as uuidv4}from "uuid";
const Home =()=>{
    const[username,setUsername]=useState("");
    const navigate=useNavigate();

    const handleJoin =()=>{
        if(!username.trim())return;
        const roomId =uuidv4();
        sessionStorage.setItem("username",username);
        navigate(`/room/${roomId}`);
    };
    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold">welcom to CollabSync</h1>
            <input 
            className="p-2 rounded text-black"
            type="text"
            placeholder="Enter your Name"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
            />
            <button
            onClick={handleJoin}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
                Join New Room
            </button>
         
        </div>
    );

};
export default Home;