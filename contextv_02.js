
var context = {
    page: [
        {
            name: "Notice_Frm.asp",                                 /* 기본값-파일명 */
            form_hidden: ["ntc_idx", "sto_id", "state_cd"],         /* 엔티티-PK */
            from_group: [                                           /* 모델-Create */
                {entity_cmd_model: "INSERT"}
            ],             
            form_button: {entity_cmd_model: "ALL"},                 /* 모델-플래스 */
            help: "은 필수 입력 사항입니다",                          /* 기본값-설명 */
            vaild: {entity_cmd_model: "ALL"},                       /* 테이블-[PK,필수유무]  : 입력검사 */
            cmd: {entity_cmd_model: "ALL"},                         /* 모델-CRUD */
            bind: {entity_cmd_model: "SELECT"},                     /* 모델-Read */
        },
        {
            name: "Notice_Frm.C.asp",                               /* 테이블-파일명 */
            vaild: [                                                /* 테이블-[PK,필수유무]  : 입력검사 */
                {name: "INSERT", entity_cmd_vaild: "INSERT"},
                {name: "UPDATE", entity_cmd_vaild: "UPDATE"},
            ],
            cmd: [                                                  /* SP- */
                {name: "DELETE", entity_cmd_sp: "M03_SP_Notice_D"},
                {name: "UPDATE", entity_cmd_sp: "M03_SP_Notice_U"},
                {name: "INSERT", entity_cmd_sp: "M03_SP_Notice_C"},
                {name: "SELECT", entity_cmd_sp: "M03_SP_Notice_RX"}
            ],
        },
        {
            name: "Notice_Lst.asp",                                 /* 기본값-파일명 */
            list: {entity_cmd_model: "LIST"},                       /* 모델-List */
            listCnt: 10,                                            /* 기본값-목록수 */
            sto_id: "S00001",                                       /* 기본값-코드  <= 기본값 지정형태 */        
            idx: {form_name:"ntc_idx"},                             /* 엔티티-PK */
            pageCnt: 5,                                             /* 기본값-페이지수 */
            bind: {name: "SELECT", entity_cmd_model: "LIST"},
            mapping: [
                {
                    name: "C_NoticeType", items: [
                        {key: "B", value:"일반"},
                        {key: "T", value:"공지"}
                    ]
                }
            ]
        },
        {
            name: "Notice_Lst.C.asp",                               /* 기본값-파일명 */
            cmd: [
                {name: "LIST", entity_cmd_sp: "M03_SP_NoticeList_RX"}
            ],
        }        
    ],
    common: {
        author: "김영호",
        date: Date(),
        title: "관리자",
        subject: "공지사항",
        caption: "대출세상.Net,  대출직거래.kr   대출직거래.com",
        form_list: [
            {
                name: "ntc_idx", 
                title: "일련번호", 
                type: "hidden", 
                value: ""
            },
            {
                name: "sto_id", 
                title: "상점코드", 
                type: "hidden", 
                value: ""
            },
            {
                name: "state_cd", 
                title: "상태", 
                type: "hidden", 
                value: ""
            },
            {
                name: "title", 
                title: "제목", 
                type: "text", 
                caption: "", 
                placeholder: "제목을 입력해 주세요.", 
                maxlength: "50"
            },
            {
                name: "writer", 
                title: "작성자", 
                type: "text", 
                caption: "", 
                maxlength: "10"
            },
            {
                name: "content", 
                title: "내용", 
                type: "text", 
                caption: "", 
                rows: "10"
            },
            {
                name: "noticeType_cd", 
                title: "공지타입", 
                type: "radio", 
                caption: "", 
                item : [
                    {id: "noticeType_B", title: "기본", value: "B"},
                    {id: "noticeType_B", title: "상위", value: "T"}
                ]
            },
            {
                name: "create_dt", 
                title: "등록일자", 
                type: "text", caption: ""
            },
            {
                name: "cnt", 
                title: "조회수", 
                type: "text", 
                caption: ""
            }
        ],
        entity_list: [],

        list_url: "Notice_Lst.asp",
        form_url: "Notice_Frm.asp",
        form_bind_url: "Notice_Frm.C.asp",
        list_bind_url: "Notice_Lst.asp",
        abc: bbb(),
        abb: 2
    }

};

/**
 * 테스트 임시 소스
 */
var ccc = function() {return 3;};

var abc = {
    aa: 11, 
    bb : function(){return 2;},
    cc: ccc()   /** 호출 결과가 들어감 */
};