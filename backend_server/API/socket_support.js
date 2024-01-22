import express from 'express'
import bodyParser from 'body-parser'
import global from '../global.js'

//Database files
import User from '../Models/users.js'
import Hits from '../Models/Hits.js'

const jsonParser = bodyParser.jsonParser

const router = express.Router({ mergeParams: true })
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
    res.json({ "hello": 'World' })
})

router.post('/handshake', (req, res) => {
    console.log(req.params, req.body, req.query)
    res.json({ "hello": 'World' })
})

router.get('/NHits', async function (req, res) {
    var result = await Hits.count()
    res.json({ 'ans': result })
})

//*Start**************** */
router.post('/disconnect', async (req, res) => {

    console.log(req.params, req.body, req.query)
    var req_data = req.body

    var result = await User.find({ "sid": req_data['sid'] })
    if (result) {
        //Updating the users status as disconnected and broadcasting it
        let user_doc = await User.findOne({ 'sid': req_data['sid'] })
        if (user_doc) {
            await user_doc.updateOne({ 'status': 'disconnected' })
            var result = await user_doc.save()
            //Broadcasting the users status
            res.json({ "status": 'success', message: "users status updated successfully", 'data': result })

        } else {
            res.json({ "status": 'failed', "message": 'Error in updating user disconnect status' })
        }
    } else {
        res.json({ "status": 'failed', message: "user doesn't exist" })
    }
})



router.post('/auth_data', async (req, res) => {

    console.log(req.params, req.body, req.query)
    var req_data = req.body

    var result = await User.find({ email: req_data['email'] })
    if (result) {
        //Updating the users status as disconnected and broadcasting it
        let user_doc = await User.findOne({ 'email': req_data['email'] })
        if (user_doc) {
            await user_doc.updateOne({ 'status': 'connected' })
            var result = await user_doc.save()
            //Broadcasting the users status
            res.json({ status: 'success', message: 'A user has connected , check and update your database', 'data': result })
        } else {
            res.json({ status: 'failed', message: 'Error in updating user connected status' })
        }
    } else {
        res.json({ status: 'failed', message: 'Error, user doesnt exist' })
    }
})



router.post('/received_message1', async (req, res) => {

    console.log(req.params, req.body, req.query)
    var req_data = req.body

    var result = await User.find({ _id: req_data['_id'] })
    res.json({ 'status': "success", "message": "Found user", 'data': result })
})

router.post('/received_message2', async (req, res) => {

    console.log(req.params, req.body, req.query)
    var req_data = req.body

    let user_doc = await User.findOne({ '_id': req_data["recipient_id"] })
    if (user_doc) {
        await user_doc.updateOne({ 'status': 'disconnected' })
        var result = await user_doc.save()
        res.json({ status: 'success', message: 'Users disconnect status updated', 'data': result })
    } else {
        res.json({status:"success",message:'Error in updating user connected status'})
    }
})



export default router