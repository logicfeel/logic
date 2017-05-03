
var fs = require('fs');
// var $ = require('jquery');


var xml2json = require("node-xml2json");

// var g_data = fs.readFile('./entity_sample.json', 'utf8', function(error, data){
//     // console.log('파일 로딩 실패'+ error);    
//     // console.log('data:'+ data);    
// });

var strXML = fs.readFileSync('./db_import.xml', 'utf8');


// var em = require('./EntityModel.js');

// var c = new em.Context();

// c.load(precontext);
// c.setEntity(entity);

// var context = c.getContext();


var json     = xml2json.parser(strXML);

// var json = $.xml2json(strXML);
// var json = parser(strXML);

var string  = JSON.stringify(json, null, 4);

// fs.writeFileSync('./context_obj2.json', context, 'utf8');

fs.writeFileSync('./db_import.json', string, 'utf8');

/*
var i = new em.EntityModel();
i.test();

i.register(data);

i.entities[0].PK_list();

i.entities[0].notNull_list();
*/

// console.log('i.entities[0].name:' + i.entities[0].name);
// console.log('i.entities[0].items[0].name:' + i.entities[0].items[0].name);
// console.log('i.entities.length:' + i.entities.length);
// console.log('data:' + data);

console.log('파일 로딩 테스트.');