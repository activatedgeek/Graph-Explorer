<%@ page import="java.util.*,java.io.*" %>
<%	
	String filename = "/var/lib/tomcat7/webapps/ROOT/graph/data/graphs/"+request.getParameter("filename")+".graph";
	String node=request.getParameter("node");
	String edge=request.getParameter("edge");
	try{   
	    PrintWriter pw = new PrintWriter(filename,"UTF-8");
	    pw.println(node);
	    pw.println(edge);
	    pw.close();
	    out.println("File Saved!");
	}catch(IOException e){
	   out.println(e.getMessage());
	}
%>