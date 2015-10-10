var squel = require('squel');
var createStatement = require('./createStatement.js');
var _ = require('lodash');
/**
 * 受け取ったJSONからSQL文を生成します。
 *
 * @type {{create: Function, select: Function, update: Function, insert: Function, deleteSQL: Function, _columnsToStringArray: Function}}
 */
module.exports = {
  /**
   * create文の生成
   *
   * @param data JSON形式のSQLスキーマ
   * @return {String}
   */
  create: function(data){
    var res;
    var array = [];
    var table = data.table;
    var columns = data.columns;
    var constraint = data.constraint;
    var primaryKey = constraint.primary_key;
    var foreignKey = constraint.foreign_key;
    array = _columnsToStringArray(columns);

    if(hasKeys(primaryKey,foreignKey))
      return createStatement().table(table).columns(array).primaryKey(primaryKey).foreignKeys(foreignKey).toString();
    if(hasKey(primaryKey))
      return createStatement().table(table).columns(array).primaryKey(primaryKey).toString();
    if(hasKey(foreignKey))
      return createStatement().table(table).columns(array).foreignKeys(foreignKey).toString();
    return createStatement().table(table).columns(array).toString();

    /**
     * 指定したkeyが存在するか
     *
     * @param key
     * @returns {boolean}
     */
    function hasKey(key) {
      return !_.isEmpty(key)
    };
    /**
     * 主キーと外部キーが存在するか
     *
     * @param primaryKey
     * @param foreignKey
     * @returns {boolean}
     */
    function hasKeys(primaryKey,foreignKey) {
      return hasKey(primaryKey) && hasKey(foreignKey);
    };

    /**
     * jsonのcolumnsのデータ定義の一つ一つをStringにして
     * SQLの文にしやすいようにArrayに格納する。
     *
     * @param columns
     * @returns {Array} res
     */
     function _columnsToStringArray(columns){
      var res = _.map(columns,function(val){
        if(val.leng && !_.isEmpty(val.const)) return val.name + ' ' + val.dataType + '(' + val.leng + ') ' + val.const.join(" ");
        if(val.leng) return val.name + ' ' + val.dataType + '(' + val.leng + ')';
        if(!_.isEmpty(val.const)) return val.name + ' ' + val.dataType  + val.const.join(" ");
        return val.name + ' ' + val.dataType;
      });
      return res;
    }
  },
  /**
   * select文の生成
   *
   * @return {string}
   */
  select: function(){
    return "select dummy.";
  },
  /**
   * update文の生成
   *
   * @return {string}
   */
  update: function(){
    return "update dummy."
  },
  /**
   * insert文の生成
   *
   * @return {string}
   */
  insert: function(){
    return "insert dummy."
  },
  /**
   * delete文を生成
   * deleteが予約語のため後ろにSQLをつけてます。
   *
   * @return {string}
   */
  deleteSQL: function(){
    return "insert dummy."
  }
};