const express = require("express");
const path = require("path");
const uuid = require("./uuid"); //assign random ID to user.
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001; //using heroku  port found in documentation.


app.use(express.json());
app.use(express.urlencoded({ extended: true })); //using this  our Url can be translated to a string type.
app.use(express.static("public"));


app.get("/notes", (req, res) => //from our JS file, when we click the button, we will prompt them with our new HTML file.
res.sendFile(path.join(__dirname, "./public/notes.html")) 

);

app.get("/api/notes", (req, res) => { //APi for Notes, when called we show our notes from our DB file.
console.info(`${req.method} request for Notes`)
const db = JSON.parse(fs.readFileSync("./db/db.json"));
res.json(db);

});


app.post("/api/notes", (req, res) => { //we create a new note, and post
console.info(`${req.method} request push note`);
const { title, text } = req.body;
const db = JSON.parse(fs.readFileSync("./db/db.json"));
console.log(db);
if (title && text) {
    const newNote = {
        title,
        text,
        id: uuid()
    };
    db.push(newNote)
    const newNoteStringify = JSON.stringify(db)
    fs.writeFileSync("./db/db.json", newNoteStringify)
    res.json(db);
} else {
    res.status(400).send("Please include title and text - both are required fields.")
}
});

app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;
    console.log(noteId);
    const db = JSON.parse(fs.readFileSync("./db/db.json"))
    for (let i = 0; i < db.length; i++) {
        if (noteId === db[i].id) {
            db.splice(i, 1);
            fs.writeFileSync("./db/db.json", JSON.stringify(db))
        }
    }
    res.json(db);
})

app.listen(PORT, () =>
console.log(`Example app listening at http://localhost:${PORT}`));