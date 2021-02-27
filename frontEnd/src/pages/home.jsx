import React from 'react'
import {Link} from 'react-router-dom'

class HomePage extends React.Component{
    render(){
       
        return(
            <div> 
                <h1>Home Page</h1> 
                <ul> 
                <li><h3><Link to='/kat'>Unos kategorija</Link></h3></li>
                <li><h3><Link to='/artikli'>Unos artikala</Link></h3></li>
                <li><h3><Link to='/update'>Update Scipt</Link></h3></li>
                </ul>
            </div>    
        )
    }
}

export default HomePage