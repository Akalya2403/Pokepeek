import SplashScreen from './components/SplashScreen';
import Home from './components/Home';
import './App.css';
import { useState } from 'react';
import {Routes,Route,Navigate} from 'react-router-dom';
import Favorites from './components/Favorites';


function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  if(showSplash){
    return <SplashScreen onFinish={()=>setShowSplash(false)}/>
  }
  return (
    <div className="App">
    <Routes>
       <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
      
    </Routes>  

      
    </div>
  );
}

export default App;
