const express = require('express')
const path = require('path');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const app = express();
const fs = require('fs-extra');
const shell = require('shelljs');

function runJob(jobId, callback) {
    var outputDir = path.join(__dirname, 'output');
    var jobScript = path.join(__dirname, 'r-scripts', 'job.R');
    var outputFile = `${outputDir}/${jobId}.svg`;
    shell.exec(`Rscript ${jobScript} ${outputFile}`);
    withFile(outputFile, callback);
}

function withFile(filePath, callback) {
    fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
        if(err) {
            console.log(err);
            return;
        }
        callback(data);
    });
}

app.get('/health', function (req, res) {
  res.send('UP');
});

app.use('/', express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    console.log("Received client connection");
//  const location = url.parse(req.url, true);
//  // You might use location.query.access_token to authenticate or share sessions
//  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        var messageObj = JSON.parse(message)
        switch(messageObj.messageType) {
            case 'jobSubmit':
                console.log("Running R job");
                runJob('test1', function(svg) {
                    var response = { messageType: 'jobResult', body: svg }
                    ws.send(JSON.stringify(response));
                });
                break;
            default:
                console.log('Unknown message type ' + messageObj.messageType + ' received from client')
        }
    });
});

server.listen(3000, function listening() {
  console.log('SVG App listening on %d', server.address().port);
});
