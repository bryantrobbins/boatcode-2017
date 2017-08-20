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
        }
    };
};

const client = newClient();
function buttonClickHandler() {
    var resultsElem = document.getElementById('jobResults');
    resultsElem.innerHTML = '';
    var selectedColor = document.getElementById('colorpicker').value
    new Spinner().spin(resultsElem);
    const jobInfo = {
        color: selectedColor
    };
    client.submitJob(jobInfo);
    console.log("Job Submitted");
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('submitButton')
        .addEventListener('click', buttonClickHandler);
});

console.log('Registering callback')
client.listen('jobResult', function(body) {
    console.log("Receieved Results: " + body);
    document.getElementById('jobResults').innerHTML = body;
    console.log("Results Updated");
});