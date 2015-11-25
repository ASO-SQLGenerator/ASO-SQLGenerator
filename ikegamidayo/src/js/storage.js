function fGetElementType() {
		//アラートは確認用
		
		if(localStorage.length > 2) {
				alert('作成できるテーブルは３つまでです。');
		} else {
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
		
		var pkflg = 0;
				var tname = frm.table_name.value;
						if(tname.match(/[^A-Za-z0-9]+/)) {
										alert("表名に指定できる文字は半角英数字のみです。");
										return false;
						}
						if(!tname.match(/\S/g)) {
										alert("表名を入力してください。");
										return false;
						}
		
		
				var columns = [""];
				for (var i=0; i<droplen; i++) {
				
						var colum = document.param.elements['a'+ b].value;
						if(colum.match(/[^A-Za-z0-9]+/)) {
										alert("列名に指定できる文字は半角英数字のみです。");
										return false;
						}
						if(!colum.match(/\S/g)) {
										alert("列名を入力してください。");
										return false;
						}
						var type = document.param.elements['a'+ c].value;
						var num = document.param.elements['a'+ d].value;
						if(!num.match(/^[1-9][0-9]*$/)) {
										alert("列に指定する文字数制限は半角数字で入力してください。");
										return false;
						}
						if(!num) {
										alert("列に指定する文字数制限を半角数字で入力してください。");
										return false;
						}
						
						dropid = document.getElementById( "a"+ a );
						
						limitlen =  dropid.getElementsByClassName("limit").length;
						
						
						var limit = [];
						f = e;
						for(var j=0; j<limitlen; j++) {
							limit[j] = document.param.elements['a'+ f].value;
									if($.inArray('auto increment', limit) >= 0 && type != 'int') {
											alert('auto incrementを設定した列にはint型のみ設定することができます。');
											return false;
									}
							f = f + 1;
						}
									if($.inArray('primary key',limit) >= 0) {
											pkflg = 1;
									}
									if($.inArray('auto increment', limit) >= 0 && $.inArray('primary key', limit) == -1) {
											alert('auto incrementを設定した列には主キー制約を設定する必要があります。');
											return false;
									}
						for(var k=0; k<i; k++) {
									if(columns[k].name == colum){
													alert('列名が重複しています。');
													return false;
									}
									if($.inArray('auto increment',columns[k].const) >= 0 && $.inArray('auto increment',limit) >= 0) {
													alert('auto incrementは１つの表に対して１つの列にだけ設定することができます。');
									}
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

				if(pkflg == 0) {
						alert("主キーが設定されていません。");
						return false;
				}

				var table1 = {
						"table": tname,
						"columns": columns,
						"data":[]
				};
				var t1 = JSON.stringify(table1);
				localStorage.setItem(localStorage.length,t1);
		}	

        	
	}
