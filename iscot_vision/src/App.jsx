import { useState } from 'react'
import './App.css'
import Home from './routes/home'
import MatrixDisplay from './routes/matrix-display'
import Pageskid from './routes/pageSkid'
import Robots from './routes/PageRobot'
import Pagelistskids from './routes/page-list-skids'
import Pagematrix from './routes/page_matrix'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/matrix-display/:cabina/:robot' element={<MatrixDisplay/>}/>
          <Route path='/pages-skid/:cabina/:robot/:skid' element={<Pageskid/>}/>
          <Route path='/Robot/:cabina' element={<Robots/>}/>
          <Route path='/skids/:cabina/:robot' element={<Pagelistskids/>}/>
          <Route path='/pagematrix/:cabina/:robot/:matrice' element={<Pagematrix/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
