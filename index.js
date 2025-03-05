const express = require('express');
const path = require('path');
const app = express();

app.use('/', express.static(path.join(__dirname, 'public/Homepage')));
app.use('/Linktree', express.static(path.join(__dirname, 'public/Linktree')));

const PORT = 6969;
app.listen(PORT, () => {
    console.log(`Server läuft unter: http://localhost:${PORT}/`);
});
