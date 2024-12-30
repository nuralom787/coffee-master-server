const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// Middleware.
app.use(cors());
app.use(express.json());

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;


// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.kwi75.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.kwi75.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Database.
        const coffeeCollection = client.db("coffeeDB").collection("coffee");
        const usersCollection = client.db("coffeeDB").collection("users");


        // ----------------------------
        // Coffees Related APIS.
        // ----------------------------



        // Get All Coffee.
        app.get("/coffee", async (req, res) => {
            const result = await coffeeCollection.find().toArray();
            res.send(result);
        })


        // Get Single Coffee.
        app.get("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })


        // Post New Coffee.
        app.post("/coffee", async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        });


        // Update An Coffee Details.
        app.put("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const updatedCoffee = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    supplier: updatedCoffee.supplier,
                    category: updatedCoffee.category,
                    chef: updatedCoffee.chef,
                    taste: updatedCoffee.taste,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        })


        // Delete A Coffee.
        app.delete("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        });



        // -----------------------------------
        // Users Related APIS
        // -----------------------------------


        // Get All Users.
        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });


        // Post User Details.
        app.post("/users", async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        });


        // Patch A User.
        app.patch("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updatedDoc = {
                $set: {
                    lastSignIn: user.lastSignIn
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });


        // Delete A User.
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Coffee Server Running!!")
});


app.listen(port, () => {
    console.log("Coffee Server Listening on port: ", port);
});