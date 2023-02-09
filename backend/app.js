const express = require("express");
const app = express();
const dotenv = require("dotenv")
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const path = require("path")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config()

connectDB();
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/notes', noteRoutes)

// ----deployment----

__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    })
}
else {
    app.get("/", (req, res) => {
        res.send("API is running..")
    })
}

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 9000
app.listen(port, () => {
    console.log("Hey App has started Listening")
})