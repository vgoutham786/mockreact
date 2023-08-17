const express = require("express");
const app = express();
var cors = require('cors');
const connetToDb = require("./db");
const tripModel = require("./Model/trip.model");
app.use(cors())
app.use(express.json())

const port = +process.env.PORT || 8080

app.post("/", async (req, res) => {
    const obj = req.body
    try {
        await tripModel.insertMany([obj]);
        res.status(201).json({ msg: "Trip Saved Successfull" })
    } catch (error) {
        res.status(400).send({ err: error.message })
    }
})

app.get("/", async (req, res) => {
    let { sort, filter } = req.query
   let sval = 0
    let data = []
    try {
        if (sort != undefined && filter != undefined) {
            if (sort == "asc") {
                sval = 1
            } else {
                sval = -1
            }

            data = await tripModel.find({ destination: filter }).sort({ budgetPerPerson: sval })
        } else if (sort != undefined) {
            if (sort == "asc") {
                sval = 1
            } else {
                sval = -1
            }
            data = await tripModel.find().sort({ budgetPerPerson: sval })
        } else if (filter != undefined) {
            data = await tripModel.find({ destination: filter })
        } else {
            data = await tripModel.find();
        }


        res.status(201).json({ data: data })
    } catch (error) {
        res.status(400).send({ err: error.message })
    }
})
app.delete("/:id", async (req, res) => {
    const id = req.params.id
    try {
        let data = await tripModel.findByIdAndDelete(id);
        res.status(201).json({ msg: "Trip deleted Successfull" })
    } catch (error) {
        res.status(400).send({ err: error.message })
    }
})

app.listen(port, async () => {
    try {
        await connetToDb
        console.log("connected to db")
        console.log("server running ",port)
    } catch (error) {
        console.log(error)
    }
})
