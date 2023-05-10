const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const Flag = require("../models/Flag");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Farmanisagoodb$oy';

//REGISTER
router.post("/register", [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 digits').isLength({ min: 5 }),
], async (req, res) => {

    var success = false;

    // Check for errors after validating
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Sorry, an user with this email already exists' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.status(200).json({ success, authtoken });

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
});

//LOGIN
router.post("/login", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    var success = false;

    // Check for errors after validating
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const validated = await bcrypt.compare(req.body.password, user.password);
        if (!validated) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // const { password, ...others } = user._doc;
        // res.status(200).json(others);

        const payload = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.status(200).json({ success, authtoken })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Get logged in user details using: POST "/api/auth/getuser". Requires auth
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        let userId = req.user.id;
        let user = await User.findById(userId).select("-password");
        res.status(200).json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

// ROUTE 3: Update score using: POST "/api/auth/updatescore". Requires auth
router.post('/updatescore', fetchuser, async (req, res) => {

    var success = false;
    var already = false;
    try {
        let userId = req.user.id;
        let qid = req.body.question;
        let child = 'question' + qid
        let userData = await User.findById(userId);
        let flagData = await Flag.findOne({ question: qid })
        // await Flag.create({
        //     question: qid,
        //     flag: req.body.flag,
        // });
        // success = true
        // res.status(200).json({ success })
        if (flagData.flag == req.body.flag) {
            if (!userData[child]) {
                userData[child] = true;
                // userData.points += 100;
                await User.updateOne({ _id: req.user.id }, userData)
                success = true;
                res.status(200).json({ success, already, points: userData.points });
            }
            else {
                success = true;
                already = true;
                res.status(200).json({ success, already, points: userData.points });
            }
        }
        else {
            res.status(200).json({ success, points: userData.points });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

// ROUTE 3: Get scoreboard using: GET "/api/auth/getscoreboard". Requires auth
router.get('/getscoreboard', fetchuser, async (req, res) => {

    var success = false;

    try {
        let userData = await User.find()
        tempData = []
        userData.forEach(item => {
            tempData.push({ name: item.name, points: item.points })
        })

        success = true;
        res.status(200).json(tempData)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})


module.exports = router;
