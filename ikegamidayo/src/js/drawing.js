function cTableMake(data) {
		for(var i=0; i<data[0].length; i++) {
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
	//		 			width: data[1][i].length * 130 + 30,
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
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}

				$("#itable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 150,
		//	  		width: data[1][i].length * 150 + 30,
						minSpareRows: 1,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
				});
		}
}

function uTableMake(data) {
		for(var i=0; i<data[0].length; i++) {
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}

				$("#utable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 150,
//			  		width: data[1][i].length * 150 + 30,
						minSpareRows: 1,
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
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}

				$("#dtable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 150,
//			  		width: data[1][i].length * 150 + 30,
						minSpareRows: 1,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
						removeRowPlugin: true
				});
		}
}

function sTableMake(data) {
		for(var i=0; i<data[0].length; i++) {
				var wid = [];
				for(var w=0; w<data[1][i].length; w++) {
						wid[w] = 130;
				}

				$("#stable"+i).handsontable({
						data: data[0][i],
						height: data[0].length * 25 + 150,
//			  		width: data[1][i].length * 150 + 30,
						minSpareRows: 1,
						colWidths: wid,
						startCols: data[1][i].length,
						rowHeaders: true,
						colHeaders: data[1][i],
						fillHandle: true,
				});
		}
}

function getData() {
		var data = [[[]]];
		var coldata = [[]];

		for(var i=0; i<localStorage.length; i++) {
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
				document.getElementById("dtablename"+i).innerHTML="テーブル名："+index;
				document.getElementById("stablename"+i).innerHTML="テーブル名："+index;
		}
		return [data,coldata];
}

$(".create").click(function(){
		var data = [[[]]];
		data = getData();
		cTableMake(data);	
});
$(".insert").click(function(){
		var data = [[[]]];
		data = getData();
		iTableMake(data);	
});
$(".update").click(function(){
		var data = [[[]]];
		data = getData();
		uTableMake(data);	
});
$(".delete").click(function(){
		var data = [[[]]];
		data = getData();
		dTableMake(data);	
});
$(".select").click(function(){
		var data = [[[]]];
		data = getData();
		sTableMake(data);	
});
