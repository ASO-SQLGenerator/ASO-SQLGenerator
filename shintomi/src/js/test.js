
for(var i=0; i<localStorage.length; i++) {
		var index = localStorage.key(i);
		var table = localStorage.getItem(index);
		var tabledata = JSON.parse(table);

		//列名を取得
		var coldata = [];
		for(var j=0; j<tabledata.columns.length; j++) {
				coldata[j] = tabledata.columns[j].name;		
		}

		var a,b,c;
		var data = [[[]]];
		var d = 0;
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
/*

for(var i=0; i<localStorage.length; i++) {
		var index = localStorage.key(i);
		var table = localStorage.getItem(index);
		var tabledata = JSON.parse(table);

		//列名を取得
		var coldata = [];
		for(var j=0; j<tabledata.columns.length; j++) {
				coldata[j] = tabledata.columns[j].name;		
		}

		var a,b,c;
		var data = [[]];
		var d = 0;
		for(a=0; b=tabledata.data[a++];) {
				var low = [];
				var e = 0;
				for(c in b) {
						low[e] = b[c];
						e++;
				}
				data[d] = low;
				d++;
		}
		
		var ro = [];
		for(var r=0; r<coldata.length; r++) {
				ro[r] = {readOnly: true};
		}

		var wid = [];
		for(var w=0; w<coldata.length; w++) {
				wid[w] = 130;
		}

		var tabletitle = document.createElement("p");
		var title = document.createTextNode("テーブル名：" + index);
		tabletitle.appendChild(title);
		var parent_object = document.getElementById("cmain_table");
		parent_object.appendChild(tabletitle);


		var tabletitle = document.createElement("p");
		var title = document.createTextNode("テーブル名：" + index);
		tabletitle.appendChild(title);
		var parent_object = document.getElementById("imain_table");
		parent_object.appendChild(tabletitle);

		var tablemake = document.createElement("div");
		tablemake.id = "ctable"+i;
		var parent_object = document.getElementById("cmain_table");
		parent_object.appendChild(tablemake);

		var tablemake = document.createElement("div");
		tablemake.id = "itable"+i;
		var parent_object = document.getElementById("imain_table");
		parent_object.appendChild(tablemake);

		var prop = {
			overflow: "auto",	
			height: "170px",
			width: "397px"
		}

		var cprop = {
			overflow: "auto",
			height: "170px",
			width: "597px"
		}

		$("#ctable"+i).handsontable({
				data: data,
				height: data.length * 25 + 150,
			  width: coldata.length * 130 + 30,
				colWidths: wid,
				startCols: coldata.length,
				maxRows: 2,
				rowHeaders: true,
				colHeaders: coldata,
				fillHandle: true,
				columns: ro
		});
		
		$("#itable"+i).handsontable({
				data: data,
				height: data.length * 25 + 150,
			  width: coldata.length * 150 + 30,
				minSpareRows: 1,
				colWidths: wid,
				startCols: coldata.length,
				rowHeaders: true,
				colHeaders: coldata,
				fillHandle: true,
				columns: ro
		});
}
//onchange

	$("#ctable0").css(prop);
	$("#ctable1").css(prop);
	$("#ctable2").css(prop);
	$("#itable0").css(cprop);
	$("#itable1").css(cprop);
	$("#itable2").css(cprop);

	*/
