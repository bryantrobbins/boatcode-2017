// Create WebSocket connection.

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
$(document).ready(function() {
    $("#button").click(function() {
        $('#results').html('')
        new Spinner().spin($('#results')[0])
        var request = { messageType: 'jobSubmit'}
        client.getSocket().send(JSON.stringify(request));
    });
});

// Listen for messages
console.log(client);

client.getSocket().addEventListener('message', function (event) {
    var message = JSON.parse(event.data)
    switch(message.messageType) {
        case 'jobResult':
            $("#results").html(message.body);
            break;
        default:
            console.log("Unknown message of type " + message.messageType + " received from server");
    }    
});
