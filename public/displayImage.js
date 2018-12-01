
$(document).ready(function () {
    // bind 'myForm' and provide a simple callback function 
    $('#myForm').ajaxForm({
        url: '/upload', // or whatever
        success: function (response) {
            alert("The server says: " + response);
        }
    });
});