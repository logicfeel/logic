

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function EntityModel() {

}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Entity() {

    this.name       = "";
    this.namespace  = "";
    this.title      = "";
    this.type       = "";   // table | model
    this.items      = [];   // { entity_items : null }
    this.models     = [];   // { entity_model : "모델명" }
    this.sp         = [];   // { entity_sp : "sp이름" }

    

}
(function() {

    // { entity_pk_list : null }
    Entity.prototype.PK_list = function() {
        return [];
    };

    // { entity_pk_list : null }
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

}());

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Attr() {

    this.name           = "";
    this.caption        = "";
    this.isNull         = true;
    this.PK             = false;
    this.FK             = false;
    this.FK_ref         = null;
    this.unique         = false;
    this.default        = "";
    this.type           = "";     // JS 자료 타입
    this.length         = -1;
    this.DB_mysql_type  = "";
    this.DB_mssql_type  = "";
    this.code           = null;
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// CRUD + List + Etc
function Model() {
    
    // I[NSERT] | U[PDATE] | S[ELECT] | L[IST] | D[ELETE]
    // BIND-VIEW [BV] | BIND-LIST [BL] | {기타 지정 이름..}
    this.name           = "";   
    this.items          = [];   // { entity_model_items : null }
    this.sp             = null; // { entity_model_sp : null }
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Procedure() {
    this.name           = "";
    this.type           = "";   // SP | FN | FT
    this.input          = [];
    this.output         = [];
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function Param() {

    this.name           = "";
    this.type           = "";
    this.DB_mysql_type  = "";
    this.DB_mssql_type  = "";
    this.length         = "";
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function HashCode() {
    this.key           = "";
    this.value         = "";
}

// ----------------------------------------------------

var e = new Entity();
e.name = "Notice";


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
    test: {entity_PK_list: null},
    test: {entity_PKs: null},
    test: {entity_valid: "SELECT"},
    v_cmd: [
        {name: "DELETE", entity_model: "SELECT"},
        {name: "UPDATE", entity_model_sp: "UPDATE"},
    ],
    cmd: [                                              // ~.C.asp 콜백사용
        {name: "DELETE", entity_model_sp: "DELETE"},
        {name: "UPDATE", entity_sp: "M03_SP_Notice_U"},
        {name: "INSERT", entity_sp: "M03_SP_Notice_C"},
        {name: "SELECT", entity_sp: "M03_SP_Notice_RX"}
    ],
    bind: {
        "list": [
            "ntc_idx",          // [0]
            "title",            // [1]
            "noticeType_cd",    // [2]
            "writer"            // [3]
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
    cmd: [                                              // ~.C.asp 콜백사용
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