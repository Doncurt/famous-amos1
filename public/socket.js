var socket = io.connect();

socket.on('status', function (data) {
    $(".status").text("Status: " + data.status);
});
