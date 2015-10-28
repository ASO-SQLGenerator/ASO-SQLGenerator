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
				$("#ctable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 150,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
						columns: ro
				});
		}
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
						ro[r] = {readOnly: true};
				}

				var aaa = data[0][i].length;
				$("#itable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 150,
						minSpareRows: 1,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
	//					columns: ro,
						cells: function(row, col, prep) {
								var cellProperties = {};
								if(row < aaa){
										cellProperties.readOnly = true;
								}
								return cellProperties;
						}

				});

		}
}

function uTableMake(data) {
		for(var i=0; i<data[0].length; i++) {
				document.getElementById("utable"+i).style.display="block";
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}

				$("#utable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 150,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
				});
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

				$("#dtable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 150,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
						removeRowPlugin: true,
						columns: ro
				});
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

				$("#stable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 150,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
						columns: ro
				});
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
				document.getElementById("ctablename"+i).innerHTML="テーブル名："+index;
				document.getElementById("itablename"+i).innerHTML="テーブル名："+index;
				document.getElementById("utablename"+i).innerHTML="テーブル名："+index;
				document.getElementById("dtablename"+i).innerHTML=
						"テーブル名："+index+'　　　<button id="btn'+i+'" onClick="tableDelete'+i+'()" >テーブルを削除</button>';
				document.getElementById("stablename"+i).innerHTML="テーブル名："+index;
		}
		return [data,coldata];
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
		dTableMake(data);	
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
		sTableMake(data);	
});

function tableDelete0() {
		var index = localStorage.key(0);
		localStorage.removeItem(index)
		var data = [[[]]];
		document.getElementById("dtablename0").innerHTML="";
		document.getElementById("dtablename1").innerHTML="";
		document.getElementById("dtablename2").innerHTML="";
		document.getElementById("dtable0").style.display="none";
		document.getElementById("dtable1").style.display="none";
		document.getElementById("dtable2").style.display="none";
		data = getData();
		dTableMake(data);
}
function tableDelete1() {
		var index = localStorage.key(1);
		localStorage.removeItem(index)
		var data = [[[]]];
		document.getElementById("dtablename0").innerHTML="";
		document.getElementById("dtablename1").innerHTML="";
		document.getElementById("dtablename2").innerHTML="";
		document.getElementById("dtable0").style.display="none";
		document.getElementById("dtable1").style.display="none";
		document.getElementById("dtable2").style.display="none";
		data = getData();
		dTableMake(data);
}
function tableDelete2() {
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
		dTableMake(data);
}
