// 스키마임

(function(global) {
    'use strict';    

    var entityNamespace = "M01.Notice";
    var entity = {
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
    };

    global.Entity                   = global.Entity || {};
    global.Entity[entityNamespace]  = global.Entity[entityNamespace] || entity;

}(this));