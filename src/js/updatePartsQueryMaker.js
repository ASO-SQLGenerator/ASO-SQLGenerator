var createSql = require('./createSql.js');
var $uMainBtn = $('#uMainBtn');
var $uSpace = $('.uspace');
var $updateCon = $('.updateCon');
var $doc = $(document);
var $sqlArea = $('#umain_sqlarea');

var boxHeight = 102;

function PartsList() {
  this.tableName = '';
  this.fields = {};
  this.conditions = [];
}
/**
 * SQL文作成イベント
 */
$uMainBtn.on('click', function() {
  var list = new PartsList();
  var uTable = $uSpace.children();
  var fields = {};
  if (uTable.length === 0) return console.error('Please setting your Updating Table Parts!');
  list.tableName = $('.utable_name').val();

  function mightAddSingleQuote(value) {
    return /[0-9]+/.test(value) ? value : '\'' + value + '\'';
  }

  uTable.each(function() {
    var prop;
    var ucvalue;
    var val;
    var con;
    var cons;

    if ($(this).hasClass('cloneSet')) {
      prop = $(this).find('.ucolum').val();
      ucvalue = $(this).find('.ucvalue').val();
      val = /[0-9]+/.test(ucvalue) ? Number(ucvalue) : ucvalue;

      fields[prop] = val;
    } else {
      con = $(this).find('.updateCon');
      cons = con.map(function() {
        if ($(this).hasClass('logicCon')) {
          return $(this).children('.u-logical').val() + ' ' + $(this).children('.ucondition').val()
            + ' ' + $(this).children('.uconsid').val() + ' ' + mightAddSingleQuote($(this).children('.uconvalue').val());
        }
        return $(this).children('.ucondition').val()
          + ' ' + $(this).children('.uconsid').val() + ' ' + mightAddSingleQuote($(this).children('.uconvalue').val());
      }).get().join(' ');
      list.conditions.push(cons);
    }
  });
  list.fields = fields;

  if ($.isEmptyObject(list.fields)) {
    $sqlArea.val('更新対象がありません').css('textcolor', 'red');
  } else {
    $sqlArea.val(createSql.update(list)).css('textcolor', 'green');
  }
  uTable.remove();
});

/**
 * 検索条件の追加
 */
$doc.on('click', '.addUpConf', function() {
  var clone = $updateCon.clone();
  var parent = $(this).parent();
  var height = parent.height();

  clone.prepend('<select class="u-logical"><option value="AND">AND</option><option value="AND">OR</option><input type="button" class="removeCon" value="削除"></br>');
  parent.height(height + boxHeight);
  parent.append(clone.addClass('logicCon'));
});

/**
 * 検索条件の削除
 */
$doc.on('click', '.removeCon', function() {
  $(this).parents('.updatecondition').height(function(idx, height) {
    return height - boxHeight;
  });
  $(this).parent().remove();
});
/**
 * 検索条件のリセット
 */
$doc.on('click', '.resetUpConf', function() {
  var logicCon = $(this).siblings('.logicCon');
  if (logicCon) {
    $(this).parent().height(function(idx, height) {
      return height - logicCon.length * boxHeight;
    });
    logicCon.remove();
  }
  $(this).siblings('.updateCon').children('input').val('');
});

/**
 * クリアボタンの表示
 */
$uSpace.on('mouseover', '.ubox', function() {
  $(this).children('.clear_btn').show();
});

/**
 * クリアボタンの非表示
 */
$uSpace.on('mouseout', '.ubox', function() {
  $(this).children('.clear_btn').hide();
});

/**
 * uboxの削除
 */
$doc.on('click', '.clear_btn', function() {
  $(this).parent().remove();
});
