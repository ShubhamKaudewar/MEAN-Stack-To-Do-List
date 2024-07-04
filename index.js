const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");


const TodoTask = require("./models/TodoTask");

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

dotenv.config();
mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("Connected to db!");
    app.listen(3212, () => console.log("Server Up and running"));
});

// View engine configuration`git 
app.set("view engine", "ejs");

// Get method
app.get("/", async (req, res) => {
    try {
        const tasks = await TodoTask.find({});
        res.render("todo.ejs", { todoTasks: tasks });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});


// POST method
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });

    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE
app.route("/edit/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        try {
            const tasks = await TodoTask.find({});
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        } catch (err) {
            console.error(err);
            res.status(500).send("An error occurred");
        }
    })
    .post(async (req, res) => {
        const id = req.params.id;
        try {
            await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("An error occurred");
        }
    });

//DELETE
app.route("/remove/:id").get(async (req, res) => {
    const id = req.params.id;
    try {
        await TodoTask.findByIdAndDelete(id);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});


app.listen(process.env.PORT || 3000, () => console.log("Server Up and running"));
