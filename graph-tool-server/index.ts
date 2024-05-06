import express from "express";
import fs from "fs";


const app = express();
const port = 8000;

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

app.post("/api/opretion/capture", async (req, res) => {
  console.log('capture');
  const path = req.body.path;

  const response = await fetch("http://localhost:8080/api/capture.png", {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
    }});
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // pathがない場合は作成する
  if (!fs.existsSync(`data/${path}`)) {
    fs.mkdirSync(`data/${path}`);
  }

  // GUIDの生成
  const guid = uuidv4();
  const fileName = `${guid}.png`;

  // 画像ファイルを保存
  fs.writeFileSync(`data/${path}/${fileName}`, buffer);
  res.send({
    filename: fileName});
});

// 画像ファイルの削除
app.post("/api/operation/removeimage", (req, res) => {
  console.log(req.path);
  const path = req.body.path;
  const fileName = req.body.fileName
  const data = `data/${path}/${fileName}`;
  console.log(data);
  fs.rmSync(data);
  res.send({});
});

// 画像ファイルの取得
app.get("/api/images/:path/:fileName", (req, res) => {
  console.log(req.path);
  const path = req.params.path;
  const fileName = req.params.fileName
  const data = fs.readFileSync(`data/${path}/${fileName}`);
  res.send(data);
});


// static content
app.use(express.static(__dirname + '/../graph-tool-poc2/dist/graph-tool-poc2'));

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
