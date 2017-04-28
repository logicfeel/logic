
var fs = require('fs');

// var g_data = fs.readFile('./entity_sample.json', 'utf8', function(error, data){
//     // console.log('파일 로딩 실패'+ error);    
//     // console.log('data:'+ data);    
// });

var precontext = fs.readFileSync('./context_sample.json', 'utf8');
var entity = fs.readFileSync('./entity_sample.json', 'utf8');


var em = require('./EntityModel.js');

var c = new em.Context();

c.load(precontext);
c.setEntity(entity);

var context = c.getContext();

var string  = JSON.stringify(context, null, 4);

// fs.writeFileSync('./context_obj2.json', context, 'utf8');

fs.writeFileSync('./context_obj.json', string, 'utf8');

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