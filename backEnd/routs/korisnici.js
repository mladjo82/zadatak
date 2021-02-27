const express = require('express')
const router = require('express').Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenZaapp = 'moravoselomojeravno'
const { MongoClient } = require('mongodb');
var url = 'mongodb://localhost:27017/baza';

//konfiguracija veze sa bazom
const validacija = require("../validation/login")
const { json } = require('express')

//unijeti validaciju
//validaciju za login
//validacija za registraciju

router.get('/', (req,res)=>{
    res.send("slje!!!")
});

router.post('/login', (req,res)=>{

    const  {error, isValid} = validacija(req.body)

    // if(!isValid){
    //     console.log('ako nesto nije dobo '+error)
    //     return res.status(400).json(error)
    // }

    const korisnik = req.body.korisnik
    const lozinka = req.body.lozinka
    console.log(lozinka)
    var loz = '' 
    var provjera = ''
    var id = {}

    MongoClient.connect(url, (err, db)=>{
        
        const baza = db.db('baza')
        baza.collection('korisnici').findOne({korisnik:korisnik},(err, result)=>{
            try{
                if(err) throw err
                provjera  = result.lozinka
                console.log('ova lozinka iz baze  '+provjera)
                console.log('ova lozinka sa forma '+req.body.lozinka)

                bcrypt.compare(req.body.lozinka, provjera).then(isMatch =>{
                    console.log('kakve su lozineke ' +isMatch)
                    if(!isMatch){
                        console.log('ova lozinka je nije dobra stvarno')
                    }else{
                        console.log('ssada se pravi token')
                        console.log(result.korisnik)
                        console.log(result.lozinka)
                        const pristupniToken = jwt.sign({korisnik:result.korisnik}, tokenZaapp,{expiresIn:18000})
                        res.json({pristupniToken})
                    
                    }
                })
            }catch(err){
                return res.status(404).json({korisniknotfound: "Korisnik nije pronadjen."})
            }
        })

    })
    
})


// router.post('/registracija', (req,res)=>{
//     MongoClient.connect(url,(err, db)=>{
//         const baza = db.db('baza')
//         bcrypt.hash(req.body.lozinka,12).then((hashedPassword)=>{
//             let data = {
//                 korisnik: req.body.korisnik,
//                 lozinka: hashedPassword
//             }
//             baza.collection('korisnici').insertOne(data)
//             //baza.collection('korisnici').insertOne({name: req.body.korisnik, parent:req.body.lozinkaS})
//             if(err) throw err
//             console.log('Upisan lozinka u bazu!')
           
//         })
//         db.close
//     }) 
// })

module.exports = router;