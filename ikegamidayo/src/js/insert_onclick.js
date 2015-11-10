function tableInsert0() {
		var index = localStorage.key(0);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var data1 = [[[]]];
		data1 = getData();
		
		//テーブルスペースINSERTデータ取得
		var insert_data = $('#itable0').handsontable('getDataAtRow', data1[0][0].length);
		
		//テーブルスペース列名取得
		var colname = $('#itable0').handsontable('getColHeader');
		
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
		
		alert(JSON.stringify(localStorage1));
		var ffff = JSON.stringify(localStorage1)
		
		//データをlocalStorage1に追加
		localStorage.setItem(index, ffff);
		data1 = getData();
		iTableMake(data1);
}
function tableInsert1() {
		var index = localStorage.key(1);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var data1 = [[[]]];
		data1 = getData();
		
		//テーブルスペースINSERTデータ取得
		var insert_data = $('#itable1').handsontable('getDataAtRow', data1[0][1].length);
		//テーブルスペース列名取得
		var colname = $('#itable1').handsontable('getColHeader');
		
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
		
		alert(JSON.stringify(localStorage1));
		var ffff = JSON.stringify(localStorage1)
		
		//データをlocalStorage1に追加
		localStorage.setItem(index, ffff);
		data1 = getData();
		iTableMake(data1);
}
function tableInsert2() {
		var index = localStorage.key(2);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var data1 = [[[]]];
		data1 = getData();
		var len = data1[0][2].length;
		if(data1[0][2][0] == "") {
						len = len - 1;
		}
		//テーブルスペースINSERTデータ取得
		var insert_data = $('#itable2').handsontable('getDataAtRow', len);
		//テーブルスペース列名取得
		var colname = $('#itable2').handsontable('getColHeader');
		
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
		
		alert(JSON.stringify(localStorage1));
		var ffff = JSON.stringify(localStorage1)
		
		//データをlocalStorage1に追加
		localStorage.setItem(index, ffff);
		data1 = getData();
		iTableMake(data1);
}
