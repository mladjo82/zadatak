import React from 'react'
import Axios from 'axios'
import 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/table'
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
import 'tinymce/skins/content/default/content.min.css'
import { Editor } from '@tinymce/tinymce-react'


class ArtikliPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
    file: null,
    file1:null,
    nameState:'',
    kategorijeState:'',
    contentState:'',
    lista:[]
    }
   
    
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeTunyMCE = this.handleChangeTunyMCE.bind(this)
  }

  

  componentDidMount(){
   
    Axios.get('http://localhost:5000/artikli/citanje',{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
      this.setState({lista : response.data})
      console.log(response.data)
      
      })
     
  }

 

handleChange(event) {
  this.setState({
    file: event.target.files[0],
    file1: URL.createObjectURL(event.target.files[0])
  })
  console.log(event.target.files[0])
  console.log(URL.createObjectURL(event.target.files[0]))
  
}

handleChangeTunyMCE(event) {
  console.log('USLO U METODU ZA TUNYMCE')
  //console.log(event)
  this.setState({contentState: event})

  
}

sacuvati = (e)=>{

      const formData = new FormData() 
      formData.append('image', this.state.file)
      formData.append("name", this.state.nameState)
      formData.append("category", this.state.kategorijeState)
      formData.append("content",  this.state.contentState)
      console.log(this.state.file)

      console.log('slanje, slanje... '+this.state.file)
      console.log('slanje, slanje... '+this.state.nameState)
      console.log('slanje, slanje... '+this.state.kategorijeState)
      console.log('slanje, slanje... '+this.state.contentState)
    

     
      Axios.post('http://localhost:5000/artikli/upis', formData,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response=>{
        Axios.get('http://localhost:5000/artikli/citanje',{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
          this.setState({lista : response.data})
          console.log(response.data)
              
         })
      }))
        
        this.setState({nameState:''})
        this.setState({kategorijeState:''})
        this.setState({contentState : ''})
        this.setState({file:null})
        this.setState({file1:null})
      }

sacuvatiIzmjene = ()=>{
        const formData = new FormData() 
        formData.append('image', this.state.file)
        formData.append("name", this.state.nameState)
        formData.append("category", this.state.kategorijeState)
        formData.append("content",  this.state.contentState)

        Axios.post(`http://localhost:5000/artikli/izmjena/${localStorage.getItem("ida")}`, formData,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response=>{
        Axios.get('http://localhost:5000/artikli/citanje',{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
          this.setState({lista : response.data})
          console.log(response.data)
              
         })
      }))
      this.setState({nameState:''})
      this.setState({kategorijeState:''})
      this.setState({contentState : ''})
      this.setState({file:null})
      this.setState({file1:null})
    }            

brisanje = (id)=>{
        console.log('Uslo je u funkciju za brisanje')
        Axios.delete(`http://localhost:5000/artikli/brisanje/${id}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
        })
        Axios.get('http://localhost:5000/artikli/citanje',{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
        this.setState({lista:response.data})
          console.log(response.data)
              
        })
    
        this.setState({nameState:''})
        this.setState({kategorijeState:''})
        this.setState({contentState : ''})
        this.setState({file:null})
      }
      
      
promjena = (id)=>{
              localStorage.setItem("ida",String(id))
              console.log('USLO JE U METODU ZA PROMJENE  ' +id)
              Axios.get(`http://localhost:5000/artikli/citanje/${id}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((response)=>{
                
                console.log(response.data)
              this.setState({nameState:response.data[0].name})
              this.setState({kategorijeState : response.data[0].category})
              this.setState({contentState:response.data[0].content})
              this.setState({file:response.data[0].image})
              this.setState({file1:response.data[0].image})

              console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')
              console.log(response.data[0].name)
              console.log(response.data[0].category)
              console.log(response.data[0].content)
              if(response.data[0].image != null){
                Axios.get(`http://localhost:5000/artikli/slika/${response.data[0].image}`).then((res)=>{
                  var sli = decodeURIComponent(atob(res.data).split("").map(function(c){
                    return "%" + ("00" + c.charCodeAt(0).toString(16).slice(-2))
                  }).join(""))
                  console.log(sli)
                  this.setState({file1:`data:image/jpeg;base64,${res.data}`})
                 
                })
              }
              
              })
              
          }

render() {
  return(
    <div>
      <form encType='multipart/form-data'>
      <h1>Unos artikala</h1>
      <label>Naziv artikla:</label>
      <input type='text' value={this.state.nameState} onChange={(event)=>{
        this.setState({nameState:event.target.value})
        console.log(this.state.nameState)
      }} />
      <label>Kategorije artikla:</label>
      <input type='text' value={this.state.kategorijeState} onChange={(event)=>{
        this.setState({kategorijeState:event.target.value})
      }}/>
      
      <Editor
          apiKey="lgjgtevrzgpapqss4dmdqs5mp50do3l15virxgq1cohfwa49"
           initialValue={this.contentState} 
             init={{
               skin: false,
               content_css: false,
               height:250,
               width:800,
               menubar: false,
               plugins:[
                 'link image',
                 'table paste'
               ],
               toolbar:
                 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help '
             }}
             value={this.state.contentState}
             onEditorChange={this.handleChangeTunyMCE}
             />
             
          </form>
        <div>
            <input type="file" file='image' className='form-control-file' onChange={this.handleChange}/>
            <img  src={this.state.file1} alt=''/>
        </div>
        <button type='submit' onClick={this.sacuvati}>Dodati artikal</button> 
        <button  onClick={this.sacuvatiIzmjene}>Sacuvati izmjene</button> 
        
        <h1>LIsta artikala</h1>

        <table>
               
               <tbody>
                {this.state.lista.map((val, key)=>{
                    return <tr key={key}><td>{this.state.lista[key].name}</td><td>{' '}</td><td>{this.state.lista[key].category}</td><td><button onClick={()=>this.brisanje(val._id)}>Delete</button></td><td><button onClick={()=>this.promjena(val._id)}>Edit</button></td></tr>
                })} 
              </tbody>
            </table>

             {/* {this.state.lista.map((val, key)=>{
                return <div key={key}><h3>{this.state.lista[key].name}{' '}{this.state.lista[key].category}<button onClick={()=>this.brisanje(this.state.lista[key]._id)}>Delete</button><button onClick={()=>this.promjena(this.state.lista[key]._id)}>Edit</button></h3></div>
             })}       */}
    </div>
  
        )
       
  }

}

export default ArtikliPage