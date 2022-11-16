
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')


const app = express()
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 8000

//  middleware 


app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vmx3iz0.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri);


const dbConnect = async () => {

    try {
        await client.connect()
        console.log('database connected')


    }
    catch (error) {
        console.log(error)

    }
}
dbConnect()






app.get('/', (req, res) => {
    res.send('Server is running')

})


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})


