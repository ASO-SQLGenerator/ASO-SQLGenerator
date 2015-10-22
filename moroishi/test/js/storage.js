function fGetElementType(){
		//アラートは確認用
		
        var s="";
        var i=0;
        var frm=document.forms["param"];
        
        //列数を取得
        var cparts=document.getElementById("cspace_parts");
        var droplen= cparts.getElementsByClassName("drop ui-droppable ui-draggable").length
        
        //パーツの要素数を取得
        var selecttags=cparts.getElementsByTagName("select");
        var inputtags=cparts.getElementsByTagName("input");
        var draglen=selecttags.length + inputtags.length;
    
				var tname = frm.table_name.value;

/*ikegamikokokara------------

				var columns = [""];
				for (var a=0; a<droplen; a++) {
						var colum = frm.culum.value;
						var type = frm.type.value;
						var num = frm.num.value;
						var limit = frm.limit.value;


						columns[a] = {
									"name": colum,
									"dataType": type,
									"leng": num,
									"const": limit		
						};
				}


				var table1 = {
						"table": tname,
						"columns": columns
				};

				var t1 = JSON.stringify(table1);
				localStorage.setItem("t1",t1);

kokomadeeeeeeeeeeeee-------------*/
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
