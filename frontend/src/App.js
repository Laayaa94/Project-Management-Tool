import { BrowserRouter,Routes,Route } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import Main from './Pages/Main';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Main/>}/>
        
      </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
