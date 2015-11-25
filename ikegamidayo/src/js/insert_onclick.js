function tableInsert0() {
		var index = localStorage.key(0);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var tabledata = JSON.parse(localStorage1);
		var data1 = [[[]]];
		data1 = getData();
		var errflg = 0;

		//テーブルスペースINSERTデータ取得
		var insert_data = hot0.getDataAtRow(data1[0][0].length);
		for (var a=0; a<insert_data.length; a++) {
				if(insert_data[a] == null) {
						insert_data[a] = null;
				}	else {
						insert_data[a] = insert_data[a].trim();
				}
		}
		for(var i=0; i<tabledata.columns.length; i++) {
						if(insert_data[i] != null) {
								if(tabledata.columns[i].dataType == 'int' && !insert_data[i].match(/^[1-9][0-9]*$/)) {
										alert('int型の"'+ tabledata.columns[i].name + '"の列の値に格納できるのは整数値のみです。');
										errflg = 1;
								}
								if(tabledata.columns[i].dataType == 'char' && tabledata.columns[i].leng != insert_data[i].length) {
										alert('char型の"'+ tabledata.columns[i].name + '"の列の値に格納できる文字列は' + tabledata.columns[i].leng +'桁の固定長のみです。');
										errflg = 1;
								}else if(tabledata.columns[i].leng < insert_data[i].length) {
										alert('"'+ tabledata.columns[i].name + '"の列に格納できる値は'+ tabledata.columns[i].leng + '桁までです。');
										errflg = 1;
								}
						}
						for(var k=0; k<tabledata.columns[i].const.length; k++) {
								//notnullチェック
								if(tabledata.columns[i].const[k] =='not null' && (insert_data[i] == null || insert_data[i] == '')) {
										alert('not null制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。');
										errflg = 1;
								}
								//unique key チェック
								for(var j=0; j<data1[0][0].length; j++) {
										if(tabledata.columns[i].const[k] =='unique key' && insert_data[i] != null && data1[0][0][j][i] == insert_data[i]){
												alert('unique key制約の"'+ tabledata.columns[i].name + '"の列の値に重複する値が含まれています。');
												errflg = 1;
										}
								}
								//主キーnotnullチェック
								if(tabledata.columns[i].const[k] =='primary key' && (insert_data[i] == null || insert_data[i] == '')) {
										alert('主キー制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。');
										errflg = 1;
								}
								//主キー列重複チェック
								for(var j=0; j<data1[0][0].length; j++) {
										if(tabledata.columns[i].const[k] =='primary key' && data1[0][0][j][i] == insert_data[i]) {
												alert('主キー制約の"' + tabledata.columns[i].name + '"の列の値に一意でない値が含まれています。');
												errflg = 1;
										}
								}
						}
		}
		

		if(errflg == 0) {
				//テーブルスペース列名取得
				var colname = hot0.getColHeader();
				//INSERTデータをjson形式に
				var jsondata = {};
				for(var q = 0; q < colname.length; q++){
					jsondata[colname[q]] = insert_data[q];
				}
				console.log(jsondata);
				//var json = JSON.stringify(jsondata);
		
				//INSERTデータを既存データに追加
				localStorage1 = JSON.parse(localStorage1);
				localStorage1["data"][localStorage1.data.length] = jsondata;
		
				//alert(JSON.stringify(localStorage1));
				var ffff = JSON.stringify(localStorage1)
				
				//データをlocalStorage1に追加
				localStorage.setItem(index, ffff);
				data1 = getData();
				iTableMake(data1);
		}
}
function tableInsert1() {
		var index = localStorage.key(1);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var tabledata = JSON.parse(localStorage1);
		var data1 = [[[]]];
		data1 = getData();
		var errflg = 0;

		//テーブルスペースINSERTデータ取得
		var insert_data = hot1.getDataAtRow(data1[0][1].length);
		for (var a=0; a<insert_data.length; a++) {
				if(insert_data[a] == null) {
						insert_data[a] = null;
				}	else {
						insert_data[a] = insert_data[a].trim();
				}
		}
		for(var i=0; i<tabledata.columns.length; i++) {
						if(insert_data[i] != null) {
								if(tabledata.columns[i].dataType == 'int' && !insert_data[i].match(/^[1-9][0-9]*$/)) {
										alert('int型の"'+ tabledata.columns[i].name + '"の列の値に格納できるのは整数値のみです。');
										errflg = 1;
								}
								if(tabledata.columns[i].dataType == 'char' && tabledata.columns[i].leng != insert_data[i].length) {
										alert('char型の"'+ tabledata.columns[i].name + '"の列の値に格納できる文字列は' + tabledata.columns[i].leng +'桁の固定長のみです。');
										errflg = 1;
								}else if(tabledata.columns[i].leng < insert_data[i].length) {
										alert('"'+ tabledata.columns[i].name + '"の列に格納できる値は'+ tabledata.columns[i].leng + '桁までです。');
										errflg = 1;
								}
						}
						for(var k=0; k<tabledata.columns[i].const.length; k++) {
								//notnullチェック
								if(tabledata.columns[i].const[k] =='not null' && (insert_data[i] == null || insert_data[i] == '')) {
										alert('not null制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。');
										errflg = 1;
								}
								//unique key チェック
								for(var j=0; j<data1[0][1].length; j++) {
										if(tabledata.columns[i].const[k] =='unique key' && insert_data[i] != null && data1[0][1][j][i] == insert_data[i]){
												alert('unique key制約の"'+ tabledata.columns[i].name + '"の列の値に重複する値が含まれています。');
												errflg = 1;
										}
								}
								//主キーnotnullチェック
								if(tabledata.columns[i].const[k] =='primary key' && (insert_data[i] == null || insert_data[i] == '')) {
										alert('主キー制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。');
										errflg = 1;
								}
								//主キー列重複チェック
								for(var j=0; j<data1[0][1].length; j++) {
										if(tabledata.columns[i].const[k] =='primary key' && data1[0][1][j][i] == insert_data[i]) {
												alert('主キー制約の"' + tabledata.columns[i].name + '"の列の値に一意でない値が含まれています。');
												errflg = 1;
										}
								}
						}
		}

		if(errflg == 0) {
				//テーブルスペース列名取得
				var colname = hot1.getColHeader();
				//INSERTデータをjson形式に
				var jsondata = {};
				for(var q = 0; q < colname.length; q++){
					jsondata[colname[q]] = insert_data[q];
				}
				console.log(jsondata);
				//var json = JSON.stringify(jsondata);
		
				//INSERTデータを既存データに追加
				localStorage1 = JSON.parse(localStorage1);
				localStorage1["data"][localStorage1.data.length] = jsondata;
		
				//alert(JSON.stringify(localStorage1));
				var ffff = JSON.stringify(localStorage1)
				
				//データをlocalStorage1に追加
				localStorage.setItem(index, ffff);
				data1 = getData();
				iTableMake(data1);
		}
}
		
function tableInsert2() {
		var index = localStorage.key(2);
		var localStorage1 = {}; 
		localStorage1 = localStorage.getItem(index);
		var tabledata = JSON.parse(localStorage1);
		var data1 = [[[]]];
		data1 = getData();
		var errflg = 0;

		//テーブルスペースINSERTデータ取得
		var insert_data = hot2.getDataAtRow(data1[0][1].length);
		for (var a=0; a<insert_data.length; a++) {
				if(insert_data[a] == null) {
						insert_data[a] = null;
				}	else {
						insert_data[a] = insert_data[a].trim();
				}
		}
		for(var i=0; i<tabledata.columns.length; i++) {
						if(insert_data[i] != null) {
								if(tabledata.columns[i].dataType == 'int' && !insert_data[i].match(/^[1-9][0-9]*$/)) {
										alert('int型の"'+ tabledata.columns[i].name + '"の列の値に格納できるのは整数値のみです。');
										errflg = 1;
								}
								if(tabledata.columns[i].dataType == 'char' && tabledata.columns[i].leng != insert_data[i].length) {
										alert('char型の"'+ tabledata.columns[i].name + '"の列の値に格納できる文字列は' + tabledata.columns[i].leng +'桁の固定長のみです。');
										errflg = 1;
								}else if(tabledata.columns[i].leng < insert_data[i].length) {
										alert('"'+ tabledata.columns[i].name + '"の列に格納できる値は'+ tabledata.columns[i].leng + '桁までです。');
										errflg = 1;
								}
						}
						for(var k=0; k<tabledata.columns[i].const.length; k++) {
								//notnullチェック
								if(tabledata.columns[i].const[k] =='not null' && (insert_data[i] == null || insert_data[i] == '')) {
										alert('not null制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。');
										errflg = 1;
								}
								//unique key チェック
								for(var j=0; j<data1[0][2].length; j++) {
										if(tabledata.columns[i].const[k] =='unique key' && insert_data[i] != null && data1[0][2][j][i] == insert_data[i]){
												alert('unique key制約の"'+ tabledata.columns[i].name + '"の列の値に重複する値が含まれています。');
												errflg = 1;
										}
								}
								//主キーnotnullチェック
								if(tabledata.columns[i].const[k] =='primary key' && (insert_data[i] == null || insert_data[i] == '')) {
										alert('主キー制約の"' + tabledata.columns[i].name + '"の列の値にnullが含まれています。');
										errflg = 1;
								}
								//主キー列重複チェック
								for(var j=0; j<data1[0][2].length; j++) {
										if(tabledata.columns[i].const[k] =='primary key' && data1[0][2][j][i] == insert_data[i]) {
												alert('主キー制約の"' + tabledata.columns[i].name + '"の列の値に一意でない値が含まれています。');
												errflg = 1;
										}
								}
						}
		}

		if(errflg == 0) {
				//テーブルスペース列名取得
				var colname = hot2.getColHeader();
				//INSERTデータをjson形式に
				var jsondata = {};
				for(var q = 0; q < colname.length; q++){
					jsondata[colname[q]] = insert_data[q];
				}
				console.log(jsondata);
				//var json = JSON.stringify(jsondata);
		
				//INSERTデータを既存データに追加
				localStorage1 = JSON.parse(localStorage1);
				localStorage1["data"][localStorage1.data.length] = jsondata;
		
				//alert(JSON.stringify(localStorage1));
				var ffff = JSON.stringify(localStorage1)
				
				//データをlocalStorage1に追加
				localStorage.setItem(index, ffff);
				data1 = getData();
				iTableMake(data1);
		}
}
