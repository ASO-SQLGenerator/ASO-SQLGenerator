$(function() {
  'use strict';
  var createSql = require('./createSql.js');
  var $cmainBtn = $('.cmain_btn');
  var $sqlArea = $('#cmain_sqlarea');
  var sql;

  sql = sessionStorage.getItem('createState');
  if (sql) {
    $sqlArea.val(sql);
  }
  /**
   * Cmainの要素を取得して、tableObjectを返す。
   * @returns {object} table
   */
  function getCmainElementsTable() {
    var table;
    var num;
    var type;
    var column;
    var dropIdNum = 10;
    var columnId = 11;
    var typeId = 12;
    var numId = 13;
    var firstLimitId = 14;
    var limitId = 0;
    var i;
    var j;
    var frm = document.forms.param;

    // 列数を取得
    var cparts = document.getElementById('cspace_parts');

    var droplen = cparts.getElementsByClassName('drop ui-droppable ui-draggable').length;

    // パーツの要素数を取得
    // var selecttags = cparts.getElementsByTagName('select');
    // var inputtags = cparts.getElementsByTagName('input');
    // var draglen = selecttags.length + inputtags.length - 3;

    var dropid;
    var limitlen;
    var pkflg = 0;

    var tname = frm.table_name.value.toString();
	if(tname.match(/[^A-Za-z0-9]+/)) {
			document.getElementById("cErr").innerText="表名に指定できる文字は半角英数字のみです。";
			return false;
	}
	if(!tname.match(/\S/g)) {
			document.getElementById("cErr").innerText="表名を入力してください。";
			return false;
	}
		

    var columns = [''];
    var limit = [];
    for (i = 0; i < droplen; i++) {
      dropid = document.getElementById('a' + dropIdNum);
      column = document.param.elements['a' + columnId].value;
	if(column.match(/[^A-Za-z0-9]+/)) {
		document.getElementById("cErr").innerText="列名に指定できる文字は半角英数字のみです。";
		return false;
	}
	if(!column.match(/\S/g)) {
		document.getElementById("cErr").innerText="列名を入力してください。";
		return false;
	}
      type = document.param.elements['a' + typeId].value;
      num = document.param.elements['a' + numId].value;
      num = String(num);
      console.log(num);
	if(!num.match(/^[1-9]\d*$/)) {
		document.getElementById("cErr").innerText="列に指定する文字数制限は半角数字で入力してください。";
		return false;
	}
	if(!num) {
		document.getElementById("cErr").innerText="列に指定する文字数制限を半角数字で入力してください。";
		return false;
	}
      limitlen = dropid.getElementsByClassName('limit').length;

      limitId = firstLimitId;
      for (j = 0; j < limitlen; j++) {
        limit[j] = document.param.elements['a' + limitId].value;
					if($.inArray('auto increment', limit) >= 0 && type != 'int') {
      				  document.getElementById("cErr").innerText="auto incrementを設定した列にはint型のみ設定することができます。";
	      				return false;
					}
        limitId += 1;
      }
			if($.inArray('primary key',limit) >= 0) {
							pkflg = 1;
		 	}
			if($.inArray('auto increment', limit) >= 0 && $.inArray('primary key', limit) == -1) {
							document.getElementById("cErr").innerText="auto incrementを設定した列には主キー制約を設定する必要があります。";
							return false;
		 	}
		 	for(var k=0; k<i; k++) {
							if(columns[k].name == colum){
											document.getElementById("cErr").innerText="列名が重複しています。";
											return false;
							}
						 	if($.inArray('auto increment',columns[k].const) >= 0 && $.inArray('auto increment',limit) >= 0) {
											document.getElementById("cErr").innerText="auto incrementは１つの表に対して１つの列にだけ設定することができます。";
											return false;
		          }
		  }


      columns[i] = {
        'name': column,
        'dataType': type,
        'leng': num,
        'const': limit
      };
      
      limit = [];

      dropIdNum += 10;
      columnId += 10;
      typeId += 10;
      numId += 10;
      firstLimitId += 10;
    }

		if(pkflg==0) {
						document.getElementById("cErr").innerText="主キーが設定されていません。";
						return false;
		}

    table = {
      'table': tname,
      'columns': columns,
      'constraint': {},
      'data': []
    };

    return table;
  }

  $cmainBtn.on('click', function() {
    var data = getCmainElementsTable();
		if(!data)	{
			return false;
		}
    var statement = createSql.create(data);
    sessionStorage.setItem('createState', statement);
    localStorage.setItem(localStorage.length, JSON.stringify(data));
  });
});
