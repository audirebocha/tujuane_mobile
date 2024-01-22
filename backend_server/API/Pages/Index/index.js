import express from 'express'
import bodyParser from 'body-parser'
import User from '../../../Models/users.js'
import session from 'express-session'


const jsonParser = bodyParser.jsonParser

const router = express.Router({ mergeParams: true })
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
    res.json({ "message": 'Index API' })
})

router.post('/get_users', async (req, res) => {
    //console.log(req.params,req.body,req.query)
    var data = req.body
    //Get all the users data
    var result = await User.find()
    if (result.length) {
        res.json({ status: 'success', message: 'total users:' + String(result.length), "data": result })

    } else {
        // Insert data to the database
        res.json({ status: 'error', message: 'No users in the database' })
    }
})

router.post('/socketio_connection_confirmation', async (req, res) => {
    console.log(req.params, req.body, req.query)
    var data = req.body
    //Get all the users data
    let user_doc = await User.findOne({ 'email': data.email })
    await user_doc.updateOne({ sid: data['sid'], 'status':'online' })
    var result = await user_doc.save()

    if (result) {
        res.json({ status: 'success', message: 'Okay your details have been updated' })
    } else {
        // Insert data to the database
        res.json({ status: 'error', message: 'Something happened when updating your details' })
    }
})






export default router