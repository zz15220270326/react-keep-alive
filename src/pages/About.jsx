import React, { useState, useEffect } from 'react';

export default function AboutPage() {

  const [title, setTitle] = useState('AboutPage');

  const onChangeTitleClick = () => {
    const titleArrField = ['About', '关于', '关于页面', 'AboutPage'];
    const arrIdx = parseInt(Math.random() * titleArrField.length);

    setTitle(titleArrField[arrIdx]);
  }

  useEffect(() => {
    console.log('about-page render');
  }, []);

  return (
    <div>
      <h2>{ title }</h2>
      
      <button onClick={ onChangeTitleClick }>Set title</button>
    </div>
  )
}
