const express = require ("express");
const router = express.Router();
const Cars = require('../models/cars');
const multer = require('multer');
const fs = require("fs");


//img uplod
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname +"_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage:storage,
}).single("image");

//insert ke database route
router.post("/add", upload, (req, res) =>{
    const car = new Cars({
        nama: req.body.nama,
        harga: req.body.harga,
        image: req.file.filename,
        created: req.body.created,
    });
    car.save().then(()=>{
        req.flash('msg', 'data berhasil disimpan');
        res.redirect('/');
    }).catch((err)=>{
        res.json({message: err.message, type:'danger'});
    });
})

router.get("/", (req,res) => {
    Cars.find().then((cars)=>{
        res.render("listCars", {
            title: "BCR CARS Dashbord",
            header: "CARS",
            subheader : "List Cars",
            cars: cars,
            msg : req.flash('msg'),
        });
    }).catch((err)=>{
        res.json({message: err.message});
    });
});

router.get("/add", (req,res) => {
    res.render("addCars", {
        title: "Add Cars",
     });
});

router.get("/edit/:id", (req,res) => {
    let id = req.params.id;
    Cars.findById(id).then((car)=>{
        res.render("editCars", {
            title: "Edit Car",
            car: car,
        });
    }).catch((err)=>{
        res.redirect("/");
    });
});

router.post("/update/:id", upload, (req, res) => {
    let id = req.params.id;
    let new_image ='';
    let new_created = Date.now()

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync("./uploads/" + req.body.old_image);
        } catch(err){
            console.log(err);
        }
    } else {
        new_image = req.body.old_image ;
    }
    
    Cars.findByIdAndUpdate(id, {
        nama: req.body.nama,
        harga: req.body.harga,
        image: new_image,
        created: new_created,
    }).then((result)=>{
        res.redirect("/");
    }).catch((err)=>{
        res.json({message: err.message, type:'danger'});
    });

})

router.get("/delete/:id", (req, res) => {
    let id = req.params.id;
    Cars.findByIdAndDelete(id).then((result) => {
        if (result.image !== '') {
            try {
                fs.unlinkSync("./uploads/" + result.image);
            } catch (err) {
                console.log(err);
            }
        }
        req.flash('msg', 'data berhasil dihapus');
        res.redirect("/");

    }).catch((err)=>{
        res.json({message: err.message});
    });
});

router.get("/login", (req,res) => {
    res.render("login", {
        title: "BCR CARS Dashbord",
        msg : req.flash('msg'),
    });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@gmail.com' && password == 'admin' ) {
        try {
            res.redirect("/");
        } catch (err) {
            req.flash('msg', 'data berhasil dihapus');
            res.redirect("/login");
            
        }
    } else {
        req.flash('msg', 'Masukkan username dan password yang benar. Perhatikan penggunaan huruf kapital.');
        res.redirect("/login");
        
    }
});

router.get("/dashbord", (req,res) => {
    Cars.find().then((cars)=>{
        res.render("dashbord", {
            title: "BCR CARS Dashbord",
            header: "DASHBORD",
            subheader : "Dashbord",
            cars: cars,
            msg : req.flash('msg'),
        });
    }).catch((err)=>{
        res.json({message: err.message});
    });
});

module.exports = router;