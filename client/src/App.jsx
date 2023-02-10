import "./App.css"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import List from './pages/List'
import NavBar from "./pages/Navbar"

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/list' element={<List/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
