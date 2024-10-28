import React, { useEffect, useState } from 'react'
import { getAll } from './services/Api/httpRequest.js'


function App() {
  const [getAll, setGetAll] = useState([])
  useEffect(() => 
  {
    const getAllDataRequest = async () =>{
      const getAllData = await getAll()
      setGetAll(getAllData)
    }
    getAllDataRequest()
  }, [])
  return (
    <>
       <h1 className="text-cyan-200">Hello world!</h1>
        
    </>
  )
}

export default App
