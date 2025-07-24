import Footer from './Components/Footer'
import Header from './Components/Header'
import Heading from './Components/Heading'
import Home from './Components/Home'
import Lower from './Components/Lower'
import { useEffect } from 'react'
import Paragraph from './Components/Paragraph'

function App() {
useEffect(() => {
  const token = localStorage.getItem("userToken");
  if (token) {
    fetch("http://localhost:5000/api/v1/user//verifyjwt", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
         
          setUser(data.user); 
        } else {
          localStorage.removeItem("userToken");
        }
      })
      .catch(err => console.error("Token validation failed:", err));
  }
}, []);

  return (
   <>
      <div className='overflow-hidden'>
      <Heading />
      <Home />
      <Paragraph />
      <Header />
      <Lower />
      <Footer />
     </div>
   </>
  )
}

export default App