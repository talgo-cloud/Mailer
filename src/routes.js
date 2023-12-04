import express from 'express'
const router = new express.Router();
import mailer from './mailer.js'
import sqrl from 'squirrelly'
import fs from 'fs'

router.post('/email', (req, res) => {
    console.log(req.body)
    let emailTemplate = ''
    let mailData = {
        body: '',
        to: req.body.to,
        from: '',
        subject: '',
    }

    console.log(req.Headers)

    // property validation
    let errList = []

    if (!req.body.to) {
        errList.push({"to": "valid email address is required"})
    }
    // if (!req.body.from) {
    //     errList.push({"from": "valid email address is required"})
    // }
    // if (!req.body.subject) {
    //     errList.push({"subject": "non-empty string expected"})
    // }
    if (!req.body.hasOwnProperty('template_type')) {
        errList.push({"template_type": "a value must be provided, even an empty string"})
    }
    if (errList.length > 0) {
        res.status(400).json({ errors: errList }).end()
        return
    }

    switch(req.body.template_type) {
        case 'verification_valid':
            mailData.subject = 'Verify your Talgo Cloud email address'
            emailTemplate = './templates/verification.html'
            mailData.from = '"Talgo Cloud" <accounts@talgo.cc>'
            break;
        case 'recovery_valid':
            mailData.subject = 'Recover your Talgo Cloud account'
            emailTemplate = './templates/recovery.html'
            mailData.from = '"Talgo Cloud" <accounts@talgo.cc>'
            break;
        default:
            mailData.subject = req.body.subject
            emailTemplate = './templates/default.html'
            mailData.from = req.body.from
            break;
    }

    mailData.body = sqrl.render(fs.readFileSync(emailTemplate).toString(), req.body)

    mailer(mailData).then((data) => {
        console.log(data)
        res.status(200).end()
    }).catch((err) => {
        console.log(err)
        res.status(500).end()
    })
})

// {"template_type": "verification_valid", "to":"gabe@mnrva.dev", "verification_url":"https://google.com"}

export default router