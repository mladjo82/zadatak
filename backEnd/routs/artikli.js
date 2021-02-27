const express = require('express');
const { MongoClient } = require('mongodb');
const  mongo = require('mongodb')
const roter = express.Router()
const jwt = require("jsonwebtoken")
const tokenZaapp = 'moravoselomojeravno'
const bcrypt = require("bcryptjs");
const { json } = require('express');
const multer = require("multer")
const path = require('path')
const fs = require('fs')



var url = 'mongodb://localhost:27017/baza';

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


const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,  './routs/images/upload')
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname)
    }
})

const upload = multer({storage:storage})

roter.get('/citanje',provjeraJWT,(req, res)=>{
    MongoClient.connect(url,(err, db)=>{
        const baza = db.db('baza')
        baza.collection('artikli').find({}).toArray((err,result)=>{
            if(err) throw err
            console.log(result)
            res.send(result)
            db.close
        })
    })
})

roter.get('/citanje/:id',provjeraJWT,(req, res)=>{
    MongoClient.connect(url,(err, db)=>{
        const baza = db.db('baza')
        baza.collection('artikli').find({_id: new mongo.ObjectId(req.params.id)}).toArray((err,result)=>{
            if(err) throw err
            console.log(result)
            res.send(result)

            db.close
        })
    })
})

roter.get('/slika/:slika', (req, res)=>{
    console.log('POKUSAVAMO UZETI SLIKU')
    let img = path.join(__dirname,'./images/upload/')+  req.params.slika
    //img = img.toString('base64')
    console.log('PUTANJA SLIKE!!!!!')
    //res.sendFile(img)
    
    fs.readFile(img,(err, content)=>{
        res.writeHead(200, {"Content-type":"image/jpg"})
        res.end(content.toString('base64'))

        //var enc = new Buffer(content, 'binary').toString('base64')
        //res.send(enc)

        //res.contentType('json')
        // res.sendFile(img)
    })
    
})

roter.post('/upis',provjeraJWT,upload.single('image'), (req, res)=>{

    var id_roditelja  = ''
    var kategorije = []

    console.log('ovdje upada...')
   

    MongoClient.connect(url, upload.single('image'),(err, db)=>{
            const baza = db.db('baza')
            console.log(req.body.name)
            console.log(req.body.category)
            console.log(req.body.content)
            console.log(req.file.originalname)
            //, image:req.file.originalname

            kategorije = req.body.category.split(",")
            console.log('Niz kategorija '+kategorije)
            console.log('Niz kategorija dio:  '+kategorije[0])
            baza.collection('artikli').insertOne({name: req.body.name, category:kategorije, content: req.body.content, image:req.file.originalname})
            db.close
    })
})

roter.delete('/brisanje/:id',provjeraJWT,(req,res)=>{
    //var url = 'mongodb://localhost:27017/baza';
    console.log('Uslo je i u  metodu za brisanje')
        MongoClient.connect(url, (err, db) => {
        const baza = db.db('baza');
        console.log('Stigglo je dovde i stalo')
        console.log(req.params.id)
        baza.collection('artikli').deleteOne({_id: new mongo.ObjectId(req.params.id)})
        db.close();
    }); 
})

roter.post('/izmjena/:id', provjeraJWT, upload.single("image"),(req,res)=>{

   
    var kategorije = []

    console.log(req.body.name)
    console.log(req.body.category)
    console.log(req.body.content)
   // console.log(req.file.originalname)
    
    console.log('Uslo je i u metodu za izmjenu')
        MongoClient.connect(url, upload.single('image'),(err, db) => {
        const baza = db.db('baza');
        kategorije = req.body.category.split(",")
        //console.log(req.file.originalname)
        baza.collection('artikli').updateOne({_id: new mongo.ObjectId(req.params.id)},{$set:{name:req.body.name, category:kategorije, content: req.body.content}})
        db.close();
      
    })
})

module.exports = roter