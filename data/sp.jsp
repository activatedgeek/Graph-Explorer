<%@ page import="java.util.*,java.io.*" %>
<%
String source = request.getParameter( "source" );
String target = request.getParameter( "target" );
String distance = request.getParameter( "d" );
String spath = request.getParameter( "spath" );
final int length = Integer.parseInt(request.getParameter("count"));

if(source!=""){

String[] path_parts = spath.split(",");
final String[] s_parts = source.split(",");
final String[] t_parts = target.split(",");
final String[] distance_parts = distance.split(",");

int final_source=Integer.parseInt(path_parts[0]);
int final_target=Integer.parseInt(path_parts[1]);


//src is vertex index; pred is the recorded predecessor in shortest path
//distance records distance from source;
class node{
	int src;
	int inqueue;
	int pred;
	int distance;
	List<Integer> neighbours;
	public node(){
		distance=555555;
		inqueue=1;
		pred=-1;
		neighbours=new ArrayList<Integer>();
	}
}

//Initialise Adjacency List
node adj_list[]=new node[length];
for (int i=0;i<length;i++){
	adj_list[i]=new node();
	adj_list[i].src=i;
}
//Creating Adjacency List
for(int i=0;i<s_parts.length;i++){
	int temp_source=Integer.parseInt(s_parts[i]);	
	int temp_target=Integer.parseInt(t_parts[i]);
	adj_list[temp_source].neighbours.add(temp_target);
	adj_list[temp_target].neighbours.add(temp_source);
}

//Returns edge distance of any two vertices
class edge_value{
	public int calc_distance(int x,int y){
		for(int i=0;i<s_parts.length;i++){
			int s1=Integer.parseInt(s_parts[i]);
			int t1=Integer.parseInt(t_parts[i]);
			if((s1==x&&t1==y)||(s1==y&&t1==x)){
				int k=Integer.parseInt(distance_parts[i]);
				return k;
			}
		}
		return -1;
	}
}
//Comparator for sorting based on distance from source
class edge_comparator implements Comparator<node> {
	@Override
	public int compare(node x1,node y1){
		if(x1.distance>y1.distance)
			return 1;
		else if (x1.distance<y1.distance)
			return -1;
		else
			return 0;
	}
}

//Creating Queue
List<node> que=new LinkedList<node>();
adj_list[final_source].distance=0;

//Add all nodes to queue
for(int i=0;i<length;i++){
	que.add(adj_list[i]);
}

//Flag for if graph is disconnected
int disconnected=0;

while(que.size()!=0){
	
	Collections.sort(que,new edge_comparator());
//Getting the vertex with the least distance from queue. Source in first case
	node u=que.get(0);
	u.inqueue=0;
//Remove from queue
	que.remove(u);
	if(u.distance==555555){
		disconnected=1;
		break;
	}
//If vertex removed is target then we are done
	if(u.src==final_target){
		break;
	}
//For each neighbour v of u
	for(int i=0;i<u.neighbours.size();i++){
		node v= new node();
		v=adj_list[u.neighbours.get(i)];
		//if v is still in queue we update distance
		if(v.inqueue==1){
			edge_value dist=new edge_value();
			int temp=u.distance+dist.calc_distance(u.src,v.src);
			if(temp<v.distance){
				v.distance=temp;
				v.pred=u.src;
				//Sort list again to reflect new distance for v
				Collections.sort(que,new edge_comparator());
			}
		}
	}
}

StringBuilder temp_send = new StringBuilder();
if(disconnected==0)
	temp_send.append("@");
else
	temp_send.append("!");



StringBuilder source_send = new StringBuilder();
StringBuilder target_send = new StringBuilder();

node v=new node();
v=adj_list[final_target];
int select_counter=0;
while(v.pred!=-1){
//Adding source vertices of shortest path
	source_send.append(v.src+",");
	v=adj_list[v.pred];
//Adding target vertices of shortest path	
	target_send.append(v.src+",");
	select_counter++;
}
temp_send.append(source_send+"#"+target_send+"#"+select_counter);
String send_jsp = temp_send.toString();
//Sending graph data to webapp
out.println(send_jsp);
}
else{
	out.println("!");
}
%>