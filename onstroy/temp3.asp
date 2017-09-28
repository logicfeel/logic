 <?xml version="1.0" encoding="UTF-8"?>
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
'	On Error Resume Next 
%>
<% session.codepage = 65001 %>
<% Response.CharSet = "utf-8" %>
<% 
'	Server.Execute "/A-Back/CMN/LoginCheck_Inc.asp"
%>
<%

	'########## 쿠키 값 | 기본정보 설정 ##########



	'########## Request 값 | 기본값 세팅 ##########
	Dim cmd 
	cmd				= Request("cmd")
	
	Dim  selPage, lineCnt
	selPage			= Request("selPage")
	lineCnt			= Request("lineCnt")
	
	Dim real_type, name_corp_tel_hp, dealType_C, dealType_P
	real_type			= Request("real_type")
	name_corp_tel_hp	= Request("name_corp_tel_hp")
	dealType_C			= Request("dealType_C")
	dealType_P			= Request("dealType_P")


	'########## Request 필수사항 검사 ##########
	if len(cmd) <= 0 then
		Response.Write "<root totalCnt='0' return='-10'></root>"
        Response.End 
	end if

%>
<!-- #include virtual="/A-CMN/DBUtils_Cls.asp" -->
<!-- #include virtual="/A-CMN/Common_Fnc.asp" -->
<%
	'########## DB Process ##########
	Dim strSQL, strSqlOrderby, DBCls, rs, result
	Set DBCls = new DBUtils_cls
  
	if cmd = "SELECT" then

		Dim paramInfo_S(7)
		Dim totalCnt
		
		paramInfo_S(0) = DBCls.MakeParam("RETURN_VALUE", adInteger, adParamReturnValue, , "")
		paramInfo_S(1) = DBCls.MakeParam("@totalCnt",adInteger,adParamOutput, 0, 0)
		paramInfo_S(2) = DBCls.MakeParam("@selPage", adInteger, adParamInput, 0, selPage)
		paramInfo_S(3) = DBCls.MakeParam("@lineCnt", adInteger, adParamInput, 0, lineCnt)
		paramInfo_S(4) = DBCls.MakeParam("@realType", adChar, adParamInput, 1, real_type)
		paramInfo_S(5) = DBCls.MakeParam("@name_corp_tel_hp", adVarChar, adParamInput, 50, name_corp_tel_hp)
		paramInfo_S(6) = DBCls.MakeParam("@realType_C", adChar, adParamInput, 1, dealType_C)
		paramInfo_S(7) = DBCls.MakeParam("@realType_P", adChar, adParamInput, 1, dealType_P)

		Set rs = DBCls.ExecSPReturnRS("MxRPrt_Dealer_SP_LX", paramInfo_S, Nothing)
		
		result = DBCls.GetValue(paramInfo_S, "RETURN_VALUE") 
		totalCnt = DBCls.GetValue(paramInfo_S, "@totalCnt")
		
		
		Response.Write "<root return='" & result & "' totalCnt='" & totalCnt & "'>"		
		if not rs.EOF then
			Response.Write rs(0)
		end if
		Response.Write "</root>"


    else
        
        Response.Write "<root return='-21' totalCnt='0'></root>"

    end if

	rs = Noting
	DBCls.Dispose
	Set DBCls = Nothing
%>

<%
' asp 디버깅 용도 	
' Call AspErrorMsg(Err)
%>				