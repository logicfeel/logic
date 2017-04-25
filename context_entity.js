
var context = {
    page: [
        {
            name: "Notice_Frm.asp",
            form_hidden: ["ntc_idx", "sto_id", "state_cd"],
            form_button: [
                {id: "btn_List", text: "목록"},
                {id: "btn_Insert", text: "목록"},
                {id: "btn_Update", text: "목록"},
                {id: "btn_Delete", text: "목록"}
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
                {name: "DELETE", sp_name: "M03_SP_Notice_D"},
                {name: "UPDATE", sp_name: "M03_SP_Notice_U"},
                {name: "INSERT", sp_name: "M03_SP_Notice_C"},
                {name: "SELECT", sp_name: "M03_SP_Notice_RX"}
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
                {name: "SELECT", sp_name: "M03_SP_NoticeList_RX"}
            ],
        }        
    ],
    common: {
        author: "김영호",
        date: Date(),
        title: "관리자",
        subject: "공지사항",
        caption: "대출세상.Net,  대출직거래.kr   대출직거래.com",
        entity: {
            name : "~~git",
            sp: [
                {name: "M03_SP_NoticeList_RX"},
                {name: "M03_SP_Notice_RX"},
                {name: "M03_SP_Notice_C"},
                {name: "M03_SP_Notice_U"},
                {name: "M03_SP_Notice_D"}
            ],
            tables: [
                {
                    name: "Notice",
                    columns: [
                        {
                            name: "ntc_idx",
                            datatype: "string",
                            caption: "일련번호"
                        },
                        {
                            name: "noticeType_cd",
                            datatype: "string",
                            caption: "일련번호"
                        },
                        {
                            name: "title",
                            datatype: "string",
                            caption: "제목"
                        },
                        {
                            name: "writer",
                            datatype: "string",
                            caption: "작성자"
                        },
                        {
                            name: "create_dt",
                            datatype: "string",
                            caption: "등록일자"
                        },
                        {
                            name: "cnt",
                            datatype: "string",
                            caption: "조회수"
                        }
                    ]
                }
            ]
        },
        list_url: "Notice_Lst.asp",
        form_url: "Notice_Frm.asp",
        form_bind_url: "Notice_Frm.C.asp",
        list_bind_url: "Notice_Lst.asp",
    }

};