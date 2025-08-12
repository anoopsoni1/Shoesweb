import { useState } from 'react'
import axios from 'axios';


function Chatbot() {
const [question , setquestion] = useState("")
const [answer ,setanswer] = useState("")


async function generateanswer (){
  setanswer("Loading...")
 const response = await axios({
  url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" ,
  method:"post" ,
  data: { 
    contents : [{
    parts :[{text: question}]
    },
  ],
  },
});
  setanswer(response['data']['candidates'][0]['content']['parts'][0]['text']);
}

  return (
    <>
  <div className='flex justify-around '>
   <h1 className='text-7xl place-items-center grid text-white'>AI BOT</h1>
   <img src='https://impossibleimages.ai/wp-content/uploads/2023/02/Ten-misconceptions-about-AI-generated-art.jpg' className='h-20  rounded-full w-20 mt-5'/>

   <h1 className='text-white mt-4 text-7xl '> Created by Anoop</h1>  </div>
   <div className='grid place-items-center gap-8 mt-32'>
     <input  value={question}  
     onChange={(e)=>{
       setquestion(e.target.value)
     }}
    className='  rounded-2xl   text-3xl h-16 w-1/2 '/>
    
    <button className='bg-slate-600 rounded-lg w-36 h-12 text-white ' onClick={generateanswer}>Generate Answer</button>
    </div>
    <div className='grid place-items-center mt-9'>
   <pre className='overflow-hidden font-medium  font-sans  w-3/4 bg-slate-200 text-center'><p>{answer}</p></pre>
   </div>
    </>
  )
}

export default Chatbot
