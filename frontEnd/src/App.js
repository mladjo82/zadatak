import React from 'react'
//import ReactDOM from "react-dom"
import LoginPage from './pages/login.jsx'
import KategorijePage from './pages/kategorije.jsx'
import ArtikliPage from './pages/artikli.jsx'
import HomePage from './pages/home.jsx'
import UpdatePage from './pages/update.jsx'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
//import Axios from 'axios', Switch, Link, Redirect
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Switch> 
        <Route exact path='/' component={LoginPage}/>
        <Route exact path='/kat' component={KategorijePage}/>
        <Route exact path='/artikli' component={ArtikliPage}/>
        <Route exact path='/home' component={HomePage}/>
        <Route exact path='/update' component={UpdatePage}/>
        <Redirect component={LoginPage}/>
      </Switch>
    </BrowserRouter>
   
  );
}

//ReactDOM.render(<App/ >, document.getElementById("root"))

export default App;
