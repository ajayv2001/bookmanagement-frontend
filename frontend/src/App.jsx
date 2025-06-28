
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import AddBooks from './pages/AddBooks/AddBooks'
import BookPage from './pages/BookPage/BookPage'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <div className='container mt-4'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/add' element={<AddBooks/>} />
          <Route path='/books/:id' element={<BookPage/>} />
        </Routes>

      </div>
    </BrowserRouter>

    
  )
}

export default App
