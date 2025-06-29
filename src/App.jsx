import Footer from './Components/Footer'
import Header from './Components/Header'
import Heading from './Components/Heading'
import Home from './Components/Home'
import Lower from './Components/Lower'
import Model from './Components/model'
import Page from './Components/Page'
import Paragraph from './Components/Paragraph'

function App() {
  return (
   <>
      <div className='overflow-hidden'>
     <Heading />
      <Home />
      <Page />
      <Paragraph />
      <Header />
      <Lower />
      <Footer />
     </div>
   </>
  )
}

export default App