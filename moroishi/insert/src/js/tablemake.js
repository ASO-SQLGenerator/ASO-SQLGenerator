

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

	var tdata = [[]];



	for(var k=0 ; k<tabledata.data.length ; k++) {
			for(var l=0 ; l<tabledata.columns.length ; l++) {
					tdata[k] = tabledata.data[l] ;

			}

	}



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
		fillHandle: true 
		afterChange: function (change, source) {   //以下セル編集後の処理
		alert("aaaa");
            /*$.ajax({
                url: "http://192.168.2.1/rest",  //postするエンドポイントを指定
                dataType: "text",   //textデータをpostする(jsonでもOK)
                type: "POST",       //メソッドをPOSTに指定
                data: {data: change[0][2] + "," + change[0][3]}, //変更前&変更後データ
                success: function () {   //以下編集が成功した後の処理
                    msg.innerText = "設定を保存しました。";
                    $(this).delay(1500).queue(function() {
                       msg.innerText = "変更したいIPをダブルクリックして書き変えてください。";
                       $(this).dequeue();
                    });
                }
            });*/
         }
	});
	$("#"+index).handsontable("loadData", test2);

}

var ttable = localStorage.getItem("atable");
var tdata = JSON.parse(ttable);

