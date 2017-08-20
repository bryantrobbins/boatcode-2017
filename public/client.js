var newClient = function newClient() {
    var socket;
    var clientId;
    
    return {
        getSocket: function getSocket() {
            if(!socket) {
                socket = new WebSocket(`ws://${location.host}`);
            }
            return socket;
        },
        getClientId: function getClientId() {
            return clientId;
        },
        setClientId: function setClientId(newClientId) {
            clientId = newClientId;
        }
    };
};

const client = newClient();
function buttonClickHandler() {
    var resultsElem = document.getElementById('jobResults');
    resultsElem.innerHTML = '';
    new Spinner().spin(resultsElem)
    var request = { messageType: 'jobSubmit'}
    client.getSocket().send(JSON.stringify(request));
    console.log("Job Submitted")
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('submitButton')
        .addEventListener('click', buttonClickHandler);
});

client.getSocket().addEventListener('message', function (event) {
    var message = JSON.parse(event.data)
    switch(message.messageType) {
        case 'jobResult':
            console.log("Receieved Results: " + message.body)
            document.getElementById('jobResults').innerHTML = message.body;
            console.log("Results Updated")
            break;
        default:
            console.log("Unknown message of type " + message.messageType + " received from server");
    }
});
