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

		var tablemake = document.createElement("div");
		tablemake.id = "table"+i;
		var parent_object = document.getElementById("cmain_table");
		parent_object.appendChild(tablemake);


		var prop = {
			overflow: "auto",	
			height: "160px",
			width: "397px"
		}

		$("#table"+i).handsontable({
				height: data.length * 25 + 50,
			  width: coldata.length * 130 + 30,
				colWidths: wid,
				startCols: coldata.length,
				rowHeaders: true,
				colHeaders: coldata,
				fillHandle: true,
				columns: ro
		});
		$("#table"+i).handsontable("loadData", data );
}

	$("#table0").css(prop);
	$("#table1").css(prop);
	$("#table2").css(prop);
