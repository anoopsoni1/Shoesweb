import React, { useEffect } from 'react'
import {useState} from "react"
const Nfkjaef = () => {
const [shubham , setshubham] = useState(0)
  const handle = ()=>{
  const shu = shubham + 1 ;
  setshubham(shu)
  }
 localStorage.setItem("shubham" , shubham) ;
 const shu = localStorage.getItem(shubham) ;
useEffect(()=>{
 localStorage.setItem("shubham" , shu) ;
} , [])

  return (
    <div onClick={handle} className='h-96 w-96 bg-amber-600'>add click {shubham}</div>
  )
}

export default Nfkjaef