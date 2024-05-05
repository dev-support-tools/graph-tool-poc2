import express from "express";
import fs from "fs";

const app = express();
const port = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/api/file/list", (req, res) => {
  // dataディレクトリのファイル一覧を取得
  console.log('get file list');
  const files = fs.readdirSync('data');
  res.send(files);
});

app.post("/api/data/save", (req, res) => {
    const data = req.body;
    console.log(req.body);
    const fileName = req.body.fileName;
    // jsonファイルに保存
    fs.writeFileSync(`data/${fileName}`, JSON.stringify(data));
    res.send({});
});

app.post("/api/data/load", (req, res) => {
  console.log('load data');
  const fileName = req.body.fileName;
  // jsonファイルから読み込み
  const data = fs.readFileSync(`data/${fileName}`);
  res.send(JSON.parse(data));
});

// static content
app.use(express.static(__dirname + '/../graph-tool-poc2/dist/graph-tool-poc2'));

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
});