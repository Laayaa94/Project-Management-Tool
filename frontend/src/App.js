import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from "./Pages/Home";
import Main from "./Pages/Main";
function App() {
  return (
    <div className="App">
     <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/main" element={<Main/>}/>

        </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
