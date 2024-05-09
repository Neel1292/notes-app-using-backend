const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
require('dotenv').config()

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
    fs.readdir(`./files`, (err, files) => {
        res.render("index", { files: files });
    })
})

app.post('/create', function(req, res) {
    const { title, description } = req.body;
    fs.writeFile(`./files/${title.split(' ').join("")}.txt`, description, function(err){
        res.redirect('/');
    });
})

app.get('/files/:filename', function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', function(err, filedata) {
        res.render('show', { filename: req.params.filename, filedata })        
    });
})

app.get('/edit/:filename', function(req, res) {
    res.render('edit', { filename: req.params.filename });
})

app.post('/edit', function(req, res) {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err){
        res.redirect('/');
    });
})

app.listen(3000, function(err, req) {
    if(err) console.error(err.message);
    console.log(`Server running on port ${PORT}....`);
})