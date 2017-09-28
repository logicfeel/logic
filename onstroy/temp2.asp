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
    <title>Cafe24-Echosting Admin</title>
    <link rel="stylesheet" type="text/css" href="/css/suio.css" media="screen" charset="utf-8">
    <link rel="stylesheet" type="text/css" href="/css/layout.css" media="screen" charset="utf-8">
    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>		
    
	<script language="javascript" src="/JS-CMN/jquery.xml2json.js"></script>
	<script language="javascript" src="/JS-CMN/Common.js"></script>
	<script language="javascript" src="/A-Back/CMN/JS/BackCommon.js"></script>
    
</head>
<body>

<div style="width:1020px">   


    <form name="frm_default" method="post">
                
	<!--###############  검색 조건 Block ###############-->

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
                        <th scope="row">물건 종류</th>
                        <td colspan="3">
                            <label class="gLabel"><input type="radio" name="real_type" value="0" checked class="fChk" /> 주거(아파트,원룸, 오피스텔 등)</label>
                            <label class="gLabel"><input type="radio" name="real_type" value="0" checked class="fChk" /> 상가(빌딩, 사무실 등)</label>
                            <label class="gLabel"><input type="radio" name="real_type" value="0" checked class="fChk" /> 토지</label>
                           	<label class="gLabel"><input type="radio" name="real_type" value="0" checked class="fChk" /> 기타</label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">이름,상호,연락처</th>
                        <td>
                            <input type="text" id="name_corp_tel_hp" name="name_corp_tel_hp" value="" class="fText" style="width:200px;" />
                        </td>
                        <th scope="row">형태</th>
                        <td>
                            
                            <label class="gLabel"><input type="checkbox" id="dealType_P" name="dealType_cd" value="P" class="fChk"> 사업자(중개사)</label>
                            <label class="gLabel"><input type="checkbox" id="dealType_C" name="dealType_cd" value="C" class="fChk"> 개인(소유자)</label>
                        </td>                        
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
		<!--###############  검색 버튼 Block ###############-->
		<div class="mButton gCenter">
		    <a href="#none" class="btnSearch"><span>검색</span></a>
		    <a href="#none" class="btnSearch reset"><span>초기화</span></a>
		</div>

    </div>

	<!--###############  검색 결과 Block ###############-->
	<div class="section" id="QA_level2">
	    <div class="mState">
	        <div class="gLeft">
	            <p class="total">검색결과 <strong>0</strong>건</p>
	            <strong class="icoStatus positive"></strong> 사업자(중개사)
	            <span class="icoMobile">기업회원</span> 개인(소유자)
            </div>
	        <div class="gRight">
	            <select name="rows" onchange="setRows(this)" class="fSelect">
	                <option value="10">10개씩보기</option>
	                <option value="20">20개씩보기</option>
	                <option value="30" selected="">30개씩보기</option>
	                <option value="50">50개씩보기</option>
	                <option value="100">100개씩보기</option>
	            </select>
	        </div>
	    </div>
	    <div class="mCtrl typeHeader">
	        <div class="gLeft">
	            <a href="#none" onclick="moveMember(1)" class="btnCtrl eBatchExposure"><span>거래처 등록</span></a>
	            <a href="#none" onclick="delete_choice()" class="btnNormal"><span><em class="icoDel"></em> 삭제</span></a>
	        </div>
	        <div class="gRight">
                <a href="#none" title="새창 열림" class="btnNormal"><span><em class="icoXls"></em> 엑셀다운로드<em class="icoLink"></em></span></a>
            </div>
	    </div>
	    <div class="mBoard gCellNarrow">
	        <table border="1" summary="" class="eChkColor">
		        <caption>목록</caption>
		        <!--###############  제목 크기 Block ###############-->
		        <colgroup>
		            <col class="chk">
		            <col class="date">
		            <col style="width:auto">
		            <col style="width:auto">
		            <col style="width:50px">
	            	<col style="width:auto">
		            <col style="width:auto">
		        </colgroup>
		        <!--###############  검색 제목 Block ###############-->
		        <thead>
		            <tr>
		                <th scope="col"><input type="checkbox" name="Allselect" class="allChk" onclick="CA(this.form)"></th>
		                <th scope="col">
		                    <strong>등록일자</strong>
		                </th>
		                <th scope="col">
		                    <strong>이름</strong>
		                </th>
		                <th scope="col">
		                    <strong>업체명</strong>
		                </th>
		                <th scope="col">
		                    <strong>구분</strong>
		                </th>
		                <th scope="col">
		                    <strong>연락처</strong>
		                </th>
		                <th scope="col">
		                    <strong>휴대폰</strong>
		                </th>
		            </tr>
		        </thead>
				
				<!--###############  검색 본문 Block ###############-->
				<tbody class="center" id="product-list">
			        <tr class="">
			            <td><input type="checkbox" class="rowChk _product_no" value="11" is_display="F" is_selling="F"></td>
						<td>2017-09-01</td>			            	
			            <td>기본상품</td>
			            <td>기본상품</td>
			            <td class="txtCode">
			            	<strong class="icoStatus positive"></strong> 
			            </td>
			            <td>010-222-2222</td>
			            <td>010-222-2222</td>
				    </tr>
				</tbody>
			
			</table>
			<!--###############  검색 없음 Block ###############-->
<!--
	        <p class="empty" style="display:block;">검색된 회원 내역이 없습니다.</p>
-->
	    </div>
	    
	    <!--###############  페이지 Block ###############-->
	    <div class="mPaginate">

	        <a href="#none" onclick="moveMember(1)" class="btnNormal"><span>이전</span></a>
	        <a href="#none" onclick="moveMember(1)" class="btnNormal"><span>1</span></a>
	        <a href="#none" onclick="moveMember(1)" class="btnNormal"><span>2</span></a>
	        <a href="#none" onclick="moveMember(1)" class="btnNormal"><span>다음</span></a>

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
    <!-- <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">-->
    <style>
		
		.w3-overlay{position:fixed;display:none;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);z-index:2}    
		
		.w3-animate-fading{animation:fading 10s infinite}@keyframes fading{0%{opacity:0}50%{opacity:1}100%{opacity:0}}
		.w3-animate-opacity{animation:opac 0.8s}@keyframes opac{from{opacity:0} to{opacity:1}}
		.w3-animate-top{position:relative;animation:animatetop 0.4s}@keyframes animatetop{from{top:-300px;opacity:0} to{top:0;opacity:1}}
		.w3-animate-left{position:relative;animation:animateleft 0.4s}@keyframes animateleft{from{left:-300px;opacity:0} to{left:0;opacity:1}}
		.w3-animate-right{position:relative;animation:animateright 0.4s}@keyframes animateright{from{right:-300px;opacity:0} to{right:0;opacity:1}}
		.w3-animate-bottom{position:relative;animation:animatebottom 0.4s}@keyframes animatebottom{from{bottom:-300px;opacity:0} to{bottom:0;opacity:1}}
		.w3-animate-zoom {animation:animatezoom 0.6s}@keyframes animatezoom{from{transform:scale(0)} to{transform:scale(1)}}
		.w3-animate-input{transition:width 0.4s ease-in-out}.w3-animate-input:focus{width:100%!important}
		.w3-opacity,.w3-hover-opacity:hover{opacity:0.60}.w3-opacity-off,.w3-hover-opacity-off:hover{opacity:1}
		
    </style>
	<div id="part_Overlay" class="w3-overlay w3-animate-opacity" onclick="w3_close();" style="cursor:pointer;z-index:90;"></div>

</div>        


<script>    
<!--

    // 중복클릭 방지를 위한 로딩바 실행
	//    $('.mLoading').show();
	// document.getElementById("part_Overlay").style.display = "block";
	// document.getElementById("part_Sidenav").style.display = "none";

    
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
	
	    Msg("MODAL", "ajaxError", msg, "");
	  }
	});

	//************** Main   템플릿  ************************
    var Main = {};

    //----------------------------------------
    // 메인 로딩
    $(document).ready(function () {
        Main.Init();
    });

    //----------------------------------------
    // 메인 초기화
    Main.Init = function () {
		
		// 값 설정
		Main.Form 			= $("#frm_default")[0];
        Main.callbackURL 	= "Dealer_Lst.asp";

        // 이벤트 등록
        Main.Event_Reg();
    };

    //----------------------------------------
    // 처리 버튼 이벤트 
    Main.Event_Reg = function () {
        
        /*
        검색
        초기화
        정렬개수 수정
        거래처 등록
        선택 거래처 삭제
        
        */
        $("#btn_Login").click(function () {
            Main.Proc_Insert();
        });
    };

	//----------------------------------------
	// Valid 입력값 유효성 검사
    Main.Valid_Insert = function(){
        // 입력값 유효성 검사
        try{
            var frm = Main.Form;
            if(isNull(frm.admin_id, '아이디')){
	            return false;
            }else if(isNull(frm.passwd, '비밀번호')){
	            return false;		
            }else{
	            return true;
            }
		} catch (e) {JsErrorMessage(e); }        
    }

	//----------------------------------------
	// Proc 처리 모드
    Main.Proc_Insert = function () {
        if (Main.Valid_Insert())                       
            Main.M_Insert();
    };
    
    

	//----------------------------------------
	// 콜백  처리
    Main.M_Insert = function () {
		try {
	        $.post(Main.callbackURL,
		        {
		            cmd			: "INSERT",
		            admin_id	: $("#admin_id").val(),
		            passwd		: $("#passwd").val()
		        },
		        function (data, status) {
					var result = $.xml2json(data);
					Main.C_StatusMsg(result, status);
		        	if(status = "success" && result.return == "0")
		        		location.href = Main.SuccessURL;
		        },
		        "xml"
		        );
        } catch (e) {JsErrorMessage(e);}                     
	}

	//----------------------------------------
	// 기타
	Main.C_StatusMsg = function(result, status) {

		if(status = "success" && result.return == "0")
			alert("정상 처리 되었습니다.");
		else if(status = "success")
			alert("DB 처리 오류가 발생하다. 오류코드:" + result.return);            	
		else if(status = "error")
			alert("ajax 처리중 오류가 발생하다.");
		else if(status = "timeout")
			alert("네트워크 접속 오류가 발생하다.");
		else
			alert("Data: " + data + "\nStatus: " + status);
	}    
    
-->
</script>
</body>
</html>            