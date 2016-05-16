var xmlvp2json = require("../index.js");
var fs = require('fs');
fs.readFile('./project.xml', function (err,data) {
    if (err) {
        return console.log(err);
    }
    classe = xmlvp2json(data,true)
  //  console.log(JSON.stringify(classe,null, "\t"));

});
