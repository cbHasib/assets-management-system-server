const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Assets Management Server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pkcv1zd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const db = client.db(`${process.env.DB_NAME}`);
    const assets = db.collection("assets");

    // Get all assets
    app.get("/assets", async (req, res) => {
      try {
        const results = await assets.find({}).sort({ _id: -1 }).toArray();
        if (results.length > 0) {
          res.send({
            success: true,
            data: results,
          });
        } else {
          res.send({
            success: false,
            error: "No assets found",
          });
        }
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });

    // Get asset by id
    app.get("/assets/:id", async (req, res) => {
      try {
        const results = await assets.findOne({
          _id: ObjectId(req.params.id),
        });
        if (results) {
          res.send({
            success: true,
            data: results,
          });
        } else {
          res.send({
            success: false,
            error: "No asset found",
          });
        }
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });

    // Add asset
    app.post("/assets", async (req, res) => {
      try {
        const result = await assets.insertOne(req.body);
        if (result.acknowledged && result.insertedId) {
          res.send({
            success: true,
            message: "Asset added successfully",
          });
        } else {
          res.send({
            success: false,
            error: "Asset not added",
          });
        }
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });

    // Delete asset
    app.delete("/assets/:id", async (req, res) => {
      try {
        const result = await assets.deleteOne({
          _id: ObjectId(req.params.id),
        });
        if (result.acknowledged && result.deletedCount) {
          res.send({
            success: true,
            message: "Asset deleted successfully",
          });
        } else {
          res.send({
            success: false,
            error: "Asset not deleted",
          });
        }
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
