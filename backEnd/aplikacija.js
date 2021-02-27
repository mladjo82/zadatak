//definisanje modula koji ce se koristiti u aplikaciji
const express = require('express');
const cors = require('cors')
//const roter = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const tokenZaapp = 'moravoselomojeravno'
var url = 'mongodb://localhost:27017/baza';
const https = require('https')
const path = require('path')



var options={
    host:'www.vantetider.se',
    path: '/api/Ajax/GetWaitingAndCapacityByService/141'
}


const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/baza', function(err, db){
    if(err) throw err;
    console.log('Konektovano na bazu');
});


const app = express();
const port = process.env.port || 5000

app.use(express.static(path.join(__dirname,'./images/upload')))
console.log(path.join(__dirname,'./images/upload'))

function provjeraJWT(req,res,next){
    const authHeader = req.headers['authorization']

    console.log('Mozda i procita nesto')

    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token,tokenZaapp, (err, user)=>{
            if(err){
                console.log('Nesto nije u redu')
                return  res.sendStatus(403)
            }

            req.user = user
            next()
        })
    }else{
        console.log('Opet nesto nije u redu')
        res.sendStatus(401)
    }
}


var kategorija = require('./routs/kategorije')
var korisnici = require('./routs/korisnici')
var artikli = require('./routs/artikli');
const { on } = require('events');
app.use(express.json());
app.use(cors())

app.use('/kategorije', kategorija)
app.use('/korisnici', korisnici)
app.use('/artikli', artikli)

app.get('/', provjeraJWT,(req,res)=>{
    res.send('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM')
})

app.get('/script',()=>{

    //uspostaviti konekciju sa bazom
    MongoClient.connect('mongodb://localhost:27017/baza', function(err, db){
    if(err) throw err;
    const baza = db.db('baza')
    
    https.get(options, (res)=>{
        var body = ''
        var Chunk = []
        res.on('data', (chunk)=>{
            Chunk.push(chunk)
        }).on('end',()=>{
            body = Buffer.concat(Chunk)
            //console.log(body)
        }).on('end',()=>{
            let obj = JSON.parse(body)
            console.log(obj)
            console.log(obj.aaData.length)
            obj.aaData.forEach(element => {
                element["obradjeno"]=false
                element["lat"]=0
                element["lng"]=0
                baza.collection('api1').insertOne(element)
               
            });
        })
     })
    db.close
    })
})

app.get('/scr',(req,res)=>{
   
        const http = require("https");
        const otions = {}
        //var naziv = 'Skaraborgs sjukhus (Skövde, Falköping, Mariestad, Lidköping)'
        var naziv = ''
        var naziv1 = []
        let obj = {}
        var listaKoordinata = []
        

        MongoClient.connect(url,  (err, db) => {
                const baza = db.db('baza');

                baza.collection('api1').find({}).toArray((err, result) => {
                    result.forEach(element => {
                        naziv1.push(element.unitName);
                        
                    });
                    console.log('Ovo su adrese ili gradovi1111111 ' + naziv1);
                    naziv1.forEach(element => {
                        options = {
                            "method": "GET",
                            "hostname": "google-maps-geocoding.p.rapidapi.com",
                            "port": null,
                            "path": encodeURI(`/geocode/json?address=${element}&language=en`),
                            "headers": {
                                "x-rapidapi-key": "7e499264b2msheac628556a4fdedp14d935jsndd0eee671a26",
                                "x-rapidapi-host": "google-maps-geocoding.p.rapidapi.com",
                                "useQueryString": true
                            }
                        };

                        const req = http.request(options, function (res) {
                            const chunks = [];
                            res.on("data", function (chunk) {
                                chunks.push(chunk);
                            }).on("end", function () {

                                const body = Buffer.concat(chunks);
                                obj = JSON.parse(body);
                                console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');
                                console.log(obj.results[0].geometry.location.lat);
                                console.log(obj.results[0].geometry.location.lng);
                                try {
                                    baza.collection('api1').updateOne({ unitName: element }, { $set: { lat: obj.results[0].geometry.location.lat, lng: obj.results[0].geometry.location.lng, obradjeno: true } });
                                } catch (err) {
                                    console.log(err);
                                }

                            });

                        });
                        req.end();

                    });
                    setTimeout(function cb(){
                        console.log('UPALO PRIJE VREMENA');
                        //procitati iz baza 'api1' sve slogove i poslati ih frontendu
                        baza.collection('api1').find({}).toArray((err, result) => {
                            if (err)
                                throw err;
                            console.log(result);
                            res.send(result);
                        });
                    },2000)
                   

                });

            })
            //db.close()
    })
            

//metoda koja vraca server koji ocejuje konekciju na definisanom portu
app.listen(port,() => {
    console.log(`Server is running on port: ${port}`);
})