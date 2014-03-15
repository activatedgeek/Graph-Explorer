<%@ page import="java.util.*,java.io.*" %>
<%	
	try{   
	    File folder = new File("/var/lib/tomcat7/webapps/ROOT/graph/data/graphs/");
	    File[] list = folder.listFiles();
	    String files="#";
	    for(int i=0;i<list.length;++i){
	    	String fName = list[i].getName();
	    	long sec = list[i].lastModified();
	    	Date d = new Date(sec);
	    	files+= fName.substring(0,fName.lastIndexOf('.'))+','+d+'#';
	    }
	    out.println(files);
	}catch(IOException e){
	   out.println(e.getMessage());
	}
%>