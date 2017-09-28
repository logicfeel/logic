<%
'##############################################################################
' FILENAME      : 
'------------------------------------------------------------------------------
' PROGRAM NAME  : 
' AUTHOR        : 김영호
' DESCRIPTION   : 
' HISTORY       :
'------------------------------------------------------------------------------
' DATE        NAME        DESCRIPTION
'------------------------------------------------------------------------------
' 
'##############################################################################

	Option Explicit	        '변수선언 필수
' 	On Error Resume Next 	' 개발시: 주석 >> 완료후 활성화

	session.codepage = 65001
 	Response.CharSet = "utf-8"
%>
<!-- #include virtual="/A-CMN/Common_Fnc.asp" -->
<% 
	Server.Execute "/A-Back/CMN/LoginCheck_Inc.asp"
%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="copyright" content="Copyright(c) White Lab Inc. All Rights Reserved." />
    <title>Logic Admin</title>

    <link rel="stylesheet" type="text/css" href="/A-Back/CMN-UI/CSS/admin_io.css?v6" media="screen" charset="utf-8">
    <link rel="stylesheet" type="text/css" href="/A-Back/CMN-UI/CSS/w3_shadow.css" media="screen" charset="utf-8">
    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>		
    
	<script language="javascript" src="/JS-CMN/jquery.xml2json.js"></script>
	<script language="javascript" src="/JS-CMN/Common.js"></script>
	<script language="javascript" src="/A-Back/CMN/JS/BackCommon.js"></script>
    
</head>
<body>

<div style="width:95%;margin:0 auto"> 

	<div class="headingArea gSubmain">
	    <div class="mTitle">
	        <h1>공지사항</h1>
	    </div>
	    <div class="mBreadcrumb">
	        <ol>
	            <li class="home">홈</li>
	            <li title="현재 위치"><strong>공지사항</strong></li>
	            <li title="현재 위치"><strong>목록</strong></li>
	            <li title="현재 위치"><strong>폼</strong></li>
	        </ol>
	    </div>
	</div>
	
    <form id="frm_default" name="frm_default" method="post">
                
	<input type=hidden id="ntc_idx" name="ntc_idx" value="" />
    <input type=hidden id="state_cd" name="state_cd" value="" />

		               
	<!--###############  폼 내용  Block ###############-->

	<div class="section" id="QA_profile1">
        <div class="optionArea">
            <div class="mOption" style="display: block;">
                <table border="1" summary="">
                <caption>회원정보 조회</caption>
                <colgroup>
                    <col style="width:154px;*width:135px;" />
                    <col style="width:auto;" />
                    <col style="width:154px;*width:135px;" />
                    <col style="width:auto;" />
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">제목 <strong class="icoRequired">필수</strong></th>
                        <td colspan="3">
                        	<input type="text" id="title" name="title" value="" class="fText" style="width:600px;" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">작성자  <strong class="icoRequired">필수</strong></th>
                        <td>
                            <input type="text" name="writer" id="writer" value="" class="fText" style="width:200px;" />
                        </td>
                        <th scope="row">공지타입  <strong class="icoRequired">필수</strong></th>
                        <td>
                            <label class="gLabel"><input type="radio" name="noticeType_cd" id="noticeType_B" value="B" class="fChk" /> 기본</label>
                            <label class="gLabel"><input type="radio" name="noticeType_cd" id="noticeType_T" value="T" class="fChk" /> 상위노출</label>
                        </td>                        
                    </tr>
                    <tr id="create_dt_area">
                        <th scope="row">작성일자</th>
                        <td colspan="3">
                        	<label id="create_dt" class="gLabel">2017-01-01</label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">내용</th>
                        <td colspan="3">
							<textarea name="content" id="content" class="fTextarea" style="width: 98%; height: 300px;" rows="10" cols="20"></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
		<!--###############  검색 버튼 Block ###############-->
		<div class="mButton gCenter">
		    <a id="btn_Insert" class="btnSubmit"><span>등록</span></a>
		    <a id="btn_Update" class="btnSubmit"><span>수정</span></a>
		    <a id="btn_Delete" class="btnSubmit"><span>삭제</span></a>
		    <a id="btn_List" class="btnSearch reset"><span>목록</span></a>
		    <a id="btn_Reset" class="btnSearch reset"><span>초기화</span></a>
		</div>
    </div>
    
	<!-- 도움말 영역 -->

	<!-- //도움말 영역 -->
    </form>
    
        
	<!--###############  처리중 Block ###############-->
	<div class="mLoading typeStatic">
	    <p>처리중입니다. 잠시만 기다려 주세요.</p>
	    <img src="http://img.echosting.cafe24.com/suio/ico_loading.gif" alt="" />
	</div>
	<div id="part_Overlay" class="w3-overlay w3-animate-opacity" style="cursor:pointer;z-index:90;"></div>
	<!--###############  페이지 Block ###############-->
	

</div> 

<script type="text/javascript">
	
    var Main = {};
    
    //----------------------------------------
    // 에러처리 및 메인 로딩
    //----------------------------------------
	$(document).ajaxError(function (event, xhr, options, exc) {
	  if (xhr.status != 200){
	    var msg = "";
	    msg = msg + "# options.data : " + options.data + " , ";
	    msg = msg + "# options.url : " + options.url + " , ";
	    msg = msg + "# options.contentType : " + options.contextType + " , ";
	    msg = msg + "# xhr.status : " + xhr.status + " , ";
	    msg = msg + "# xhr.statusText : " + xhr.statusText + " , ";
	    msg = msg + "# xhr.responseText : " + xhr.responseText + " , ";
	
	    Msg("ALERT", "ajaxError", msg, "");
	  }
	});

    $(document).ready(function () {
        Main.Init();
    });



    //----------------------------------------
    // 메인 초기화
    //----------------------------------------
    Main.Init = function () {

		// 값 설정
		Main.Form 			= $("#frm_default")[0];
        Main.callbackURL 	= "Notice_Frm_v2.C.asp";
        Main.listURL 		= "Notice_Lst_v2.asp";
        

        // Get 로딩
        Main.Params = ParamGet2JSON(location.href);

        // 입력값 검사
        Main.ParamsValid();

        // 입력값 검사
        Main.Mode_Button(Main.Params.cmd);

        // 버튼 이벤트 등록
        Main.Event_Reg();

        if (Main.Params.cmd == "INSERT")
            this.Mode_Insert();
        else if (Main.Params.cmd == "UPDATE")
            this.Mode_Update();

    };

    //----------------------------------------
    // 이벤트 등록
    //----------------------------------------
    Main.Event_Reg = function () {
        
        $("#btn_List").click(function () {
            Main.C_GoList();
        });
        
        $("#btn_Insert").click(function () {
            Main.Proc_Insert();
        });
        
        $("#btn_Update").click(function () {
            Main.Proc_Update();
        });
        
        $("#btn_Delete").click(function () {
            Main.Proc_Delete();
        });
		
		$("#btn_Reset").click(function () {
            Main.Form.reset();
        });
    };
    
	//----------------------------------------
    // cmd 확인 * 필수  : INSERT / UPDATE
    //----------------------------------------
    Main.ParamsValid = function () {

        if (typeof (Main.Params) == "undefined" || typeof (Main.Params.cmd) == "undefined" || Main.Params.cmd == "") {
            Msg("ALERT", "접근경로", "잘못된 접근경로입니다.(cmd)", "B");
            return;
        }

        if (!(Main.Params.cmd == "INSERT" || Main.Params.cmd == "UPDATE")) {
            Msg("ALERT", "접근경로", "잘못된 접근경로입니다.(INSERT/UPDATE)", "B");
            return;
        }

        if (Main.Params.cmd == "UPDATE"
    			&& typeof (Main.Params.ntc_idx) == "undefined" && Main.Params.ntc_idx == ""
    			) {
            Msg("ALERT", "접근경로", "잘못된 접근경로입니다.(admin_id)", "B");
            return;
        }
        
    };

    //----------------------------------------
    // 화면 이동
    //----------------------------------------
	Main.C_GoList = function () {

	    var params = "";
		
		if (typeof Main.Params.selPage  !== "undefined" && typeof Number(Main.Params.selPage) ===  "number"){
			params += "&selPage=" + Main.Params.selPage;
		}
			
		if (typeof Main.Params.lineCnt  !== "undefined" && typeof Number(Main.Params.lineCnt) ===  "number"){
			params += "&lineCnt=" + Main.Params.lineCnt;
		}
	    
	    // REVIEW: 검색 조건이 추가되면  매칭이 안되는 이슈가 있음
	    //window.history.go(-1);
	    location.href = Main.listURL + "?cmd=SELECT" + params;	    
	};
	
	//----------------------------------------
	// 회면 모드 설정
	//----------------------------------------
    // 등록 모드
    Main.Mode_Insert = function () {
        $("#create_dt_area").hide();
    };

    // 수정 모드
    Main.Mode_Update = function () {
        // admin_id 수정 금지 
        //$("#create_dt").attr("readonly", "")
        // 데이터 가져옴
        this.M_ViewBind(Main.Params.ntc_idx);
    };

    // 버튼 모드
    Main.Mode_Button = function (cmd) {

        //$("#btn_List").hide();    // 목록은 기본 보기임
        $("#btn_Insert").hide();
        $("#btn_Update").hide();
        $("#btn_Delete").hide();
        $("#btn_Reset").hide();

        if (cmd == "INSERT") {
            $("#btn_Insert").show();
            $("#btn_Reset").show();
        } else if (cmd == "UPDATE") {
            $("#btn_Update").show();
            $("#btn_Delete").show();
        }
    };
    

	//----------------------------------------
	// Valid 입력값 유효성 검사
	//----------------------------------------
    
    Main.Valid_Insert = function(){
        // 입력값 유효성 검사
        try{
            var frm = Main.Form;
			if(isNull(frm.title, '제목')){
	            return false;		
            }else if(isNull(frm.writer, '작성자')){
	            return false;		
            }else if(isNull(frm.noticeType_cd, '공지타입')){
	            return false;		
            }else{
	            return true;
            }
		} catch (e) {JsErrorMessage(e); }        
    };

    Main.Valid_Update = function(){
        // 입력값 유효성 검사
        try{
            var frm = Main.Form;
			if(isNull(frm.ntc_idx, '일련번호')){
	            return false;			            
            }else if(isNull(frm.title, '제목')){
	            return false;		
            }else if(isNull(frm.writer, '작성자')){
	            return false;		
            }else if(isNull(frm.noticeType_cd, '공지타입')){
	            return false;		
            }else{
	            return true;
            }
		} catch (e) {JsErrorMessage(e); }        
    };

    Main.Valid_Delete = function(){
        // 입력값 유효성 검사
        try{
            
            if (confirm('삭제하시겠습니까?')){

                var frm = Main.Form;
				if(isNull(frm.ntc_idx, '일련번호')){
	                return false;		
                }else{
	                return true;
                }
            }
		} catch (e) {JsErrorMessage(e); }        
    };

	//----------------------------------------
	// Proc 처리 모드
	//----------------------------------------
	
    Main.Proc_Insert = function () {
        if (Main.Valid_Insert())                       
            Main.M_Insert();
    };
                
    Main.Proc_Update = function () {
        if (Main.Valid_Update())                       
            Main.M_Update();
    };

    Main.Proc_Delete = function () {
        if (Main.Valid_Delete())                       
            Main.M_Delete();
    };

	//----------------------------------------
	// 뷰 바인딩
	//----------------------------------------
    // 모델-뷰 바인딩 : Ajax
    Main.M_ViewBind = function (ntc_idx) {
		try {
	        $.ajax({
	            type : 'POST',
	            url : Main.callbackURL,
	            data :
				{
				    cmd			: "SELECT",
				    ntc_idx		: ntc_idx
				},
	            async : false, 	// 동기로 임시로 처리(멀티요청)
	            success	: function (result) {
	                //alert("Data: " + result);
	                if (result != null) {
	                    Main.Model = $.xml2json(result);
	                }
	                Main.V_ViewBind();
	            }
	        });
        } catch (e) {JsErrorMessage(e); }        
    };

    // 뷰 바인딩
    Main.V_ViewBind = function () {
		try {
	        //$("#CList").html("");
	        if (typeof (Main.Model.db) == "undefined") {
	            Msg("MODAL", "자료없음", "자료가 존재하지 않습니다.", "");
	            return;
	        }
	        $("#ntc_idx").val(Main.Model.db.row.ntc_idx);
	        $("#state_cd").val(Main.Model.db.row.state_cd);
   	        $("#title").val(Main.Model.db.row.title);
	        $("#writer").val(Main.Model.db.row.writer);
	        $("#content").val(Main.Model.db.row.content);
	        if (Main.Model.db.row.noticeType_cd == "B")
	            $("#noticeType_B").attr("checked", "checked");
	        else if (Main.Model.db.row.noticeType_cd == "T")
	            $("#noticeType_T").attr("checked", "checked");
			
	        $("#create_dt").text(Main.Model.db.row.create_dt);
        
        } catch (e) {JsErrorMessage(e); }        
    };

	//----------------------------------------
	// 모델 처리
	//----------------------------------------
	
    Main.M_Insert = function () {
		try {
	        $.post(Main.callbackURL,
		        {
		            cmd				: "INSERT",
		            title			: $("#title").val(),
		            writer			: $("#writer").val(),
		            content			: $("#content").val(),
		            noticeType_cd	: $("input[type='radio'][name=noticeType_cd]:checked").val()
		        },
		        function (data, status) {
					var result = $.xml2json(data);
					Main.C_StatusMsg(result, status);
		        	if(status = "success" &&  Number(result.return) >= 0)
		        		location.href = Main.listURL;
		        },
		        "xml"
		        );
        } catch (e) {JsErrorMessage(e);}                     
	};
	
	
    Main.M_Update = function () {
		try {
	        $.post(Main.callbackURL,
		        {
		            cmd				: "UPDATE",
		            ntc_idx			: $("#ntc_idx").val(),
		            title			: $("#title").val(),
		            writer			: $("#writer").val(),
		            content			: $("#content").val(),
		            noticeType_cd	: $("input[type='radio'][name=noticeType_cd]:checked").val()
		        },
		        function (data, status) {
		        	var result = $.xml2json(data);
					Main.C_StatusMsg(result, status);
		        },
		        "xml"
		        );
        } catch (e) {JsErrorMessage(e);}        
	};

    Main.M_Delete = function () {
		try {
	        $.post(Main.callbackURL,
		        {
		            cmd			: "DELETE",
		            ntc_idx		: $("#ntc_idx").val()
		        },
		        function (data, status) {
		        	var result = $.xml2json(data);
					Main.C_StatusMsg(result, status);
		        	if(status = "success" &&  Number(result.return) >= 0)
		        		location.href = Main.listURL;
		        },
		        "xml"
		        );
        } catch (e) {JsErrorMessage(e);}              
	};

	
	//----------------------------------------
	// 바인딩 결과 메세지 
	//----------------------------------------
	Main.C_StatusMsg = function(result, status) {


		if(status = "success" &&  Number(result.return) >= 0)
			alert("정상 처리 되었습니다.");
		else if(status = "success")
			alert("DB 처리 오류가 발생하다. 오류코드:" + result.return);            	
		else if(status = "error")
			alert("ajax 처리중 오류가 발생하다.");
		else if(status = "timeout")
			alert("네트워크 접속 오류가 발생하다.");
		else
			alert("Data: " + data + "\nStatus: " + status);
	};


</script>

</body>
</html>

<% Call AspErrorMsg(Err) %>