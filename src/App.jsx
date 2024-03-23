import { useState } from 'react';
import { QuizzicalEntry } from './components/QuizzicalEntry';
import QuizzMain from './components/QuizzicalMain';
import './App.css';

function App() {
  const [showMain, setShowMain] = useState(false)

  const handleStartClick = () => {
    setShowMain(true)
  };

  return (
    <>
      {!showMain && <QuizzicalEntry onStartClick={handleStartClick} />} 
      {showMain && <QuizzMain />} 
    </>
    
  );
}

export default App;