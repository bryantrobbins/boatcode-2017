const express = require('express')
const app = express()
const path = require('path');

app.get('/health', function (req, res) {
  res.send('UP');
});

app.get('/svg', function (req, res) {
  res.send('<svg width="300" height="200"> <rect width="100%" height="100%" fill="blue" /></svg>')
});

app.listen(3000, function () {
  console.log('SVG App listening on port 3000')
})

app.use('/', express.static(path.join(__dirname, 'public')))
