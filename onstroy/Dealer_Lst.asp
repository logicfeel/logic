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
%>
<% 
	Option Explicit	        '변수선언 필수
'	On Error Resume Next 
	Response.buffer = True	
	Response.expires = 0
%>
<% session.codepage = 65001 %>
<% Response.CharSet = "utf-8" %>
<% 
	Server.Execute "/A-Back/CMN/LoginCheck_Inc.asp"
%>
<%	

	Dim topPath
	topPath = "/A-Back/CMN-UI/"	
	
	
	Dim sto_idx, admin_id, admin_idx, admin_nm 
	sto_idx 	= Request.Cookies("LGC")("STO_IDX")
	admin_idx	= Request.Cookies("LGC")("ADMIN_IDX")
	admin_id	= Request.Cookies("LGC")("ADMIN_ID")
	admin_nm	= Request.Cookies("LGC")("ADMIN_NM")
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="copyright" content="Copyright(c) White Lab Inc. All Rights Reserved." />
    <title>OnStory Admin</title>
    <link rel="stylesheet" type="text/css" href="/css/suio.css" media="screen" charset="utf-8">
    <link rel="stylesheet" type="text/css" href="/css/layout.css" media="screen" charset="utf-8">
    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>		
    
	<script language="javascript" src="/JS-CMN/jquery.xml2json.js"></script>
	<script language="javascript" src="/JS-CMN/Common.js?v1"></script>
	<script language="javascript" src="/A-Back/CMN/JS/BackCommon.js?v1"></script>
    
</head>
<body>

<div style="width:1020px">   


    <form id="frm_default" name="frm_default" method="post">
                
	<input type=hidden id="deal_idx" name="deal_idx" value="" /> 
		               
	<!--###############  폼 내용  Block ###############-->

	<div class="section" id="QA_profile1">
        <div>&nbsp;</div>
        <div>&nbsp;</div>
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
                        <th scope="row">거래처 타입 <strong class="icoRequired">필수</strong></th>
                        <td colspan="3">
                            <label class="gLabel"><input id="dealType_C" type="radio" name="dealType_cd" value="C" checked class="fChk" /> 사업자(중개사)</label>
                            <label class="gLabel"><input id="dealType_P" type="radio" name="dealType_cd" value="P" class="fChk" /> 개인(소유자)</label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">이름  <strong class="icoRequired">필수</strong></th>
                        <td>
                            <input type="text" id="name" name="name" value="" class="fText" style="width:200px;" />
                        </td>
                        <th scope="row">상호명</th>
                        <td>
                            <input type="text" id="corpName" name="corpName" value="" class="fText" style="width:200px;" />
                        </td>                        
                    </tr>
                    <tr>
                        <th scope="row">연락처</th>
                        <td>
                            <input type="text" id="tel" name="tel" value="" class="fText" style="width:200px;" />
                        </td>
                        <th scope="row">핸드폰</th>
                        <td>
                            <input type="text" id="hp" name="hp" value="" class="fText" style="width:200px;" />
                        </td>                        
                    </tr>                    
                    <tr>
                        <th scope="row">팩스</th>
                        <td>
                            <input type="text" id="fax" name="fax" value="" class="fText" style="width:200px;" />
                        </td>
                        <th scope="row">이메일</th>
                        <td>
                            <input type="text" id="email" name="email" value="" class="fText" style="width:200px;" />
                        </td>                        
                    </tr>                                        
                    <tr>
                        <th scope="row">주소</th>
                        <td colspan="3">

	            		<a id="btn_Addr" class="btnNormal "><span>주소찾기 </span></a> 



                        	<input type="text" id="jibunAddr" name="jibunAddr" value="" class="fText" style="width:600px;" />
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

	<!--###############  처리중 Block ###############-->
	<div class="mLoading typeStatic">
	    <p>처리중입니다. 잠시만 기다려 주세요.</p>
	    <img src="http://img.echosting.cafe24.com/suio/ico_loading.gif" alt="" />
	</div>
	
	<!--###############  페이지 Block ###############-->
	<!-- 도움말 영역 -->

	<!-- //도움말 영역 -->
    </form>


</div>        

<script src="http://dmaps.daum.net/map_js_init/postcode.v2.js"></script>
<script>


function zipCode_Pop(){

	var themeObj = {
	   //bgColor: "", //바탕 배경색
	   searchBgColor: "#0B65C8", //검색창 배경색
	   //contentBgColor: "", //본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
	   //pageBgColor: "", //페이지 배경색
	   //textColor: "", //기본 글자색
	   queryTextColor: "#FFFFFF" //검색창 글자색
	   //postcodeTextColor: "", //우편번호 글자색
	   //emphTextColor: "", //강조 글자색
	   //outlineColor: "", //테두리
	};

    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.
//            $("#zipcode").val(data.zonecode);
            $("#jibunAddr").val(data.jibunAddress + " ");
        }
        ,theme: themeObj
    }).open();
}
</script>	
<script>    
<!--


	//************** ajax 에러 처리  ************************
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


	//************** Main   템플릿  ************************
    var Main = {};

    //----------------------------------------
    // 메인 로딩
    //----------------------------------------
    $(document).ready(function () {
        Main.Init();
    });

//	Msg("ALERT", "ajaxError", msg, "");

    //----------------------------------------
    // 메인 초기화
    //----------------------------------------
    Main.Init = function () {
		
		// 값 설정
		Main.Form 			= $("#frm_default")[0];
        Main.callbackURL 	= "Dealer_Frm.C.asp";
        Main.ListURL 		= "Dealer_Lst.asp";

		// Get 로딩
        Main.Params = ParamGet2JSON(location.href);

        // 입력값 검사
        Main.ParamsValid();

        // 입력값 검사
        Main.Mode_Button(Main.Params.cmd);
        
        // 이벤트 등록
        Main.Event_Reg();


        if (Main.Params.cmd == "INSERT")
            this.Mode_Insert();
        else if (Main.Params.cmd == "UPDATE")
            this.Mode_Update();
                    
    };

    //----------------------------------------
    // 처리 버튼 이벤트 
    //----------------------------------------
    Main.Event_Reg = function () {
        $("#btn_Insert").click(function () {
            Main.Proc_Insert();
        });
        $("#btn_Update").click(function () {
            Main.Proc_Update();
        });
        $("#btn_Delete").click(function () {
            Main.Proc_Delete();
        });
        $("#btn_List").click(function () {
            location.href = Main.ListURL;
        });
        $("#btn_Addr").click(function () {
            zipCode_Pop();
        });
        $("#btn_Reset").click(function () {
            Main.Form.reset();
        });
        
    };

	//----------------------------------------
	// 진행현황 표시
    Main.loading = function (isBool) {
        if (isBool) {                       
            $('.mLoading').show();
        } else {
        	$('.mLoading').hide();
        }
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
    			&& typeof (Main.Params.deal_idx) == "undefined" && Main.Params.deal_idx == "") {
            Msg("ALERT", "접근경로", "잘못된 접근경로입니다.(deal_idx)", "B");
            return;
        }
    }    

	//----------------------------------------
	// 회면 모드 설정
	//----------------------------------------
    // 등록 모드
    Main.Mode_Insert = function () {
//        $("#sto_id").val(Main.Params.sto_id);
//        $("#create_dt_area").hide();
    };

    // 수정 모드
    Main.Mode_Update = function () {
        // admin_id 수정 금지 
//        $("#create_dt").attr("readonly", "")
        // 데이터 가져옴
        this.M_ViewBind(Main.Params.deal_idx);
    }

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
    }
    
	//----------------------------------------
	// Valid 입력값 유효성 검사
	//----------------------------------------
    Main.Valid_Insert = function(){
        // 입력값 유효성 검사
        try{
            var frm = Main.Form;
            if(isNull(frm.dealType_cd, '거래처 타입')){
	            return false;
            }else if(isNull(frm.name, '이름')){
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
			if(isNull(frm.deal_idx, '일련번호')){
	            return false;			            
            }else if(isNull(frm.dealType_cd, '거래처 타입')){
	            return false;		
            }else if(isNull(frm.name, '이름')){
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
                if(isNull(frm.deal_idx, '일련번호')){
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
    // 모델 뷰 바인딩 : Ajax
    Main.M_ViewBind = function (deal_idx) {
		try {
	        Main.loading(true);
	        $.ajax({
	            type : 'POST',
	            url : Main.callbackURL,
	            data :
				{
				    cmd			: "SELECT",
				    deal_idx	: deal_idx
				},
	            async : false, 	// 동기로 임시로 처리(멀티요청)
	            success	: function (result) {
	                //alert("Data: " + result);
	                if (result != null) {
	                    Main.Model = $.xml2json(result);
	                }
	                Main.V_ViewBind();
	                Main.loading(false);
	            }
	        });
        } catch (e) {JsErrorMessage(e); } 
    }

    // 뷰 바인딩
    Main.V_ViewBind = function () {
		try {
	        //$("#CList").html("");
	        if (typeof (Main.Model.db) == "undefined") {
	            Msg("ALERT", "자료없음", "자료가 존재하지 않습니다.", "");
	            return;
	        }
	        $("#deal_idx").val(Main.Model.db.row.deal_idx);
	        $("#name").val(Main.Model.db.row.name);
   	        $("#corpName").val(Main.Model.db.row.corpName);
	        $("#tel").val(Main.Model.db.row.tel);
	        $("#hp").val(Main.Model.db.row.hp);
	        $("#fax").val(Main.Model.db.row.fax);
	        $("#email").val(Main.Model.db.row.email);
	        if (Main.Model.db.row.dealType_cd == "C")
	            $("#dealType_C").attr("checked", "checked");
	        else if (Main.Model.db.row.dealType_cd == "P")
	            $("#dealType_P").attr("checked", "checked");
        	$("#jibunAddr").val(Main.Model.db.row.jibunAddr);
        	
        } catch (e) {JsErrorMessage(e); }        
    };

	//----------------------------------------
	// 모델 처리
	//----------------------------------------	
    Main.M_Insert = function () {
		try {
	        Main.loading(true);
	        $.post(Main.callbackURL,
		        {
		            cmd				: "INSERT",
		            dealType_cd		: $("input[type='radio'][name=dealType_cd]:checked").val(),
		            name			: $("#name").val(),
		            corpName		: $("#corpName").val(),
		            tel				: $("#tel").val(),
		            hp				: $("#hp").val(),
		            fax				: $("#fax").val(),
		            email			: $("#email").val(),
		            jibunAddr		: $("#jibunAddr").val()
		        },
		        function (data, status) {
					var result = $.xml2json(data);
					Main.C_StatusMsg(result, status);
		        	if(status = "success" && Number(result.return) >= 0)
		        		location.href = Main.ListURL;
		        	Main.loading(false);
		        },
		        "xml"
		        );
        } catch (e) {JsErrorMessage(e);}                     
	};
	
	
    Main.M_Update = function () {
		try {
			Main.loading(true);
	        $.post(Main.callbackURL,
		        {
		            cmd				: "UPDATE",
		            deal_idx		: $("#deal_idx").val(),
		            dealType_cd		: $("input[type='radio'][name=dealType_cd]:checked").val(),
		            name			: $("#name").val(),
		            corpName		: $("#corpName").val(),
		            tel				: $("#tel").val(),
		            hp				: $("#hp").val(),
		            fax				: $("#fax").val(),
		            email			: $("#email").val(),
		            jibunAddr		: $("#jibunAddr").val()
		        },
		        function (data, status) {
		        	var result = $.xml2json(data);
					Main.C_StatusMsg(result, status);
					Main.loading(false);
		        },
		        "xml"
		        );
        } catch (e) {JsErrorMessage(e);}        
	};

    Main.M_Delete = function () {
		try {
			Main.loading(true);
	        $.post(Main.callbackURL,
		        {
		            cmd			: "DELETE",
		            deal_idx	: $("#deal_idx").val()
		        },
		        function (data, status) {
		        	var result = $.xml2json(data);
					Main.C_StatusMsg(result, status);
		        	if(status = "success" && Number(result.return) >= 0)
		        		location.href = Main.ListURL;
		        	Main.loading(false);
		        },
		        "xml"
		        );
        } catch (e) {JsErrorMessage(e);}              
	};

	
	//----------------------------------------
	// 기타
	//----------------------------------------	
	Main.C_StatusMsg = function(result, status) {


		if(status = "success" && Number(result.return) >= 0)
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

-->
</script>
</body>
</html>            