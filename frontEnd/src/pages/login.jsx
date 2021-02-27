import React, { useState } from 'react'
import Axios from 'axios'
//import KategorijePage from './kategorije.jsx'
import {useHistory} from 'react-router-dom'
//import LoginPage from './pages/login.jsx'




const LoginPage = ()=>{

    const [ nameState ,setNameState] = useState('')
    const [ passState, setPassState] = useState('')
    const history = useHistory()
   
    //var mark = {}
    

    const sacuvati = ()=>{
        console.log('Uslo je u metodu za slanje')
        Axios.post('http://localhost:5000/korisnici/login', {korisnik: nameState, lozinka: passState}).then((response)=>{
            console.log(response.data)
            console.log(response.data.pristupniToken)
            localStorage.setItem("token",response.data.pristupniToken)
            if(response.data){
                history.push('/home')
            }
        })
        
    }        
          

    return(

        
        <div>
            <h1>Login stranica</h1>
            <label>Korisnicko ime:</label>
            <input type='text' value={nameState} onChange={(event)=>{
                setNameState(event.target.value)
            }} />
            <label>Lozinka:</label>
            <input type='text' value={passState} onChange={(event)=>{
                setPassState(event.target.value)
            }}/>
            <button onClick={sacuvati}>Prijava</button>
        </div>
    )
}

export default LoginPage