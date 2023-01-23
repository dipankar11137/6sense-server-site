const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.09jmf63.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // console.log("database connect");
    const appleProductsCollection = client
      .db("city-electronics")
      .collection("apple-products");
    const appleBuyProductsCollection = client
      .db("city-electronics")
      .collection("apple-buy-products");
    const reviewCollection = client
      .db("city-electronics")
      .collection("add-review");
    const taskUserCollection = client
      .db("city-electronics")
      .collection("task-user");

    // AUth JWT
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

    app.get("/appleProducts", async (req, res) => {
      const query = {};
      const cursor = appleProductsCollection.find(query);
      const mainProducts = await cursor.toArray();
      res.send(mainProducts);
    });

    app.get("/appleProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await appleProductsCollection.findOne(query);
      res.send(products);
    });
    // Update and Delivery
    app.put("/appleProducts/:id", async (req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateQuantity.quantity,
        },
      };
      const result = await appleProductsCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    // Post apple Products
    app.post("/appleProducts", async (req, res) => {
      const newProduct = req.body;
      const result = await appleProductsCollection.insertOne(newProduct);
      res.send(result);
    });
    // Buy Apple Product
    app.post("/appleBuyProducts", async (req, res) => {
      // console.log("hii");
      const newProduct = req.body;
      const result = await appleBuyProductsCollection.insertOne(newProduct);
      res.send(result);
    });
    // Delete Apple Product
    app.delete("/appleProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await appleProductsCollection.deleteOne(query);
      res.send(result);
    });
    // Delete buy products
    app.delete("/appleBuyProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await appleBuyProductsCollection.deleteOne(query);
      res.send(result);
    });
    // apple get buy products
    app.get("/appleBuyProducts", async (req, res) => {
      const query = {};
      const cursor = appleBuyProductsCollection.find(query);
      const mainProducts = await cursor.toArray();
      res.send(mainProducts);
    });
    // get item identify by email
    app.get("/appleBuyProductsEmail/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = appleBuyProductsCollection.find(query);
      const buyItems = await cursor.toArray();
      res.send(buyItems);
    });

    //                Review Services
    // Add Review
    app.post("/addReview", async (req, res) => {
      const newProduct = req.body;
      const result = await reviewCollection.insertOne(newProduct);
      res.send(result);
    });
    app.get("/showReview", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });
    // Task 6sense
    app.post("/addUser", async (req, res) => {
      const newProduct = req.body;
      const result = await taskUserCollection.insertOne(newProduct);
      res.send(result);
    });
    app.get("/showUser", async (req, res) => {
      const query = {};
      const cursor = taskUserCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Dipu Server");
});

app.listen(port, () => {
  console.log("Dipu server is running ");
});
