import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

//Importing pages
import Index from './pages';


const router = createBrowserRouter([
  {
    path:'/',
    element: <Index/>,
  },
  
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
