import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Home(){
    const navigate = useNavigate();
    useEffect( ()=>{
        async function getInfo() {
          try{const response = await axios.get("http://localhost:3000/api/v1/user/user-info", {
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(response.status === 200){
            navigate('/dashboard')
        }else if(response.status === 403){
            navigate('/signin')
        }}catch(e){
            console.log(e);
            navigate('/signin')
        }
        
        }
        getInfo()
        
      },[])}