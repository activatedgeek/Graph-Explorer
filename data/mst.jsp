<%@ page import="java.util.*,java.io.*" %>
<%
String source = request.getParameter( "source" );
String target = request.getParameter( "target" );
String distance = request.getParameter( "d" );
int length = Integer.parseInt(request.getParameter("count"));

if(source!=""){
String[] s_parts = source.split(",");
String[] t_parts = target.split(",");
String[] distance_parts = distance.split(",");

class edge{
	int src;
	int tgt;
	int weight;
	int selected;
}

edge edge_mat[]=new edge[s_parts.length];

for(int i=0;i<s_parts.length;i++){
	edge_mat[i]=new edge();
	int q1=Integer.parseInt(s_parts[i]);
	edge_mat[i].src=q1;
	int q2=Integer.parseInt(t_parts[i]);
	edge_mat[i].tgt=q2;
	int q3=Integer.parseInt(distance_parts[i]);
	edge_mat[i].weight=q3;
}

class edge_comparator implements Comparator<edge> {
	@Override
	public int compare(edge x1,edge y1){
		if(x1.weight>y1.weight)
			return 1;
		else if (x1.weight<y1.weight)
			return -1;
		else
			return 0;
	}
}
Arrays.sort(edge_mat,new edge_comparator());

class djset{
	int vertices[];
	public djset(int length){
		vertices=new int[length];
	}
	void Makeset(int x) {
		vertices[x]=x;
	}

	int Find(int x){
		if (vertices[x]==x)
			return x;
		else
			return Find(vertices[x]);
	}

	void Union(int x,int y){
		int xRoot= Find(x);
		int yRoot = Find(y);
		vertices[xRoot]=yRoot;
	}
}
djset disjoint_set = new djset(length);

for(int i=0;i<length;i++){
	disjoint_set.Makeset(i);
}

for(int i=0;i<s_parts.length;i++){
	if(disjoint_set.Find(edge_mat[i].src)!=disjoint_set.Find(edge_mat[i].tgt)){
		disjoint_set.Union(edge_mat[i].src,edge_mat[i].tgt);
		edge_mat[i].selected=1;
	}
	else{
		edge_mat[i].selected=0;
	}
}

int no_of_edges=0;
for(int i=0;i<s_parts.length;i++){
	if(edge_mat[i].selected==1)
		no_of_edges++;
}

StringBuilder temp_send = new StringBuilder();
int connect_flag=0;

if(no_of_edges==length-1)
	temp_send.append("@");
else
	temp_send.append("!");

for(int i=0;i<s_parts.length;i++){
	if(edge_mat[i].selected==1){
		temp_send.append(edge_mat[i].src+",");
	}
}
temp_send.append("#");

for(int i=0;i<s_parts.length;i++){
	if(edge_mat[i].selected==1)
		temp_send.append(edge_mat[i].tgt+",");
}
temp_send.append("#"+no_of_edges);

String send_jsp = temp_send.toString();
out.println(send_jsp);
}
else{
	out.println("!");
}
%>
