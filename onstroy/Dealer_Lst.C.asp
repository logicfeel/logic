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
	Server.Execute "/A-Back/CMN/LoginCheck_Inc.asp"
%>
<%

	'########## 쿠키 값 | 기본정보 설정 ##########



	'########## Request 값 | 기본값 세팅 ##########
	Dim cmd 
	cmd				= Request("cmd")
	

	Dim deal_idx, dealType_cd, name, corpName, jibunAddr, tel, hp, email, fax
	deal_idx		= Request("deal_idx")
	dealType_cd		= Request("dealType_cd")
	name			= Request("name")
	corpName		= Request("corpName")
	jibunAddr		= Request("jibunAddr")
	tel				= Request("tel")
	hp				= Request("hp")
	email			= Request("email")
	fax				= Request("fax")
	
	


	'########## Request 필수사항 검사 ##########
	if len(cmd) <= 0 then
		Response.Write "<root totalCnt='0' return='-10'></root>"
        Response.End 
	end if

	        	
	if cmd	= "SELECT" OR cmd = "DELETE"  then
		if len(deal_idx) <= 0 then
			Response.Write "<root totalCnt='0'  return='-11'></root>"
	        Response.End 
		end if
	elseif cmd = "INSERT" then
		if len(dealType_cd) <= 0 OR len(name) <= 0  then
			Response.Write "<root totalCnt='0'  return='-12'></root>"
	        Response.End 
		end if
	elseif cmd = "UPDATE" then
		if len(dealType_cd) <= 0 OR (len(name) <= 0 AND len(corpName) <= 0) then
			Response.Write "<root totalCnt='0'  return='-13'></root>"
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
		paramInfo_S(1) = DBCls.MakeParam("@deal_idx", adInteger, adParamInput, 0, deal_idx)

		Set rs = DBCls.ExecSPReturnRS("MxRPrt_Dealer_SP_RX", paramInfo_S, Nothing)
		result = DBCls.GetValue(paramInfo_S, "RETURN_VALUE") 
		
		if not rs.EOF then
			Response.Write "<root return='" & result & "'>"
            Response.Write rs(0)
			Response.Write "</root>"
		else
		    Response.Write "<root return='-14'></root>"
		End	if	
				
    elseif cmd = "INSERT" then

    	Dim paramInfo_I(8)

		paramInfo_I(0) = DBCls.MakeParam("RETURN_VALUE", adInteger, adParamReturnValue, , "")						
		paramInfo_I(1) = DBCls.MakeParam("@dealType_cd", adChar, adParamInput, 1, dealType_cd)
		paramInfo_I(2) = DBCls.MakeParam("@name", adVarChar, adParamInput, 50, name)
    	paramInfo_I(3) = DBCls.MakeParam("@corpName", adVarChar, adParamInput, 50, corpName)
        paramInfo_I(4) = DBCls.MakeParam("@jibunAddr", adVarChar, adParamInput, 300, jibunAddr)
        paramInfo_I(5) = DBCls.MakeParam("@tel", adVarChar, adParamInput, 20, tel)
        paramInfo_I(6) = DBCls.MakeParam("@hp", adVarChar, adParamInput, 20, hp)
        paramInfo_I(7) = DBCls.MakeParam("@email", adVarChar, adParamInput, 50, email)
        paramInfo_I(8) = DBCls.MakeParam("@fax", adVarChar, adParamInput, 20, fax)

		Set rs = DBCls.ExecSPReturnRS("MxRPrt_Dealer_SP_C", paramInfo_I, Nothing)
		result = DBCls.GetValue(paramInfo_I, "RETURN_VALUE") 

        Response.Write "<root return='" & result & "'></root>"
        
    elseif cmd = "UPDATE" then

		Dim paramInfo_U(9)
		
		paramInfo_U(0) = DBCls.MakeParam("RETURN_VALUE", adInteger, adParamReturnValue, , "")						
		paramInfo_U(1) = DBCls.MakeParam("@deal_idx", adInteger, adParamInput, 0, deal_idx)
		paramInfo_U(2) = DBCls.MakeParam("@dealType_cd", adChar, adParamInput, 1, dealType_cd)
		paramInfo_U(3) = DBCls.MakeParam("@name", adVarChar, adParamInput, 50, name)
    	paramInfo_U(4) = DBCls.MakeParam("@corpName", adVarChar, adParamInput, 50, corpName)
        paramInfo_U(5) = DBCls.MakeParam("@jibunAddr", adVarChar, adParamInput, 300, jibunAddr)
        paramInfo_U(6) = DBCls.MakeParam("@tel", adVarChar, adParamInput, 20, tel)
        paramInfo_U(7) = DBCls.MakeParam("@hp", adVarChar, adParamInput, 20, hp)
        paramInfo_U(8) = DBCls.MakeParam("@email", adVarChar, adParamInput, 50, email)
        paramInfo_U(9) = DBCls.MakeParam("@fax", adVarChar, adParamInput, 20, fax)

		Set rs = DBCls.ExecSPReturnRS("MxRPrt_Dealer_SP_U", paramInfo_U, Nothing)
		result = DBCls.GetValue(paramInfo_U, "RETURN_VALUE") 
		
        Response.Write "<root return='" & result & "'></root>"

    elseif cmd = "DELETE" then

		Dim paramInfo_D(1)

		paramInfo_D(0) = DBCls.MakeParam("RETURN_VALUE", adInteger, adParamReturnValue, , "")						
		paramInfo_D(1) = DBCls.MakeParam("@deal_idx", adInteger, adParamInput, 0, deal_idx)

		Set rs = DBCls.ExecSPReturnRS("MxRPrt_Dealer_SP_D", paramInfo_D, Nothing)
		result = DBCls.GetValue(paramInfo_D, "RETURN_VALUE") 
			
        Response.Write "<root return='" & result & "'></root>"

    else
        
        Response.Write "<root return='-15'></root>"

    end if

'	rs = Noting
	DBCls.Dispose
	Set DBCls = Nothing
%>

<%
' asp 디버깅 용도 	
 Call AspErrorMsg(Err)
%>				