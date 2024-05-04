import express from "express";
import fs from "fs";

const app = express();
const port = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post("/api/data/save", (req, res) => {
    const data = req.body;
    // jsonファイルに保存
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.send({});
});

app.get("/api/data/load", (req, res) => {
    // jsonファイルから読み込み
    const data = fs.readFileSync('data.json');
    res.send(JSON.parse(data));
});

// static content
app.use(express.static(__dirname + '/../graph-tool-poc2/dist/graph-tool-poc2'));

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
});