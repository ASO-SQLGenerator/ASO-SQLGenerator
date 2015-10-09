var squel = require('squel');
var createStatement = require('./createStatement.js');
var _ = require('lodash');

/**
 * JSON型データをSQLのString型に変換する。
 *
 * @type {{_createSql: (module.exports|exports), create: Function, select: Function, update: Function, insert: Function, deleteSQL: Function, columnsToStringArray: Function}}
 */
module.exports = {
  /**
   * create文の生成
   *
   * @return {String}
   */
  create: function(data){
    var res;
    var array = [];
    var table = data.table;
    var columns = data.columns;
    var constraint = data.constraint;
    var primary = constraint.primary_key;
    array = this.columnsToStringArray(columns);

    if(0 >= primary.length){
      res = createStatement().table(table).columns(array);
    }else {
      res = createStatement().table(table).columns(array).primaryKey(primary);
    }
    return res.toString();
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
  },

  /**
   * jsonのcolumnsのデータ定義の一つ一つをStringにして
   * SQLの文にしやすいようにArrayに格納する。
   *
   * @param columns
   * @returns {Array} res
   */
  columnsToStringArray: function(columns){
    var res = _.map(columns,function(val){
      if(val.leng && val.const.length > 0) return val.name + ' ' + val.dataType + '(' + val.leng + ') ' + val.const.join(" ");
      if(val.leng) return val.name + ' ' + val.dataType + '(' + val.leng + ')';
      if(val.const.length > 0) return val.name + ' ' + val.dataType  + val.const.join(" ");
      return val.name + ' ' + val.dataType;
    });
    return res;
  }
};