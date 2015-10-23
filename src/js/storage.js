function fGetElementType(){
		//アラートは確認用
		
       
        var a = 11;
        var b = 12;
        var c = 13;
        var d = 14;
        var frm=document.forms["param"];
        
        //列数を取得
        var cparts=document.getElementById("cspace_parts");
        
        var droplen= cparts.getElementsByClassName("drop ui-droppable ui-draggable").length
        
        //パーツの要素数を取得
        var selecttags=cparts.getElementsByTagName("select");
        var inputtags=cparts.getElementsByTagName("input");
        
        var draglen=selecttags.length + inputtags.length -3;
    	
				var tname = frm.table_name.value;
		

				var columns = [""];
				for (var i=0; i<droplen; i++) {
				
						var colum = document.param.elements['a'+ a].value;
						var type = document.param.elements['a'+ b].value;
						var num = document.param.elements['a'+ c].value;
						/*
						var limit = [];
						for(var j=0; j<draglen; j++) {
							var e = d+j;
							limit[j] = document.param.elements['a'+ e].value;
							}
							*/
						
						var limit = document.param.elements['a'+ d].value;
						
						
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
				}


				var table1 = {
						"table": tname,
						"columns": columns,
						"data":[{}]
				};

				var t1 = JSON.stringify(table1);
				localStorage.setItem(tname,t1);

        	//alert("入力フォームの数:"+draglen);
        	//alert("列数:"+droplen);
        	
        	for(var x=0; x<droplen; x++){
        		s+="{"
           		for(var y=0; y<5; y++){
           		
           		 s+= frm.elements[i].name+":"
           		 	+ frm.elements[i].value;
           		 	i++;
           		 	
           		 	if(y<4){
           		 		s+=",";
           		 		}
           		 
				}
				s+="}"
				
				if(x<droplen-1){
					s+=",";
					}
			}
			//↓データ構造が理解できないため一旦保留
			/*
			var atable = {
				"table":"Aテーブル",
				"columns":[s],
				"constraint":[
			*/
			var obj = s;
			//JSON.stringifyメソッドを使ってオブジェクトをjson形式に変換
			var json_text = JSON.stringify(obj);
	//		alert(obj);
		//	alert(json_text);
	}
