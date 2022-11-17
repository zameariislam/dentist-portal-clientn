
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

const appoinmentOptionCollection = client.db("doctorsPortal").collection("appoinmentOptions");
const bookingsCollection = client.db("doctorsPortal").collection("bookings");







app.get('/appoinmentOptions', async (req, res) => {

    const date = req.query.date

    try {

        const query = {}

        const bookingQuery = { appoinmentDate: date }




        const options = await appoinmentOptionCollection.find(query).toArray();
        const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray()
        // console.log(alreadyBooked)
        options.forEach(option => {
            const optionBooked = alreadyBooked.filter(book => book.treatment === option.name)
            const bookedSlot = optionBooked.map(book => book.slot)
            const remainingSlots = option.slots.filter(slot => !bookedSlot.includes(slot))
            option.slots = remainingSlots


        })


        res.send({
            success: true,
            message: "Successfully got the data",
            data: options,
        });
    } catch (error) {

        res.send({
            success: false,
            error: error.message,
        });
    }


})



app.post('/bookings', async (req, res) => {




    try {
        const booking = req.body
        console.log(booking)
        const query = {

            appoinmentDate: booking.appoinmentDate,
            treatment: booking.treatment,
            email: booking.email

        }
        console.log(query)


        const alreadyBooked = await bookingsCollection.find(query).toArray()
        console.log(alreadyBooked)
        if (alreadyBooked.length) {
            return res.send({
                success: false,
                message: `You have already have a booking on ${booking.appoinmentDate}`
            })


        }


        const result = await bookingsCollection.insertOne(req.body);


        if (result.insertedId) {
            res.send({
                success: true,
                message: `Successfully created  with id ${result.insertedId}`,
            });
        } else {
            res.send({
                success: false,
                error: "Couldn't create the product",
            });
        }
    } catch (error) {

        res.send({
            success: false,
            error: error.message,
        });
    }

})



app.get('/', (req, res) => {
    res.send('Server is running')

})


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})


