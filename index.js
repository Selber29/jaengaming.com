const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

const VIDEO_DIR = path.join(__dirname, 'data', 'youtok', 'vids');
const THUMB_DIR = path.join(__dirname, 'data', 'youtok', 'thumbs');
app.use('/thumbs', express.static(THUMB_DIR));

const DATA_FILE = path.join(__dirname, 'data', 'youtok', 'data.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let videoData = {};
if (fs.existsSync(DATA_FILE)) {
  try {
    videoData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    console.error('Fehler beim Laden der JSON-Daten:', err);
  }
}

app.use('/vids', express.static(VIDEO_DIR, {
  setHeaders: function (res, filePath) {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    }
  }
}));


app.get('/videos', (req, res) => {
  if (!videoData.videos || videoData.videos.length === 0) {
    return res.status(404).json({ message: 'Keine Videos gefunden' });
  }
  res.json(videoData.videos);
});

app.get('/video/:id', (req, res) => {
  const videoId = req.params.id;
  const video = videoData.videos.find(v => v.id === videoId);
  if (!video) return res.status(404).json({ message: 'Video nicht gefunden' });
  res.json(video);
});

app.get('/youtok/watch', (req, res) => {
  const videoId = req.query.video;
  if (!videoId) {
    return res.status(400).send('Fehler: Kein Video angegeben.');
  }

  const videoData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const video = videoData.videos.find(v => v.id === videoId);

  if (!video) {
    return res.status(404).send('Video nicht gefunden.');
  }

  res.send(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${video.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #181818;
            color: white;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #1c1c1c;
            border-radius: 8px;
          }
          h1 {
            text-align: center;
          }
          video {
            display: block;
            width: 100%;
            max-width: 800px;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.8);
          }
          .thumbnail {
            width: 200px;
            margin: 20px auto;
            display: block;
            border-radius: 8px;
          }
          .description {
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
          }
          .comments {
            margin-top: 20px;
          }
          .comment {
            background-color: #2a2a2a;
            padding: 10px;
            margin: 5px 0;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <a href="/youtok" style="color: white; text-decoration: none; padding: 10px; background-color:rgb(255, 0, 119); border-radius: 5px; display: inline-block; margin: 20px;">Go Bacc</a>
        <div class="container">
          <h1>${video.title}</h1>
          <video controls autoplay>
            <source src="/vids/${video.id}" type="video/mp4">
            Dein Browser unterstützt das Video-Tag nicht.
          </video>
          <p>Posted by: ${video.youtuber}</p>
          <h2>${video.views} views</h2>
          <div class="description">
            <p>${video.description}</p>
          </div>

          <p>${video.likes} Likes</p>
          <p>${video.dislikes} Dislikes</p>

          <div class="comments">
            <h3>Kommentare:</h3>
            <ul>
              ${video.comments.length === 0 ? '<li>Keine Kommentare vorhanden.</li>' : ''}
              ${video.comments.map(comment => `<li class="comment">${comment}</li>`).join('')}
            </ul>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.get('/youtok', (req, res) => {
  const videoData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  
  let videoCards = videoData.videos.map(video => {
    return `
      <div class="video-card">
        <a href="/youtok/watch?video=${video.id}">
          <img src="/thumbs/${video.thumbnail}" class="video-thumbnail" alt="${video.title}">
        </a>
        <div class="video-info">
          <h3>${video.title}</h3>
          <p>${video.description}</p>
        </div>
      </div>
    `;
  }).join('');

  res.send(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Video Übersicht</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #181818;
            color: white;
            margin: 0;
            padding: 0;
          }
          .container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          .video-card {
            background-color: #1c1c1c;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.8);
          }
          .video-thumbnail {
            width: 100%;
            height: 140px;
            object-fit: cover;
          }
          .video-info {
            padding: 10px;
            color: white;
          }
          .video-info h3 {
            font-size: 18px;
            margin: 10px 0;
          }
          .video-info p {
            font-size: 14px;
            color: #bbb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${videoCards}
        </div>
      </body>
    </html>
  `);
});

app.use('/', express.static(path.join(__dirname, 'public/Homepage')));
app.use('/Linktree', express.static(path.join(__dirname, 'public/Linktree')));
app.use('/magnum', express.static(path.join(__dirname, 'public/Magnum')));

app.listen(6969, () => {
  console.log(`Server läuft unter: http://localhost:6969/`);
});
