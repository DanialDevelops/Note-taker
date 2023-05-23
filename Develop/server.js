const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        console.log(data)
        return res.json(JSON.parse(data))
    })
});

app.post('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if(err){
            console.log(err)
        }

        const notes = JSON.parse(data)

        const newNotes ={
            id: uuidv4(),
            title: req.body.title,
            text: req.body.text,
        }

        console.log('New Note:', newNotes);

        notes.push(newNotes)

        fs.writeFile('db/db.json', JSON.stringify(notes),'utf8', (err) => {
            if(err){
                console.log(err)
                return res.status(500).json({ error: 'Failed to save the note.' });
            }

            res.json(notes);
        })

    })
});

app.get('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to read notes from database.' });
        }

        const notes = JSON.parse(data);
        const note = notes.find((note) => note.id === noteId);

        if (!note) {
            return res.status(404).json({ error: 'Note not found.' });
        }

        res.json(note);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });





