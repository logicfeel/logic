/*
    [지정된 스키마]

    [컴파일 스키마]
    - entity_items: null        >> 전체 속성
    - entity_items: "속성명"
    - entity_model:  null       >> 전체 모델
    - entity_model:  "모델명"
    - entity_model_sp : null
    - entity_sp: null           >> 전체 SP
    - entity_sp: "SP이름"
    - entity_pk_list : null
    - entity_fk_list : null 
    - entity_notnull_list : null
    - entity_null_list : null
    - entity_valid: "CRUDL" 
    - entity_code : null        >> 전체 코드
    - entity_code : "속성명"

    * 이름[0] 배열 선택시 해당 엔티티로 세팅됨

    [구문스키마]
    - entities: [
        {
            name: "~",
            namespace: ""
        }
    ]
    - pages: [
        {
            filepath: "~",
            command: ""
        }
    ]


*/