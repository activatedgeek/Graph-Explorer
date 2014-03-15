<%@ page import="java.util.*,java.io.*" %>
<%
	String filename = "/var/lib/tomcat7/webapps/ROOT/graph/data/graphs/"+request.getParameter("filename")+".graph";
	try{   
	    File f = new File(filename);
	    f.delete();
	    out.println("File Deleted!");
	}catch(IOException e){
	   out.println(e.getMessage());
	}
%>