---------------------------------------
# 폼의 디자인과 기능의 분리

# from 타입 정리
    - type : 
        * 공통 : tabindex
        + text : 문자열
            * max, min, placeHolder
        + passwd : 숨김 문자열
            * max, min
        + textarea : 줄바꿈 + 문자열
            * placeHolder
        + label : 읽기 전용
            *
        + checkbox : checked + value (value 플래그 조건) * 독립
            => 단일 code 속성 or 일반 
        + radio : * 묶음
            => 복수 code 속성
        + select : * 묶음
            => 복수 code 속성
     - 속성
        + max   
        코드 네임스페이스 이용


# 대상
    - 텍스트
        + 문자
            + 최대길이
        + 문자열
        + 문자 (읽기전용)
        + 문자 (passwd)

        + 코드
        + Boolean

분류법
    - 문자
    - 숫자
    - 날짜
    - 기타 : 이진, 특수

JS 자료형
    - String : "asda"
    - Number : 1, -1, 0.1
    - Date 2002-11-11 00:00
    - Object : {}
    - Boolean : true, false
    - Array : []
    - RegExp : /~/

    - input
        + text          : D
        + password      : D
        + submit
        + reset
        + radio : name 같게 여러개 중 선택 : D
            value, 오늘쪽 텍스트
        + checkbox      : D
        + button

        <html5>
        + color
        + date
        + datetime-local
        + email
        + month
        + number
        + range
        + search
        + tel
        + time
        + url
        + week

    - textarea  : D

    - label     : D
    
    - select    : D
        + option : value : Text
        + optgroup
    
    - button

    - fieldset : 요소 그룹
        + legend : 그룹 설명

    <html5>
    - datalist : 검색어 + select
        + option, ..
    - keygen
    - output




---------------------------------------
# 코드화.




---------------------------------------
# 바인딩 순서 정보 





