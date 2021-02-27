const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validacijaKorisnika(data){

    let errors = {}

    //konvertovanje praznih polja u prazne stringove da bi mogli koristiti validator 
    data.korisnik = !isEmpty(data.korisnik) ? data.korisnik : "";
    data.lozinka = !isEmpty(data.lozinka) ? data.lozinka : "";

    //provjera korisnika
    if(Validator.isEmpty(data.korisnik)){
        errors.korisnik = "Polje za korisnika je obavezno."
    }else if(!Validator.isEmpty(data.korisnik)){
        errors.korisnik = "Neispravna lozinka."
    }

    //provjera lozinke
    if(Validator.isEmpty(data.lozinka)){
        errors.lozinka = "Unesite lozinku."
    }
return{
    errors,
    isValid: isEmpty(errors)
}

}