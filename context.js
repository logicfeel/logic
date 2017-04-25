
var context = {
    page: [
        {
            name: "Notice_Frm.asp",
            form_hidden: ["ntc_idx", "sto_id", "state_cd"],
            from_group: ["title", "writer", "content"],
            form_button: [
                {id: "btn_List", text: "목록"},
                {id: "btn_Insert", text: "등록"},
                {id: "btn_Update", text: "수정"},
                {id: "btn_Delete", text: "삭제"}
            ],
            help: "은 필수 입력 사항입니다",
            vaild: [
                {name: "DELETE", form_name: ["ntc_idx", "sto_id"]},
                {name: "UPDATE", form_name: ["ntc_idx", "sto_id", "title", "writer", "noticeType_cd"]},
                {name: "INSERT", form_name: ["sto_id", "title", "writer", "noticeType_cd"]},
            ],
            cmd: [
                {name: "DELETE", form_name: "ntc_idx" },
                {name: "UPDATE", form_name: ["ntc_idx", "sto_id", "title", "writer", "content", "noticeType_cd"]},
                {name: "INSERT", form_name: ["sto_id", "title", "writer", "content", "noticeType_cd"]},
                {name: "SELECT", form_name: ["ntc_idx", "sto_id"]}
            ],
            bind: [
                {form_name: "sto_id", entity_name: "sto_id"},
                {form_name: "ntc_idx", entity_name: "ntc_idx"}
            ]
        },
        {
            name: "Notice_Frm.C.asp",
            vaild: [
                {name: "DELETE", form_name: ["ntc_idx", "sto_id"]},
                {name: ["INSERT","UPDATE"], form_name: ["title", "writer", "noticeType_cd"]},
            ],
            cmd: [
                {name: "DELETE", sp_name: "M03_SP_Notice_D", form_name: ["ntc_idx"] },
                {name: "UPDATE", sp_name: "M03_SP_Notice_U", form_name: ["ntc_idx", "sto_id", "title", "writer", "content", "noticeType_cd"]},
                {name: "INSERT", sp_name: "M03_SP_Notice_C", form_name: ["sto_id", "title", "writer", "content", "noticeType_cd"]},
                {name: "SELECT", sp_name: "M03_SP_Notice_RX", form_name: ["ntc_idx"]}
            ],
        },
        {
            name: "Notice_Lst.asp",
            list: {form_title: ["title", "noticeType_cd", "writer", "cnt"]},
            listCnt: 10,
            sto_id: "S00001",
            idx: {form_name:"ntc_idx"},
            pageCnt: 5,
            bind: [
                {form_name: "sto_id", entity_name: "sto_id"},
                {form_name: "ntc_idx", entity_name: "ntc_idx"}
            ]
        },
        {
            name: "Notice_Lst.C.asp",
            cmd: [
                {name: "SELECT", sp_name: "M03_SP_NoticeList_RX", form_name: ["sto_id"], param_name: ["selPage", "lineCnt"]}
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
    }

};