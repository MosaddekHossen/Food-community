const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// CRUD Operations
const uri = `mongodb+srv://${process.env.FOOD_USER}:${process.env.FOOD_PASS}@atlascluster.nqtfzbx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        const foodCollection = client.db('foodDB').collection('food');
        const requestCollection = client.db('RequDB').collection('Requ');

        // Create
        app.post('/food', async (req, res) => {
            const newFood = req.body;
            console.log(newFood)
            const result = await foodCollection.insertOne(newFood);
            res.send(result);
        })

        // Create Request
        app.post('/request', async (req, res) => {
            const newFood = req.body;
            console.log(newFood)
            const result = await requestCollection.insertOne(newFood);
            res.send(result);
        })

        // Read
        app.get('/food', async (req, res) => {
            const cursor = foodCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // Delete
        app.delete('/food/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.deleteOne(query);
            res.send(result);
        })

        // Get
        app.get('/food/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query);
            res.send(result);
        })

        // Update
        app.put('/food/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const upDatedFood = req.body;
            const product = {
                $set: {
                    foodName: upDatedFood.foodName,
                    foodQuantity: upDatedFood.foodQuantity,
                    pickupLocation: upDatedFood.pickupLocation,
                    expiredDate: upDatedFood.expiredDate,
                    additionalNotes: upDatedFood.additionalNotes,
                    foodStatus: upDatedFood.foodStatus,
                    userName: upDatedFood.userName,
                    userEmail: upDatedFood.userEmail,
                    userImage: upDatedFood.userImage,
                    foodImage: upDatedFood.foodImage

                }
            }
            const result = await foodCollection.updateOne(filter, product, options);
            res.send(result);
        })

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Hello World!!!");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})