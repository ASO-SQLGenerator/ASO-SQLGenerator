

for (var i=0 ; i<localStorage.length ; i++) {
	var index = localStorage.key(i);
	var table = localStorage.getItem(index);	
	var tabledata = JSON.parse(table);

	var coldata = [];
	
	for(var j=0 ; j<tabledata.columns.length ; j++) {	
			coldata[j] = tabledata.columns[j].name ;
	}
	
	
	var a,b,c;
	var test = [];
	var test2 = [[]];
	var d = 0;
	for(a=0; b=tabledata.data[a++];) {
		var low = [];
   	var e = 0;
			for(c in b) {
					test[e] = b[c];
					e++;
				}
			for(var z=0; z<test.length; z++) {
					low[z] = test[z];
			}
			test2[d] = low;
			d++;

	}
//alert(test2[0]);
	/*
	alert(test);

for(var x=0; x<tabledata.data.length; x++){
		for(var z=0; z<test.length; z++) {
				low[z] = [test[z]]; 
		}
		test2[x] = low;
}
*/

	/*
		var test2 = [
				[test[0],test[1],test[2],test[3]],
				["g","h","j","k"]
				];
/*
		var test = [];
	test[0] = "a";
	test[1] = "s";
	test[2] = "d";
	test[3] = "f";
	test[4] = "g";
	test[5] = "h";
	test[6] = "j";
	test[7] = "k";
	alert(test);
/*
	var a,b,c,test = "";
	for(a=0; b=tabledata.data[a++];) {
			for(c in b) test += "[" + c + ":" + b[c] + "]";
			test += "\n"
	}
	alert(test);
*/	
	
	var tdata = [[]];


	//もってこれるかたち
//	alert(tabledata.data[0].a_id);

//	alert(tabledata.data[0][test]);
	for(var k=0 ; k<tabledata.data.length ; k++) {
			for(var l=0 ; l<tabledata.columns.length ; l++) {
					tdata[k] = tabledata.data[l] ;
	//				alert(tabledata.data[l]);
			}

	}



/*

	for(var k=0 ; k<coldata.length ; k++) {
			data[0][k] = coldata[k];
	}
	*/
	var tablemake = document.createElement("div");
	tablemake.id = index;
	var parent_object = document.getElementById("example1");
    parent_object.appendChild(tablemake);	
	$("#"+index).handsontable({
		startRows: 10,
		startCols: coldata.length,
		rowHeaders: true,
		colHeaders: coldata,
		minSpareRows: 1,
		fillHandle: true //possible values: true, false, "horizontal", "vertical"
	});
	$("#"+index).handsontable("loadData", test2);

}

var ttable = localStorage.getItem("atable");
var tdata = JSON.parse(ttable);

//alert(tdata.columns[0].name1);

//for (int i = 0; i < jsoncol.length; i++){

//}

/*
var data = [
["バージョン", "コードネーム", "リリース", "パッケージ数"],
[1.1, "buzz", 1996, 474],
[1.2, "rex", 1996, 848],
[1.3, "bo", 1997, 974],
[2.0, "hamm", 1998, 1500],
[2.1, "slink", 1999, 2250],
[2.2, "potato", 2000, 3900],
[3.0, "woody", 2002, 8500],
[3.1, "sarge", 2005, 15400],
[4.0, "etch", 2007, 18000],
[5.0, "lenny", 2009, 28000],
[6.0, "squeeze", 2011, 29000],
[7.0, "wheezy", "2013予定", ""]
];
*/

