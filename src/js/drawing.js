$(function() {
function cTableMake(data) {
		for(var i=0; i<data[0].length; i++) {
				document.getElementById("ctable"+i).style.display="block";
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}
				var ro = [];
				for(var r=0; r<data[1][i].length; r++) {
						ro[r] = {readOnly: true};
				}
				
		var container = document.getElementById('ctable'+i);
			eval('hot' + i + ' = new Handsontable(container, {'
				+'	data: data[0][i],'
				+'	height: data[0].length * 25 + 125,'
				+'	colWidths: wid,'
				+'	startCols: data[1][i].length,'
				+'	rowHeaders: true,'
				+'	colHeaders: data[1][i],'
				+'	fillHandle: true,'
				+'	columns: ro'
+'		});');
}
/*

				$("#ctable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 125,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
						columns: ro
				});
		*/
}

function iTableMake(data) {

		var tlen = 3;
		if(localStorage.length<tlen) {
				tlen = localStorage.length;
		}
		for(var i=0; i<tlen; i++) {
				var index = localStorage.key(i);
				var table = localStorage.getItem(index);
				var tabledata = JSON.parse(table);
				var ai0 = 0;
				var ai1 = 0;
				var ai2 = 0;
				var aaa = data[0][i].length;
				if(data[0][i][0] == "") {
						aaa = aaa - 1;
				}
				document.getElementById("itable"+i).style.display="block";
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}
				var ro = [];
				for(var r=0; r<data[1][i].length; r++) {
						if($.inArray('auto increment',tabledata.columns[r].const) >= 0) {
								ro[r] = {readOnly: true};
								eval('ai'+i+'= ai'+i+'+1');
								if(aaa == 0){
										var bbb = new Array(data[1][i].length);
										bbb[r] = 1;
										data[0][i][aaa]= bbb;
								} else {
										var bbb = new Array(data[1][i].length);
										var increment = Number(data[0][i][aaa-1][r]) + 1;
										increment = String(increment);
										bbb[r] = increment;
										data[0][i][aaa]= bbb;
								}
						} else {
								ro[r] = {readOnly: false};
						}
				}
var container = document.getElementById('itable'+i);
eval('hot' + i + ' = new Handsontable(container, {'
				+'	data: data[0][i],'
				+'	height: data[0].length * 25 + 120,'
				+'	minSpareRows: 1-ai'+i+','
				+'	colWidths: wid,'
				+'	startCols: data[1][i].length,'
				+'	rowHeaders: true,'
				+'	colHeaders: data[1][i],'
				+'	fillHandle: true,'
				+'	maxRows:data[0][i].length + 1,'
				+'	columns: ro'
+'		});');
}
hot0.updateSettings({
				cells: function(row, col, prep) {
						var cellProperties = {};
						var len = data[0][0].length-1;
						if(row < len) {
								cellProperties.readOnly = true;
						}
						return cellProperties;
					}
				});
if(localStorage.length > 1) {
		hot1.updateSettings({
				cells: function(row, col, prep) {
						var cellProperties = {};
						var len = data[0][1].length-1;
						if(row < len) {
								cellProperties.readOnly = true;
						}
						return cellProperties;
				}
		});
}
if(localStorage.length > 2) {
		hot2.updateSettings({
				cells: function(row, col, prep) {
						var cellProperties = {};
						var len = data[0][2].length-1;
						if(row < len) {
								cellProperties.readOnly = true;
						}
						return cellProperties;
				}
		});
}
/*

		for(var i=0; i<data[0].length; i++) {
				document.getElementById("itable"+i).style.display="block";
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}
				var ro = [];
				for(var r=0; r<data[1][i].length; r++) {
						ro[r] = {readOnly: false};
				}

				var aaa = data[0][i].length;

				if(data[0][i][0] == "") {
						aaa = aaa - 1;
				}
				$("#itable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 125,
						minSpareRows: 1,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
						//↓セルの最大数を制限する
						maxRows:data[0][i].length + 1,
						columns: ro,
						cells: function(row, col, prep) {
								var cellProperties = {};
								if(row < aaa){
										cellProperties.readOnly = true;
								}
								return cellProperties;
						}

				});
				
		}
		*/
}
		//var editdata0 = [];
		//var editdata1 = [];
		//var editdata2 = [];

function uTableMake(data) {
		var tlen = 3;
		var editdata0 = [];
		var editdata1 = [];
		var editdata2 = [];

		if(localStorage.length<tlen) {
						tlen = localStorage.length;
		}
		for(var i=0; i<tlen; i++) {
				var index = localStorage.key(i);
				var table = localStorage.getItem(index);
				var tabledata = JSON.parse(table);
				document.getElementById("utable"+i).style.display="block";
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}
				var ro = [];
				for(var r=0; r<data[1][i].length; r++) {
					if($.inArray('primary key',tabledata.columns[r].const) >= 0){
						ro[r] = {readOnly: true};
					}else{
						ro[r] = {readOnly: false};
					}
				}
			/*	document.getElementById("utablename"+i).innerHTML=
						"テーブル名："+tabledata.table+'　　　<button id="ubtn'+i+'" onClick="tableUpdate'+i+'(editdata'+i+')">変更要素を確定</button>'; */
		var container = document.getElementById('utable'+i);
		eval('hot' + i + ' = new Handsontable(container, {'
				+'	data: data[0][i],'
				+'	height: data[0].length * 25 + 100,'
				+'	colWidths: wid,'
				+'	startCols: data[1][i].length,'
				+'	rowHeaders: true,'
				+'	colHeaders: data[1][i],'
				+'	fillHandle: true,'
				+'	columns: ro'
				+'		});');
/*
				$("#utable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 125,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
						columns: ro
				});
			*/
		}
				var j0 = 0;
				var j1 = 0;
				var j2 = 0;

				hot0.addHook('afterChange',function(changes,source) {
						if(source === 'edit' && changes[0][2] != changes[0][3]) {
								var eflg = 0;
								for(var n=0; n<editdata0.length; n++) {
					 					if(editdata0[n][0][1] === changes[0][1]) {
												editdata0[n][0][3] = changes[0][3];
												eflg = 1;
										}
								}
								if(eflg == 0) {
										editdata0[j0] = changes;
										j0++;
								}
						}
						hot0.updateSettings({
								cells: function(row, col, prep) {
										var cellProperties = {};
										if(row != changes[0][0]) {
												cellProperties.readOnly = true;
										}
										return cellProperties;
								}
						});
				});
		window.tableUpdate0 = function tableUpdate0() {
		var updateTable0 = {};
		var data1 =[[[]]] 
		var test = getData();
		var colname = hot0.getColHeader();
		var local = localStorage.getItem(0);
			local = JSON.parse(local);;
		var index = editdata0[0][0][0];

		var	temp = local.data[index][colname[0]];
		var editvalues = {};
		var editkey=[];

		for(var i=0; i<editdata0.length; i++) {
				editvalues[test[1][0][editdata0[i][0][1]]] = editdata0[i][0][3];
				
				 //var a = JSON.stringify(local);
				 var b = JSON.stringify(editdata0);
				 var c = JSON.stringify(editvalues);
					 c = JSON.parse(c);
				 var d = hot0.getDataAtRow(editdata0[0][0][0]);
				 var e =editdata0[0][0][0];
				 var f =test[1][0][editdata0[i][0][1]];
				console.log('i:' + i);
				console.log(JSON.stringify(local.data[index]));
				console.log(local.data[index][f]);
				local.data[index][f] = c[f];
				console.log(local.data[index][f]);
				console.log('b:' +b);
				console.log('c:' +c[f]);
				console.log('変更された行のデータ内容:' + d[i]);
				console.log('変更された0番目の表の行番号:' + e);
				console.log(f);
				editkey[i] = f;
				//console.log(editdata0[i][0]);
				//console.log(editdata0[i][0][3]);
				for(var a=0; a<d.length; a++) {
						if(d[a] == null) {
								d[a] = null;
						} else {
								d[a] = d[a].trim();
						}
				}
		}
		for(var i=0; i<local.columns.length; i++) {
						if(d[i] != null) {
								if(local.columns[i].dataType == 'int' && !d[i].match(/^[1-9][0-9]*$/)) {
										document.getElementById("uErr0").innerText='　int型の"'+ local.columns[i].name + '"の列の値に格納できるのは整数値のみです。';
										return false
								}
								if(local.columns[i].dataType == 'char' && local.columns[i].leng != d[i].length) {
										document.getElementById("uErr0").innerText='　char型の"'+ local.columns[i].name + '"の列の値に格納できる文字列は' + local.columns[i].leng +'桁の固定長のみです。';
										return false
								}else if(tabledata.columns[i].leng < d[i].length) {
										document.getElementById("uErr0").innerText= '　"'+ local.columns[i].name + '"の列に格納できる値は'+ local.columns[i].leng + '桁までです。';
										return false
								}
						}
						for(var k=0; k<local.columns[i].const.length; k++) {
								//notnullチェック
								if(local.columns[i].const[k] =='not null' && (d[i] == null || d[i] == '')) {
										document.getElementById("uErr0").innerText='　not null制約の"' + local.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//unique key チェック
								for(var j=0; j<test[0][0].length; j++) {
										if(local.columns[i].const[k] =='unique key' && d[i] != null && test[0][0][j][i] == d[i] && j != editdata0[0][0][0]){
												document.getElementById("uErr0").innerText='　unique key制約の"'+ local.columns[i].name + '"の列の値に重複する値が含まれています。';
												return false
										}
								}
								//主キーnotnullチェック
								if(local.columns[i].const[k] =='primary key' && (d[i] == null || d[i] == '')) {
										document.getElementById("uErr0").innerText='　主キー制約の"' + local.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//主キー列重複チェック
								for(var j=0; j<test[0][0].length; j++) {
										if(local.columns[i].const[k] =='primary key' && d[i] != null && test[0][0][j][i] == d[i] && j != editdata0[0][0][0]){
												document.getElementById("uErr0").innerText='　主キー制約の"' + local.columns[i].name + '"の列の値に一意でない値が含まれています。';
												return false
										}
								}
						}
		}
		var con = [];
		//con = test[1][0][0] +" == /'" + test[0][0][editdata0[0][0][0]][0] +"/'";
		console.log(JSON.stringify(local));
		console.log(editkey);
		console.log(editkey.length);
		console.log(editvalues);
		var setvalue='';	
		for(var i=0; i < editkey.length; i++){
			if(i!=0){
				setvalue += ',';
			}
			console.log(editkey[i]);
			console.log(editvalues[editkey[i]])
			var s = editkey[i] + ' = ' + editvalues[editkey[i]];
			
			setvalue = setvalue + s;
		} 
		var sql = "UPDATE " + local.table + " SET " + setvalue + " WHERE " + colname[0] + " = " + temp + ";";
		console.log(sql);
		console.log(editvalues);
		console.log(setvalue);

		sessionStorage.setItem("updateState",sql);

		var uplocal = JSON.stringify(local);
		localStorage.setItem(0,uplocal);		

		if (sql) {
			$('#umain_sqlarea').val(sql);
				}

		data1 = getData();
		makeTitle();
		uTableMake(data1);
		
		//var table = localStorage.getItem(0);
		//var tabledata = JSON.parse(table);
		//updateTable0['table'] = tabledata.table;
		//updateTable0['values'] = editvalues;
		//updateTable0['conditions'] = con; 
		//console.log(updateTable0);
		//alert(updateTable0);
	}
		if(localStorage.length > 1) {
				hot1.addHook('afterChange',function(changes,source) {
						if(source === 'edit' && changes[0][2] != changes[0][3]) {
								var eflg = 0;
								for(var n=0; n<editdata1.length; n++) {
					 					if(editdata1[n][0][1] === changes[0][1]) {
												editdata1[n][0][3] = changes[0][3];
												eflg = 1;
										}
								}
								if(eflg == 0) {
										editdata1[j1] = changes;
										j1++;
								}
						}
						hot1.updateSettings({
								cells: function(row, col, prep) {
										var cellProperties = {};
										if(row != changes[0][0]) {
												cellProperties.readOnly = true;
										}
										return cellProperties;
								}
						});
				});
		window.tableUpdate1 = function tableUpdate1() {
		var updateTable1 = {};
		var data1 =[[[]]] 
		var test = getData();
		var colname = hot1.getColHeader();
		var local = localStorage.getItem(1);
			local = JSON.parse(local);
		var index = editdata1[0][0][0];
		var	temp = local.data[index][colname[0]];
		var editvalues = {};
		var editkey=[];
		for(var i=0; i<editdata1.length; i++) {
				editvalues[test[1][1][editdata1[i][0][1]]] = editdata1[i][0][3];
				 //var a = JSON.stringify(local);
				 var b = JSON.stringify(editdata1);
				 var c = JSON.stringify(editvalues);
					 c = JSON.parse(c);
				 var d = hot1.getDataAtRow(editdata1[0][0][0]);
				 var e = editdata1[0][0][0];
				 var f = test[1][1][editdata1[i][0][1]];
				console.log('i:' + i);
				console.log(JSON.stringify(local.data[index]));
				console.log(local.data[index][f]);
				local.data[index][f] = c[f];
				console.log(local.data[index][f]);
				console.log('b:' +b);
				console.log('c:' +c[f]);
				console.log('変更された行のデータ内容:' + d[i]);
				console.log('変更された0番目の表の行番号:' + e);
				console.log(f);
				editkey[i] = f;
				//console.log(editdata0[i][0]);
				//console.log(editdata0[i][0][3]);
				for(var a=0; a<d.length; a++) {
						if(d[a] == null) {
								d[a] = null;
						} else {
								d[a] = d[a].trim();
						}
				}
		}
		for(var i=0; i<local.columns.length; i++) {
						if(d[i] != null) {
								if(local.columns[i].dataType == 'int' && !d[i].match(/^[1-9][0-9]*$/)) {
										document.getElementById("uErr1").innerText='　int型の"'+ local.columns[i].name + '"の列の値に格納できるのは整数値のみです。';
										return false
								}
								if(local.columns[i].dataType == 'char' && local.columns[i].leng != d[i].length) {
										document.getElementById("uErr1").innerText='　char型の"'+ local.columns[i].name + '"の列の値に格納できる文字列は' + local.columns[i].leng +'桁の固定長のみです。';
										return false
								}else if(tabledata.columns[i].leng < d[i].length) {
										document.getElementById("uErr1").innerText= '　"'+ local.columns[i].name + '"の列に格納できる値は'+ local.columns[i].leng + '桁までです。';
										return false
								}
						}
						for(var k=0; k<local.columns[i].const.length; k++) {
								//notnullチェック
								if(local.columns[i].const[k] =='not null' && (d[i] == null || d[i] == '')) {
										document.getElementById("uErr1").innerText='　not null制約の"' + local.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//unique key チェック
								for(var j=0; j<test[0][1].length-1; j++) {
										if(local.columns[i].const[k] =='unique key' && d[i] != null && test[0][1][j][i] == d[i] && j != editdata1[0][0][0]){
												document.getElementById("uErr1").innerText='　unique key制約の"'+ local.columns[i].name + '"の列の値に重複する値が含まれています。';
												return false
										}
								}
								//主キーnotnullチェック
								if(local.columns[i].const[k] =='primary key' && (d[i] == null || d[i] == '')) {
										document.getElementById("uErr1").innerText='　主キー制約の"' + local.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//主キー列重複チェック
								for(var j=0; j<test[0][1].length-1; j++) {
										if(local.columns[i].const[k] =='primary key' && d[i] != null && test[0][1][j][i] == d[i] && j != editdata1[0][0][0]){
												document.getElementById("uErr1").innerText='　主キー制約の"' + local.columns[i].name + '"の列の値に一意でない値が含まれています。';
												return false
										}
								}
						}
		}
		var con = [];
		//con = test[1][0][0] +" == /'" + test[0][0][editdata0[0][0][0]][0] +"/'";
		console.log(JSON.stringify(local));
		console.log(editkey);
		console.log(editkey.length);
		console.log(editvalues);
		var setvalue='';	
		for(var i=0; i < editkey.length; i++){
			if(i!=0){
				setvalue += ',';
			}
			console.log(editkey[i]);
			console.log(editvalues[editkey[i]])
			var s = editkey[i] + ' = ' + editvalues[editkey[i]];
			
			setvalue = setvalue + s;
		} 
		var sql = "UPDATE " + local.table + " SET " + setvalue + " WHERE " + colname[0] + " = " + temp + ";";
		console.log(sql);
		console.log(editvalues);
		console.log(setvalue);
		sessionStorage.setItem("updateState",sql);
		var uplocal = JSON.stringify(local);
		localStorage.setItem(1,uplocal);
		
		if (sql) {
			$('#umain_sqlarea').val(sql);
				}
				
		data1 = getData();
		makeTitle();
		uTableMake(data1);
		
		//var table = localStorage.getItem(0);
		//var tabledata = JSON.parse(table);
		//updateTable0['table'] = tabledata.table;
		//updateTable0['values'] = editvalues;
		//updateTable0['conditions'] = con; 
		//console.log(updateTable0);
		//alert(updateTable0);
	}
		}
		if(localStorage.length > 2) {
				hot2.addHook('afterChange',function(changes,source) {
						if(source === 'edit' && changes[0][2] != changes[0][3]) {
								var eflg = 0;
								for(var n=0; n<editdata2.length; n++) {
					 					if(editdata2[n][0][1] === changes[0][1]) {
												editdata2[n][0][3] = changes[0][3];
												eflg = 1;
										}
								}
								if(eflg == 0) {
										editdata2[j2] = changes;
										j2++;
								}
						}
						hot2.updateSettings({
								cells: function(row, col, prep) {
										var cellProperties = {};
										if(row != changes[0][0]) {
												cellProperties.readOnly = true;
										}
										return cellProperties;
								}
						});
				});
		window.tableUpdate2 = function tableUpdate2() {
		var updateTable1 = {};
		var data1 =[[[]]] 
		var test = getData();
		var colname = hot2.getColHeader();
		var local = localStorage.getItem(2);
			local = JSON.parse(local);
		var index = editdata2[0][0][0];
		var	temp = local.data[index][colname[0]];
		var editvalues = {};
		var editkey=[];
		for(var i=0; i<editdata2.length; i++) {
				editvalues[test[1][2][editdata2[i][0][1]]] = editdata2[i][0][3];
				 //var a = JSON.stringify(local);
				 var b = JSON.stringify(editdata2);
				 var c = JSON.stringify(editvalues);
					 c = JSON.parse(c);
				 var d = hot2.getDataAtRow(editdata2[0][0][0]);
				 var e =editdata2[0][0][0];
				 var f =test[1][2][editdata2[i][0][1]];
				console.log('i:' + i);
				console.log(JSON.stringify(local.data[index]));
				console.log(local.data[index][f]);
				local.data[index][f] = c[f];
				console.log(local.data[index][f]);
				console.log('b:' +b);
				console.log('c:' +c[f]);
				console.log('変更された行のデータ内容:' + d[i]);
				console.log('変更された0番目の表の行番号:' + e);
				console.log(f);
				editkey[i] = f;
				//console.log(editdata0[i][0]);
				//console.log(editdata0[i][0][3]);
				for(var a=0; a<d.length; a++) {
						if(d[a] == null) {
								d[a] = null;
						} else {
								d[a] = d[a].trim();
						}
				}
		}
		for(var i=0; i<local.columns.length; i++) {
						if(d[i] != null) {
								if(local.columns[i].dataType == 'int' && !d[i].match(/^[1-9][0-9]*$/)) {
										document.getElementById("uErr2").innerText='　int型の"'+ local.columns[i].name + '"の列の値に格納できるのは整数値のみです。';
										return false
								}
								if(local.columns[i].dataType == 'char' && local.columns[i].leng != d[i].length) {
										document.getElementById("uErr2").innerText='　char型の"'+ local.columns[i].name + '"の列の値に格納できる文字列は' + local.columns[i].leng +'桁の固定長のみです。';
										return false
								}else if(tabledata.columns[i].leng < d[i].length) {
										document.getElementById("uErr2").innerText= '　"'+ local.columns[i].name + '"の列に格納できる値は'+ local.columns[i].leng + '桁までです。';
										return false
								}
						}
						for(var k=0; k<local.columns[i].const.length; k++) {
								//notnullチェック
								if(local.columns[i].const[k] =='not null' && (d[i] == null || d[i] == '')) {
										document.getElementById("uErr2").innerText='　not null制約の"' + local.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//unique key チェック
								for(var j=0; j<test[0][2].length-1; j++) {
										if(local.columns[i].const[k] =='unique key' && d[i] != null && test[0][2][j][i] == d[i] && j != editdata2[0][0][0]){
												document.getElementById("uErr2").innerText='　unique key制約の"'+ local.columns[i].name + '"の列の値に重複する値が含まれています。';
												return false
										}
								}
								//主キーnotnullチェック
								if(local.columns[i].const[k] =='primary key' && (d[i] == null || d[i] == '')) {
										document.getElementById("uErr2").innerText='　主キー制約の"' + local.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//主キー列重複チェック
								for(var j=0; j<test[0][2].length-1; j++) {
										if(local.columns[i].const[k] =='primary key' && d[i] != null && test[0][2][j][i] == d[i] && j != editdata2[0][0][0]){
												document.getElementById("uErr2").innerText='　主キー制約の"' + local.columns[i].name + '"の列の値に一意でない値が含まれています。';
												return false
										}
								}
						}
		}
		var con = [];
		//con = test[1][0][0] +" == /'" + test[0][0][editdata0[0][0][0]][0] +"/'";
		console.log(JSON.stringify(local));
		console.log(editkey);
		console.log(editkey.length);
		console.log(editvalues);
		var setvalue='';	
		for(var i=0; i < editkey.length; i++){
			if(i!=0){
				setvalue += ',';
			}
			console.log(editkey[i]);
			console.log(editvalues[editkey[i]])
			var s = editkey[i] + ' = ' + editvalues[editkey[i]];
			
			setvalue = setvalue + s;
		} 
		var sql = "UPDATE " + local.table + " SET " + setvalue + " WHERE " + colname[0] + " = " + temp + ";";
		console.log(sql);
		console.log(editvalues);
		console.log(setvalue);
		sessionStorage.setItem("updateState",sql);
		
		var uplocal = JSON.stringify(local);
		localStorage.setItem(2,uplocal);
		if (sql) {
			$('#umain_sqlarea').val(sql);
				}
		data1 = getData();
		makeTitle();
		uTableMake(data1);
		
		//var table = localStorage.getItem(0);
		//var tabledata = JSON.parse(table);
		//updateTable0['table'] = tabledata.table;
		//updateTable0['values'] = editvalues;
		//updateTable0['conditions'] = con; 
		//console.log(updateTable0);
		//alert(updateTable0);
	}
		}
}

function dTableMake(data) {
		for(var i=0; i<data[0].length; i++) {
				document.getElementById("dtable"+i).style.display="block";
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}
				var ro = [];
				for(var r=0; r<data[1][i].length; r++) {
						ro[r] = {readOnly: true};
				}
		var container = document.getElementById('dtable'+i);
		eval('hot' + i + ' = new Handsontable(container, {'
				+'	data: data[0][i],'
				+'	height: data[0].length * 25 + 100,'
				+'	colWidths: wid,'
				+'	startCols: data[1][i].length,'
				+'	rowHeaders: true,'
				+'	colHeaders: data[1][i],'
				+'	fillHandle: true,'
				+'	removeRowPlugin: true,'
				+'	columns: ro'
+'		});');
/*


				$("#dtable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 125,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
						removeRowPlugin: true,
						columns: ro
				});
				*/
		}
}

function sTableMake(data) {
		for(var i=0; i<data[0].length; i++) {
				document.getElementById("stable"+i).style.display="block";
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}
				var ro = [];
				for(var r=0; r<data[1][i].length; r++) {
						ro[r] = {readOnly: true};
				}
var container = document.getElementById('stable'+i);
eval('hot' + i + ' = new Handsontable(container, {'
				+'	data: data[0][i],'
				+'	height: data[0].length * 25 + 100,'
				+'	colWidths: wid,'
				+'	startCols: data[1][i].length,'
				+'	columnSorting: true,'
				+'	rowHeaders: true,'
				+'	colHeaders: data[1][i],'
				+'	fillHandle: true,'
				+'	columns: ro'
+'		});');
/*
				$("#stable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 125,
						colWidths: wid,
						startCols: data[1][i].length,
						columnSorting: true,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
						columns: ro
				});
			*/
		}
}

function getData() {
		var data = [[[]]];
		var coldata = [[]];
		var tlen = 3;
		if(localStorage.length<tlen) {
						tlen = localStorage.length;
		}
		for(var i=0; i<tlen; i++) {
				var index = localStorage.key(i);
				var table = localStorage.getItem(index);
				var tabledata = JSON.parse(table);

				coldata[i] = [];
				for(var j=0; j<tabledata.columns.length; j++) {
						coldata[i][j] = tabledata.columns[j].name;		
				}

				var a,b,c;
				var d = 0;
				data[i] = [];
				for(a=0; b=tabledata.data[a++];) {
						var low = [];
						var e = 0;
						for(c in b) {
								low[e] = b[c];
								e++;
						}
						data[i][d] = low;
						d++;
				}
		}
		return [data,coldata];
}


function makeTitle () {
		var tlen = 3;
		if(localStorage.length<tlen) {
						tlen = localStorage.length;
		}
		for(var i=0; i<tlen; i++) {
				var index = localStorage.key(i);
				var table = localStorage.getItem(index);
				var tabledata = JSON.parse(table);
				
				document.getElementById("ctablename" + i).innerHTML="テーブル名:" + tabledata.table;
				
				document.getElementById("itablename"+i).innerHTML=
						"テーブル名："+tabledata.table+'　　　<button id="iBtn'+i+'" onClick="tableInsert'+i+'()">追加要素を確定</button><label id="iErr'+i+'" style="color:red;"></label>';
						document.getElementById("utablename"+i).innerHTML="テーブル名："+tabledata.table;

				document.getElementById("utablename"+i).innerHTML=
						"テーブル名："+tabledata.table+'　　　<button id="ubtn'+i+'" onClick="return tableUpdate'+i+'()">変更要素を確定</button><label id="uErr'+i+'" style="color:red;"></label>';
			
				document.getElementById("dtablename"+i).innerHTML=
						"テーブル名："+tabledata.table+'　<br><button class="daBtn" onClick="tableReset'+i+'()" >テーブルの全データ破棄</button>      <button class="dBtn" onClick="tableDelete'+i+'()" >テーブルの削除</button>';

				document.getElementById("stablename"+i).innerHTML=
						"テーブル名："+tabledata.table+'　<input type="checkbox" id="sCheck"' + i + ' name="scb'+ i +'" checked="checked">列省略　　<button id="sBtn'+i+'" onClick="tableSelect'+i+'()" >テーブルを参照するSQL表示</button>';

		}
}
$(function() {
		var data = [[[]]];
		document.getElementById("ctablename0").innerHTML="";
		document.getElementById("ctablename1").innerHTML="";
		document.getElementById("ctablename2").innerHTML="";
		document.getElementById("ctable0").style.display="none";
		document.getElementById("ctable1").style.display="none";
		document.getElementById("ctable2").style.display="none";
		data = getData();
		makeTitle();
		cTableMake(data);	
});
$(".create").click(function() {
		var data = [[[]]];
		document.getElementById("ctablename0").innerHTML="";
		document.getElementById("ctablename1").innerHTML="";
		document.getElementById("ctablename2").innerHTML="";
		document.getElementById("ctable0").style.display="none";
		document.getElementById("ctable1").style.display="none";
		document.getElementById("ctable2").style.display="none";
		data = getData();
		makeTitle();
		cTableMake(data);	
});
$(".insert").click(function() {
		var data = [[[]]];
		document.getElementById("itablename0").innerHTML="";
		document.getElementById("itablename1").innerHTML="";
		document.getElementById("itablename2").innerHTML="";
		document.getElementById("itable0").style.display="none";
		document.getElementById("itable1").style.display="none";
		document.getElementById("itable2").style.display="none";
		data = getData();
		makeTitle();
		iTableMake(data);
		sql = sessionStorage.getItem('insertState');
		  if (sql) {
			$('#imain_sqlarea').val(sql);
		}	
});
$(".update").click(function() {
		var data = [[[]]];
		document.getElementById("utablename0").innerHTML="";
		document.getElementById("utablename1").innerHTML="";
		document.getElementById("utablename2").innerHTML="";
		document.getElementById("utable0").style.display="none";
		document.getElementById("utable1").style.display="none";
		document.getElementById("utable2").style.display="none";
		data = getData();
		makeTitle();
		uTableMake(data);
		sql = sessionStorage.getItem('updateState');
		  if (sql) {
			$('#umain_sqlarea').val(sql);
		}	
});
$(".delete").click(function() {
		var data = [[[]]];
		document.getElementById("dtablename0").innerHTML="";
		document.getElementById("dtablename1").innerHTML="";
		document.getElementById("dtablename2").innerHTML="";
		document.getElementById("dtable0").style.display="none";
		document.getElementById("dtable1").style.display="none";
		document.getElementById("dtable2").style.display="none";
		data = getData();
		makeTitle();
		dTableMake(data);
		sql = sessionStorage.getItem('dropState');
		  if (sql) {
			$('#dmain_sqlarea').val(sql);
		}
});
$(".select").click(function() {
		var data = [[[]]];
		document.getElementById("stablename0").innerHTML="";
		document.getElementById("stablename1").innerHTML="";
		document.getElementById("stablename2").innerHTML="";
		document.getElementById("stable0").style.display="none";
		document.getElementById("stable1").style.display="none";
		document.getElementById("stable2").style.display="none";
		data = getData();
		makeTitle();
		sTableMake(data);	
});
	//パーツを用いたdelete文の生成
    window.tabledelete = function tabledelete() {
        var delete_stock = [];
        var stock_count = 0;
        var delete_count = 0;

        var clearAll_flag = 0;
        var sql = "";


        var dget = document.getElementById('cdspace_parts');
        var delete_counter = dget.getElementsByClassName('ddrop checked').length;



        for(+delete_count; +delete_count < +delete_counter; +delete_count++) {
            console.log(delete_counter);
            console.log(delete_count);


            var ui_tableitem = $('.dspace').children('div:eq(' + delete_count + ')');
            var delete_number = ui_tableitem.attr('name');

            var tablename = document.getElementsByName('a' + (+delete_number + 1))[0].value;

            var deletecondtion1;
            var deletecondtion2;
            var deletecondtion3;
            if ($("*[name=" + delete_number + "] > div > div").length) {
                console.log('find');
                deletecondition1 = document.getElementsByName('a' + (+delete_number + 2))[0].value;
                deletecondition2 = document.getElementsByName('a' + (+delete_number + 3))[0].value;
                deletecondition3 = document.getElementsByName('a' + (+delete_number + 4))[0].value;
                console.log(deletecondition1.toString());
                console.log(deletecondition2.toString());
                console.log(deletecondition3.toString());
                
                var k1 = deletecondition1.toString();
                var k2 = deletecondition3.toString();
                
                
                var tation ='';
                     if (deletecondition2 == "equal") {
                        tation = "=";
                    } else if (deletecondition2 == "dainari") {
                        tation = ">";
                    } else if (deletecondition2 == "syounari") {
                        tation = "<";
                    } else if (deletecondition2 == "dainari equal") {
                        tation = ">=";
                    } else if (deletecondition2 == "syounari equal") {
                        tation = "<=";
                    }
                
                var temp ='';
                temp = "DELETE FROM "+ tablename + " WHERE " + k1 + " " + tation + " " + k2 + ";";
                
            } else {
                console.log('undefind');
                clearAll_flag = 1;
                
                var temp ='';
                temp = "DELETE FROM " + tablename + ";";
                
            }


            var countKey = 0; //cannot move
            for (countKey; localStorage.key(countKey); countKey++) {
                console.log(localStorage.key(countKey));
                var getkeys = localStorage.key(countKey);


                var delete_storage = JSON.parse(localStorage.getItem(getkeys));
                console.log(delete_storage.table);


                if (delete_storage.table == tablename) {

                    if (clearAll_flag == 1) {
                        clearAll();
                    } else if (deletecondition2 == "equal") {
                        equal();
                    } else if (deletecondition2 == "dainari") {
                        dainari();
                    } else if (deletecondition2 == "syounari") {
                        syounari();
                    } else if (deletecondition2 == "dainari equal") {
                        dainari_equal();
                    } else if (deletecondition2 == "syounari equal") {
                        syounari_equal();
                    }


                    for (var z in delete_stock) {
                        for (var g in delete_storage.data) {
                            if (delete_storage.data[g] == delete_stock[z]) {
                                delete_storage.data.splice(g, 1);
                                console.log('delete finish');
                            }
                        }
                    }
                    console.log(delete_stock[0]);
                    console.log(delete_stock[1]);
					sql = sql + temp + "\n";
					console.log(sql);
                    localStorage.setItem(localStorage.key(countKey), JSON.stringify(delete_storage));
                }
                  
                //console.log(sql);

                function clearAll() {
                    for (var v in delete_storage.data) {
                    }
                    delete_storage.data.splice(0, v + 1);
                    console.log("start action clearAll");
                    clearAll_flag = 0;
                }

                function equal() {
                    console.log("start action equal");
                    for (var j in delete_storage.data) {
                        for (var i in delete_storage.data[j]) {
                            if (i == deletecondition1 && delete_storage.data[j][i] == deletecondition3) {
                                console.log("match this columns >>> loaclStorage : key = " + localStorage.key(countKey) + " >>> data >>> " + " Line >>> " + j + " >>> " + i + " = " + delete_storage.data[j][i]);
                                delete_stock[stock_count] = delete_storage.data[j];
                                stock_count++;
                            }
                        }
                    }
                }

                function dainari() {
                    console.log("start action dainari");
                    for (var j in delete_storage.data) {
                        for (var i in delete_storage.data[j]) {
                            if (i == deletecondition1) {
                                if (+delete_storage.data[j][i] > deletecondition3) {
                                    console.log("match this columns >>> loaclStorage : key = " + localStorage.key(countKey) + " >>> data >>> " + " Line >>> " + j + " >>> " + i + " = " + delete_storage.data[j][i]);
                                    delete_stock[stock_count] = delete_storage.data[j];
                                    stock_count++;
                                }
                            }
                        }
                    }
                }

                function syounari() {
                    console.log("start action syounari");
                    for (var j in delete_storage.data) {
                        for (var i in delete_storage.data[j]) {
                            if (i == deletecondition1) {
                                if (+delete_storage.data[j][i] < deletecondition3) {

                                    console.log("match this columns >>> loaclStorage : key = " + localStorage.key(countKey) + " >>> data >>> " + " Line >>> " + j + " >>> " + i + " = " + delete_storage.data[j][i]);
                                    delete_stock[stock_count] = delete_storage.data[j];
                                    stock_count++;
                                }
                            }
                        }
                    }
                }

                function dainari_equal() {
                    console.log("start action dainari equal");
                    for (var j in delete_storage.data) {
                        for (var i in delete_storage.data[j]) {
                            if (i == deletecondition1) {
                                if (+delete_storage.data[j][i] >= deletecondition3) {
                                    console.log("match this columns >>> loaclStorage : key = " + localStorage.key(countKey) + " >>> data >>> " + " Line >>> " + j + " >>> " + i + " = " + delete_storage.data[j][i]);
                                    delete_stock[stock_count] = delete_storage.data[j];
                                    stock_count++;
                                }
                            }
                        }
                    }
                }

                function syounari_equal() {
                    console.log("start action syounari equal");
                    for (var j in delete_storage.data) {
                        console.log(j);
                        for (var i in delete_storage.data[j]) {
                            if (i == deletecondition1) {
                                if (+delete_storage.data[j][i] <= deletecondition3) {
                                    console.log("match this columns >>> loaclStorage : key = " + localStorage.key(countKey) + " >>> data >>> " + " Line >>> " + j + " >>> " + i + " = " + delete_storage.data[j][i]);
                                    delete_stock[stock_count] = delete_storage.data[j];
                                    stock_count++;
                                }
                            }
                        }
                    }
                }
            }
        }
          
          console.log(sql);
          console.log("stop");

		sessionStorage.setItem("dropState",sql);
		
		if (sql) {
			$('#dmain_sqlarea').val(sql);
				}
		data1 = [[[]]];						
		data1 = getData();
		makeTitle();
		dTableMake(data1);
          
          
    }

window.tableDelete0 = function tableDelete0() {
		var index = localStorage.key(0);
		var table = localStorage.getItem(index);
		var tabledata = JSON.parse(table);
		var sql = "DROP TABLE " + tabledata.table +";";
		sessionStorage.setItem('dropState',sql);
		localStorage.removeItem(index)
		if(localStorage.length == 1) {
			var movedata = localStorage.getItem(1);
			localStorage.setItem(0,movedata);
			localStorage.removeItem(1);
		}
		if(localStorage.length == 2) {
			var movedata = localStorage.getItem(1);
			localStorage.setItem(0,movedata);
			localStorage.removeItem(1);
			var movedata = localStorage.getItem(2);
			localStorage.setItem(1,movedata);
			localStorage.removeItem(2);
		}
		if(localStorage.length >= 3 ){
		for(var i =1;i <= localStorage.length; i++){
			var movedata = localStorage.getItem(i);
			localStorage.setItem(i-1,movedata);
			localStorage.removeItem(i);
		}
		}
		var data = [[[]]];
		document.getElementById("dtablename0").innerHTML="";
		document.getElementById("dtablename1").innerHTML="";
		document.getElementById("dtablename2").innerHTML="";
		document.getElementById("dtable0").style.display="none";
		document.getElementById("dtable1").style.display="none";
		document.getElementById("dtable2").style.display="none";
		sql = sessionStorage.getItem('dropState');
		  if (sql) {
			$('#dmain_sqlarea').val(sql);
		}
		data = getData();
		makeTitle();
		dTableMake(data);
}
window.tableDelete1 = function tableDelete1() {
		var index = localStorage.key(1);
		var table = localStorage.getItem(index);
		var tabledata = JSON.parse(table);
		var sql = "DROP TABLE " + tabledata.table +";";
		sessionStorage.setItem('dropState',sql);
	
		var index = localStorage.key(1);
		localStorage.removeItem(index)
			if(localStorage.length == 2) {
			var movedata = localStorage.getItem(2);
			localStorage.setItem(1,movedata);
			localStorage.removeItem(2);
		}
		if(localStorage.length >= 3 ){
		for(var i =2;i <= localStorage.length; i++){
			var movedata = localStorage.getItem(i);
			localStorage.setItem(i-1,movedata);
			localStorage.removeItem(i);
		}
		}

		var data = [[[]]];
		document.getElementById("dtablename0").innerHTML="";
		document.getElementById("dtablename1").innerHTML="";
		document.getElementById("dtablename2").innerHTML="";
		document.getElementById("dtable0").style.display="none";
		document.getElementById("dtable1").style.display="none";
		document.getElementById("dtable2").style.display="none";
		sql = sessionStorage.getItem('dropState');
		  if (sql) {
			$('#dmain_sqlarea').val(sql);
		}
		data = getData();
		makeTitle();
		dTableMake(data);
}
window.tableDelete2 = function tableDelete2() {
		var index = localStorage.key(2);
		var table = localStorage.getItem(index);
		var tabledata = JSON.parse(table);
		var sql = "DROP TABLE " + tabledata.table +";";
		sessionStorage.setItem('dropState',sql);
		localStorage.removeItem(index)
		if(localStorage.length >= 3 ){
		for(var i =3;i <= localStorage.length; i++){
			var movedata = localStorage.getItem(i);
			localStorage.setItem(i-1,movedata);
			localStorage.removeItem(i);
		}
		}
		var data = [[[]]];
		document.getElementById("dtablename0").innerHTML="";
		document.getElementById("dtablename1").innerHTML="";
		document.getElementById("dtablename2").innerHTML="";
		document.getElementById("dtable0").style.display="none";
		document.getElementById("dtable1").style.display="none";
		document.getElementById("dtable2").style.display="none";
				sql = sessionStorage.getItem('dropState');
		  if (sql) {
			$('#dmain_sqlarea').val(sql);
		}
		data = getData();
		makeTitle();
		dTableMake(data);
}

window.tableReset0 = function tableReset0(){
		var index = localStorage.key(0);
		var tabledata = localStorage.getItem(index);
		var data1 = [[[]]];
		var data1 = getData();
		var len = data1[0][0].length;
		//alert(tabledata);
		//alert(len);
		tabledata = JSON.parse(tabledata);
		//sql文の生成
		var sql = "DELETE FROM " + tabledata.table +";";
		sessionStorage.setItem("dropState",sql);
		//keyが0のdata部分の全削除
		tabledata.data.splice(0,len);
		tabledata = JSON.stringify(tabledata);
		//全削除されたJSONをkeyが0のlocalStorageに格納
		localStorage.setItem(index,tabledata);
		if (sql) {
			$('#dmain_sqlarea').val(sql);
				}
		makeTitle();
		dTableMake(data1);
}

window.tableReset1 = function tableReset1(){
		var index = localStorage.key(1);
		var tabledata = localStorage.getItem(index);
		var data1 = [[[]]];
		var data1 = getData();
		var len = data1[0][1].length;
		//alert(tabledata);
		//alert(len);
		tabledata = JSON.parse(tabledata);
		//sql文の生成
		var sql = "DELETE FROM " + tabledata.table +";";
		sessionStorage.setItem("dropState",sql);
		//keyが0のdata部分の全削除
		tabledata.data.splice(0,len);
		tabledata = JSON.stringify(tabledata);
		//全削除されたJSONをkeyが0のlocalStorageに格納
		localStorage.setItem(index,tabledata);
		if (sql) {
			$('#dmain_sqlarea').val(sql);
				}
		makeTitle();
		dTableMake(data1);
}

window.tableReset2 = function tableReset2(){
		var index = localStorage.key(2);
		var tabledata = localStorage.getItem(index);
		var data1 = [[[]]];
		var data1 = getData();
		var len = data1[0][2].length;
		//alert(tabledata);
		//alert(len);
		tabledata = JSON.parse(tabledata);
		//sql文の生成
		var sql = "DELETE FROM " + tabledata.table +";";
		sessionStorage.setItem("dropState",sql);
		//keyが0のdata部分の全削除
		tabledata.data.splice(0,len);
		tabledata = JSON.stringify(tabledata);
		//全削除されたJSONをkeyが0のlocalStorageに格納
		localStorage.setItem(index,tabledata);
		if (sql) {
			$('#dmain_sqlarea').val(sql);
				}
		makeTitle();
		dTableMake(data1);
}






window.tableInsert0 = function tableInsert0() {
		var index = localStorage.key(0);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var tabledata = JSON.parse(localStorage1);
		var data1 = [[[]]];
		data1 = getData();
		
		//テーブルスペースINSERTデータ取得
		var insert_data = hot0.getDataAtRow(data1[0][0].length);
		for (var a=0; a<insert_data.length; a++) {
				if(insert_data[a] == null) {
						insert_data[a] = null;
				}	else {
						insert_data[a] = String(insert_data[a]);
						insert_data[a] = insert_data[a].trim();
				}
		}
		for(var i=0; i<tabledata.columns.length; i++) {
						if(insert_data[i] != null) {
								if(tabledata.columns[i].dataType == 'int' && !insert_data[i].match(/^[1-9][0-9]*$/)) {
										document.getElementById("iErr0").innerText='　int型の"'+ tabledata.columns[i].name + '"の列の値に格納できるのは整数値のみです。';
										return false
								}
								if(tabledata.columns[i].dataType == 'char' && tabledata.columns[i].leng != insert_data[i].length) {
										document.getElementById("iErr0").innerText='　char型の"'+ tabledata.columns[i].name + '"の列の値に格納できる文字列は' + tabledata.columns[i].leng +'桁の固定長のみです。';
										return false
								}else if(tabledata.columns[i].leng < insert_data[i].length) {
										document.getElementById("iErr0").innerText= '　"'+ tabledata.columns[i].name + '"の列に格納できる値は'+ tabledata.columns[i].leng + '桁までです。';
										return false
								}
						}
						for(var k=0; k<tabledata.columns[i].const.length; k++) {
								//notnullチェック
								if(tabledata.columns[i].const[k] =='not null' && (insert_data[i] == null || insert_data[i] == '')) {
										document.getElementById("iErr0").innerText='　not null制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//unique key チェック
								for(var j=0; j<data1[0][0].length; j++) {
										if(tabledata.columns[i].const[k] =='unique key' && insert_data[i] != null && data1[0][0][j][i] == insert_data[i]){
												document.getElementById("iErr0").innerText='　unique key制約の"'+ tabledata.columns[i].name + '"の列の値に重複する値が含まれています。';
												return false
										}
								}
								//主キーnotnullチェック
								if(tabledata.columns[i].const[k] =='primary key' && (insert_data[i] == null || insert_data[i] == '')) {
										document.getElementById("iErr0").innerText='　主キー制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//主キー列重複チェック
								for(var j=0; j<data1[0][0].length; j++) {
										if(tabledata.columns[i].const[k] =='primary key' && data1[0][0][j][i] == insert_data[i]) {
												document.getElementById("iErr0").innerText='　主キー制約の"' + tabledata.columns[i].name + '"の列の値に一意でない値が含まれています。';
												return false
										}
								}
						}
		}
		
		//テーブルスペース列名取得
		var colname = hot0.getColHeader();
		//INSERTデータをjson形式に
		var jsondata = {};
		jsondata[colname[0]] = insert_data[0];
		//alert(insert_data);
		for(var q = 1; q < colname.length; q++){
			jsondata[colname[q]] = insert_data[q]
		}
		//var json = JSON.stringify(jsondata);
		
		//INSERTデータを既存データに追加
		localStorage1 = JSON.parse(localStorage1);
		localStorage1["data"][localStorage1.data.length] = jsondata;
		
		//sql文に必要なデータをまとめる　文字と数字で""をつける必要あり
		var sql = "INSERT INTO " + localStorage1.table + " VALUES( " + insert_data + " );";
		sessionStorage.setItem("insertState",sql);
				if (sql) {
					$('#imain_sqlarea').val(sql);
						}
		//alert(sql);
		
		var ffff = JSON.stringify(localStorage1)
		
		
		//データをlocalStorage1に追加
		localStorage.setItem(index, ffff);
		data1 = getData();
		iTableMake(data1);
}
window.tableInsert1 = function tableInsert1()  {
		var index = localStorage.key(1);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var tabledata = JSON.parse(localStorage1);
		var data1 = [[[]]];
		data1 = getData();
		
		//テーブルスペースINSERTデータ取得
		var insert_data = hot1.getDataAtRow(data1[0][1].length);
		for (var a=0; a<insert_data.length; a++) {
				if(insert_data[a] == null) {
						insert_data[a] = null;
				}	else {
						insert_data[a] = String(insert_data[a]);
						insert_data[a] = insert_data[a].trim();
				}
		}
		for(var i=0; i<tabledata.columns.length; i++) {
						if(insert_data[i] != null) {
								if(tabledata.columns[i].dataType == 'int' && !insert_data[i].match(/^[1-9][0-9]*$/)) {
										document.getElementById("iErr1").innerText='　int型の"'+ tabledata.columns[i].name + '"の列の値に格納できるのは整数値のみです。';
										return false
								}
								if(tabledata.columns[i].dataType == 'char' && tabledata.columns[i].leng != insert_data[i].length) {
										document.getElementById("iErr1").innerText='　char型の"'+ tabledata.columns[i].name + '"の列の値に格納できる文字列は' + tabledata.columns[i].leng +'桁の固定長のみです。';
										return false
								}else if(tabledata.columns[i].leng < insert_data[i].length) {
										document.getElementById("iErr1").innerText= '　"'+ tabledata.columns[i].name + '"の列に格納できる値は'+ tabledata.columns[i].leng + '桁までです。';
										return false
								}
						}
						for(var k=0; k<tabledata.columns[i].const.length; k++) {
								//notnullチェック
								if(tabledata.columns[i].const[k] =='not null' && (insert_data[i] == null || insert_data[i] == '')) {
										document.getElementById("iErr1").innerText='　not null制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//unique key チェック
								for(var j=0; j<data1[0][1].length; j++) {
										if(tabledata.columns[i].const[k] =='unique key' && insert_data[i] != null && data1[0][1][j][i] == insert_data[i]){
												document.getElementById("iErr1").innerText='　unique key制約の"'+ tabledata.columns[i].name + '"の列の値に重複する値が含まれています。';
												return false
										}
								}
								//主キーnotnullチェック
								if(tabledata.columns[i].const[k] =='primary key' && (insert_data[i] == null || insert_data[i] == '')) {
										document.getElementById("iErr1").innerText='　主キー制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//主キー列重複チェック
								for(var j=0; j<data1[0][1].length; j++) {
										if(tabledata.columns[i].const[k] =='primary key' && data1[0][1][j][i] == insert_data[i]) {
												document.getElementById("iErr1").innerText='　主キー制約の"' + tabledata.columns[i].name + '"の列の値に一意でない値が含まれています。';
												return false
										}
								}
						}
		}
		
		//テーブルスペース列名取得
		var colname = hot1.getColHeader();
		
		//INSERTデータをjson形式に
		var jsondata = {};
		jsondata[colname[0]] = insert_data[0];
		for(var q = 1; q < colname.length; q++){
			jsondata[colname[q]] = insert_data[q]
		}
		//var json = JSON.stringify(jsondata);
		
		//INSERTデータを既存データに追加
		localStorage1 = JSON.parse(localStorage1);
		localStorage1["data"][localStorage1.data.length] = jsondata;
		
		//sql文に必要なデータをまとめる 文字と数字で""をつける必要あり
		var sql = "INSERT INTO " + localStorage1.table + " VALUES( " + insert_data + " );";
		sessionStorage.setItem("insertState",sql);
		if (sql) {
			$('#imain_sqlarea').val(sql);
				}
		//alert(sql);
		
		//alert(JSON.stringify(localStorage1));
		var ffff = JSON.stringify(localStorage1)
		
		//データをlocalStorage1に追加
		localStorage.setItem(index, ffff);
		data1 = getData();
		iTableMake(data1);
}
window.tableInsert2 = function tableInsert2() {
		var index = localStorage.key(2);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var tabledata = JSON.parse(localStorage1);
		var data1 = [[[]]];
		data1 = getData();
		
		//テーブルスペースINSERTデータ取得
		var insert_data = hot2.getDataAtRow(data1[0][2].length);
		for (var a=0; a<insert_data.length; a++) {
				if(insert_data[a] == null) {
						insert_data[a] = null;
				}	else {
						insert_data[a] = String(insert_data[a]);
						insert_data[a] = insert_data[a].trim();
				}
		}
		for(var i=0; i<tabledata.columns.length; i++) {
						if(insert_data[i] != null) {
								if(tabledata.columns[i].dataType == 'int' && !insert_data[i].match(/^[1-9][0-9]*$/)) {
										document.getElementById("iErr2").innerText='　int型の"'+ tabledata.columns[i].name + '"の列の値に格納できるのは整数値のみです。';
										return false
								}
								if(tabledata.columns[i].dataType == 'char' && tabledata.columns[i].leng != insert_data[i].length) {
										document.getElementById("iErr2").innerText='　char型の"'+ tabledata.columns[i].name + '"の列の値に格納できる文字列は' + tabledata.columns[i].leng +'桁の固定長のみです。';
										return false
								}else if(tabledata.columns[i].leng < insert_data[i].length) {
										document.getElementById("iErr2").innerText= '　"'+ tabledata.columns[i].name + '"の列に格納できる値は'+ tabledata.columns[i].leng + '桁までです。';
										return false
								}
						}
						for(var k=0; k<tabledata.columns[i].const.length; k++) {
								//notnullチェック
								if(tabledata.columns[i].const[k] =='not null' && (insert_data[i] == null || insert_data[i] == '')) {
										document.getElementById("iErr2").innerText='　not null制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//unique key チェック
								for(var j=0; j<data1[0][2].length; j++) {
										if(tabledata.columns[i].const[k] =='unique key' && insert_data[i] != null && data1[0][2][j][i] == insert_data[i]){
												document.getElementById("iErr2").innerText='　unique key制約の"'+ tabledata.columns[i].name + '"の列の値に重複する値が含まれています。';
												return false
										}
								}
								//主キーnotnullチェック
								if(tabledata.columns[i].const[k] =='primary key' && (insert_data[i] == null || insert_data[i] == '')) {
										document.getElementById("iErr2").innerText='　主キー制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。';
										return false
								}
								//主キー列重複チェック
								for(var j=0; j<data1[0][2].length; j++) {
										if(tabledata.columns[i].const[k] =='primary key' && data1[0][2][j][i] == insert_data[i]) {
												document.getElementById("iErr2").innerText='　主キー制約の"' + tabledata.columns[i].name + '"の列の値に一意でない値が含まれています。';
												return false
										}
								}
						}
		}
		
		//テーブルスペース列名取得
		var colname = hot2.getColHeader();
		
		//INSERTデータをjson形式に
		var jsondata = {};
		jsondata[colname[0]] = insert_data[0];
		for(var q = 1; q < colname.length; q++){
			jsondata[colname[q]] = insert_data[q]
		}
		//var json = JSON.stringify(jsondata);
		
		//INSERTデータを既存データに追加
		localStorage1 = JSON.parse(localStorage1);
		localStorage1["data"][localStorage1.data.length] = jsondata;
		
		//sql文に必要なデータをまとめる　文字と数字で""をつける必要あり
		var sql = "INSERT INTO " + localStorage1.table + " VALUES( " + insert_data + " );";
		sessionStorage.setItem("insertState",sql);
		if (sql) {
			$('#imain_sqlarea').val(sql);
				}
		//alert(sql);
		
		//alert(JSON.stringify(localStorage1));
		var ffff = JSON.stringify(localStorage1)
		
		//データをlocalStorage1に追加
		localStorage.setItem(index, ffff);
		data1 = getData();
		iTableMake(data1);
}

window.tableSelect0 = function tableSelect0() {
		var index = localStorage.key(0);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var tabledata = JSON.parse(localStorage1);
		var data1 = [[[]]];
		data1 = getData();
		
		var $sqlArea = $('#smain_sqlarea');
		var sql;
		
		
		//テーブルスペースSELECTデータ取得
		var select_data = hot0.getDataAtRow(data1[0][0].length);
		
		//テーブルスペース列名取得
		var colname = hot0.getColHeader();
		
		//列の省略判定 $("[name=scb0]").prop("checked") →　チェックボックスにチェックが入っていたらtrueを返す 
		if($("[name=scb0]").prop("checked") == true){
			sql ="SELECT * FROM " + tabledata.table + ";";
			sessionStorage.setItem('selectState', sql);
		}else{
			sql = "SELECT " + colname + " FROM " + tabledata.table + ";";
			sessionStorage.setItem('selectState', sql);
		}
		
		if (sql) {
			$sqlArea.val(sql);
		}
}

window.tableSelect1 = function tableSelect1() {
		var index = localStorage.key(1);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var tabledata = JSON.parse(localStorage1);
		var data1 = [[[]]];
		data1 = getData();
		
		var $sqlArea = $('#smain_sqlarea');
		var sql;
		
		//テーブルスペースSELECTデータ取得
		var select_data = hot1.getDataAtRow(data1[0][1].length);
		
		//テーブルスペース列名取得
		var colname = hot1.getColHeader();
		
		//列の省略判定 $("[name=scb0]").prop("checked") →　チェックボックスにチェックが入っていたらtrueを返す 
		if($("[name=scb1]").prop("checked") == true){
			sql ="SELECT * FROM " + tabledata.table + ";";
			sessionStorage.setItem('selectState', sql);
		}else{
			sql = "SELECT " + colname + " FROM " + tabledata.table + ";";
			sessionStorage.setItem('selectState', sql);
		}
			if (sql) {
				$sqlArea.val(sql);
			}
}

window.tableSelect2 = function tableSelect2() {
		var index = localStorage.key(2);
		var localStorage1 = {};
		localStorage1 = localStorage.getItem(index);
		var tabledata = JSON.parse(localStorage1);
		var data1 = [[[]]];
		data1 = getData();
		
		var $sqlArea = $('#smain_sqlarea');
		var sql;
		
		
		//テーブルスペースSELECTデータ取得
		var select_data = hot2.getDataAtRow(data1[0][2].length);
		
		//テーブルスペース列名取得
		var colname = hot2.getColHeader();
		
		//列の省略判定 $("[name=scb0]").prop("checked") →　チェックボックスにチェックが入っていたらtrueを返す 
		if($("[name=scb2]").prop("checked") == true){
			sql ="SELECT * FROM " + tabledata.table + ";";
			sessionStorage.setItem('selectState', sql);
		}else{
			sql = "SELECT " + colname + " FROM " + tabledata.table + ";";
			sessionStorage.setItem('selectState', sql);
		}
		  if (sql) {
				$sqlArea.val(sql);
			}
}

});
