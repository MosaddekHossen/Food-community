const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
// app.use(cors());
app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:5174', 'http://utopian-goat.surge.shurplussaver.surge.sh'],
        credentials: true,
    }),
);

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
        const requestCollection = client.db('foodDB').collection('reQu');

        // Create Food
        app.post('/food', async (req, res) => {
            const newFood = req.body;
            // console.log(newFood)
            const result = await foodCollection.insertOne(newFood);
            res.send(result);
        })

        // Read 
        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // User Email
        app.get('/foods/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const cursor = foodCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // Read 2
        app.get('/food', async (req, res) => {
            // Sort
            const filter = req.query;
            // console.log(filter.search);
            query = {
                // foodName: { $regex: filter.search, $options: 'i' }
                // foodName: { $regex: String(filter.search || ""), $options: 'i' }
                foodName: { $regex: String(filter.search), $options: 'i' }
            };
            const options = {
                sort: {
                    expiredDate: filter.sort === 'true' ? 1 : -1
                }
            }
            const cursor = foodCollection.find(query, options);
            // const cursor = foodCollection.find();
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

        // Get Update
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

        // Create Request
        app.post('/request', async (req, res) => {
            const newFood = req.body;
            // console.log(newFood)
            const result = await requestCollection.insertOne(newFood);
            res.send(result);
        })

        // User Email
        app.get('/request/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const cursor = requestCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // Read Manage route
        app.get('/requests/:id', async (req, res) => {
            const id = req.params.id;
            const query = { id: id }
            const cursor = requestCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        // Manage deliver 
        app.patch('/request/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const upDatedFood = {
                $set: {
                    foodStatus: "Delivered"
                }
            }
            const result = await requestCollection.updateOne(filter, upDatedFood);
            res.send(result);
        })

        // Delete 
        app.delete('/request/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await requestCollection.deleteOne(query);
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