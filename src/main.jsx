import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import LoginPage from './Components/Login.jsx'
import SignupPage from './Components/Signup.jsx'
import List from './Components/List.jsx'
import CheckoutPage from './Components/Checkout.jsx'
import Cart from './Components/Cart.jsx'
import { Provider } from 'react-redux'
import { store } from './Store/Store.js'
import { ToastContainer } from 'react-toastify'
import One from './ProductsList/One.jsx'
import Two from './ProductsList/Two.jsx'
import Twelve from './ProductsList/Twelve.jsx'
import Thirteen from './ProductsList/Thirteen.jsx'
import Seven from './ProductsList/Seven.jsx'
import Seventeen from './ProductsList/Seventeen.jsx'
import Eight from './ProductsList/Eight.jsx'
import Eighteen from './ProductsList/Eighteen.jsx'
import Nine from './ProductsList/Nine.jsx'
import Nineteen from './ProductsList/Nineteen.jsx'
import Twenty from './ProductsList/Twenty.jsx'
import Ten from './ProductsList/Ten.jsx'
import Three from './ProductsList/Three.jsx'
import Four from './ProductsList/Four.jsx'
import Five from './ProductsList/Five.jsx'
import Six from './ProductsList/Six.jsx'
import Sixteen from './ProductsList/Sixteen.jsx'
import Fifteen from './ProductsList/Fifteen.jsx'
import Fourteen from './ProductsList/Fouteen.jsx'
import Eleven from './ProductsList/Eleven.jsx'
import Twentyone from './ProductsList/Twentyone.jsx'
import { useEffect } from 'react'
import Dashboard from './Components/Dashboard.jsx'


const route = createBrowserRouter([
  {
    path: "/" ,
    children : [
      {
        path : "/",
        element : <App />
      },
      {
        path: "/login", 
        element : <LoginPage />
      } ,
      {  path : "/SignIn" ,
        element: <SignupPage />
      },
      {
        path: "/one" ,
        element : <One />
      },
      {
        path: "/twentyone" ,
        element : <Twentyone />
      },
       {
        path: "/two" ,
        element : <Two />
      },
      {
        path: "/eleven" ,
        element : <Eleven />
      },
      {
        path: "/fourteen" ,
        element : <Fourteen/>
      },
      {
        path: "/fifteen" ,
        element : <Fifteen />
      },
      {
        path: "/sixteen" ,
        element : <Sixteen />
      },
      {
        path: "/six" ,
        element : <Six />
      },
      {
        path: "/five" ,
        element : <Five />
      },
      {
        path: "/four" ,
        element : <Four/>
      },
      {
        path: "/three" ,
        element : <Three />
      },
      {
        path: "/ten" ,
        element : <Ten />
      },
      {
        path: "/twenty" ,
        element : <Twenty />
      },
      {
        path: "/nineteen" ,
        element : <Nineteen />
      },
      {
        path: "/nine" ,
        element : <Nine />
      },
      {
        path: "/eighteen" ,
        element : <Eighteen />
      },
      {
        path: "/eight" ,
        element : <Eight />
      },
      {
        path: "/seventeen" ,
        element : <Seventeen />
      },
      {
        path: "/seven" ,
        element : <Seven />
      },
      {
        path: "/thirteen" ,
        element : <Thirteen />
      },
      {
        path: "/twelve" ,
        element : <Twelve />
      },
      {
        path : "/list" ,
        element : <List />
      },
      {
        path: "/checkout",
        element : <CheckoutPage />
      },
      {
        path: "/cart" ,
        element : <Cart />
      },
      {
        path: "/dashboard" ,
        element : <Dashboard />
      }
    ]
  }
])


createRoot(document.getElementById('root')).render(
      <Provider store={store}>
      <ToastContainer autoClose={1000} pauseOnHover={false}  /> 
    <RouterProvider router = {route} />
     </Provider>

)
