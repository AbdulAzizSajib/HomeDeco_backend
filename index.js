const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware to handle Cross-Origin Resource Sharing
app.use(cors());
// Parse incoming requests with JSON payloads
app.use(express.json());

const uri =
  "mongodb+srv://decoAdmin:2ZdHDG89BdBBG5nZ@cluster0.binqvht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    //!
    const productCollection = client.db("homeDeco").collection("resource");
    const cartCollection = client.db("homeDeco").collection("cart");
    const userCollection = client.db("homeDeco").collection("users");
    //! Get data from Server Database 1
    app.get("/products", async (req, res) => {
      const products = await productCollection.find().toArray();
      res.send(products);
    });
    //! Cart API - Post 2
    app.post("/cart", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });
    //! Cart API - GET 3
    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });
    //! Cart API - Delete 4
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    //! User API - POST 5
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const exitingUser = await userCollection.findOne(query);
      if (exitingUser) {
        return res.send({ message: "User Already Exits", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

//routes
app.get("/", (req, res) => {
  res.send("Welcome to the Server");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//2ZdHDG89BdBBG5nZ
//decoAdmin
