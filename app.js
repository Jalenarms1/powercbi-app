require("dotenv").config()
const express = require("express")
const path = require("path")
const app = express()
const bodyParser = require('body-parser');
const apiRouter = require("./api")
const {middleware} = require("./middleware")
const cors = require("cors")


app.use(express.static(path.join(__dirname, 'react-client/build')))

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend domain
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
  
app.use(cors(corsOptions));

app.use(bodyParser.json())

app.use(middleware)

app.use(apiRouter)

// app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})