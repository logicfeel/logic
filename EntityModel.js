(function(global) {
'use strict';

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Context(pEntityModel) {
    
    var _entity_version     = "1.0.0"

    if (!(pEntityModel instanceof EntityModel)) {
        throw new Error('EntityModel 생성시 기본값 오류 :');
    }

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
        'entity_bind', 
        'context_code',
        'context_sp'
    ];
    this._preContext        = null;
    this._entityModel       = pEntityModel;
    this._refEntity         = [];
    this._refProcedure      = [];
    this._refCode           = [];
}
(function() {

    // 배열 syntax 에서 숫자만 추출함 없을시 0 리턴
    function _getArrayNumber(pString, pDefaultNumber) {
        
        var curser_st   = 0;
        var curser_end  = 0;
        var number      = null;

        curser_st   = pString.indexOf('[');
        curser_end  = pString.indexOf(']', curser_st);

        if (curser_st > 0) {
            number = pString.substring(curser_st + 1, curser_end);
            number = Number(number);
            if (typeof number !== "number") {
                throw new Error('number type 오류 :');
            }
        } else if (typeof pDefaultNumber === "number"){
            number = pDefaultNumber;
        }
        return number;
    }

    // 파싱 이전 처리 (엔티티 참조 등록)
    Context.prototype._preParse = function(pContext) {

        var entity          = null;
        var procedure       = null;
        var code            = null;

        for (var prop in pContext) {
            if (pContext.hasOwnProperty(prop)) {
                
                // entity 참조 엔티티 가져옴(_refEntity 에 등록)
                if (prop === "entities") {

                    if (!(pContext[prop] instanceof Array)) pContext[prop] = [pContext[prop]];

                    for (var i = 0; i < pContext[prop].length; i++) {

                        entity = this._entityModel.getEntity(pContext[prop][i].name, pContext[prop][i].namespace);
                        
                        if (entity) {
                            this._refEntity.push(entity);
                        } else {
                            throw new Error('지정 entity 객체 없음 (register등록 확인!) 오류 entity:' + pContext[prop][i].name);
                        }
                    }

                // procedures 참조 엔티티 가져옴(_refProcedure 에 등록)
                } else if (prop === "procedures") {

                    if (!(pContext[prop] instanceof Array)) pContext[prop] = [pContext[prop]];

                    for (var i = 0; i < pContext[prop].length; i++) {

                        procedure = this._entityModel.getProcedure(pContext[prop][i].name, pContext[prop][i].namespace);
                        
                        if (procedure) {
                            this._refProcedure.push(procedure);
                        } else {
                            throw new Error('지정 procedure 객체 없음 (register등록 확인!) 오류 procedure:' + pContext[prop][i].name);
                        }
                    }

                // codes 참조 엔티티 가져옴(_refCode 에 등록)
                } else if (prop === "codes") {

                    if (!(pContext[prop] instanceof Array)) pContext[prop] = [pContext[prop]];

                    for (var i = 0; i < pContext[prop].length; i++) {

                        code = this._entityModel.getCode(pContext[prop][i].name, pContext[prop][i].namespace);
                        
                        if (code) {
                            this._refCode.push(code);
                        } else {
                            throw new Error('지정 code 객체 없음 (register등록 확인!) 오류 code:' + pContext[prop][i].name);
                        }
                    }
                }                
            }
        }    
    }

    // 파싱 처리 (배열, 개열, 일반값)
    Context.prototype._parse = function(pContext) {
        
        var context     = {};

        // 파싱 이전 처리 
        this._preParse(pContext);

        if (typeof pContext === "object") {

            for (var prop in pContext) {

// 디버깅
// if (prop == "entity_bind") {
//     console.log('ee');
//     var a = 2;
// }
                // if (pContext.hasOwnProperty(prop) && prop !== "entities") {
                if (pContext.hasOwnProperty(prop)) {
                    
                    function checkSyntax(value, index, array){
                        return prop.indexOf(value) > -1 ? true : false;
                    }

                    //  신텍트인 경우 
                    if (this._syntax.some(checkSyntax)) {
                        context = this._parseSyntax(prop, pContext[prop]);
                    
                    // 값이 배열인 경우    
                    } else if (pContext[prop] instanceof Array) {  
                        context[prop] = [];
                        for (var i = 0; i < pContext[prop].length; i++) {
                            context[prop].push(this._parse(pContext[prop][i]));
                        }
                        
                    // 값이 객체인 경우    
                    } else if (pContext[prop] instanceof Object) {
                        context[prop] = this._parse(pContext[prop]);
                    
                    // 일반 값인 경우
                    } else {
                        context[prop] = pContext[prop];

                        // function checkSyntax(value, index, array){
                        //     return prop.indexOf(value) > -1 ? true : false;
                        // }

                        // if (this._syntax.some(checkSyntax)) {
                        //     context = this._parseSyntax(prop, pContext[prop]);
                        // } else {
                        //     context[prop] = pContext[prop];
                        // }
                    }
                }
            }
        } else {
            context = pContext;
        }

        return context;
    };

    // Syntax 처리
    Context.prototype._parseSyntax = function(pProp, pPropValue) {
        
        var arrIdx      = 0;
        var entity      = null;
        var procedure   = null;
        var code        = null;

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

        if (syntax.indexOf('entity') > -1) {

            arrIdx      = _getArrayNumber(pProp, 0);
            entity      = this._refEntity[arrIdx];
            if (!entity) {
                throw new Error('오류!! _refEntity 가 없습니다. (entities 1개이상 등록)');
            }

            switch (syntax) {
                case "entity_items":
                    context = entity.getAttrObject(pPropValue, this);
                    break;
                case "entity_model":
                    context = entity.getModelObject(pPropValue, this);
                    break;                
                case "entity_model_sp":
                    context = entity.getModelSPObject(pPropValue, this);
                    break;
                case "entity_sp":
                    context = entity.getSPObject(pPropValue, this);
                    break;
                case "entity_pk_list":
                    context = entity.getFunc('pk_list', pPropValue, this);
                    break;
                case "entity_fk_list":
                    context = entity.getFunc('fk_list', pPropValue, this);
                    break;
                case "entity_notnull_list":
                    context = entity.getFunc('notnull_list', pPropValue, this);
                    break;
                case "entity_null_list":
                    context = entity.getFunc('null_list', pPropValue, this);
                    break;
                case "entity_valid":
                    context = entity.getFunc('valid', pPropValue, this);
                    break;
                case "entity_bind":
                    var aa = 1;
                    context = "";
                    break;
                default:
                    context = {};
                    break;
            }            
            
        } else if (syntax.indexOf('context') > -1) {
            
            arrIdx      = _getArrayNumber(pProp, null);
            
            switch (syntax) {
                case "context_sp":
                    context     = this._getRefObject(this._refProcedure, arrIdx, pPropValue);
                    if (!context) {
                        throw new Error('오류!! _refProcedure 가 없습니다.');
                    }
                    break;
                case "context_code":
                    context     = this._getRefObject(this._refCode, arrIdx, pPropValue);
                    if (!context) {
                        throw new Error('오류!! _refCode 가 없습니다.' + pPropValue);
                    }
                    break;
            }
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
            throw new Error('타입 오류 : ' + pStrJSON);
        }
        return jsonObj;
    }

    // 참조객체 getObject 얻기
    // 우선순위 : idx 있을시 idx > pName 있는경우 > 전체    
    Context.prototype._getRefObject = function(pObject, pIdx, pName) {

        var obj         = null;

        if (typeof pIdx === "number") {
            return pObject[pIdx];
        }

        obj = [];
        for (var i = 0; i < pObject.length; i++) {
            if (pName && pObject[i].name === pName ) {
                    return pObject[i].getObject(this);
            } else if (!pName) {
                obj.push(pObject[i].getObject(this));
            }
        }
        // return obj.length > 0 ? obj : null;
        return obj;
    }

    // json 파일 로드
    Context.prototype.readContext = function(pStrJSON) {

        var obj = null;

        try {

            obj = this._convertStrJSON(pStrJSON);

            if (typeof obj.pages === "undefined") {
                throw new Error('pages 필수 값 오류');
            }

            this._preContext = obj;

        } catch (e) {
            console.log('오류발생 !! (발생위치:Context.prototype.readContext) ');
            console.log(e.name);
            console.log(e.message);
        }
    };


    // 컨텍스트 얻기 (컨텍스트 + 엔티티)
    Context.prototype.getContext = function() {

        try {

            return this._parse(this._preContext);

        } catch (e) {
            console.log('오류발생 !! (발생위치:Context.prototype.getContext) ');
            console.log(e.name);
            console.log(e.message);
        }
    };

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

        if (!pName) {
            console.log('경고!! 객체의 name 필수 속성 없음 name:' + pName);
        }
        
        for (var i = 0; i < pThisArray.length; i++) {
            if (pThisArray[i].name === pName && pThisArray[i].namespace === pNamesapce) return true;
        }
        return false;
    }

    EntityModel.prototype._convertStrJSON = function(pStrJSON) {

        var jsonObj     = null;

        if (typeof pStrJSON === "string") {
            jsonObj = JSON.parse(pStrJSON);
        } else if (typeof pStrJSON === "object") {
            jsonObj = pStrJSON;
        }
        
        if (typeof jsonObj !== "object") {
            throw new Error('타입 오류 : ' + pStrJSON);
        }
        return jsonObj;
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
            throw new Error('타입 오류 : ' + pStrJSON);
        }

        if (typeof jsonObj.entity_model === "undefined") {
            throw new Error('entity_model 필수 값 오류');
        }
        this.createEntityModelObject(jsonObj);
    }

    EntityModel.prototype.registerEntity = function(pStrJSON) {

        var obj = null;

        try {

            obj = this._convertStrJSON(pStrJSON);

            if (typeof obj.entity_model === "undefined") {
                throw new Error('entity_model 필수 값 오류');
            } else if (typeof obj.entity_model.entity === "undefined") {
                throw new Error('entity_model.entity 필수 값 오류');
            }
            this.createEntityObject(obj.entity_model.entity);

        } catch (e) {
            console.log('오류발생 !! (발생위치:EntityModel.prototype.registerEntity) ');
            console.log(e.name);
            console.log(e.message);
        }
        
    };

    EntityModel.prototype.registerProcedure = function(pStrJSON) {

        var obj = null;

        try {

            obj = this._convertStrJSON(pStrJSON);

            if (typeof obj.entity_model === "undefined") {
                throw new Error('entity_model 필수 값 오류');
            } else if (typeof obj.entity_model.procedure === "undefined") {
                throw new Error(' jentity_model.procedure 필수 값 오류');
            }
            this.createProcedureObject(obj.entity_model.procedure);

        } catch (e) {
            console.log('오류발생 !! (발생위치:EntityModel.prototype.registerProcedure) ');
            console.log(e.name);
            console.log(e.message);
        }
    };

    EntityModel.prototype.registerCode = function(pStrJSON) {

        var obj = null;

        try {

            obj = this._convertStrJSON(pStrJSON);

            if (typeof obj.entity_model === "undefined") {
                throw new Error('entity_model 필수 값 오류');
            } else if (typeof obj.entity_model.code === "undefined") {
                throw new Error('entity_model.code 필수 값 오류');
            }
            this.createCodeObject(obj.entity_model.code);

        } catch (e) {
            console.log('오류발생 !! (발생위치:EntityModel.prototype.registerCode) ');
            console.log(e.name);
            console.log(e.message);
        }        
    };

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

    // { context_code : "속성명" }
    // { context_code : null } : [[]]  전체 이중 배열 리턴
    EntityModel.prototype.getCode = function(pName, pNamespace) {
        
        pNamespace = pNamespace ? pNamespace : "";

        for (var i = 0; i < this.codes.length; i++) {
            if (this.codes[i].name === pName && 
                this.codes[i].namespace === pNamespace) {
                return this.codes[i];
            } 
        }
        return null;
    };


    // EntityModel.prototype.readEntityModel = function(pStrJSON) {

    //     var obj = null;

    //     try {

    //         obj = this._convertStrJSON(pStrJSON);

    //         if (typeof obj.entity_model === "undefined") {
    //             throw new Error('entity_model 필수 값 오류');
    //         }
    //         this.createEntityModelObject(pStrJSON);

    //     } catch (e) {
    //         console.log('오류발생 !! (발생위치:Context.prototype.readEntityModel) ');
    //         console.log(e.name);
    //         console.log(e.message);
    //     }
    // };



    // 해당 에티티모델만 추출 (네임스페이스 기준) 저장하기 위해서
    // TODO: 테스트 및 실효성 확인 해야함 (Model 및 SP 참조도 가져와야함)
    // Export 의 개념과 비슷함
    EntityModel.prototype.getEntityModelObject = function(pNamespace) {
        
        var obj             = {};

        obj["entity_model"] = {};
        obj["entity_model"]["entity"] = [];
        obj["entity_model"]["procedure"] = [];
        obj["entity_model"]["code"] = [];

        try {

            for (var i = 0; this.entities.length; i++) {
                if (this.entities[i].namespace === pNamespace) {
                    obj["entity_model"]["entity"].push(this.entities[i].getObject());
                }
            }
            for (var i = 0; this.proceduces.length; i++) {
                if (this.proceduces[i].namespace === pNamespace) {
                    obj["entity_model"]["procedure"].push(this.proceduces[i].getObject());
                }
            }
            for (var i = 0; this.codes.length; i++) {
                if (this.codes[i].namespace === pNamespace) {
                    obj["entity_model"]["code"].push(this.codes[i].getObject());
                }
            }
            return obj;

        } catch (e) {
            console.log('오류발생 !! (발생위치:EntityModel.prototype.getEntityModelObject) ');
            console.log(e.name);
            console.log(e.message);
        }        
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
                attr = new Attr(pProp.items[i], this);
                this.items.push(attr);
            }
        }
    }

    // REVEW: 종속성 > Attr, Procedure
    if (typeof pProp.sp !== "undefined") {
        
        if (!(pProp.sp instanceof Array)) pProp.sp = [pProp.sp];            // 배열삽입
        
        for (var i = 0; i < pProp.sp.length; i++) {
            if (pProp.sp[i].name) {
                sp = this._onwer.getProcedure(pProp.sp[i].name, pProp.sp[i].namespace);    
                if (!sp) {
                    throw new Error('지정 sp 객체 없음 (register등록 확인!) 오류 sp:' + pProp.sp[i].name);
                }
                this.sp.push(sp);
            }
        }
    }

    // REVIEW: 종속성 > Attr, Procedure
    if (typeof pProp.model !== "undefined") {

        if (!(pProp.model instanceof Array)) pProp.model = [pProp.model];   // 배열삽입

        for (var i = 0; i < pProp.model.length; i++) {
            if (pProp.model[i].name) {
                model = new Model(pProp.model[i], this);
                this.model.push(model);
            }
        }
    }    
}
(function() {

    // TODO: 전역 검토
    // 중복제거 배열 합침(합집합) :: 파괴형
    Entity.prototype._unionConcat = function(pArray, pTarget) {

        var union = true;

        if (pArray instanceof Array && pTarget instanceof Array) {
            for (var i = 0; i < pTarget.length; i++) {
                union = false;
                for (var ii = 0; ii < pArray.length; ii++) {
                    if (pTarget[i] === pArray[ii]) {
                        union = true;
                        break;
                    }
                }
                if (union) pArray.push(pTarget[i]);
            }
        }
        return pArray;
    };    

    // TODO: 전역 검토
    // 중복제거 배열 합침(교집합) :: 파괴형
    Entity.prototype._unionAllConcat = function(pArray, pTarget) {

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

    // { entity_inside_list : null }
    Entity.prototype.inside_list = function() {

        var array = [];

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].isInside  === true) array.push(this.items[i]);
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
                 * 내부값 빼기
                 */
                array = this.notNull_list();
                array = this._unionAllConcat(array, this.FK_list());
                array = this._removeArray(array, this.PK_list(true));
                array = this._unionAllConcat(array, this.FK_list(false));
                array = this._removeArray(array, this.inside_list());
                break;

            case "R":   // PK + FK
                array = this.PK_list(null);
                array = this._unionAllConcat(array, this.FK_list());
                break;

            case "U":   // PK + FK + not null ->  내부값 빼기
                array = this.PK_list(null);
                array = this._unionAllConcat(array, this.FK_list());
                array = this._unionAllConcat(array, this.notNull_list());
                array = this._removeArray(array, this.inside_list());
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

    // { context_code : "속성명" }
    // { context_code : null } : [[]]  전체 이중 배열 리턴
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

    // SP 얻기 
    Entity.prototype.getSP = function(pName) {
        for (var i = 0; i < this.sp.length; i++) {
            if (this.sp[i].name === pName) return this.sp[i];
        }
        return null;
    };    

    // Model 객체 얻기 
    Entity.prototype.getAttrObject = function(pName, pContext) {
        
        var obj     = null;
        var attr    = null;

        if (pName || pName !== null) {
            attr = this.getAttr(pName);
            if (attr) obj = attr.getObject(pContext);
        } else {
            obj = [];
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i]) {
                    obj.push(this.items[i].getObject(pContext));
                }
            }
        }
        return obj;
    };

    // Model 객체 얻기 
    Entity.prototype.getModelObject = function(pName, pContext) {
        
        var obj     = null;
        var model   = null;

        if (pName || pName !== null) {
            model = this.getModel(pName);
            if (model) obj = model.getObject(pContext);
        } else {
            obj = [];
            for (var i = 0; i < this.model.length; i++) {
                if (this.model[i]) {
                    model = this.model[i].getObject(pContext);
                    obj.push(model);
                }
            }
        }
        return obj;
    };

    // Model SP 객체 얻기 
    Entity.prototype.getModelSPObject = function(pName, pContext) {
        
        var obj     = null;
        var model   = null;

        if (pName !== null) {
            model = this.getModel(pName);
            if (model && model.sp) {
                obj = model.sp.getObject(pContext);
            }
        }
        return obj;
    };    

    // SP 객체 얻기 
    Entity.prototype.getSPObject = function(pName, pContext) {
        
        var obj     = null;
        var sp      = null;

        if (pName || pName !== null) {
            sp = this.getSP(pName);
            if (sp) obj = sp.getObject(pContext);
        } else {
            obj = [];
            for (var i = 0; i < this.sp.length; i++) {
                if (this.sp[i]) {
                    obj.push(this.sp[i].getObject(pContext));
                }
            }
        }
        return obj;
    };    


    // Model 객체 얻기 
    Entity.prototype.getFunc = function(pFuncCode, pName, pContext) {
        
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
                    obj = attr[i].getObject(pContext);
                    arr.push(obj);
                }
            }
        }
        return arr;
    };

    // Attr 얻기 
    Entity.prototype.getObject = function(pContext) {
        
        var obj         = {};
        var array       = [];

        for (var i = 0; i < this.items.length; i++) {
            array.push(this.items[i].getObject(pContext));
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
function Attr(pProp, pOnwer) {

    var code            = null;
    var hashCode        = null;
    var codeName        ="";
    var form            = null;

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0 ||
        !pOnwer) {
        throw new Error('name, pOnwer 필수값 없음 오류 :');
    }
    this._onwer         = pOnwer;
    this.name           = pProp.name;
    this.type           = "ATTR";
    this.value_type     = pProp.value_type ? pProp.value_type : "String";
    this.caption        = pProp.caption ? pProp.caption : "";

    // 대소문자 속성명 사용시
    if (pProp.isNull)  {
        this.isNull     = pProp.isNull ? true : false;
    } else {
        this.isNull     = pProp.isnull ? true : false;
    }
    if (pProp.PK)  {
        this.PK         = pProp.PK ? true : false;
    } else {
        this.PK         = pProp.pk ? true : false;
    }
    if (pProp.FK)  {
        this.FK         = pProp.FK ? true : false;
    } else {
        this.FK         = pProp.fk ? true : false;
    }
    if (pProp.FK_ref)  {
        this.FK_ref     = pProp.FK_ref ? pProp.FK_ref : null;
    } else {
        this.FK_ref     = pProp.fk_ref ? pProp.FK_ref : null;
    }
    this.unique         = pProp.unique ? true : false;
    this.default        = pProp.default ? pProp.default : "";
    this.length         = pProp.length ? pProp.length : 0;
    this.mssql_type     = pProp.mssql_type ? pProp.mssql_type : "";
    this.mysql_type     = pProp.mysql_type ? pProp.mysql_type : "";
    this.code           = null;
    this.isInside       = pProp.isInside ?  true : false;
    this.form           = null;

    // 입력형식 : name, name + namespace, object
    if (pProp.code) {

        // a.코드이름 즉시 입력시 : String
        if (typeof pProp.code === "string") {
            hashCode = this._onwer._onwer.getCode(pProp.code, "");

        // b.코드명 + 네임스페이스 객체 입력시 : Object
        } else if (typeof pProp.code === "object" && 
                pProp.code.name && pProp.code.namesapce) {
            hashCode = this._onwer._onwer.getCode(pProp.code.name, pProp.code.namespace);

        // c.속성 : Object
        } else if (typeof pProp.code === "object") {
            this._onwer._onwer.createCodeObject(pProp.code);
            hashCode = this._onwer._onwer.getCode(pProp.code.name, pProp.code.namespace);
        }

        if (hashCode) {
            this.code = hashCode;
        } else {
            throw new Error('code 오류 :' + pProp.code);
        }
    }
    
    if (typeof pProp.form_type === "string") {
        this.form       = pProp.form_type;
    } else if (typeof pProp.form_type === "object") {
        form = new Form(pProp.form_type);
        if (form) {
            this.form = form;
        } else {
            throw new Error('form 기본 정보 오류 form_type:' + pProp.form_type);
        }
    }
}
(function() {

    // Attr 얻기 
    Attr.prototype.getObject = function(pContext) {
        
        var obj     = {};

        for (var prop in this) {
            if (this[prop] instanceof HashCode || this[prop] instanceof Form ) {
                obj[prop] = this[prop].getObject(pContext);
            } else if (typeof this[prop] !== "function" && prop !== "_onwer") {
                obj[prop] = this[prop];
            }
        }
        return obj;
    };
}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// {"context_code": null}        : 전체 코드
// {"context_code": "state_cd"}  : 지정 코드
function HashCode(pProp) {

    var code    = null;
    
    // 필수 값 검사
    if (typeof pProp.name !== "string" || pProp.name.length <= 0) {
        throw new Error('name 필수값 없음 오류 :');
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
    HashCode.prototype.getObject = function(pContext) {
        
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
    }
    this.type           = "CODE"
    this.key            = pProp.key;
    this.value          = pProp.value;
    this.caption        = pProp.caption ? pProp.caption : "";
}
(function() {

    // Code 얻기 
    Code.prototype.getObject = function(pContext) {
        
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
function Form(pProp) {

    // 필수 값 검사
    if (typeof pProp.form_type !== "string" || pProp.form_type.length <= 0) {
        throw new Error('form_type 필수값 없음 오류 :');
    }

    /**
     * form_type 종류 : text, textarea, password, label, checkbox, radio, select <option>
     */
    this.form_type      = pProp.form_type;
    this.type           = "FORM"
    this.tabindex       = pProp.tabindex ? pProp.tabindex : 99;         // 폼 정렬 순서
    this.max            = pProp.max ? pProp.max : -1;                   // 입력 최대 길이
    this.min            = pProp.min ? pProp.min : -1;                   // 최소 입력 길이
    this.placeholder    = pProp.placeholder ? pProp.placeholder : "";   // 입력 폼 설명 문구
    this.row            = pProp.row ? pProp.row : -1;                   // * textarea 경우
    this.value          = pProp.value ? pProp.value : "";               // 기본값
    this.disabled       = pProp.disabled ? true : false;                // 뷰 여부
    this.readonly       = pProp.readonly ? true : false;                // 읽기 전용 여부
}
(function() {

    // Code 얻기 
    Form.prototype.getObject = function(pContext) {
        
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
        }
    }
    // 참조 삽입
    if (typeof pProp.attr !== "undefined") {
        
        if (!(pProp.attr instanceof Array)) pProp.attr = [pProp.attr];
        
        for (var i = 0; i < pProp.attr.length; i++) {
            attr = this._onwer.getAttr(pProp.attr[i]);
            if (attr instanceof Attr) {
                this.items.push(attr);
            } else {
                console.log('경고!! 대상 Entity 대상 Entity 에 해당 items 명 없음:' + pProp.attr[i]);
            }
        }
    }
}
(function() {

    // Model 얻기 
    Model.prototype.getObject = function(pContext) {
        
        var obj         = {};
        var array       = [];

        for (var i = 0; i < this.items.length; i++) {
            array.push(this.items[i].getObject(pContext));
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
    Procedure.prototype.getObject = function(pContext) {
        
        var obj         = {};
        var array       = [];

        for (var i = 0; i < this.items.length; i++) {
            array.push(this.items[i].getObject(pContext));
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
    }
    this.name           = pProp.name;   // {필수값}
    this.type           =  "PARAM";   // {필수값}
    this.value_type     = pProp.value_type;
    this.length         = pProp.length ? pProp.length : 0;
    this.isOutput       = pProp.isOutput ? true : false;
    this.default        = pProp.default ? pProp.default : "";
    this.mysql_type  = pProp.mysql_type ? pProp.mysql_type : this.mysql_type;
    this.mssql_type  = pProp.mssql_type ? pProp.mssql_type : this.mssql_type;    
}
(function() {

    // Param 얻기 
    Param.prototype.getObject = function(pContext) {
        
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