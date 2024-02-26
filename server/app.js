var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var path = require('path')

var app = express();

// write your logging code here
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.csv'), { flags: 'a' });

app.use(morgan(':user-agent|:date[iso]|:method|:url|:http-version|:status', { stream: accessLogStream }))

// write your code to respond "ok" here
app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    // converts CSV to JSON

    // Convert the data to String and split it in an array
    let csv = fs.readFileSync('./server/log.csv');
    const array = csv.toString().split("\n");
    let result = [];
    // The array[0] contains all the header columns so we store them in headers array
    let headers = array[0].split("|");
    // Since headers are separated, we need to traverse remaining n-1 rows.
    for (let i = 1; i < array.length - 1; i++) {
        let obj = {}    
        // Split the string using pipe delimiter | and store the values in a properties array
        let properties = array[i].split("|")
        console.log(`array[${i}] = ${array[i]}`)
        for (let j in headers) {
            obj[headers[j]] = properties[j];
            console.log(`obj[${headers[j]}] = ${obj[headers[j]]}`);
            //console.log(`obj is ${obj}`)
    }
        // Add the generated object to our result array
        result.push(obj);
        //console.log(`result is ${result}`)
    }

    //let json = JSON.stringify(result);
    //console.log(`json is ${json}`);
    res.status(200).json(result);
    let json = JSON.stringify(result);
    fs.writeFileSync('output.json', json);
});

module.exports = app;
