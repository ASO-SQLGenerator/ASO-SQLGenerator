function fGetElementType(){
		//アラートは確認用
		
        var a = 10;
        var b = 11;
        var c = 12;
        var d = 13;
        var e = 14;
        var f = 0;
        var frm=document.forms["param"];
        
        //列数を取得
        var cparts=document.getElementById("cspace_parts");
        
        var droplen= cparts.getElementsByClassName("drop ui-droppable ui-draggable").length;
        
        
        //パーツの要素数を取得
        var selecttags=cparts.getElementsByTagName("select");
        var inputtags=cparts.getElementsByTagName("input");
        
        var draglen=selecttags.length + inputtags.length -3;
		
		var dropid;
		var limitlen;
		
				var tname = frm.table_name.value;
		
		
				var columns = [""];
				for (var i=0; i<droplen; i++) {
				
						var colum = document.param.elements['a'+ b].value;
						var type = document.param.elements['a'+ c].value;
						var num = document.param.elements['a'+ d].value;
						
						dropid = document.getElementById( "a"+ a );
						
						limitlen =  dropid.getElementsByClassName("limit").length;
						
						
						var limit = [];
						f = e;
						for(var j=0; j<limitlen; j++) {
							
							limit[j] = document.param.elements['a'+ f].value;
							f = f + 1;
							}
						
						columns[i] = {
									"name": colum,
									"dataType": type,
									"leng": num,
									"const": limit
						};
						a += 10;
						b += 10;
						c += 10;
						d += 10;
						e += 10;
				}


				var table1 = {
						"table": tname,
						"columns": columns,
						"data":[]
				};
				var t1 = JSON.stringify(table1);
				localStorage.setItem(localStorage.length,t1);

        	
	}
