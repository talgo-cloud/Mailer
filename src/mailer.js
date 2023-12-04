// Load the AWS SDK for Node.js
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"; // ES Modules import
const client = new SESv2Client();

export default function sendEmail(mailData) {
  const input = { // SendEmailRequest
    FromEmailAddress: mailData.from,
    Destination: { // Destination
      ToAddresses: [ // EmailAddressList
        mailData.to,
      ],
    },
    Content: { // EmailContent
      Simple: { // Message
        Subject: { // Content
          Data: mailData.subject, // required
          Charset: 'utf-8',
        },
        Body: { // Body
          Html: {
            Data: mailData.body, // required
            Charset: 'utf-8',
          },
        },
      },
    },
  };

  const command = new SendEmailCommand(input);
  return client.send(command);
}