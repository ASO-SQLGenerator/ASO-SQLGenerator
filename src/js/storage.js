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

    var tname = frm.table_name.value.toString();

    var columns = [''];
    var limit = [];
    for (i = 0; i < droplen; i++) {
      dropid = document.getElementById('a' + dropIdNum);
      column = document.param.elements['a' + columnId].value;
      type = document.param.elements['a' + typeId].value;
      num = document.param.elements['a' + numId].value;
      limitlen = dropid.getElementsByClassName('limit').length;

      limitId = firstLimitId;
      for (j = 0; j < limitlen; j++) {
        limit[j] = document.param.elements['a' + limitId].value;
        limitId += 1;
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

    table = {
      'table': tname,
      'columns': columns,
      'constraint': {},
      'data': [{}]
    };

    return table;
  }

  $cmainBtn.on('click', function() {
    var data = getCmainElementsTable();
    var statement = createSql.create(data);
    sessionStorage.setItem('createState', statement);
    localStorage.setItem(data.table, JSON.stringify(data));
  });
});
