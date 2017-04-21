// 스키마임

(function(global) {
    'use strict';    


    /**
     * [ 필요 정보]
     * - 테이블명
     *      + 컬럼
     *          ++ 기본 요구사항 : 컬럼명, 타입, 설명, 기본값, 유일성(PK)
     *          ++ 선택 요구사항 : 필수유무, 길이 
     *          ++ 상세자료타입 (DB별로), mssql_type:"", mysql_type:""
     *              (가능 컨버팅 타입 어떤식으로 매칭 할건지...)
     *          ++ TODO: 이후 >> PK, FK, 인덱스
     * - 테이블 관계 정보
     *      + 외부 테이블에 대한 참조  (* 어지간하면 관리 안함) => 논리적 의미 참조만 함
     * - 모듈명
     * - 모듈 버전
     * - SP / FN 의 기능처리
     * - 엔티티타입 : U (사용자테이블), P(저장프로시저), FN(함수), V(뷰), 테이블 함수
     *  (* 저장프로시저, 함수, 뷰, 쿼리는 이후에 파싱 형태 확장 가능함)
     */

    var entityInfoSample = {
        tables: [
            {
                name: "",
                columns: [
                    {
                        /* 필수 */
                        name: "",
                        datatype: "",

                        /* 선택 */
                        default: "", 
                        caption: "",
                        unique: false,

                        /* 특성선택 */
                        pk: false,
                        pk_sort: "ASC",
                        fk: "tableName.columnName",
                        isNull: true,
                        size: 0,
                        mssql_type: "",
                        mysql_type: "",
                        identity: 1
                    }
                ]
            }
        ],

        // relation: [
        //     {
        //         table.
        //     }
        // ],

        /* TODO: */
        sp: {},
        fn: {}
    };

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



    function EntityModule() {

        EntityModule.prototype.addTable = function() {
        };
    }


    global.Entity                   = global.Entity || {};
    global.Entity[entityNamespace]  = global.Entity[entityNamespace] || entity;

}(this));