import bodyParser from 'body-parser'
import express from 'express'
import db_connect from './Db_con.js'
import cors from 'cors'
import session from 'express-session'
import global from './global.js'
//APIs
import Socket_support  from  './API/socket_support.js'
import AUTH from './API/Pages/Auth/auth.js'
import Index from './API/Pages/Index/index.js'



const app=express()
//Database connection establishment
db_connect()
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin:[global.Frontend_server,"http://localhost:5001","https://tujuane-messenger.web.app","https://tujuane-socketio.onrender.com"],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))


//API
app.use('/socket_support',Socket_support)
app.use('/auth',AUTH)
app.use('/index',Index)
app.use('/',AUTH)

app.get('/',(req,res)=>{
    res.send('Hello World')
})
app.post('/handshake',(req,res)=>{
    console.log(req.params,req.body)
    res.send(req.params,req.body)
})
app.listen(5000,()=>{console.log('Server has started on port 5000')})
