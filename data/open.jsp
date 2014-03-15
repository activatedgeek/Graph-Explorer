<%@ page import="java.util.*,java.io.*" %>
<%	
	String filename = "/var/lib/tomcat7/webapps/ROOT/graph/data/graphs/"+request.getParameter("filename")+".graph";
	try{   
	    BufferedReader br = new BufferedReader(new FileReader(filename));
	    String node = br.readLine();
	    String edge = br.readLine();
	    out.println(node+'$'+edge);
	}catch(IOException e){
	   out.println(e.getMessage());
	}
%>