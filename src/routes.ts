import * as express from 'express'
const router = new express.Router();
import mailer from './mailer'
import Email from './mail'

export type EmailRequest = {
    to: string
    from?: string
    subject?: string
    template_type?: string
    verification_code?: string
    recovery_url?: string
    title?: string
    message?: string
}

router.post('/email', (req, res) => {
    console.log(req.body)

    let email: Email

    try {
        email = new Email(req.body)
    } catch(err) {
        console.log(err)
        res.status(400).send(err.toString())
        return
    }

    mailer(email.build()).then((data) => {
        console.log(data)
        res.status(200).end()
    }).catch((err) => {
        console.log(err)
        res.status(500).end()
    })
})

// {"template_type": "verification_valid", "to":"gabe@mnrva.dev", "verification_url":"https://google.com"}

export default router