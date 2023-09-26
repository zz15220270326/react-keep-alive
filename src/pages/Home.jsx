import React, { useState } from 'react';

function HomePage() {
  const [count, setCount] = useState(0);

  const addCount = () => {
    setCount(count => count + 1);
  };

  const initCount = () => {
    setCount(0);
  }

  return (
    <>
      <div className="home-page">
        <h2>{ count }</h2>

        <button onClick={ addCount }>Add Count</button>
        <button onClick={ initCount }>Init Count</button>      
      </div>
      <footer>
        foot
      </footer>
    </>
  );
}

export default HomePage;
