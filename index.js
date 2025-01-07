const express = require('express');
const path = require('path');
const app = express();

app.use('/frutiger-aero-shoe', express.static(path.join(__dirname, 'public/Kunstprojekt')));
app.use('/', express.static(path.join(__dirname, 'public/Homepage')));

const PORT = 6969;
app.listen(PORT, () => {
    console.log(`Server läuft unter: http://localhost:${PORT}/frutiger-aero-shoe`);
});
