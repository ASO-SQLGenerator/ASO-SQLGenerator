var atable = {
	"table": "Aテーブル",
	"columns": [
		{
			"name": "a_id",
			"dataType": "int",
			"leng": "4",
			"const": [
				"no null"
			]
		},
		{
			"name": "b",
			"dataType": "string",
			"leng": "16",
			"const": [
				"no null"
			]
		},
		{
			"name": "c",
			"dataType": "string",
			"leng": "16",
			"const": [
				"no null"
			]
		},

	],
	"constraint": 
			{
					"primary_key": [
							"a_id"
							],
					"foreign_key": [
						{
								"col_name":"b",
								"table":"bテーブル",
								"parent_col":"b"
						}
					]
			},
	
	"data": [
		{
						"a_id":"0001",
						"b":"ああああ",
						"c":"ええええええ"
		},
		{
						"a_id":"0002",
						"b":"うううう",
						"c":"おおおおおおおお"
		},
		{
						"a_id":"0123",
						"b":"aiueo",
						"c":"aiueoao"
		}
	]

	};
	
var btable = {
	"table": "Bテーブル",
	"columns": [
		{
			"name": "d_id",
			"dataType": "int",
			"leng": "4",
			"const": [
				"no null"
			]
		},
		{
			"name": "e",
			"dataType": "string",
			"leng": "16",
			"const": [
				"no null"
			]
		},

	],
	"constraint": 	{
					"primary_key": [
							"d_id"
							],
			},
	"data": [
		{
			"d_id":"0003",
			"e":"かかかか",
		},
		{
			"d_id":"0004",
			"e":"けけけけ",
		}
	]

	};

var aaa = JSON.stringify(atable);
localStorage.setItem("atable",aaa);

var bbb = JSON.stringify(btable);
localStorage.setItem("btable",bbb);




 
$(function(){

    
    // データの全削除
    $('#clear').click(function() {
        localStorage.clear();
        showStorage();
    });
 
});
