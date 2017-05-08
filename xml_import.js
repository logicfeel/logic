
var fs = require('fs');
// var $ = require('jquery');


var xml2json = require("node-xml2json");

// var g_data = fs.readFile('./entity_sample.json', 'utf8', function(error, data){
//     // console.log('파일 로딩 실패'+ error);    
//     // console.log('data:'+ data);    
// });

// json 변환 테스트
// var strXML = fs.readFileSync('./db_import.xml', 'utf8');


// var strXML = fs.readFileSync('./db_import.xml', 'utf8');


var strJSON = fs.readFileSync('./e_Model.json', 'utf8');
var strJSON_e = fs.readFileSync('./e_Entity.json', 'utf8');
var strJSON_s = fs.readFileSync('./e_SP.json', 'utf8');
var strJSON_c = fs.readFileSync('./e_Code.json', 'utf8');
var strJSON_x = fs.readFileSync('./e_Context.json', 'utf8');

var eModel = require('./EntityModel.js');

var em = new eModel.EntityModel();

var c = new eModel.Context(em);

em.readEntityModel(strJSON);         // entityModel (전체) 읽기 테스트

em.registerEntity(strJSON_e);        // entity 추가 등록 테스트
em.registerProcedure(strJSON_s);     // entity 추가 등록 테스트
em.registerCode(strJSON_c);          // entity 추가 등록 테스트

c.readContext(strJSON_x)            // Context 읽기 테스트

var compileContext = c.getContext();

// c.load(precontext);
// c.setEntity(entity);

// var context = c.getContext();


// var json     = xml2json.parser(strXML);

// var json = $.xml2json(strXML);
// var json = parser(strXML);

var string  = JSON.stringify(compileContext, null, 4);

fs.writeFileSync('./e_Parsing.json', string, 'utf8');


// json 변환 테스트
//fs.writeFileSync('./eModel.json', string, 'utf8');

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