
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Context() {
    
    var _entity_version     = "1.0.0"
    
    this.preContext         = null;
}
(function() {

    Context.prototype._parse = function() {
        return [];
    };

    Context.prototype.load = function(pJSON) {

    };

    Context.prototype.getContext = function() {
        return [];
    };

    Context.prototype.setEntity = function(pJSON) {
    };

}());
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function EntityModel() {
    
    var _version        = "1.0.0"

    this.entities       = [];
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

        if (typeof pJSON.model !== "undefined") {
            for (var i = 0; i < pJSON.model.length; i++) {
                if (pJSON.model[i].name !== "undefined" && pJSON.model[i].name.length > 0) {
                    model = new Model(pJSON.model[i], this);
                    entity.model.push(model);
                }
            }
        }

        if (typeof pJSON.sp !== "undefined") {
            for (var i = 0; i < pJSON.sp.length; i++) {
                if (pJSON.sp[i].name !== "undefined" && pJSON.sp[i].name.length > 0) {
                    proceduce = new Model(pJSON.sp[i]);
                    entity.sp.push(proceduce);
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

        this.entities.push(entity);
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
    if (typeof pProp.name !== "string" || pJSON.model[i].name.length > 0 ||  
        typeof pProp.type !== "string" || pJSON.model[i].type.length > 0) {
        throw new Error('name type 필수값 없음 오류 :');
        return null;
    }

    this.name       = pProp.name;
    this.type       = pProp.type;

    this.namespace  = pProp.namespace ? pProp.namespace : this.namespace;
    this.title      = pProp.title ? pProp.title : this.title;
}
(function() {

    // { entity_pk_list : null }
    Entity.prototype.PK_list = function() {
        return [];
    };

    // { entity_fk_list : null }
    Entity.prototype.FK_list = function() {
        return [];
    };

    // { entity_notnull_list : null }
    Entity.prototype.notNull_list = function() {
        return [];
    };

    // { entity_null_list : null }
    Entity.prototype.null_list = function() {
        return [];
    };

    // { entity_valid_[C|R|U|D|L] : null }
    Entity.prototype.valid = function(pCRUDL) {
        return [];
    };

    // { entity_code : "속성명" }
    // { entity_code : null } : [[]]  전체 이중 배열 리턴
    Entity.prototype.code = function(pAttrName) {
        return [];
    };

    // 프로시저 찾기 SP
    Entity.prototype.getProcedure = function(pName) {
        for (var i = 0; i < this.sp.length; i++) {
            if (this.sp[i].name === pName) return this.sp[i];
        }
        return null;
    };    

}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Attr(pProp) {

    this.name           = "";           // {필수}
    this.type           = "String";     //  JS 자료 타입
    this.caption        = "";
    this.isNull         = true;
    this.PK             = false;
    this.FK             = false;
    this.FK_ref         = null;
    this.unique         = false;
    this.default        = "";
    this.length         = -1;
    this.DB_mysql_type  = "";
    this.DB_mssql_type  = "";
    this.code           = null;

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pJSON.model[i].name.length > 0 ) {
        throw new Error('name 필수값 없음 오류 :');
        return null;
    }

    this.name       = pProp.name;

    this.type       = pProp.type ? pProp.type : this.type;
    this.caption    = pProp.caption ? pProp.caption : this.caption;
    this.isNull     = pProp.isNull ? pProp.isNull : this.isNull;
    this.PK         = pProp.PK ? pProp.PK : this.PK;
    this.FK         = pProp.FK ? pProp.FK : this.FK;
    this.FK_ref     = pProp.FK_ref ? pProp.FK_ref : this.FK_ref;
    this.unique     = pProp.unique ? pProp.unique : this.unique;
    this.default    = pProp.default ? pProp.default : this.default;
    this.length     = pProp.length ? pProp.length : this.length;
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// CRUD + List + Etc
function Model(pProp, pOnwer) {
    
    // I[NSERT] | U[PDATE] | S[ELECT] | L[IST] | D[ELETE]
    // BIND-VIEW [BV] | BIND-LIST [BL] | {기타 지정 이름..}
    this._onwer         = pOnwer;
    this.name           = "";   
    this.items          = [];   // { entity_model_items : null }
    this.sp             = null; // { entity_model_sp : null }

    // 필수 값 검사
    if (typeof pProp.name !== "string" || pJSON.model[i].name.length > 0 ) {
        throw new Error('name 필수값 없음 오류 :');
        return null;
    }

    this.name       = pProp.name;

    if (pProp.sp) {
        this.sp =  this._onwer.getProcedure(pName);
    }
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Procedure(pProp) {
    
    this.name           = "";
    this.type           = "";   // SP | FN | FT
    this.input          = [];
    this.output         = [];
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Param(pProp) {

    this.name           = "";
    this.type           = "";
    this.DB_mysql_type  = "";
    this.DB_mssql_type  = "";
    this.length         = "";
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function HashCode(pProp) {
    this.key           = "";
    this.value         = "";
}

// ----------------------------------------------------


/**
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
    entity: {
        name: "Notice",
        namespace: "C01.Module01"
    }
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