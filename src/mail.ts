import { SendEmailCommandInput } from "@aws-sdk/client-sesv2"
import { EmailRequest } from './routes'
import * as Sqrl from 'squirrelly'
import { readFileSync } from 'fs' 
// this file definies an interface for email objects

export default class Email {
    to: string
    from: string
    subject: string
    body: string
    template: string
    constructor(req: EmailRequest) {

        if (req.to == undefined) {
            throw new Error('to address must be provided')
        }
        this.to = req.to
        
        switch(req.template_type) {
            case 'verification_valid':
                this.template = './templates/verification.html'
                if (req.verification_code == undefined) {
                    throw new Error('verification_url must be provided')
                }
                this.from = '"Talgo Cloud" <accounts@talgo.cc>'
                this.subject = 'Verify your email for Talgo Cloud'
                break
            case 'recovery_valid':
                this.template = './templates/recovery.html'
                if (req.recovery_url == undefined) {
                    throw new Error('recovery_url must be provided')
                }
                this.from = '"Talgo Cloud" <accounts@talgo.cc>'
                this.subject = 'Recover your Talgo Cloud account'
                break
            default:
                this.template = './templates/default.html'
                if (req.title == undefined) {
                    throw new Error('title must be provided for non-templated emails')
                }
                if (req.from == undefined) {
                    throw new Error('from address must be provided for non-templated emails')
                }
                if (req.subject == undefined) {
                    throw new Error('subject must be provided for non-templated emails')
                }
                if (req.message == undefined) {
                    throw new Error('message must be provided for non-templated emails')
                }
                this.from = req.from
                this.subject = req.subject
                break
        }

        this.body = Sqrl.render(readFileSync(this.template).toString(), req)
    }

    build(): SendEmailCommandInput {
        return { // SendEmailRequest
            FromEmailAddress: this.from,
            Destination: { // Destination
              ToAddresses: [ // EmailAddressList
                this.to,
              ],
            },
            Content: { // EmailContent
              Simple: { // Message
                Subject: { // Content
                  Data: this.subject, // required
                  Charset: 'utf-8',
                },
                Body: { // Body
                  Html: {
                    Data: this.body, // required
                    Charset: 'utf-8',
                  },
                },
              },
            },
          }
    }
}

