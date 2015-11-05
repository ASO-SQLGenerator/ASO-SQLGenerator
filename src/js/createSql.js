var squel = require('squel');
var createStatement = require('./createStatement.js').createStatement;
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
  create: function(data) {
    var array = [];
    var table = data.table;
    var columns = data.columns;
    var constraint = data.constraint;
    var primaryKey = constraint.primary_key;
    var foreignKey = constraint.foreign_key;

    /**
     * 指定したkeyが存在するか
     *
     * @param key
     * @returns {boolean}
     */
    function hasKey(key) {
      return !_.isEmpty(key);
    }

    /**
     * 主キーと外部キーが存在するか
     *
     * @param primary
     * @param foreign
     * @returns {boolean}
     */
    function hasKeys(primary, foreign) {
      return hasKey(primary) && hasKey(foreign);
    }

    /**
     * jsonのcolumnsのデータ定義の一つ一つをStringにして
     * SQLの文にしやすいようにArrayに格納する。
     *
     * @param cols
     * @returns {Array} res
     */
    function _columnsToStringArray(cols) {
      var res;
      res = _.map(cols, function(val) {
        if (val.leng && !_.isEmpty(val.const)) return val.name + ' ' + val.dataType + '(' + val.leng + ') ' + val.const.join(' ');
        if (val.leng) return val.name + ' ' + val.dataType + '(' + val.leng + ')';
        if (!_.isEmpty(val.const)) return val.name + ' ' + val.dataType + val.const.join(' ');
        return val.name + ' ' + val.dataType;
      });
      return res;
    }

    array = _columnsToStringArray(columns);
    if (hasKeys(primaryKey, foreignKey)) {
      return createStatement().table(table).columns(array).primaryKey(primaryKey).foreignKeys(foreignKey).toString();
    }
    if (hasKey(primaryKey)) {
      return createStatement().table(table).columns(array).primaryKey(primaryKey).toString();
    }
    if (hasKey(foreignKey)) {
      return createStatement().table(table).columns(array).foreignKeys(foreignKey).toString();
    }
    return createStatement().table(table).columns(array).toString();
  },
  /**
   * select文の生成
   *
   * @return {string}
   */
  select: function() {
    return 'select dummy.';
  },
  /**
   * update文の生成
   *
   * @return {string}
   */
  update: function() {
    return 'update dummy.';
  },
  /**
   * insert文の生成
   *
   * @param data JSON形式のSQLスキーマ
   * @return {string}
   */
  insert: function(data) {
    var table = data.table;
    var value = data.data;
    var res;

    res = squel.insert().into(table).setFieldsRows(value);
    return res.toString();
  },
  /**
   * delete文を生成
   *
   * @param data JSON形式のSQLスキーマ
   * @return {string}
   */
  delete: function(data) {
    var table = data.table;
    var conditions = data.conditions;
    var query = squel.remove().from(table);
    var res;

    res = this._setConditions(query, conditions);
    return res.toString();
  },


  _setConditions: function(sqlObj, conditons) {
    var result = sqlObj;

    function isConditions(conditions) {
      return !_.isEmpty(conditions) && _.isArray(conditions);
    }
    if (isConditions(conditons)) {
      _.forEach(conditons, function(value) {
        result = result.where(value);
      });
    }
    return result;
  }
};
