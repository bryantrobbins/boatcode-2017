var newClient = function newClient() {
    const socket = new WebSocket(`ws://${location.host}`);
    const callbacks = { };
    
    socket.addEventListener('message', function (event) {
        var message = JSON.parse(event.data);
        if (message.messageType in getCallbacks()) {
            callbacks[message.messageType](message.body);
        } else {
            console.log(`Unknown message type ${message.messageType} received from server`);
        }
    });
    
    function getCallbacks() {
        return callbacks;
    }

    var clientId;
    var resultsVersion = -1;
    
    return {
        getSocket: function () {
            return socket;
        },
        getCallbacks: function() {
            return callbacks;
        },
        submitJob: function(jobInfo) {
            console.log("Submitting job");
            this.send({
                messageType: 'jobSubmit',
                body: jobInfo
            });
        },
        send: function(obj) {
            this.getSocket().send(JSON.stringify(obj));
        },
        listen: function(messageType, callback) {
            callbacks[messageType] = callback;
        },
        getClientId: function () {
            return clientId;
        },
        setClientId: function (newClientId) {
            clientId = newClientId;
        },
        getResultsVersion: function() {
            return resultsVersion;
        },
        setResultsVersion(newVersion) {
            resultsVersion = newVersion;
        }
    };
};

const client = newClient();
function buttonClickHandler() {
    var resultsElem = document.getElementById('jobResults');
    resultsElem.innerHTML = '';
    var selectedColor = document.getElementById('colorpicker').value;
    new Spinner().spin(resultsElem);
    const jobInfo = {
        clientId: client.getClientId(),
        color: selectedColor
    };
    client.submitJob(jobInfo);
    console.log("Job Submitted");
}

document.addEventListener("DOMContentLoaded", function() {
    // Add click handler for submit button
    var submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', buttonClickHandler);
});

client.listen('jobResult', function(body) {
    if(body.version > client.getResultsVersion()) {
        document.getElementById('jobResults').innerHTML = body.svg;
        client.setResultsVersion(body.version);
        console.log("Results Updated");
    }
});

client.listen('socketReady', function(body) {
    client.setClientId(body.clientId);
    console.log("Socket ready");
    document.getElementById('submitButton').disabled = false;
});