
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
    this.preContext         = null;
    this.entityModel        = new EntityModel();

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
        entity = this.entityModel.entities[entityIdx];

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
                context = entity.getProcedureObject(pPropValue);
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
            case "entity_code":
                context = entity.getFunc('code', pPropValue);
                break;
        }            

        return context;
    };

    // json 파일 로드
    Context.prototype.load = function(pJSON) {

        var context = null;

        if (typeof pJSON === "string") {
            context = JSON.parse(pJSON);
        } else if (typeof pJSON === "object") {
            context = pJSON;
        }
        
        if (typeof context !== "object") {
            console.log('타입 오류 : ' + pJSON);
        } else if (typeof context.pages === "undefined") {
            console.log('필수 값 오류'+ pJSON);
        }

        this.preContext = context;
    };

    // 컨텍스트 얻기 (컨텍스트 + 엔티티)
    Context.prototype.getContext = function() {
        return this._parse(this.preContext);
    };

    // 컨텍스트에 엔티티 주입
    Context.prototype.setEntity = function(pJSON) {
        this.entityModel.register(pJSON);
    };


    /**
     * node 모듈 등록
     */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Context = Context;
    }

}());
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function EntityModel() {
    
    var _version        = "1.0.0"

    this.entities       = [];
    this.temp           = null;
}
(function() {

    EntityModel.prototype._createEntityObject = function(pJSON) {
        
        var entity      = null;
        var attr        = null;
        var model       = null;
        var proceduce   = null;
        var hashCode    = null;
        var param       = null;
        var prop        = {};
        
        if (typeof pJSON.name !== "undefined" && pJSON.name.length > 0) {
            prop.name = pJSON.name;
        }
        if (typeof pJSON.namespace !== "undefined" && pJSON.namespace.length > 0) {
            prop.namespace = pJSON.namespace;
        }
        if (typeof pJSON.title !== "undefined" && pJSON.title.length > 0) {
            prop.title = pJSON.title;
        }
        if (typeof pJSON.type !== "undefined" && pJSON.type.length > 0) {
            prop.type = pJSON.type;
        }

        entity = new Entity(prop);

        if (typeof pJSON.items !== "undefined") {
            for (var i = 0; i < pJSON.items.length; i++) {
                if (pJSON.items[i].name !== "undefined" && pJSON.items[i].name.length > 0) {
                    attr = new Attr(pJSON.items[i]);
                    entity.items.push(attr);
                }
            }
        }

        if (typeof pJSON.sp !== "undefined") {
            for (var i = 0; i < pJSON.sp.length; i++) {
                if (pJSON.sp[i].name !== "undefined" && pJSON.sp[i].name.length > 0) {
                    proceduce = new Procedure(pJSON.sp[i]);
                    entity.sp.push(proceduce);
                }
            }
        }

        // 참조 객체가 있어서 마지막에 위치함 (items, sp 뒤) 
        if (typeof pJSON.model !== "undefined") {
            for (var i = 0; i < pJSON.model.length; i++) {
                if (pJSON.model[i].name !== "undefined" && pJSON.model[i].name.length > 0) {
                    model = new Model(pJSON.model[i], entity);
                    entity.models.push(model);
                }
            }
        }


        return entity;
    };


    EntityModel.prototype.register = function(pJSON) {
        
        var entity = null;

        if (typeof pJSON === "string") {
            entity = JSON.parse(pJSON);
        } else if (typeof pJSON === "object") {
            entity = pJSON;
        }
        
        if (typeof entity !== "object") {
            console.log('타입 오류 : ' + pJSON);
        } else if (typeof entity.name === "undefined" || 
                   typeof entity.type === "undefined" || 
                   typeof entity.items === "undefined" ) {
            console.log('필수 값 오류'+ pJSON);
        }

        this.temp = entity;
        this.entities.push(this._createEntityObject(entity));
    };

    EntityModel.prototype.unregister = function(pName) {
        for (var i = 0; this.entities.length; i++) {
            if (this.entities[i].name === pName) {
                this.entities.splice(i, 1);
            }
        }
    };

    EntityModel.prototype.getEntity = function(pName) {
        for (var i = 0; this.entities.length; i++) {
            if (this.entities[i].name === pName) {
                return this.entities[i];
            }
        }
        return null;
    };

    EntityModel.prototype.test = function() {
        console.log('test.. call');
    }

    /**
     * node 모듈 등록
     */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.EntityModel = EntityModel;
    }

}());


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Entity(pProp) {

    this.name       = "";   // {필수}
    this.type       = "";   // {필수} table | model
    this.namespace  = "";
    this.title      = "";
    this.items      = [];   // { entity_items : null }
    this.models     = [];   // { entity_model : "모델명" }
    this.sp         = [];   // { entity_sp : "sp이름" }

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 ||  
        typeof pProp.type !== "string" || pProp.type.length <= 0) {
        throw new Error('name type 필수값 없음 오류 :');
        return null;
    }

    this.name       = pProp.name;
    this.type       = pProp.type;

    this.namespace  = pProp.namespace ? pProp.namespace : this.namespace;
    this.title      = pProp.title ? pProp.title : this.title;
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
    // TODO: 코드명 삽입 필요 (컬럼명)
    Entity.prototype.code = function(pAttrName) {

        var array = [];

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].code.length > 0) {
                array.push(this.items[i].code);
            }
        }
        return array;
    };

    // 프로시저 얻기 SP
    Entity.prototype.getProcedure = function(pName) {
        for (var i = 0; i < this.sp.length; i++) {
            if (this.sp[i].name === pName) return this.sp[i];
        }
        return null;
    };

    // Attr 얻기 
    Entity.prototype.getAttr = function(pName) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].name === pName) return this.items[i];
        }
        return null;
    };

    // Model 얻기 
    Entity.prototype.getModel = function(pName) {
        for (var i = 0; i < this.models.length; i++) {
            if (this.models[i].name === pName) return this.models[i];
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
            for (var i = 0; i < this.models.length; i++) {
                if (this.models[i]) {
                    model = this.models[i].getObject();
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

    // SP 객체 얻기 
    Entity.prototype.getProcedureObject = function(pName) {
        
        var obj     = null;
        var sp      = null;

        if (pName !== null) {
            sp = this.getProcedure(pName);
            if (sp) obj = sp.getObject();
        } else {            
            obj = [];
            for (var i = 0; i < this.sp.length; i++) {
                if (this.sp[i]) {
                    sp = this.sp[i].getObject();
                    obj.push(sp);
                }
            }
        }
        return obj;
    };    

    // Model 객체 얻기 
    Entity.prototype.getFunc = function(pFuncName, pName) {
        
        var obj     = null;
        var attr    = null;
        var arr     = [];

        switch (pFuncName.toLowerCase()) {
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
            case "code":
                attr = this.code(pName);
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

}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Attr(pProp) {

    var code            = null;

    this.name           = "";           // {필수}
    this.type           = "String";     //  JS 자료 타입
    this.caption        = "";
    this.isNull         = true;
    this.PK             = false;
    this.FK             = false;
    this.FK_ref         = null;
    this.unique         = false;
    this.default        = "";
    this.length         = 0;
    this.DB_mysql_type  = "";
    this.DB_mssql_type  = "";
    this.code           = [];

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 ) {
        throw new Error('name 필수값 없음 오류 :');
        return null;
    }

    this.name           = pProp.name;
    this.type           = pProp.type ? pProp.type : this.type;
    this.caption        = pProp.caption ? pProp.caption : this.caption;
    this.isNull         = pProp.isNull ? true : false;
    this.PK             = pProp.PK ? true : false;
    this.FK             = pProp.FK ? true : false;
    this.FK_ref         = pProp.FK_ref ? pProp.FK_ref : this.FK_ref;
    this.unique         = pProp.unique ? true : false;
    this.default        = pProp.default ? pProp.default : this.default;
    this.length         = pProp.length ? pProp.length : this.length;
    this.DB_mysql_type  = pProp.DB_mysql_type ? pProp.DB_mysql_type : this.DB_mysql_type;
    this.DB_mssql_type  = pProp.DB_mssql_type ? pProp.DB_mssql_type : this.DB_mssql_type;

    if (pProp.code instanceof Array) {
        for (var i = 0; i < pProp.code.length; i++) {
            code = new HashCode(pProp.code[i]);
            if (code !== null) {
               this.code.push(code); 
            }
        }
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
function HashCode(pProp) {

    this.key           = "";
    this.value         = "";

    // 필수 값 검사
    if (typeof pProp.key !== "string" || pProp.key.length <= 0 || 
        typeof pProp.value !== "string" || pProp.value.length <= 0) {
        throw new Error('key  value 필수값 없음 오류 :');
        return null;
    }
    
    this.key           = pProp.key;
    this.value         = pProp.value;
}


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// CRUD + List + Etc
function Model(pProp, pOnwer) {
    
    var attr            = null;

    // I[NSERT] | U[PDATE] | S[ELECT] | L[IST] | D[ELETE]
    // BIND-VIEW [BV] | BIND-LIST [BL] | {기타 지정 이름..}
    this._onwer         = pOnwer;
    this.name           = "";   
    this.items          = [];
    this.sp             = null; // { entity_model_sp : null }

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 ) {
        throw new Error('name 필수값 없음 오류 :');
        return null;
    }
    this.name       = pProp.name;

    // 참조 삽입
    if (pProp.sp) {
        this.sp =  this._onwer.getProcedure(pProp.sp);
    }
    // 참조 삽입
    if (typeof pProp.attr !== "undefined") {
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
        
        obj["name"] = this.name;

        for (var i = 0; i < this.items.length; i++) {
            array.push(this.items[i].getObject());
        }
        obj["items"] = array;

        return obj;
    };

}());    

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Procedure(pProp) {
    
    var param           = null;

    this.name           = "";
    this.type           = "";   // SP | FN | FT
    this.input          = [];
    this.output         = [];

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 ||
        typeof pProp.type !== "string" || pProp.type.length <= 0) {
        throw new Error('name, type 필수값 없음 오류 :');
        return null;
    }
    this.name       = pProp.name;
    this.type       = pProp.type;

    if (typeof pProp.input !== "undefined") {
        for (var i = 0; i < pProp.input.length; i++) {
            param = new Param(pProp.input[i]);
            if (param !== null) {
                this.input.push(param);
            }
        }
    }
    if (typeof pProp.output !== "undefined") {
        for (var i = 0; i < pProp.output.length; i++) {
            param = new Param(pProp.output[i]);
            if (param !== null) {
                this.output.push(param);
            }
        }
    }    
}
(function() {

    // Procedure(sp) 얻기 
    Procedure.prototype.getObject = function() {
        
        var obj         = {};
        var array       = null;
        
        obj["name"] = this.name;
        obj["type"] = this.type;
        
        array           = [];
        for (var i = 0; i < this.input.length; i++) {
            array.push(this.input[i].getObject());
        }
        obj["input"] = array;

        array           = [];
        for (var i = 0; i < this.output.length; i++) {
            array.push(this.output[i].getObject());
        }
        obj["output"] = array;

        return obj;
    };

}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Param(pProp) {

    this.name           = "";   // {필수}
    this.type           = "";   // {필수}
    this.length         = 0;
    this.DB_mysql_type  = "";
    this.DB_mssql_type  = "";

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 ||
        typeof pProp.type !== "string" || pProp.type.length <= 0) {
        throw new Error('name, type 필수값 없음 오류 :');
        return null;
    }
    this.name       = pProp.name;
    this.type       = pProp.type;

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
 * ----------------------------------------------------
 * JSON 형태로 관리됨  
 *  - 스크립트 안쓰는 방향으로 ... 어려우면 우회하는 방향 검토
 *  - e.... 뭘가르키는지   명확성 필요
 *  - 1안 > 지정됨 이름으로 값을 매칭시 스키마 로딩과 매칭함
 */
// 처리전 컨텍스트  : JSON 형태
var pre_context = {
    name: "",
    bind: {entity_model: "SELECT"},
    test: {entity_pk_list: null},
    test: {entity_valid: "SELECT"},
    v_cmd: [
        {name: "DELETE", entity_model: "SELECT"},
        {name: "UPDATE", entity_model_sp: "UPDATE"},
    ],
    cmd: [                                              // ~.C.asp 콜백사용
        {name: "DELETE", entity_model_sp: "DELETE"},
        {name: "UPDATE", entity_model_sp: "UPDATE"},
        {name: "INSERT", entity_model_sp: "INSERT"},
        {name: "SELECT", entity_model_sp: "SELECT"}
    ],
    bind: {
        "list": [
            "ntc_idx",          // [0] : Idx
            "title",            // [1] : 제목
            "noticeType_cd",    // [2] : 코드
            "writer"            // [3] : 글쓴이
        ]
    },
    entitys: [
        {
            name: "Notice",
            namespace: "C01.Module01"
        }
    ],
    pages: [
        {
            filepath: ""
        }
    ],
    "entity[0]": ""
};

// 처리 후 컨텐스트
var context = {
    name: "",
    v_cmd: [
        {name: "DELETE", entity_model: [
            {name: "ntc_idx", title: "일련번호", type: "String"},
        ]},
        {name: "UPDATE", entity_model: [
            {name: "ntc_idx", title: "일련번호", type: "String"},
            {name: "sto_id", title: "상점코드", type: "String"},
            {name: "state_cd", title: "상태", type: "String"},
            {name: "title", title: "제목", type: "String"},
        ]},
    ],
    cmd: [
        {name: "DELETE", entity_sp:  [
            {name: "ntc_idx", title: "일련번호", type: "String"},
        ]},
        {name: "UPDATE", entity_sp: [
            {name: "ntc_idx", title: "일련번호", type: "String"},
            {name: "sto_id", title: "상점코드", type: "String"},
            {name: "state_cd", title: "상태", type: "String"},
            {name: "title", title: "제목", type: "String"},
        ]},
        {name: "INSERT", entity_sp:[
            {name: "ntc_idx", title: "일련번호", type: "String"},
            {name: "sto_id", title: "상점코드", type: "String"},
            {name: "state_cd", title: "상태", type: "String"},
            {name: "title", title: "제목", type: "String"},
        ]},
        {name: "SELECT", entity_sp: [
            {name: "ntc_idx", title: "일련번호", type: "String"},
        ]}
    ],
    bind: { "list": [
            {name: "ntc_idx", title: "일련번호", type: "String"},
            {name: "sto_id", title: "상점코드", type: "String"},
            {name: "state_cd", title: "상태", type: "String"},
            {name: "title", title: "제목", type: "String"},
    ]},
    entity: [
        {
            name: "Notice",
            namespace: "C01.Module01"
        }
    ]
};
