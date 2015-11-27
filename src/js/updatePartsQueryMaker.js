var uMainBtn = $('#uMainBtn');
var uSpace = $('.uspace');
var updateCon = $('.updateCon');
var doc = $(document);

var boxHeight = 102;

function getCloneSetValues(object) {
  return object.map(function() {
    return $(this).find('#ucolum').val() + ' = \'' + $(this).find('#ucvalue').val() + '\'';
  }).get().join(', ');
}
/**
 * SQL文作成イベント
 */
uMainBtn.on('click', function() {
  var list;
  var uTable = uSpace.children();
  if (uTable.length === 0) return console.error('Please setting your Updating Table Parts!');
  list = uTable.map(function() {
    var set = getCloneSetValues($(this).children('.cloneSet'));
    console.log(set);
    return $(this).find('cloneSet');
  }).get();
  uTable.remove();
});

/**
 * 検索条件の追加
 */
doc.on('click', '.addUpConf', function() {
  var clone = updateCon.clone();
  var parent = $(this).parent();
  var height = parent.height();

  clone.prepend('<select class="u-logical"><option value="AND">AND</option><option value="AND">OR</option><input type="button" class="removeCon" value="削除"></br>');
  parent.height(height + boxHeight);
  parent.append(clone.addClass('logicCon'));
});

/**
 * 検索条件の削除
 */
doc.on('click', '.removeCon', function() {
  $(this).parents('.updatecondition').height(function(idx, height) {
    return height - boxHeight;
  });
  $(this).parent().remove();
});
/**
 * 検索条件のリセット
 */
doc.on('click', '.resetUpConf', function() {
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
uSpace.on('mouseover', '.ubox', function() {
  $(this).children('.clear_btn').show();
});

/**
 * クリアボタンの非表示
 */
uSpace.on('mouseout', '.ubox', function() {
  $(this).children('.clear_btn').hide();
});

/**
 * uboxの削除
 */
doc.on('click', '.clear_btn', function() {
  $(this).parent().remove();
});
