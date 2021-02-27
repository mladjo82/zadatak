const express = require('express');
const { MongoClient } = require('mongodb');
const  mongo = require('mongodb')
const roter = express.Router()
const jwt = require("jsonwebtoken")
const tokenZaapp = 'moravoselomojeravno'
const bcrypt = require("bcryptjs");
const { json } = require('express');

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



roter.get('/citanje',provjeraJWT,(req, res)=>{
    MongoClient.connect(url,(err, db)=>{
        const baza = db.db('baza')
        baza.collection('kategorija').find({}).toArray((err,result)=>{
            if(err) throw err
            console.log(result)
            res.send(result)

            db.close
        })
    })
})

roter.get('/citanje/:id', provjeraJWT,(req, res)=>{
    MongoClient.connect(url,(err, db)=>{
        const baza = db.db('baza')
        baza.collection('kategorija').find({_id: new mongo.ObjectId(req.params.id)}).toArray((err,result)=>{
            if(err) throw err
            console.log(result)
            res.send(result)

            db.close
        })
    })
})

roter.post('/upis', provjeraJWT,(req, res)=>{

    var id_roditelja  = ''

    MongoClient.connect(url,(err, db)=>{
        const baza = db.db('baza')
        console.log(req.body.name)
        console.log(req.body.parent)

        baza.collection('kategorija').find({name:req.body.parent},{_id:1}).toArray((err,result)=>{
            if(err) throw err
            console.log(result)
            console.log('jsdkhksjghdfkjhvgksdfjvnjkdnvkdfjnvkdfjnvdfkjvndf')
            console.log(result.length)
            if(!result.length==0){
                console.log('USLO JE U IF ISKAZ')
                console.log(result[0]._id)
                id_roditelja = result[0]._id
                id_roditelja = String(id_roditelja)
            }
            
            baza.collection('kategorija').insertOne({name: req.body.name, parent:{id:id_roditelja ,name:req.body.parent}})
            if(err) throw err
            db.close
        })
       
    })
})

roter.post('/izmjena/:id',provjeraJWT,(req,res)=>{

    console.log(req.body.name)
    console.log(req.body.parent)
    console.log(req.params.id)
    // var id_roditelja  = ''
    // console.log('Uslo je i u metodu za izmjenu')
         MongoClient.connect(url, (err, db) => {
         const baza = db.db('baza');
        baza.collection('kategorija').find({name:req.body.parent},{_id:1}).toArray((err,result)=>{
             if(err) throw err
             if(!result.length==0){
                console.log('Rezultat updaejta ')
                console.log(result)
                id_roditelja = result[0]._id
                id_roditelja = String(id_roditelja)
             }
            
             baza.collection('kategorija').updateOne({_id: new mongo.ObjectId(req.params.id)},{$set:{name:req.body.name, parent:{id:id_roditelja, name:req.body.parent}}})
             db.close();
         })
     })
})

roter.delete('/brisanje/:id',provjeraJWT,(req,res)=>{
    //var url = 'mongodb://localhost:27017/baza';
    console.log('Uslo je i u  metodu za brisanje')
        MongoClient.connect(url, (err, db) => {
        const baza = db.db('baza');
        console.log('Stigglo je dovde i stalo')
        console.log(req.params.id)
        baza.collection('kategorija').deleteOne({_id: new mongo.ObjectId(req.params.id)})
        db.close();
    }); 
})

module.exports = roter