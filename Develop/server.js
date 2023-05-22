const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

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

        const userId = uuid;

        const newNotes ={
            id: userId,
            title: req.body.title,
            text: req.body.text,
        }

        notes.push(newNotes)

        fs.writeFile('db/db.json', 'utf8', (err) => {
            if(err){
                console.log(err)
                return res.status(500).json({ error: 'Failed to save the note.' });
            }

            res.json(newNote);
        })

    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });



//app.delete('/api/notes/:id', (req, res) => {
    
//});

