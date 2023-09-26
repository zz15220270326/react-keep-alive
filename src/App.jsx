import ReactDOM from 'react-dom';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import {
  AliveProvider,
  transToAliveComponent,
  useInitScopeContext
} from 'react-keep-alive';

import HomePage from './pages/Home';
import SubmitPage from './pages/Submit';
import AboutPage from './pages/About';

const HomeKeepAlivePage = transToAliveComponent(HomePage, {
  id: 'home-page'
});
const SubmitKeepAlivePage = transToAliveComponent(SubmitPage, 'submit-page');
const AboutKeepAlivePage = transToAliveComponent(AboutPage, 'about-page');

function App() {
  useInitScopeContext();

  return (
    <div className="container">
      <ul className="route-links">
        <li className="route-lk-item">
          <Link to="/">首页</Link>
        </li>
        <li className="route-lk-item">
          <Link to="/about">关于</Link>
        </li>
        <li className="route-lk-item">
          <Link to="/submit">提交</Link>
        </li>
      </ul>
      <hr />
      <Routes>
        <Route path="/" element={ <HomeKeepAlivePage /> } />
        <Route path="about" element={ <AboutKeepAlivePage /> } />
        <Route path="/submit" element={ <SubmitKeepAlivePage /> } />
      </Routes>
    </div>
  );
}

ReactDOM.render(
  (
    <BrowserRouter>
      <AliveProvider>
        <App />
      </AliveProvider>
    </BrowserRouter>
  ),
  document.getElementById('app')
);
