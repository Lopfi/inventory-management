const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const multer = require('multer');
const Database = require('better-sqlite3');
fs = require('fs-extra');
app.use(bodyParser.urlencoded({extended: true}));

const db = new Database('./db/data.db');

// plans table
db.prepare(`
    CREATE TABLE IF NOT EXISTS plans
    (
        destination TEXT,
        file        TEXT
    );`).run();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({storage: storage})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');

});

// upload single file

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file);
})
//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files;
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }

    res.send(files);

})


app.post('/uploadphoto', upload.single('picture'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database

    var finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
    };
    db.collection('mycollection').insertOne(finalImg, (err, result) => {
        console.log(result)

        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')


    })
})


app.get('/photos', (req, res) => {
    db.collection('mycollection').find().toArray((err, result) => {

        const imgArray = result.map(element => element._id);
        console.log(imgArray);

        if (err) return console.log(err)
        res.send(imgArray)


    })
});

app.get('/photo/:id', (req, res) => {
    var filename = req.params.id;

    db.collection('mycollection').findOne({'_id': ObjectId(filename)}, (err, result) => {

        if (err) return console.log(err)

        res.contentType('image/jpeg');
        res.send(result.image.buffer)


    })
})

app.listen(3000, () => {
    console.log('listening on 3000')
});