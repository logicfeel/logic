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
 	On Error Resume Next 	' 개발시: 주석 >> 완료후 활성화

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
	        </ol>
	    </div>
	</div>
                    

    <form id="frm_default" name="frm_default" method="post">
	
	<input type="hidden" id="sortType" name="sortType" value="0" />
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
                        <th scope="row">제목</th>
                        <td colspan="3">
                            <input type="text" id="srhKeyword" name="srhKeyword" value="" class="fText" style="width:400px;" />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
		<!--###############  검색 버튼 Block ###############-->
		<div class="mButton gCenter">
		    <a id="btn_Search" class="btnSearch"><span>검색</span></a>
		    <a id="btn_Reset" class="btnSearch reset"><span>초기화</span></a>
		</div>

    </div>

	<!--###############  검색 결과 Block ###############-->
	<div class="section" id="QA_level2">
	    <div class="mState">
	        <div class="gLeft">
	            <p class="total">검색결과 <strong id="totalView">0</strong>건</p>
	            <!--
	            <strong class="icoStatus positive"></strong> 사업자(중개사)
	            <span class="icoMobile">기업회원</span> 개인(소유자)
	            -->
            </div>
	        <div class="gRight">
	            <select id="lineCnt" name="lineCnt" class="fSelect">
	                <option value="10" selected>10개씩보기</option>
	                <option value="20">20개씩보기</option>
	                <option value="30">30개씩보기</option>
	                <option value="50">50개씩보기</option>
	                <option value="100">100개씩보기</option>
	            </select>
	        </div>
	    </div>
	    <div class="mCtrl typeHeader">
	        <div class="gLeft">
	            <a id="btn_Insert" class="btnCtrl eBatchExposure"><span>공지 등록</span></a>
	            <!-- <a href="#none" id="btn_Delete" class="btnNormal"><span><em class="icoDel"></em> 삭제</span></a> -->
	        </div>
	        <div class="gRight">
                <!-- <a href="#none" id="btn_Excel" title="새창 열림" class="btnNormal"><span><em class="icoXls"></em> 엑셀다운로드<em class="icoLink"></em></span></a>-->
            </div>
	    </div>
	    <div class="mBoard gCellNarrow">
	        <table border="1" summary="" class="eChkColor">
		        <caption>목록</caption>
		        <!--###############  제목 크기 Block ###############-->
		        <colgroup>
		            <col style="width:60px">
		            <col style="width:auto">
		            <col style="width:100px">
	            	<col style="width:100px">
		            <col class="date">
		            <col style="width:60px">
		        </colgroup>
		        <!--###############  검색 제목 Block ###############-->
		        <thead>
		            <tr>
		                <th scope="col">
		                    <strong>순번</strong>
		                </th>
		                <th scope="col">
							<strong id="btn_sortType_34" class="array"><!-- 정렬방식: ascend descend -->
                        		<span>제목</span><button type="button">정렬선택</button>
                    		</strong>
		                </th>
		                <th scope="col">
		                    <strong>공지타입</strong>
		                </th>
		                <th scope="col">
		                    <strong>작성자</strong>
		                </th>
		                <th scope="col">
		                    <strong id="btn_sortType_12" class="array"><!-- 정렬방식: ascend descend -->
                        		<span>작성일</span><button type="button">정렬선택</button>
                    		</strong>
		                </th>
		                <th scope="col">
		                    <strong>조회수</strong>
		                </th>
		            </tr>
		        </thead>
				
				<!--###############  검색 본문 Block ###############-->
				<tbody class="center" id="CList">
					<tr><td colspan='6' align='center'>자료가 없습니다.</td></tr>
				</tbody>
			
			</table>
			<!--###############  검색 없음 Block ###############-->
<!--
	        <p class="empty" style="display:block;">검색된 자료가 없습니다.</p>
-->
	    </div>
	    
	    <!--###############  페이지 Block ###############-->
	    <div id="CPage" class="mPaginate">
<!--
	        <a href="#none" onclick="moveMember(1)" class="btnNormal"><span>이전</span></a>
	        <a href="#none" onclick="moveMember(1)" class="btnNormal"><span>1</span></a>
	        <a href="#none" onclick="moveMember(1)" class="btnNormal"><span>2</span></a>
	        <a href="#none" onclick="moveMember(1)" class="btnNormal"><span>다음</span></a>
-->
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


<script src="/A-Back/CMN/JS/Paging_T1.js?v1"></script>
<script type="text/javascript">
<!--

	var Main = {};

    //----------------------------------------
    // 에러처리 및 메인 로딩
    //----------------------------------------
	$(document).ajaxError(function (event, xhr, options, exc) {
	    if (xhr.status != 200) {
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
	    Paging.Init(Main.lineCnt, 5, false, false);
	});
	

    //----------------------------------------
    // 메인 초기화
    //----------------------------------------
	Main.Init = function () {
	    Main.Model 			= [];
	    Main.lineCnt 		= $("#lineCnt").val();			// 리스트 페이지 수
	    Main.selPage 		= 1; 							// 선택 페이지 수
		Main.Form 			= $("#frm_default")[0];	    
	    Main.callbackURL 	= "Notice_Lst_v2.C.asp";
	    Main.frmURL 		= "Notice_Frm_v2.asp";
	
        // Get 로딩
        Main.Params = ParamGet2JSON(location.href);
        
        // Get 접근 값 설정
        Main.ParamSet();
        
	    // 이벤트 등록
	    Main.Event_Reg();
	
        // 초기로딩
        Main.Proc_Select();
	};
	
    //----------------------------------------
    // 이벤트 등록
    //----------------------------------------
	Main.Event_Reg = function () {
        
        $("#btn_Search").click(function () {
            Main.Proc_Select(1);
        });
        
        $("#srhKeyword").keydown(function (e) {
	        if (e.keyCode == 13) {
				e.preventDefault();
	       		Main.Proc_Select(1);
	        }
        });
        
        $("#btn_Reset").click(function () {
            Main.Form.reset();
        });	
        
        $("#lineCnt").change(function () {
            Main.lineCnt = $("#lineCnt").val();
            Main.selPage = 1;
            Paging.Init(Main.lineCnt, 5, false, false);
            Main.Proc_Select();
        });
        
        $("#btn_Insert").click(function () {
            Main.C_GoForm("INSERT", "");
        });
		
		$("#btn_sortType_12").click(function () {
            
            var sortType = $("#sortType").val();
            
            Main.ResetSortClass();
            
            if (sortType === "2"){
				$("#btn_sortType_12").addClass("ascend");
				$("#sortType").val("1");
            }else {
            	$("#btn_sortType_12").addClass("descend");
            	$("#sortType").val("2");
            }
            Main.Proc_Select();
        });
		
		$("#btn_sortType_34").click(function () {
            
            var sortType = $("#sortType").val();
            
            Main.ResetSortClass();
            
            if (sortType === "4"){
				$("#btn_sortType_34").addClass("ascend");
				$("#sortType").val("3");
            }else {
            	$("#btn_sortType_34").addClass("descend");
            	$("#sortType").val("4");
            }
            Main.Proc_Select();
        });        
	};

    //----------------------------------------
    // 추가 기능들
    //----------------------------------------
	// sort 초기화
	Main.ResetSortClass = function () {
		$("#btn_sortType_12").removeClass("ascend");
		$("#btn_sortType_12").removeClass("descend");
		$("#btn_sortType_34").removeClass("ascend");
		$("#btn_sortType_34").removeClass("descend");
	};

    //----------------------------------------
    // GET 방식 값 설정
    //----------------------------------------
	Main.ParamSet = function() {
        if (typeof Main.Params !== "undefined" ) {
			if (typeof Main.Params.selPage  !== "undefined" && typeof Number(Main.Params.selPage) ===  "number"){
				Main.selPage = Main.Params.selPage;
			}
			
			if (typeof Main.Params.lineCnt  !== "undefined" && typeof Number(Main.Params.lineCnt) ===  "number"){
				Main.lineCnt = Main.Params.lineCnt;
			}
        }
	};

		
    //----------------------------------------
    // 화면 이동
    //----------------------------------------
	Main.C_GoForm = function (cmd, idx) {

	    var params = "";
	    
	    params = params + "&ntc_idx=" + idx + "&selPage=" + Main.selPage + "&lineCnt=" + Main.lineCnt;
	    
	    if (cmd == "UPDATE") {
	    	location.href = Main.frmURL + "?cmd=UPDATE" + params;	    
	    }else if (cmd == "INSERT") {
	    	location.href = Main.frmURL + "?cmd=INSERT" + params;
	    }
	};
	
		

    //----------------------------------------
    // 진행현황 표시
    //----------------------------------------
    Main.loading = function (isBool) {
        if (isBool) {                       
            $('.mLoading').show();
            document.getElementById("part_Overlay").style.display = "block";
        } else {
        	$('.mLoading').hide();
        	document.getElementById("part_Overlay").style.display = "none";
        }
    };

	//----------------------------------------
	// Proc 처리 모드
	//----------------------------------------
    Main.Proc_Select = function (selPage) {

			// if (Main.Valid_Select())
            
            if (typeof selPage === "number") Main.selPage = selPage;
            
            Main.loading(true);		// 로딩중 메세지
            Main.M_Select();
    };
        
	//----------------------------------------
	// 리스트 바인딩
	//----------------------------------------
	// 모델-리스트 바인딩 : Ajax
	Main.M_Select = function () {
        	
		try {
	        $.post(Main.callbackURL,
		        {
		            cmd					: "SELECT",
		            selPage				: Main.selPage,
		            lineCnt				: Main.lineCnt,
		            sortType			: $("#sortType").val(),
		            srhKeyword			: $("#srhKeyword").val()
		        },
		        function (data, status) {
					var result = $.xml2json(data);
					Main.C_StatusMsg(result, status);
					if (result != null) Main.Model = result;
		            Main.V_ListBind();
		            // Main.loading(false);	위치 아래로 변경함
		        },
		        "xml"
		        );
        } catch (e) {JsErrorMessage(e);}
        	        	
	};
		 
	// 뷰-리스트 바인딩
	Main.V_ListBind = function () {
	
	    $("#CList").html("");
		$("#totalView").text(Main.Model.totalCnt);
	
	    if (typeof (Main.Model.db) == "undefined" || Main.Model.totalCnt == "0") {
	        $("#CList").append("<tr><td colspan='6' align='center'>자료가 없습니다.</td></tr>");
	    } else {

		    // 개시물 번호 = 전체 갯수 - ((현재페이지 -1) * 리스트수 )
		    var numCnt = Main.Model.totalCnt - ((Main.selPage - 1) * Main.lineCnt);
		    var forRow = SingleRow2Arr(Main.Model.db.row);
			var strHtml;
			
		    for (var i = 0, num = numCnt; i < forRow.length; i++, num--) {
		        strHtml = "";
		        strHtml = strHtml + "<tr>";
		        strHtml = strHtml + "<td>" + num + "</td>";
		        strHtml = strHtml + "<td><a href=\"javascript:Main.C_GoForm('UPDATE','" + forRow[i].ntc_idx + "');\"\">" + forRow[i].title + "</a></td>";
		        strHtml = strHtml + "<td>" + Main.Code_NoticeType(forRow[i].noticeType_cd) + "</td>";
		        strHtml = strHtml + "<td>" + forRow[i].writer + "</td>";
		        strHtml = strHtml + "<td>" + forRow[i].create_dt.substring(0,10) + "</td>";
		        strHtml = strHtml + "<td>" + forRow[i].cnt + "</td>";
		        strHtml = strHtml + "</td>";
		        $("#CList").append(strHtml); 
		    }
		    Paging.V_PageBind(Main.Model.totalCnt, Main.selPage, Main.Proc_Select);	// 페이지 바인딩
	    }	    

	    Main.loading(false);
	    return;
	};

	//----------------------------------------
	// 바인딩 결과 메세지 
	//----------------------------------------
	Main.C_StatusMsg = function(result, status) {
		if(status === "success" && Number(result.return) < 0)
			alert("DB 처리 오류가 발생하다. 오류코드:" + result.return);            	
		else if(status === "error")
			alert("ajax 처리중 오류가 발생하다.");
		else if(status === "timeout")
			alert("네트워크 접속 오류가 발생하다.");
	};
	
	//----------------------------------------
	// 코드규칙
	//----------------------------------------		
	// 공지타입
	Main.Code_NoticeType = function (flag) {
		var tmp = "";
		if (flag == "B")
			tmp = "일반";
		else if (flag == "T")
			tmp = "상위공지";
		else
			tmp = flag;
		return tmp;	
	};

//********************************************************************** 
-->
</script>
</body>
</html>

<% Call AspErrorMsg(Err) %>
