import express from 'express'
const app = express()
import router from './routes.js'
import { EventEmitter } from 'events'
EventEmitter.defaultMaxListeners = 15;


const port = process.env.PORT || 3000

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routes
app.use(router);

app.listen(port, () => {
    console.log('Mailer listening at http://127.0.0.1:' + port)
})
