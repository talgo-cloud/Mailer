// Load the AWS SDK for Node.js
import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-sesv2"; // ES Modules import
const client = new SESv2Client();

export default function mailer(input: SendEmailCommandInput) {
  const command = new SendEmailCommand(input);
  return client.send(command);
}