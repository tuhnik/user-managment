const express = require('express');
const fs = require('fs')
const app = express();
const port = 5000;
const cors = require('cors');
const api = require('./routes');
const md = require('markdown-it')({typographer:  true});

let mddocs = fs.readFileSync(__dirname + "/README.md", "utf8")
let htmldocs = md.render(mddocs);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res)=>{
    res.send(htmldocs)
})
app.use('/api', api);

app.listen(port, () => console.log(`Back-end running at ${port}`));
