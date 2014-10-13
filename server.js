var express=require("express");
var stylus=require('stylus');
var mongoose=require('mongoose');
var bodyParser   = require('body-parser');
var favicon      = require('static-favicon');
var fileServer   = require('serve-static')
var logger       = require('morgan');
var env=process.env.NODE_ENV=process.env.NODE_ENV||"development";

var app=express();
function compile(str,path){
    return stylus(str).set('filename',path);
}
app.use( fileServer( __dirname+'/public' ));
app.use( favicon());
app.set('views',__dirname+'/server/views');
app.set('view engine','jade');
app.use(logger('dev'));
app.use(bodyParser());
app.use(logger());
app.use(stylus.middleware(
    {src:__dirname+'/public',
    compile:compile}
));
if(env=='development'){
mongoose.connect('mongodb://localhost/multivision');
}else{
    mongoose.connect('mongodb://jason:multivision@ds035280.mongolab.com:35280/multivisions');
}

var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error...'));
db.once('open',function callback(){
    console.log('multivision db opened');
})
var messageSchema=mongoose.Schema({message:String});
var Message=mongoose.model('Message',messageSchema);
var mongoMessage;
Message.findOne().exec(function(error,messageDoc){
    mongoMessage=messageDoc.message;
})
app.get('/partials/:partialPath',function(req,res,next){
    res.render('partials/'+req.params.partialPath);
})
app.get('*',function(req,res,next){
    res.render('index',{mongoMessage:mongoMessage});
})
var port=3030;
app.listen(port);
console.log('Listening on port'+port+'...');