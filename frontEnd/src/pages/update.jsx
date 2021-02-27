import React from 'react'
import Axios from 'axios'



class UpdatePage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
        lista:[]
        }
    }

     buttonStyle = {
        height : '55px'
        
      };

    klik=()=>{
        console.log('USLO U METODU ZA SKRIPTU!!!')
        Axios.get('http://localhost:5000/script').then((response)=>{
            console.log(response.data)
            
        })
    }

    klik1=()=>{
        console.log('USLO U METODU ZA SKRIPTU malu!!!')
        Axios.get('http://localhost:5000/scr').then((response)=>{
            console.log(response.data)
            this.setState({lista : response.data})


        })
    }

    render(){
        return(
            <div className="Button">
                <button style={this.buttonStyle} onClick={()=>this.klik()}>PREUZIMANJE PODATAKA</button>
                <button style={this.buttonStyle} onClick={()=>this.klik1()}>UPDATE PODATAKA</button>
                
                <div>
                    <table>
                        <tbody>
                            {this.state.lista.map((val, key)=>{
                                return <tr key={key}><td>{this.state.lista[key].regionName}</td><td>{' '}</td><td>{this.state.lista[key].unitName}</td><td>{' '}</td><td>{this.state.lista[key].Waiting}</td><td>{' '}</td><td>{this.state.lista[key].lng}</td><td>{' '}</td><td>{this.state.lista[key].lat}</td></tr>
                            })} 
                        </tbody>
                     </table>

                </div>

            </div>
            
        )
    }
}

export default UpdatePage