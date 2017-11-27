

	// 모듈 고통 메세지

    // 처리 메세지  type ( MODAL : 전체메세지 ,  ALERT : alert)
    //              flag ( 'B':뒤로 )
    function Msg(type, title, msg, flag) {
	    if (type == "MODAL") {
	    	$(".modal-title").text(title);
	      $(".modal-body").text(msg);
	      $("#myModal").modal('show');
	    } else {
	      console.log(msg);
	      alert(msg);
	    	if (flag == "B") 	history.back();
	    }
	
	    return;
	}

	// js 오류 출력
	function JsErrorMessage(e){
		var msg = "";
        msg = msg + "에러 메시지 : " + e.message + " , ";
        msg = msg + "에러 이름 : " + e.name + " , ";
        msg = msg + "스택 추적 : " + e.stack + " , ";
        msg = msg + "파일의 이름 : " + e.fileName + " , ";
        msg = msg + "줄 번호 : " + e.lineNumber + " , ";

        Msg("ALERT", "페이지오류", msg, "");
	}
	
	
	// 1 Row 배열[0]  처리  
	function SingleRow2Arr(json){
	    if (typeof (json.length) == "number")
	        return json;
	    else {
	        var tmpJson;
	        tmpJson = [];
	        tmpJson[0] = json;
	        return tmpJson;
	    }
	}
	

    function ParamGet2JSON(URLInfo) {
        var current_URL = URLInfo.indexOf("?");
        if (current_URL < 0) return {};
        var check = URLInfo.substring(current_URL + 1);
        var varList = check.split("&");
        var forCnt = varList.length;
        var jsonParam = {};
        var arrList = new Array();
        for (var i = 0; i < forCnt; i++) {
            var keyValue = varList[i].split("=");
            jsonParam[keyValue[0]] = keyValue[1]; //jsonParam["cmd"] = "INSERT";
            //eval(varList[i]); 	// 변수와 값으로 삽입
        }
        return jsonParam;
    }
