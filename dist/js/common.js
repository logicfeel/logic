/*********************************************************************
//새창 여는 함수
**********************************************************************/
function newPupup( url, winName, sizeW, sizeH)
{
 var nLeft  = screen.width/2 - sizeW/2 ;
 var nTop  = screen.height/2 - sizeH/2 ;
 
 opt = ",toolbar=no,menubar=no,location=no,scrollbars=yes,status=no";
 window.open(url, winName, "left=" + nLeft + ",top=" +  nTop + ",width=" + sizeW + ",height=" + sizeH  + opt );
 
}


/*********************************************************************
// get 방식의 파라미터를 해당폼에 input hidden 객체로 생성한다.
**********************************************************************/
function get2post(frm,sSearch){ 
    if (sSearch.length > 0) {
    
     var asKeyValues = sSearch.split('&');
     var asKeyValue  = '';
        
     for (var i = 0; i < asKeyValues.length; i++) {
      
      asKeyValue = asKeyValues[i].split('=');
      var e = document.createElement("input");
      e.setAttribute("type","hidden");
      e.setAttribute("name",asKeyValue[0]);
      e.setAttribute("value",asKeyValue[1]);
      e.setAttribute("_temp","true");
      frm.appendChild(e);
       }
   } 
 } 