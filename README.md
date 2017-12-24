# Logic/Module_Test

## 모듈 목록

    - MnAdmn    : 모듈 관리자 (로그인, 계정 목록/등록/수정)
    - MnAuth    : 모듈 권한검사
    - MnCMN     : 모듈 공통 (DB접속, MSSQL2008, 전역 함수/클래스)

## NPM 모듈 목록

    - MnAuth_M  : NPM 권한검사 모델 모듈
    - MnAdmn_M  : NPM 관리자 모델 모듈
    - MnAdmn_C  : NPM 관리자 컨트롤 모듈 ( ASP, MnCMN 종속)
    - MnCMN     : NPM 공통 모듈

### MnAuth_M

    - MnAuth_FN_check   : 권한 검사

### MnAdmn_M

    - MnAdmn_Account                    : 계정엔티티
    - MnAdmn_Account_SP_C               : 계정 등록
    - MnAdmn_Account_SP_U               : 계정 수정
    - MnAdmn_Account_SP_LX              : 계정 목록
    - MnAdmn_Account_SP_loginCheck_R    : 계정 로그인 검사
    - MnAdmn_FN_idCheck                 : 아이디 유효성 검사   (가상)

### MnAdmn_C
    src
    - MnAdmn_login.Frm.asp      : 관리자 로그인 화면
    - MnAdmn_login.Frm.C.asp    : 관리자 로그인 화면 콜백
    - MnAdmn_account.Lst.asp    : 관리자 계정 목록
    - MnAdmn_account.Lst.C.asp  : 관리자 계정 목록
    - MnAdmn_account.Frm.asp    : 관리자 계정 등록 폼
    - MnAdmn_account.Frm.C.asp  : 관리자 계정 등록 폼
    - MnAdmn_id_Chk.Frm.P.asp   : 관리자 아이디 검사 폼
    - MnAdmn_id_Chk.Prc.asp     : 관리자 아이디 검사 처리

    scss 
    - css/theme.scss            : 테마 오버라이딩

    dist/css 
    - admin_io.css              : 관리자 입출력 스타일
    - w3_shadow.css             : w3 수입 기본 스타일  * 검토필요

    dist/images
    - logo.jpg                  : 로고
    - admin/bot.jpg [...]       : 관리자 스타일 관련 이미지들..

    dist/js
    - Main.js                   : 콜백 처리

### MnCMN
    src
    - MnCMN_DBUtils_Cls.asp     : 공통 DB 관리 클래스
    - MnCMN_Fnc.asp             : 공통 함수

    dist/css
    - REST.css                  : 기본 css rest

    dist/js
    - disPage.js                : 페이지 JS 클래스

    

        

