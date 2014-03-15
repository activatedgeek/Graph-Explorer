cues = {'none': 'No Operation Specified', 
		'vert': 'Click on the canvas to add vertices', 
		'edge': 'Click two vertices to connect',
		'mvert': 'Drag vertex to move',
		'dvert': 'Right Click the vertex to remove',
		'dedge': 'Right Click the edge to remove',
		'sp': 'Click the vertices to calculate shortest path between',
		'mst': 'Calculating the minimum spanning tree'
};

hotkey={v:'vert',
		e: 'edge',
		m: 'mvert',
		d: 'dvert',
		g: 'dedge',
		s: 'sp',
		t: 'mst'};

colors=[];
mode = 'none'
onCircle=false;

source={x:-1,y:-1};
target={x:-1,y:-1};
sourceSet=false;

node=[];
conn=[];
tempconn = []

$(document).ready(function(){
	reset();
	$("#overlay").toggle();
	canvas = new Raphael("play",$("#play").width(),$("#play").height());
	$("#error").hide();
	$("#msg").text(cues[mode]);
	$("#savefile").val("");
	modeChange();

	$(".controls").click(function(){
		mode = $(this).attr('id');
		modeChange();
	});

	$("#clear").click(function(){
		$("path,circle").fadeOut(500,function(){
			$(this).remove();
			node = [];
			conn = [];
			tempconn = [];
		});
	});

	$("#reset").click(function(){
		redraw();
	});

	$(this).keypress(function(event){
		if(event.keyCode==38){ //up arrow key
			var up = $('#'+mode).prev().attr('id');
			if(up==null){
				mode='mst';
			}else{
				mode=up;
			}
			$('#'+mode).trigger('click');
		}
		else if(event.keyCode==40){ //down arrow key
			var down = $('#'+mode).next().attr('id');
			if(down==null){
				mode='none';
			}else{
				mode=down;
			}
			$('#'+mode).trigger('click');
		}
		else if(!$("#savefile").is(':focus')){
			if(event.keyCode==27){
				mode='none';
			}else{
				var key= String.fromCharCode(event.which);
				var temp=mode;
				mode=hotkey[key];
				if(mode==null){
					mode=temp;
				}
			}
			$('#'+mode).trigger('click');
		}
	});

	$("#play").click(function(e){
		var pos = getMousePos(this,e);
		if(!onCircle && mode=='vert'){
			var color='rgb('+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')';
			addVertex({x:pos.x,y:pos.y,color: color},20,'new');
		}
	});

	$("#play").bind("contextmenu",function(e){
        if(mode=='edge'){
	        sourceSet=false;
	    }
        return false;
    });

    $("#save").click(function(){
    	var nodeData = getNodeData();
    	var edgeData = getEdgeData();
    	if(nodeData!=":"){
    		if($("#savefile").val()!=''){
    			$("#savefile").css("border","auto");
		    	$.post('data/save.jsp',{node: nodeData,edge: edgeData,filename: $("#savefile").val()},function(data,status){
		    		if(status=='success'){
		    			$("#msg").hide().html(data).fadeIn(500);
		    		}
		    	});
		    	$("#savefile").val('');
	    	}else{
	    		$("#savefile").css("border","solid red 0.2em").hide().fadeIn(500);
	    		$("#msg").hide().html("No filename given").fadeIn(500);
	    	}
    	}
    	else{
    		$("#msg").hide().html("You haven't added anything to the graph yet!").fadeIn(500);
    	}
    });

    $("#close").click(function(){
    	$("#overlay").fadeToggle(500);
    });

    $("#open").click(function(){
    	$.post('data/list.jsp',{},function(data,status){
    		if(status=='success'){
    			$("#files").children().remove();
    			file = data.split('#');
    			if(file.length>2){
	    			$("#files").append("<tr><th>Name</th><th>Last Modified</th><tr>")
	    			var a=15;
	    		
	    			for(var i=1;i<file.length-1;++i){
	    				var d = file[i].split(',');
	    				$("#files").append("<tr><td class='file'>"+d[0]+"</td><td class='date'>"+d[1]+"</td><td class='delete'>X</td></tr>");
	    			}
	    			
	    			$("#overlay").fadeToggle(500);
	    			$(".file").click(function(){
				    	$.post('data/open.jsp',{filename: $(this).text()},function(data,status){
				    		if(status=='success'){
					    		readGraphData(data);
					    		$("#overlay").fadeToggle(500);
					    		$("#msg").hide().html(cues[mode]).fadeIn(500);
				    		}
				    	});
				    });

					$(".delete").click(function(){
						var filename = $(this).prev().prev().text();
						$.post('data/delete.jsp',{filename: filename},function(data,status){
				    		if(status=='success'){
					    		$("#msg").hide().html(data).fadeIn(500);
					    		$("#close").trigger('click');
					    		$("#open").trigger('click');
					    	}
				    	});
					});
    			}
    			else{
    				$("#msg").hide().html("You have no saved graphs, make one now!").fadeIn(500);
    			}
    		}
    	});
    });
});

function readGraphData(data){
	var data = data.split('$');
	var nodes = data[0].split(':');
	var edges = data[1].split(':');
	node = [];
	for(var i=1;i<nodes.length-1;++i){
		var temp = nodes[i].split('#');
		node.push({x: parseInt(temp[0]),y: parseInt(temp[1]),color: temp[2]});
	}
	conn = [];
	for(var i=1;i<edges.length-1;++i){
		var temp = edges[i].split('#');
		conn.push({source: parseInt(temp[0]),target: parseInt(temp[1])});
	}
	redraw();
}

function getNodeData(){
	s = ":";
	for(var i=0;i<node.length;++i){
		s+=node[i].x+'#'+node[i].y;
		if(node[i].color!=null){
			s+='#'+node[i].color+":";
		}
	}
	return s;
}

function getEdgeData(){
	s = ":";
	for(var i=0;i<conn.length;++i){
		s+= conn[i].source+'#'+conn[i].target+':';
	}
	return s;
}

function reset(){
	source={x:-1,y:-1};
	target={x:-1,y:-1};
	sourceSet=false;
}

function modeChange(){
	$("#msg").css("color","green").fadeOut(0,function(){
		$("#msg").text(cues[mode]);
		$(this).fadeIn(250,function(){
			$(this).css("color","black");
		});
	});
	$(".controls").css({"background":"none","color":"black"});
	$('#'+mode).css({"background":"#cbe4e2","color":"#c42726"});

	if(mode=='mst'){
		var sList = '',tList='',dList='';
		for(var i=0;i<conn.length;++i){
			sList += conn[i].source;
			tList += conn[i].target;
			dList += distance(node[conn[i].source],node[conn[i].target]);
			if(i<conn.length-1){
				sList+=',';
				tList+=',';
				dList+=',';
			}
		}
    	$.post('data/mst.jsp',{source: sList,target: tList,d: dList,count: node.length},function(data,status){
    		if(status=='success'){
    			if(data[1]=='@'){
    				var data = data.substr(2);
    				var data = data.split('#');
    				for(var i=0;i<2;++i){
    					data[i] = data[i].split(',');
    					data[i].splice(data[i].length-1);
    				}
    				tempconn = [];
    				for(var i=0;i<data[0].length;++i){
    					tempconn.push({source: parseInt(data[0][i]), target: parseInt(data[1][i])});
    				}
    				redraw('mst');
    			}
    			else{
    				$("#msg").hide().html("Graph is disconnected").fadeIn(250);
    			}
    		}
    	});
    }
}

function distance(a,b){
	return Math.floor(Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)));
}

function getMousePos(canvas,event){
	var rect = canvas.getBoundingClientRect();
	return{
      x: Math.floor(event.clientX - rect.left),
      y: Math.floor(event.clientY - rect.top)
    };
}

function addEdge(s,t,status){
	if(status=='new'){
		var c = {source:-1,target:-1};
		for(var i=0;i<node.length;++i){
			if(source.x==node[i].x && source.y==node[i].y){
				c.source=i;
			}
			else if(target.x==node[i].x && target.y==node[i].y){
				c.target=i;
			}
			if(c.source!=-1 && c.target!=-1){
				conn.push(c);
				break;
			}
		}
		redraw('edge');
		return;
	}
	canvas
	.path(["M",s.x,s.y,"L",t.x,t.y])
	.attr({"stroke":"gray","stroke-width":"0.5em","stroke-opacity": 0.5})
	.mouseover(function(){
		this
		.animate({"stroke-opacity": 1}, 100, ">");
	})
	.mouseout(function(){
		this
		.animate({"stroke-opacity": 0.5}, 100, "<");
	});

	$("path").bind("contextmenu",function(e){
		if(mode=='dedge'){
			delEdge($(this).attr("d"));
			$(this).fadeOut(500,function(){
				$(this).remove();
			});
		}
	});
}

function addVertex(v,r,status){
	if(status=='new')
		node.push(v);
	canvas.circle(v.x,v.y,r)
	.attr({stroke:"black",fill: v.color,"stroke-width":"3px"})
	.drag(function(dx,dy){
		if(mode=='mvert'){
			var nx = this.ox + dx;
			var ny = this.oy + dy;
			if(nx<30)
				nx=30;
			if(ny<30)
				ny=30;

			if(nx>$("#play").width()-30)
				nx=$("#play").width()-30;
			if(ny>$("#play").height()-30)
				ny=$("#play").height()-30;

			this.attr({cx: nx, cy: ny});
			node[dragIn].x= nx;
			node[dragIn].y= ny;
			redraw('move');
		}
		else
			this.attr({cx: this.ox, cy: this.oy});
	},function(){
		this.ox = this.attr("cx");
        this.oy = this.attr("cy");
        dragIn = findIndex(this.ox,this.oy);
	},function(){})
	.mouseover(function(){
		onCircle=true;
		this
		.animate({r: r+5, opacity: 1}, 100, ">");
	})
	.mouseout(function(){
		onCircle=false;
		this
		.animate({r: r, opacity: 1,fill: v.color}, 100, "<");
	})
	.click(function(){
		if(mode=='edge' || mode=='sp'){
			var x = this.attr("cx");
			var y = this.attr("cy");
			if(!sourceSet){
				source={x:x,y:y};
				sourceSet=true;
			}
			else{
				target={x:x,y:y};
				sourceSet=false;
				if(mode=='edge')
					addEdge(source,target,'new');
				else if(mode=='sp'){
					var sList = '',tList='',dList='';
					for(var i=0;i<conn.length;++i){
						sList += conn[i].source;
						tList += conn[i].target;
						dList += distance(node[conn[i].source],node[conn[i].target]);
						if(i<conn.length-1){
							sList+=',';
							tList+=',';
							dList+=',';
						}
					}
					var srcIn = findIndex(source.x,source.y);
					var tarIn = findIndex(target.x,target.y);
					$.post('data/sp.jsp',{source: sList,target: tList,d: dList,count: node.length,spath: srcIn+','+tarIn},function(data,status){
						if(status=='success'){
							if(data[1]=='@'){
			    				var data = data.substr(2);
			    				var data = data.split('#');
			    				for(var i=0;i<2;++i){
			    					data[i] = data[i].split(',');
			    					data[i].splice(data[i].length-1);
			    				}
			    				tempconn = [];
			    				for(var i=0;i<data[0].length;++i){
			    					tempconn.push({source: parseInt(data[0][i]), target: parseInt(data[1][i])});
			    				}
				    			redraw('sp');
			    			}
			    			else{
			    				$("#msg").hide().html("Node not reachable!").fadeIn(250);
			    			}
						}
					});
				}
				reset();
			}
		}
	});
	
	$("circle").bind("contextmenu",function(e){
        if(mode=='dvert'){
        	delVertex({x:$(this).attr("cx"),y:$(this).attr("cy")});
	        onCircle=false;
	    }
        return false;
    });
}

function delVertex(v){
	var index=-1;
	//find the index to be deleted
	for(var i=0;i<node.length;++i){
		if(node[i].x==v.x && node[i].y==v.y){
			index=i;
			break;
		}
	}
	if(index==-1)
		return;
	//remove vertex connections
	for(var i=0;i<conn.length;++i){
		if(conn[i].source==index || conn[i].target==index){
			conn.splice(i,1);
			i--;
		}
	}
	//remove from node list
	node.splice(index,1);

	//update connection indices
	for(var i=0;i<conn.length;++i){
		if(conn[i].source>index){
			--conn[i].source;
		}
		if(conn[i].target>index){
			--conn[i].target;
		}
	}
	redraw();
}

function delEdge(d){
	var edge = resolveCords(d);
	var si=-1,ti=-1;
	for(var i=0;i<node.length;++i){
		if(node[i].x==edge.source.x && node[i].y==edge.source.y){
			si=i;
		}
		else if(node[i].x==edge.target.x && node[i].y==edge.target.y){
			ti=i;
		}
	}
	//console.log(si+","+ti+" "+conn.length);
	for(var i=0;i<conn.length;++i){
		if(conn[i].source==si && conn[i].target==ti){
			conn.splice(i,1);
			break;
		}
	}
}

function resolveCords(d){
	source={x:-1,y:-1};
	target={x:-1,y:-1};
	det = d.split(',');
	source.x=det[0].split('M')[1];
	next = det[1].split('L');
	source.y=next[0];
	target.x=next[1];
	target.y=det[2];
	return {
		source: source,
		target: target
	};
}

function redraw(status){
	if(status=='move' || status=='edge'){
		$("path,circle").remove();
	}else{
		$("path,circle").fadeOut(500,function(){
			$(this).remove();
		});
	}
	if(status=='mst' || status=='sp'){
		for(var i=0;i<tempconn.length;++i){
			addEdge(node[tempconn[i].source],node[tempconn[i].target],'re');
		}
	}else{
		for(var i=0;i<conn.length;++i){
			addEdge(node[conn[i].source],node[conn[i].target],'re');
		}
	}
	for(var i=0;i<node.length;++i){
		addVertex(node[i],20,'re');
	}
}

function findIndex(x,y){
	for(var i=0;i<node.length;++i){
		if(node[i].x==x && node[i].y==y){
			return i;
		}
	}
	return -1;
}