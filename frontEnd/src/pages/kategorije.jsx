import React, { useState, useEffect } from 'react'
import Axios from 'axios'



const KategorijePage = ()=>{

        const [ nameState ,setNameState] = useState('')
        const [ parentState, setParentState] = useState('')
        const [lista, setLista] = useState([])
        //const [lista1, setLista1] = useState([])

        useEffect(()=>{
              Axios.get('http://localhost:5000/kategorije/citanje',{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
                setLista(response.data)
                console.log(response.data)
                
              })
            },[])

        const sacuvati = ()=>{
              Axios.post('http://localhost:5000/kategorije/upis', {name: nameState, parent: parentState},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})
                
          
              Axios.get('http://localhost:5000/kategorije/citanje',{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
                setLista(response.data)
                console.log(response.data)
                    
               })
               
               setNameState('')
               setParentState('')
            }

        const sacuvatiIzmjenu = ()=>{
          Axios.post(`http://localhost:5000/kategorije/izmjena/${localStorage.getItem("id")}`, {name: nameState, parent: parentState},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})
              
              setNameState('')
              setParentState('')
            }
          
            const brisanje = (id)=>{
              console.log('Uslo je u funkciju za brisanje')
              Axios.delete(`http://localhost:5000/kategorije/brisanje/${id}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
                Axios.get('http://localhost:5000/kategorije/citanje',{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
                  setLista(response.data)
                  console.log(response.data)
                      
                 })
              })
             
          
               setNameState('')
               setParentState('')
            }
          
            const promjena = (id)=>{
              localStorage.setItem("id", String(id))
               Axios.get(`http://localhost:5000/kategorije/citanje/${id}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
                
                setNameState(response.data[0].name)
                setParentState(response.data[0].parent.name)
                
               })
               
          
              Axios.get('http://localhost:5000/kategorije/citanje',{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
                setLista(response.data)
                console.log(response.data)
                    
               })
            }

  return(
      <div >
            <h1>Unos kategorija</h1>

            <label>Naziv kategorije:</label>
            <input type='text' value={nameState} onChange={(event)=>{
                setNameState(event.target.value)
            }} />
            <label>Naziv nadkategorije:</label>
            <input type='text' value={parentState} onChange={(event)=>{
                setParentState(event.target.value)
            }}/>
            <button onClick={sacuvati}>Dodati kategoriju</button>
            <button onClick={sacuvatiIzmjenu}>Sacuvati izmjenu</button>

            <h1>LIsta kategorija</h1>
           
             <table>
               <thead>
                 <tr>{['naziv Kategorije','nadkategorija(parent)'].map((key, index)=>{return <th key={index}>{key.toUpperCase()}</th>})}</tr>
               </thead>
               <tbody>
                {lista.map((val, key)=>{
                    return <tr key={key}><td>{val.name}</td><td>{' '}</td><td>{val.parent.name}</td><td><button onClick={()=>brisanje(val._id)}>Delete</button></td><td><button onClick={()=>promjena(val._id)}>Edit</button></td></tr>
                })} 
              </tbody>
            </table>
           
        </div>    
  )
}

export default KategorijePage