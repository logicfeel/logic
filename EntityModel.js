(function(global) {
'use strict';

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Context() {
    
    var _entity_version     = "1.0.0"

    this._syntax      = [
        'entity_items', 
        'entity_model', 
        'entity_model_sp',
        'entity_sp', 
        'entity_pk_list', 
        'entity_fk_list', 
        'entity_notnull_list',
        'entity_null_list', 
        'entity_valid', 
        'entity_code'
    ];
    this._preContext         = null;
    this._entityModel        = new EntityModel();
}
(function() {

    // 배열 syntax 에서 숫자만 추출함 없을시 0 리턴
    function _getArrayNumber(pString) {
        
        var curser_st   = 0;
        var curser_end  = 0;
        var number      = null;

        curser_st   = pString.indexOf('[');
        curser_end  = pString.indexOf(']', curser_st);

        if (curser_st > 0) {
            number = pString.substring(curser_st + 1, curser_end);
        } else {
            number = "0";
        }
        number = Number(number);
        if (typeof number !== "number") {
            throw new Error('number type 오류 :');
            return null;
        }
        
        return number;
    }

    // 파싱 처리 (배열, 개열, 일반값)
    Context.prototype._parse = function(pContext) {
        
        var context     = {};
        
        for (var prop in pContext) {
            if (pContext.hasOwnProperty(prop)) {
                
                // 값이 배열인 경우
                if (pContext[prop] instanceof Array) {  
                    for (var i = 0; i < pContext[prop].length; i++) {
                        context[prop] = this._parse(pContext[prop][i]);
                    }
                    
                // 값이 객체인 경우    
                } else if (pContext[prop] instanceof Object) {
                    context[prop] = this._parse(pContext[prop]);
                
                // 일반 값인 경우
                } else {

                    function checkSyntax(value, index, array){
                        return prop.indexOf(value) > -1 ? true : false;
                    }

                    if (this._syntax.some(checkSyntax)) {
                        context = this._parseSyntax(prop, pContext[prop]);
                    } else {
                        context[prop] = pContext[prop];
                    }

                }
            }
        }

        return context;
    };

    // Syntax 처리
    Context.prototype._parseSyntax = function(pProp, pPropValue) {
        
        var entityIdx   = 0;
        var entity      = null;
        var array       = [];
        var context     = null;
        var syntax      = "";
        var curser      = -1;

        curser = pProp.indexOf('[');
        if (curser > -1) {
            syntax = pProp.substring(0, curser);
        } else {
            syntax = pProp;
        }

        entityIdx = _getArrayNumber(pProp);
        entity = this._entityModel.entities[entityIdx];

        switch (syntax) {
            case "entity_items":
                context = entity.getAttrObject(pPropValue);
                break;
            case "entity_model":
                context = entity.getModelObject(pPropValue);
                break;                
            case "entity_model_sp":
                context = entity.getModelSPObject(pPropValue);
                break;
            case "entity_sp":
                context = entityModel.getProcedureObject(pPropValue);
                break;
            case "entity_code":
                context = entityModel.getCodeObject(pPropValue);
                break;
            case "entity_pk_list":
                context = entity.getFunc('pk_list', pPropValue);
                break;
            case "entity_fk_list":
                context = entity.getFunc('fk_list', pPropValue);
                break;
            case "entity_notnull_list":
                context = entity.getFunc('notnull_list', pPropValue);
                break;
            case "entity_null_list":
                context = entity.getFunc('null_list', pPropValue);
                break;
            case "entity_valid":
                context = entity.getFunc('valid', pPropValue);
                break;
            default:
                context = {};
                break;
        }            
        return context;
    };
    
    Context.prototype._convertStrJSON = function(pStrJSON) {

        var jsonObj     = null;

        if (typeof pStrJSON === "string") {
            jsonObj = JSON.parse(pStrJSON);
        } else if (typeof pStrJSON === "object") {
            jsonObj = pStrJSON;
        }
        
        if (typeof jsonObj !== "object") {
            console.log('타입 오류 : ' + pStrJSON);
        }
        return jsonObj;
    }


    // json 파일 로드
    Context.prototype.readContext = function(pStrJSON) {

        var obj = null;

        obj = this._convertStrJSON(pStrJSON);

        if (typeof obj.pages === "undefined") {
            console.log('pages 필수 값 오류');
        }

        this._preContext = obj;
    };

    Context.prototype.readEntityModel = function(pStrJSON) {

        var obj = null;

        obj = this._convertStrJSON(pStrJSON);

        if (typeof obj.entity_model === "undefined") {
            console.log('entity_model 필수 값 오류');
        }
        this._entityModel.readEntityModel(pStrJSON);
    };

    Context.prototype.registerEntity = function(pStrJSON) {

        var obj = null;

        obj = this._convertStrJSON(pStrJSON);

        if (typeof obj.entity_model === "undefined") {
            console.log('entity_model 필수 값 오류');
        }
        this._entityModel.readEntityModel(pStrJSON);
    };

    Context.prototype.registerProcedure = function(pStrJSON) {

        var obj = null;

        obj = this._convertStrJSON(pStrJSON);

        if (typeof obj.procedure === "undefined") {
            console.log('procedure 필수 값 오류');
        }
        this._entityModel.createProcedureObject(pStrJSON);
    };

    Context.prototype.registerCode = function(pStrJSON) {

        var obj = null;

        obj = this._convertStrJSON(pStrJSON);

        if (typeof obj.code === "undefined") {
            console.log('code 필수 값 오류');
        }
        this._entityModel.createCodeObject(pStrJSON);
    };

    // 컨텍스트 얻기 (컨텍스트 + 엔티티)
    Context.prototype.getContext = function() {
        return this._parse(this._preContext);
    };

    Context.prototype.getEntityModel = function(pNamespace) {
        return this._parse(this._preContext);
    };

    // // 컨텍스트에 엔티티 주입
    // Context.prototype.setEntity = function(pJSON) {
    //     this._entityModel.register(pJSON);
    // };
}());
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function EntityModel() {
    
    var _version        = "1.0.0"

    this.entities       = [];
    this.proceduces     = [];
    this.codes          = [];
    this.temp           = null;
}
(function() {

    // 객체 중복 검사
    EntityModel.prototype._overlap = function(pThisArray, pName, pNamesapce) {
        for (var i = 0; i < pThisArray.length; i++) {
            if (pThisArray.name === pName && pThisArray.namespace === pNamesapce) return true;
        }
        return false;
    }

    EntityModel.prototype.createEntityModelObject = function(pJSON) {
        
        var entity          = null;
        var attr            = null;
        var model           = null;
        // var proceduce   = null;
        var hashCode        = null;
        var param           = null;
        var prop            = {};
        var entity_model    = null;

        if (!pJSON.entity_model) {
            throw new Error('entity_model 최상위 필수값 없음 오류 :');
            return null;
        }
        entity_model = pJSON.entity_model;

        if (entity_model.procedure) {
            this.createProcedureObject(entity_model.procedure);
        }

        if (entity_model.code) {
            this.createCodeObject(entity_model.code);
        }

        if (entity_model.entity) {
            this.createEntityObject(entity_model.entity);
        }
        return entity;
    };

    EntityModel.prototype.createProcedureObject = function(pJSON) {
        
        var proceduce   = null;
        
        if (!(pJSON instanceof Array)) pJSON = [pJSON];   // 배열삽입

        for (var i = 0; i < pJSON.length; i++) {
            if(!this._overlap(this.proceduces, pJSON[i].name, pJSON[i].namespace)) {
                proceduce = new Procedure(pJSON[i]);
                this.proceduces.push(proceduce);
            }
        }
    }

    EntityModel.prototype.createCodeObject = function(pJSON) {

        var code   = null;
        
        if (!(pJSON instanceof Array)) pJSON = [pJSON];   // 배열삽입

        for (var i = 0; i < pJSON.length; i++) {
            if(!this._overlap(this.codes, pJSON[i].name, pJSON[i].namespace)) {
                code = new HashCode(pJSON[i]);
                this.codes.push(code);
            }
        }
    }

    EntityModel.prototype.createEntityObject = function(pJSON) {
        
        var entity      = null;

        if (!(pJSON instanceof Array)) pJSON = [pJSON];   // 배열삽입

        for (var i = 0; i < pJSON.length; i++) {
            if(!this._overlap(this.entities, pJSON[i].name, pJSON[i].namespace)) {
                entity = new Entity(pJSON[i], this);
                if (entity) this.entities.push(entity);
            }
        }
    };

    // string 형태의 JSON 또는 객체
    EntityModel.prototype.readEntityModel = function(pStrJSON) {

        var jsonObj = null;

        if (typeof pStrJSON === "string") {
            jsonObj = JSON.parse(pStrJSON);
        } else if (typeof pStrJSON === "object") {
            jsonObj = pStrJSON;
        }
        
        if (typeof jsonObj !== "object") {
            console.log('타입 오류 : ' + pStrJSON);
        }

        if (typeof jsonObj.entity_model === "undefined") {
            console.log('entity_model 필수 값 오류');
        }
        this.createEntityModelObject(jsonObj);
        //this.entities.push(this.createEntityObject(jsonObj));
    }

    EntityModel.prototype.getEntity = function(pName, pNamespace) {
        
        if(!pNamespace) pNamespace = "";    // 초기값 

        for (var i = 0; this.entities.length; i++) {
            if (this.entities[i].name === pName &&
                this.entities[i].namespace === pNamespace) {
                return this.entities[i];
            }
        }
        return null;
    };

    EntityModel.prototype.getProcedure = function(pName, pNamespace) {
        
        if(!pNamespace) pNamespace = "";    // 초기값 

        for (var i = 0; i < this.proceduces.length; i++) {
            if (this.proceduces[i].name === pName &&
                this.proceduces[i].namespace === pNamespace) {
                return this.proceduces[i];
            }
        }
        return null;
    };

    // { entity_code : "속성명" }
    // { entity_code : null } : [[]]  전체 이중 배열 리턴
    EntityModel.prototype.getCode = function(pName, pNamespace) {
        
        if(!pNamespace) pNamespace = "";    // 초기값 

        for (var i = 0; i < this.codes.length; i++) {
            if (this.codes[i].name === pName && 
                this.codes[i].namespace === pNamespace) {
                return this.codes[i];
            } 
        }
        return null;
    };


    // SP 객체 얻기 
    EntityModel.prototype.getEntityObject = function(pName, pNamespace) {
        
        var obj     = null;
        var entity      = null;

        if (pName !== null) {
            entity = this.getEntity(pName, pNamespace);
            if (entity) obj = entity.getObject();
        } else {
            obj = [];
            for (var i = 0; i < this.entities.length; i++) {
                if (this.entities[i]) {
                    obj = this.entities[i].getObject();
                    obj.push(obj);
                }
            }
        }
        return obj;
    };    

    // SP 객체 얻기 
    EntityModel.prototype.getProcedureObject = function(pName, pNamespace) {
        
        var obj         = null;
        var proceduce   = null;

        if (pName !== null) {
            proceduce = this.getProcedure(pName, pNamespace);
            if (proceduce) obj = proceduce.getObject();
        } else {            
            obj = [];
            for (var i = 0; i < this.proceduces.length; i++) {
                if (this.proceduces[i]) {
                    proceduce = this.proceduces[i].getObject();
                    obj.push(proceduce);
                }
            }
        }
        return obj;
    };    

    // HashCode 객체 얻기 
    EntityModel.prototype.getCodeObject = function(pName, pNamespace) {
        
        var obj         = null;
        var hashCode    = null;

        if (pName !== null) {
            hashCode = this.getCode(pName, pNamespace);
            if (hashCode) obj = hashCode.getObject();
        } else {
            obj = [];
            for (var i = 0; i < this.codes.length; i++) {
                if (this.codes[i]) {
                    hashCode = this.codes[i].getObject();
                    obj.push(hashCode);
                } 
            }
        }
        return obj;
    };
}());


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Entity(pProp, pOnwer) {

    var attr        = null;
    var sp          = null;
    var model       = null;

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 ||  
        typeof pProp.type !== "string" || pProp.type.length <= 0 ||
        !pOnwer) {
        throw new Error('name type 필수값 없음 오류 :');
        return null;
    }
    this._onwer     = pOnwer;
    this.name       = pProp.name;   // {필수}
    this.type       = pProp.type;   // {필수} TABLE | ABSTRACT
    this.namespace  = pProp.namespace ? pProp.namespace : "";
    this.title      = pProp.title ? pProp.title : "";
    this.items      = [];
    this.model      = [];
    this.sp         = [];

    if (typeof pProp.items !== "undefined") {

        if (!(pProp.items instanceof Array)) pProp.items = [pProp.items];   // 배열삽입

        for (var i = 0; i < pProp.items.length; i++) {
            if (pProp.items[i].name) {
                attr = new Attr(pProp.items[i]);
                this.items.push(attr);
            }
        }
    }

    // REVEW: 종속성 > Attr, Procedure
    if (typeof pProp.sp !== "undefined") {
        
        if (!(pProp.sp instanceof Array)) pProp.sp = [pProp.sp];            // 배열삽입
        
        for (var ii = 0; ii < pProp.sp.length; ii++) {
            if (pProp.sp[ii].name) {
                sp = this._onwer.getProcedure(pProp.sp[ii].name, pProp.sp[ii].namespace);    
                if (!sp) {
                    throw new Error('지정 sp 객체 없음 (register등록 확인!) 오류 sp:' + pProp.sp[i].name);
                    return null;
                }
                this.sp.push(sp);
            }
        }
    }

    // REVIEW: 종속성 > Attr, Procedure
    if (typeof pProp.model !== "undefined") {

        if (!(pProp.model instanceof Array)) pProp.model = [pProp.model];   // 배열삽입

        for (var ii = 0; ii < pProp.model.length; ii++) {
            if (pProp.model[ii].name) {
                model = new Model(pProp.model[ii], this);
                this.model.push(model);
            }
        }
    }    
}
(function() {

    // TODO: 전역 검토
    // 중복제거 배열 합침 :: 파괴형
    Entity.prototype._unionConcat = function(pArray, pTarget) {

        var union = true;

        if (pArray instanceof Array && pTarget instanceof Array) {
            for (var i = 0; i < pTarget.length; i++) {
                union = true;
                for (var ii = 0; ii < pArray.length; ii++) {
                    if (pTarget[i] === pArray[ii]) {
                        union = false;
                        break;
                    }
                }
                if (union) pArray.push(pTarget[i]);
            }
        }
        return pArray;
    };    

    // TODO: 전역 검토
    // 배열 빼기
    Entity.prototype._removeArray = function(pArray, pTarget) {

        if (pArray instanceof Array && pTarget instanceof Array) {
            for (var i = 0; i < pTarget.length; i++) {
                for (var ii = 0; ii < pArray.length; ii++) {
                    if (pTarget[i] === pArray[ii]) {
                        pArray.splice(ii, 1);
                    }
                }
            }
        }
        return pArray;
    };    


    // { entity_pk_list : null }
    Entity.prototype.PK_list = function(pIsDefault) {
        
        var array = [];

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].PK === true) {
                if (pIsDefault === false) {
                    if (this.items[i].default === null || this.items[i].default.length === 0) {
                        array.push(this.items[i]);
                    }
                } else if (pIsDefault){
                    if (this.items[i].default !== null && this.items[i].default.length > 0) {
                        array.push(this.items[i]);
                    }
                } else{    
                    array.push(this.items[i]);
                }
            }
        }
        return array;
    };

    // { entity_fk_list : null }
    Entity.prototype.FK_list = function() {

        var array = [];

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].FK) array.push(this.items[i]);
        }
        return array;
    };

    // { entity_notnull_list : null }
    Entity.prototype.notNull_list = function() {

        var array = [];

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].isNull === false) array.push(this.items[i]);
        }
        return array;
    };

    // { entity_null_list : null }
    Entity.prototype.null_list = function() {

        var array = [];

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].isNull  === true) array.push(this.items[i]);
        }
        return array;
    };

    // { entity_valid: "CRUDL" }
    Entity.prototype.valid = function(pCRUDL) {

        var array = [];

        switch (pCRUDL) {
            case "C":   // not null + FK + PK(default 값에 분기)  
                /**
                 * REVIEW: DB에 등록시 :: PK 자동등록(증가), PK 수동등록 정의 필요
                 * PK 기본값 있을시 : PK 빼기
                 * PK 기본값 없을시 : PK 넣기
                 */
                array = this.notNull_list();
                array = this._unionConcat(array, this.FK_list());
                array = this._removeArray(array, this.PK_list(true));
                array = this._unionConcat(array, this.FK_list(false));
                break;

            case "R":   // PK + FK
                array = this.PK_list(null);
                array = this._unionConcat(array, this.FK_list());
                break;

            case "U":   // PK + FK + not null
                array = this.PK_list(null);
                array = this._unionConcat(array, this.FK_list());
                array = this._unionConcat(array, this.notNull_list());
                break;

            case "D":   // PK
                array = this.PK_list(null);
                break;

            case "L":   // FK
                array = this.FK_list();
                break;
        }
        return array;
    };

    // { entity_code : "속성명" }
    // { entity_code : null } : [[]]  전체 이중 배열 리턴
    // Entity.prototype.getCode = function(pName) {
    //     for (var i = 0; i < this.items.length; i++) {
    //         if (this.items[i].code &&
    //             this.items[i].code.name === pName && 
    //             this.items[i].code.items.length > 0) {
    //             return this.items[i].code;
    //         } 
    //     }
    //     return null;
    // };

    // 프로시저 얻기 SP
    // Entity.prototype.getProcedure = function(pName) {
    //     for (var i = 0; i < this.sp.length; i++) {
    //         if (this.sp[i].name === pName) return this.sp[i];
    //     }
    //     return null;
    // };

    // Attr 얻기 
    Entity.prototype.getAttr = function(pName) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].name === pName) return this.items[i];
        }
        return null;
    };

    // Model 얻기 
    Entity.prototype.getModel = function(pName) {
        for (var i = 0; i < this.model.length; i++) {
            if (this.model[i].name === pName) return this.model[i];
        }
        return null;
    };

    // Model 객체 얻기 
    Entity.prototype.getAttrObject = function(pName) {
        
        var obj     = null;
        var attr    = null;

        if (pName || pName !== null) {
            attr = this.getAttr(pName);
            if (attr) obj = attr.getObject();
        } else {
            obj = [];
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i]) {
                    obj.push(this.items[i].getObject());
                }
            }
        }
        return obj;
    };

    // Model 객체 얻기 
    Entity.prototype.getModelObject = function(pName) {
        
        var obj     = null;
        var model   = null;

        if (pName || pName !== null) {
            model = this.getModel(pName);
            if (model) obj = model.getObject();
        } else {
            obj = [];
            for (var i = 0; i < this.model.length; i++) {
                if (this.model[i]) {
                    model = this.model[i].getObject();
                    obj.push(model);
                }
            }
        }
        return obj;
    };

    // Model 객체 얻기 
    Entity.prototype.getModelSPObject = function(pName) {
        
        var obj     = null;
        var model   = null;

        if (pName !== null) {
            model = this.getModel(pName);
            if (model && model.sp) {
                obj = model.sp.getObject();
            }
        }
        return obj;
    };    

    // Model 객체 얻기 
    Entity.prototype.getFunc = function(pFuncCode, pName) {
        
        var obj     = null;
        var attr    = null;
        var arr     = [];

        switch (pFuncCode.toLowerCase()) {
            case "pk_list":
                attr = this.PK_list(pName);
                break;
            case "fk_list":
                attr = this.FK_list();
                break;                
            case "notnull_list":
                attr = this.notNull_list();
                break;
            case "null_list":
                attr = this.null_list();
                break;
            case "valid":
                attr = this.valid(pName);
                break;
        }

        if (attr instanceof Array) {
            for (var i = 0; i < attr.length; i++) {
                if (attr[i]) {
                    obj = attr[i].getObject();
                    arr.push(obj);
                }
            }
        }
        return arr;
    };

    // Attr 얻기 
    Entity.prototype.getObject = function() {
        
        var obj         = {};
        var array       = [];

        for (var i = 0; i < this.items.length; i++) {
            array.push(this.items[i].getObject());
        }
        obj["name"]         = this.name;
        obj["type"]         = "TABLE";
        obj["namespace"]    = this.namespace;
        obj["title"]        = this.title;;
        obj["items"]        = array;

        return obj;
    };    
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// {"entity_items": "sto_id"}       : 지정 속성
// {"entity_items": null}           : 전체 속성
function Attr(pProp) {

    var code            = null;
    var hashCode        = null;
    var codeName        ="";

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 ) {
        throw new Error('name 필수값 없음 오류 :');
        return null;
    }

    this.name           = pProp.name;
    this.type           = "ATTR";
    this.value_type     = pProp.value_type ? pProp.value_type : "String";
    this.caption        = pProp.caption ? pProp.caption : "";
    this.isNull         = pProp.isNull ? true : false;
    this.PK             = pProp.PK ? true : false;
    this.FK             = pProp.FK ? true : false;
    this.FK_ref         = pProp.FK_ref ? pProp.FK_ref : null;
    this.unique         = pProp.unique ? true : false;
    this.default        = pProp.default ? pProp.default : "";
    this.length         = pProp.length ? pProp.length : 0;
    this.mssql_type     = pProp.mssql_type ? pProp.mssql_type : "";
    this.mysql_type     = pProp.mysql_type ? pProp.mysql_type : "";
    this.code           = null;

    // TODO: 등록 위치 바뀜
    if (pProp.code) {
        codeName = pProp.code.name ? pProp.code.name : "CODE_" + this.name;
        hashCode = new HashCode(codeName);
        if (!pProp.code.items) {
            throw new Error('items 필수값 없음 오류 :');
            return null;
        }
        for (var i = 0; i < pProp.code.items.length; i++) {
            code = new Code(pProp.code.items[i]);
            if (code) hashCode.items.push(code);
        }
        this.code = hashCode;
    }
}
(function() {

    // Attr 얻기 
    Attr.prototype.getObject = function() {
        
        var obj     = {};

        for (var prop in this) {
            if (typeof this[prop] !== "function") {
                obj[prop] = this[prop];
            }
        }
        return obj;
    };
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// {"entity_code": null}        : 전체 코드
// {"entity_code": "state_cd"}  : 지정 코드
function HashCode(pProp) {

    var code    = null;
    
    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0) {
        throw new Error('name 필수값 없음 오류 :');
        return null;
    }
    this.name           = pProp.name;
    this.type           = "HASHCODE"
    this.namespace      = pProp.namespace ? pProp.namespace : "";
    this.items          = [];

    if (typeof pProp.items !== "undefined") {
        
        if (!(pProp.items instanceof Array)) pProp.items = [pProp.items];
        
        for (var i = 0; i < pProp.items.length; i++) {
            code = new Code(pProp.items[i]);
            if (code) this.items.push(code);
        }
    }     
}
(function() {

    // HashCode 얻기 
    HashCode.prototype.getObject = function() {
        
        var obj     = {};
        var arr     = [];

        for (var i = 0; i < this.items.length; i++) {
            arr.push(this.items[i]);
        }
        obj["name"]         = this.name;
        obj["type"]         = this.type;
        obj["namespace"]    = this.namespace;
        obj["items"]        = arr;

        return obj;
    };
}());    

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Code(pProp) {

    // 필수 값 검사
    if (typeof pProp.key !== "string" || pProp.key.length <= 0 || 
        typeof pProp.value !== "string" || pProp.value.length <= 0) {
        throw new Error('key  value 필수값 없음 오류 :');
        return null;
    }
    this.type           = "CODE"
    this.key            = pProp.key;
    this.value          = pProp.value;
    this.caption        = pProp.caption ? pProp.caption : "";
}
(function() {

    // Code 얻기 
    Code.prototype.getObject = function() {
        
        var obj     = {};

        for (var prop in this) {
            if (typeof this[prop] !== "function") {
                obj[prop] = this[prop];
            }
        }
        return obj;
    };
}());  

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// CRUD + List + Etc
// { entity_model_sp : null }       : 전체 모델
// {"entity_model": "UPDATE"}       : 지정 모델
function Model(pProp, pOnwer) {
    
    var attr            = null;

    // 필수값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 || 
        !pOnwer) {
        throw new Error('name 필수값 없음 오류 :');
        return null;
    }

    // I[NSERT] | U[PDATE] | S[ELECT] | L[IST] | D[ELETE]
    // BIND-VIEW [BV] | BIND-LIST [BL] | {기타 지정 이름..}    
    this._onwer         = pOnwer;
    this.name           = pProp.name;
    this.type           = "MODEL";
    this.items          = [];
    this.sp             = null;

    // 참조 삽입
    if (pProp.sp) {
        this.sp =  this._onwer._onwer.getProcedure(pProp.sp, pProp.namespace);
        if (!this.sp) {
            throw new Error('지정 sp 객체 없음 (register등록 확인!) 오류 sp:' + pProp.sp);
            return null;
        }
    }
    // 참조 삽입
    if (typeof pProp.attr !== "undefined") {
        
        if (!(pProp.attr instanceof Array)) pProp.attr = [pProp.attr];
        
        for (var i = 0; i < pProp.attr.length; i++) {
            attr = this._onwer.getAttr(pProp.attr[i]);
            if (attr instanceof Attr) {
                this.items.push(attr);
            }
        }
    }
}
(function() {

    // Model 얻기 
    Model.prototype.getObject = function() {
        
        var obj         = {};
        var array       = [];

        for (var i = 0; i < this.items.length; i++) {
            array.push(this.items[i].getObject());
        }
        obj["name"] = this.name;
        obj["type"] = "MODEL";
        obj["items"] = array;

        return obj;
    };
}());    

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// {"entity_sp": "M03_SP_Notice_U"}     : 지정 프로시저
// {"entity_sp": null}                  : 전체 프로시저
function Procedure(pProp) {
    
    var param           = null;

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 ||
        typeof pProp.type !== "string" || pProp.type.length <= 0) {
        throw new Error('name, type 필수값 없음 오류 :');
        return null;
    }
    this.name       = pProp.name;   // {필수값}
    this.type       = pProp.type;   // {필수값} SP | FN | FT
    this.namespace  = pProp.namespace ? pProp.namespace : "";
    this.items      = [];

    if (typeof pProp.items !== "undefined") {
        
        if (!(pProp.items instanceof Array)) pProp.items = [pProp.items];
        
        for (var i = 0; i < pProp.items.length; i++) {
            param = new Param(pProp.items[i]);
            if (param !== null) {
                this.items.push(param);
            }
        }
    }
}
(function() {

    // Procedure(sp) 얻기 
    Procedure.prototype.getObject = function() {
        
        var obj         = {};
        var array       = [];

        for (var i = 0; i < this.items.length; i++) {
            array.push(this.items[i].getObject());
        }
        obj["name"]         = this.name;
        obj["type"]         = this.type;
        obj["namespace"]    = this.namespace;
        obj["items"]        = array;

        return obj;
    };
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Param(pProp) {

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 ||
        typeof pProp.value_type !== "string" || pProp.value_type.length <= 0) {
        throw new Error('name, valueType 필수값 없음 오류 :');
        return null;
    }
    this.name           = pProp.name;   // {필수값}
    this.type           =  "PARAM";   // {필수값}
    this.value_type     = pProp.value_type;
    this.length         = pProp.length ? pProp.length : 0;
    this.isOutput       = pProp.isOutput ? true : false;
    this.default        = pProp.default ? pProp.default : "";
    this.DB_mysql_type  = pProp.DB_mysql_type ? pProp.DB_mysql_type : this.DB_mysql_type;
    this.DB_mssql_type  = pProp.DB_mssql_type ? pProp.DB_mssql_type : this.DB_mssql_type;    
}
(function() {

    // Param 얻기 
    Param.prototype.getObject = function() {
        
        var obj     = {};

        for (var prop in this) {
            if (typeof this[prop] !== "function") {
                obj[prop] = this[prop];
            }
        }
        return obj;
    };

}());    


/**
 * 전역 등록 : golbal, module.exprot (node)
 */
global.Context      = global.Context || Context;
global.EntityModel  = global.EntityModel || EntityModel;

// node 등록(주입)
if (typeof module !== 'undefined' && module.exports) {
    module.exports.Context      = Context;
    module.exports.EntityModel  = EntityModel;    
}
}(this));