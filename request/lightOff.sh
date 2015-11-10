var request = require('request');

request('http://localhost:3030/serialCmd?cmd=%5bsl0%5d', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log(body); // Show the HTML for the Modulus homepage.
    }
});
