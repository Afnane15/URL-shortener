const express = require('express');
const mongoose = require('mongoose');
const URL = require('./models/url');
const { randomBytes } = require('crypto');


const app = express();
const dbURI = 'mongodb+srv://afnane15:afnane2001@cluster0.70sdi.mongodb.net/url-shortener?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(dbURI)
    .then((result) => { app.listen(3000);
    console.log('listening..')})
    .catch((err) => console.log(err))

// view engine setup
app.set('view engine', 'ejs');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static( 'public'));


app.get('/',  (req, res) => {
    let errorMessage = false
    URL.find()
    .then((url) => {
        res.render('index', { title: 'Express', errorMessage, url });
    })
   
});


//Saving the history and list it 
app.post('/', (req, res) => {
    let errorMessage = false
    if(!req.body['short_url']){
        req.body['short_url'] = randomBytes(Math.ceil(20/2))
                             .toString('hex')
                             .slice(0,10)
    }
    URL.findOne({ short_url:req.body['short_url']})
    .then((result)=>{
        if(result){
        errorMessage = 'This alias already exists, please introduce another one.';
        URL.find()
        .then((url) => {
            res.render('index', {url,errorMessage});
        })
        }else{
            const url = new URL(req.body);
            url.save()
            .then(() => {
                errorMessage = false;
                URL.find()
                .then((url) => {
                    res.render('index', {url,errorMessage});
                    })
                
                })
            .catch((err) => {
                console.log(err)
            })
        }
    })
    .catch((err) => {
        console.log(err)
    })
    
    }
)

app.get('*', (req, res) => {
    const targetUrl = req.url;
    URL.findOne({short_url: targetUrl.slice(1)})
    .then((url) => {
        if(url){
            res.redirect(url['long_url']); 
        }else{
        const error = { status: 404}
        return res.render('error', {error,  message: 'Url not found'})
        }})
    .catch((err) => { 
        console.log(err)})  }
)


