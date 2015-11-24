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
var container = document.getElementById('itable'+i);
eval('hot' + i + ' = new Handsontable(container, {'
				+'	data: data[0][i],'
				+'	height: data[0].length * 25 + 125,'
				+'	minSpareRows: 1,'
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
						ro[r] = {readOnly: false};
				}
			/*	document.getElementById("utablename"+i).innerHTML=
						"テーブル名："+tabledata.table+'　　　<button id="ubtn'+i+'" onClick="tableUpdate'+i+'(editdata'+i+')">変更要素を確定</button>'; */
		var container = document.getElementById('utable'+i);
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
		var local = localStorage.getItem(0);
			local = JSON.parse(local);
		var index = editdata0[0][0][0];
		var editvalues = {};
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
				//console.log(editdata0[i][0]);
				//console.log(editdata0[i][0][3]);
		}
		var con = [];
		//con = test[1][0][0] +" == /'" + test[0][0][editdata0[0][0][0]][0] +"/'";
		console.log(JSON.stringify(local));
		//console.log(editvalues);
		var uplocal = JSON.stringify(local);
		localStorage.setItem(0,uplocal);
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
		var local = localStorage.getItem(1);
			local = JSON.parse(local);
		var index = editdata1[0][0][0];
		var editvalues = {};
		for(var i=0; i<editdata1.length; i++) {
				editvalues[test[1][1][editdata1[i][0][1]]] = editdata1[i][0][3];
				 //var a = JSON.stringify(local);
				 var b = JSON.stringify(editdata1);
				 var c = JSON.stringify(editvalues);
					 c = JSON.parse(c);
				 var d = hot1.getDataAtRow(editdata1[0][0][0]);
				 var e =editdata1[0][0][0];
				 var f =test[1][1][editdata1[i][0][1]];
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
				//console.log(editdata0[i][0]);
				//console.log(editdata0[i][0][3]);
		}
		var con = [];
		//con = test[1][0][0] +" == /'" + test[0][0][editdata0[0][0][0]][0] +"/'";
		console.log(JSON.stringify(local));
		//console.log(editvalues);
		var uplocal = JSON.stringify(local);
		localStorage.setItem(1,uplocal);
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
		var local = localStorage.getItem(2);
			local = JSON.parse(local);
		var index = editdata2[0][0][0];
		var editvalues = {};
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
				//console.log(editdata0[i][0]);
				//console.log(editdata0[i][0][3]);
		}
		var con = [];
		//con = test[1][0][0] +" == /'" + test[0][0][editdata0[0][0][0]][0] +"/'";
		console.log(JSON.stringify(local));
		//console.log(editvalues);
		var uplocal = JSON.stringify(local);
		localStorage.setItem(2,uplocal);
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
				+'	height: data[0].length * 25 + 125,'
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
				+'	height: data[0].length * 25 + 125,'
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
						"テーブル名："+tabledata.table+'　　　<button id="iBtn'+i+'" onClick="tableInsert'+i+'()">追加要素を確定</button>';
						document.getElementById("utablename"+i).innerHTML="テーブル名："+tabledata.table;

				document.getElementById("utablename"+i).innerHTML=
						"テーブル名："+tabledata.table+'　　　<button id="ubtn'+i+'" onClick="tableUpdate'+i+'()">変更要素を確定</button>';
			
				document.getElementById("dtablename"+i).innerHTML=
						"テーブル名："+tabledata.table+'　<br><button class="daBtn" onClick="tableReset'+i+'()" >テーブルの全データ破棄</button>      <button class="dBtn" onClick="tableDelete'+i+'()" >テーブルの削除</button>';

				document.getElementById("stablename"+i).innerHTML=
						"テーブル名："+tabledata.table+'　<input type="checkbox" id="sCheck"' + i + ' name="scb'+ i +'" checked="checked">列省略　　<button id="sBtn'+i+'" onClick="tableSelect'+i+'()" >テーブルを参照するSQL表示</button>';

		}
}
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
}
window.tableDelete1 = function tableDelete1() {
		var index = localStorage.key(1);
		localStorage.removeItem(index)
			if(localStorage.length == 2) {
			var movedata = localStorage.getItem(2);
			localStorage.setItem(1,movedata);
			localStorage.removeItem(2);
		}

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
}
window.tableDelete2 = function tableDelete2() {
		var index = localStorage.key(2);
		localStorage.removeItem(index)
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
}

window.tableReset0 = function tableReset0(){
		var index = localStorage.key(0);
		var tabledata = localStorage.getItem(index);
		var data1 = [[[]]];
		var data1 = getData();
		var len = data1[0][0].length;
		alert(tabledata);
		alert(len);
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
		alert(tabledata);
		alert(len);
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
		alert(tabledata);
		alert(len);
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
		var data1 = [[[]]];
		data1 = getData();
		
		//テーブルスペースINSERTデータ取得
		var insert_data = hot0.getDataAtRow(data1[0][0].length);
		
		//テーブルスペース列名取得
		var colname = hot0.getColHeader();
		//INSERTデータをjson形式に
		var jsondata = {};
		jsondata[colname[0]] = insert_data[0];
		alert(insert_data);
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
		var data1 = [[[]]];
		data1 = getData();
		
		//テーブルスペースINSERTデータ取得
		var insert_data = hot1.getDataAtRow(data1[0][1].length);
		
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
		
		alert(JSON.stringify(localStorage1));
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
		var data1 = [[[]]];
		data1 = getData();
		
		//テーブルスペースINSERTデータ取得
		var insert_data = hot2.getDataAtRow(data1[0][2].length);
		
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
		
		alert(JSON.stringify(localStorage1));
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
		var select_data = hot0.getDataAtRow(data1[0][1].length);
		
		//テーブルスペース列名取得
		var colname = hot0.getColHeader();
		
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
		var select_data = hot0.getDataAtRow(data1[0][2].length);
		
		//テーブルスペース列名取得
		var colname = hot0.getColHeader();
		
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