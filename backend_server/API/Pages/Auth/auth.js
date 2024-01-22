import express from 'express'
import bodyParser from 'body-parser'
import User from '../../../Models/users.js'
import session from 'express-session'


const jsonParser = bodyParser.jsonParser

const router = express.Router({ mergeParams: true })
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
    res.json({ "hello": 'World' })
})

router.post('/sign_in', async (req, res) => {
    //console.log(req.params,req.body,req.query)
    var data = req.body
    //Check if the user is in the database if not sign them in
    var result = await User.find({ email: data.email })
    if (result.length) {
        req.session.auth = true
        req.session.email = data['email']

        //Updating the users activity
        let user_doc = await User.findOne({ 'email': data.email })
        await user_doc.updateOne({ 'status': 'active' })
        var result = await user_doc.save()
        res.json({ status: 'success', message: 'Welcome back user','data': result })

    } else {
        // Insert data to the database
        const new_user = new User({
            display_name: data['display_name'],
            email: data['email'],
            phone: data['phone'],
            profile_photo_url: data['photoURL'],
            status: 'active'
        })
        new_user.save()

        //Add session data
        req.session.auth = true
        req.session.email = data['email']

        // Send a response to the client if all is successful
        res.json({ status: 'success', message: 'You have successfully registered with us' })

    }
})





export default router