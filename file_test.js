
var fs = require('fs');

// var g_data = fs.readFile('./entity_sample.json', 'utf8', function(error, data){
//     // console.log('파일 로딩 실패'+ error);    
//     // console.log('data:'+ data);    
// });


var data = fs.readFileSync('./entity_sample.json', 'utf8');

var em = require('./EntityModel.js');

var i = new em.EntityModel();
i.test();

i.register(data);


console.log('i.entities[0].name:' + i.entities[0].name);
console.log('i.entities[0].items[0].name:' + i.entities[0].items[0].name);
console.log('i.entities.length:' + i.entities.length);
// console.log('data:' + data);

console.log('파일 로딩 테스트.');