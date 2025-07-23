import Footer from './Components/Footer'
import Header from './Components/Header'
import Heading from './Components/Heading'
import Home from './Components/Home'
import Lower from './Components/Lower'
import Page from './Components/Page'
import Paragraph from './Components/Paragraph'

function App() {
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