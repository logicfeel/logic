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

'	On Error Resume Next 

	session.codepage = 65001 
	Response.CharSet = "utf-8" 
%>
<% 
	Server.Execute "/A-Back/CMN/LoginCheck_Inc.asp"
%>
<%
	'########## 쿠키 값 | 기본정보 설정 ##########
	Dim CK_l_sto_id
	CK_l_sto_id	= Request.Cookies("EM")("L_STO_ID")


	'########## Request 값 | 기본값 세팅 ##########
	Dim cmd 
	cmd				= Request("cmd")
	
	Dim  ntc_idx
	ntc_idx			= Request("ntc_idx")	        	

	Dim title, noticeType_cd, writer, content
  	title			= Request("title")	        	
  	noticeType_cd	= Request("noticeType_cd")	        	
  	writer			= Request("writer")	        	 
  	content			= Request("content")	        	

	'########## Request 필수사항 검사 ##########
	if len(cmd) <= 0 then
		Response.Write "<root totalCnt='0' return='-10'></root>"
        Response.End 
	end if

	if cmd = "INSERT" OR cmd = "UPDATE" then
		if len(title) <= 0 OR len(writer) <= 0 OR len(noticeType_cd) <= 0 then
			Response.Write "<root totalCnt='0'  return='-11'></root>"
	        Response.End 
		end if
	end if

%>
<!-- #include virtual="/A-CMN/DBUtils_Cls.asp" -->
<!-- #include virtual="/A-CMN/Common_Fnc.asp" -->
<%
	'########## DB Process ##########
	Dim strSQL, strSqlOrderby, DBCls, rs, result
	Set DBCls = new DBUtils_cls

	if cmd = "SELECT" then

		Dim paramInfo_S(1)

		paramInfo_S(0) = DBCls.MakeParam("RETURN_VALUE", adInteger, adParamReturnValue, , "")						
		paramInfo_S(1) = DBCls.MakeParam("@ntc_idx", adInteger, adParamInput, 0, ntc_idx)

		Set rs = DBCls.ExecSPReturnRS("M03_SP_Notice_RX", paramInfo_S, Nothing)
		result = DBCls.GetValue(paramInfo_S, "RETURN_VALUE") 
		
		if not rs.EOF then
			Response.Write "<root return='" & result & "'>"
            Response.Write rs(0)
			Response.Write "</root>"
		else
		    Response.Write "<root return='-14'></root>"
		End	if			


    elseif cmd = "INSERT" then

    	Dim paramInfo_I(5)

		paramInfo_I(0) = DBCls.MakeParam("RETURN_VALUE", adInteger, adParamReturnValue, , "")						
		paramInfo_I(1) = DBCls.MakeParam("@sto_id", adChar, adParamInput, 6, CK_l_sto_id)
		paramInfo_I(2) = DBCls.MakeParam("@title", adVarChar, adParamInput, 100, title)
    	paramInfo_I(3) = DBCls.MakeParam("@writer", adVarChar, adParamInput, 20, writer)
        paramInfo_I(4) = DBCls.MakeParam("@content", adVarChar, adParamInput, 2000, content)
        paramInfo_I(5) = DBCls.MakeParam("@noticeType_cd", adVarChar, adParamInput, 1, noticeType_cd)

		Set rs = DBCls.ExecSPReturnRS("M03_SP_Notice_C", paramInfo_I, Nothing)
		result = DBCls.GetValue(paramInfo_I, "RETURN_VALUE") 
		
        Response.Write "<root return='" & result & "'></root>"
        
    elseif cmd = "UPDATE" then

		Dim paramInfo_U(5)
		
		paramInfo_U(0) = DBCls.MakeParam("RETURN_VALUE", adInteger, adParamReturnValue, , "")						
		paramInfo_U(1) = DBCls.MakeParam("@ntc_idx", adInteger, adParamInput, 0, ntc_idx)
		paramInfo_U(2) = DBCls.MakeParam("@title", adVarChar, adParamInput, 100, title)
    	paramInfo_U(3) = DBCls.MakeParam("@writer", adVarChar, adParamInput, 20, writer)
        paramInfo_U(4) = DBCls.MakeParam("@content", adVarChar, adParamInput, 2000, content)
        paramInfo_U(5) = DBCls.MakeParam("@noticeType_cd", adVarChar, adParamInput, 1, noticeType_cd)

		Set rs = DBCls.ExecSPReturnRS("M03_SP_Notice_U", paramInfo_U, Nothing)
		result = DBCls.GetValue(paramInfo_U, "RETURN_VALUE") 
		
        Response.Write "<root return='" & result & "'></root>"

    elseif cmd = "DELETE" then

		Dim paramInfo_D(1)

		paramInfo_D(0) = DBCls.MakeParam("RETURN_VALUE", adInteger, adParamReturnValue, , "")						
		paramInfo_D(1) = DBCls.MakeParam("@ntc_idx", adInteger, adParamInput, 0, ntc_idx)

		Set rs = DBCls.ExecSPReturnRS("M03_SP_Notice_D", paramInfo_D, Nothing)
		result = DBCls.GetValue(paramInfo_D, "RETURN_VALUE") 
			
        Response.Write "<root return='" & result & "'></root>"

    else
        
        Response.Write "<root return='-20'></root>"

    end if
		
	rs = Noting
	DBCls.Dispose
	Set DBCls = Nothing
%>

<% Call AspErrorMsg(Err) %>