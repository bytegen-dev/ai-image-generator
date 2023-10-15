import { useEffect } from 'react';
import './App.css';
import ImageGenerator from './components/imageGenerator/ImageGenerator';

function App() {
  useEffect(()=>{
    window.addEventListener("contextmenu", (e)=>{
      e.preventDefault()
    })
  },[])

  return (
    <div className='app'>
      <ImageGenerator />
    </div>
  );
}

export default App;
