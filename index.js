const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        // Create
        app.post('/food', async (req, res) => {
            const newFood = req.body;
            console.log(newFood)
            const result = await foodCollection.insertOne(newFood);
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