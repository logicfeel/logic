/*
    [지정된 스키마]

    [컴파일 스키마]
    - entity_items: null        >> 전체 속성

        > "test_entity": {"entity_items": null}
        > "test_entity": [
                {...}
                ..
            ]

    - entity_items: "속성명"
        > "test_entity_a": {"entity_items": "sto_id"}
        > "test_entity_a": {..}

    - entity_model:  null       >> 전체 모델
        > "test_model": {"entity_model": null}
        > [
            {
                "name": "INSERT",
                "items": [
                    {...}
                    ..
                ]
            }
            ..
        ]

    - entity_model:  "모델명"
        > "test_model_a": {"entity_model": "UPDATE"}
        > "test_model_a": {
            "name": "UPDATE",
            "items": [
                {...}
                ..
            ]
        }

    - entity_model_sp : "모델명"    // 없을시 null
        > "test_model_sp": {"entity_model_sp": "UPDATE"}
        > "test_model_sp": {
            "name": "M03_SP_Notice_U",
            "type": "SP",
            "input": [ {...} .. ],
            "output": [ {...} .. ]
        }

    - entity_sp: null           >> 전체 SP
        > "test_sp_all": {"entity_sp": null}
        > [
            {
                "name": "M03_SP_Notice_C",
                "type": "SP",
                "input": [ {...} .. ],
                "output": [ {...} .. ]
            }
            ...
        ]

    - entity_sp: "SP이름"
        > "test_sp": {"entity_sp": "M03_SP_Notice_U"}
        > {
                "name": "M03_SP_Notice_C",
                "type": "SP",
                "input": [ {...} .. ],
                "output": [ {...}  .. ]
           }

    - entity_pk_list : null
        > "test_f_fk": {"entity_fk_list": null}
        > "test_f_fk": [
            {...}
            ..
           ] 

    - entity_fk_list : null 
        > "test_f_pk": {"entity_pk_list": null}
        > "test_f_pk": [
            {...}
            ..
        ]

    - entity_notnull_list : null
        > "test_f_nnull": {"entity_notnull_list": null}
        > "test_f_notnull": [
            {...}
            ..
        ]

    - entity_null_list : null
        > "test_f_null": {"entity_null_list": null}
        > "test_f_null": [
            {...}
            ..
        ]

    - entity_valid: null        >>  없음이 정상임
        > "test_f_valid": {"entity_valid": null}
        > []


    - entity_valid: "CRUDL" 
        > "test_f_vaild_C": {"entity_valid": "C"}
        > "test_f_vaild_C": [
            {...}
            ..
        ]

    - entity_code : null        >> 전체 코드
        > "test_c_all": {"entity_code": null}
        > "test_c_all": [
            {
                "name": "title",
                "items": [
                    {...}
                    ..
                ]
            }
            ..
        ]

    - entity_code : "속성명"
        > "test_c": {"entity_code": "state_cd"}
        > "test_c": {
             "name": "state_cd",
             "items": [
                {..}
                ..
             ]
          }


    * 이름[0] 배열 선택시 해당 엔티티로 세팅됨

    [구문스키마]
    - entities: [
        {
            name: "~",
            namespace: ""
        }
        ..
    ]
    - pages: [
        {
            filepath: "~",
            command: ""
        }
        ..
    ]


*/