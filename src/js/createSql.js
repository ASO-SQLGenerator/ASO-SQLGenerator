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
   * @param {object} data JSON形式のSQLスキーマ
   * @return {String} CREATE文
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
     * @param {mixin} key 外部キーか主キー
     * @returns {boolean} booleanを返す
     */
    function hasKey(key) {
      return !_.isEmpty(key);
    }

    /**
     * 主キーと外部キーが存在するか
     *
     * @param {mixin} primary 主キー
     * @param {mixin} foreign 外部キー
     * @returns {boolean} booleanを返す
     */
    function hasKeys(primary, foreign) {
      return hasKey(primary) && hasKey(foreign);
    }

    /**
     * jsonのcolumnsのデータ定義の一つ一つをStringにして
     * SQLの文にしやすいようにArrayに格納する。
     *
     * @param {array} cols columnsのデータ定義
     * @returns {array} res Stringの配列
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
   * @return {string} SELECT文
   */
  select: function() {
    return 'select dummy.';
  },
  /**
   * update文の生成
   *
   * @return {string} UPDATE文
   */
  update: function() {
    return 'update dummy.';
  },
  /**
   * insert文の生成
   *
   * @param {object} data JSON形式のSQLスキーマ
   * @return {string} INSERT
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
   * @param {object} data JSON形式のSQLスキーマ
   * @return {string} DELETE文
   */
  delete: function(data) {
    var table = data.table;
    var conditions = data.conditions;
    var query = squel.remove().from(table);
    var res;

    res = this._setConditions(query, conditions);
    return res.toString();
  },
  /**
   * クエリにWHERE句を設定する
   *
   * @param {object} sqlObj  squelのオブジェクト
   * @param {array} conditions  WHERE句の配列
   * @returns {object} SquelObject
   */
  _setConditions: function(sqlObj, conditions) {
    var result = sqlObj;

    function isConditions(array) {
      return !_.isEmpty(array) && _.isArray(array);
    }

    function syntaxChack(str) {
      var reg = /^((?:NOT\s|)(?:'(?:(?:[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])|[ぁ-んァ-ン]|\w)+')\s(?:(?:>|<|<>|<=>|=|!=|<=|>=)\s(?:(?:'(?:(?:[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])|[ぁ-んァ-ン]|\w)+')|\d+)|BETWEEN\s\d+\sAND\s\d+))((?:\s(?:AND|OR)\s)(?:(?:NOT\s|)(?:'(?:(?:[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])|[ぁ-んァ-ン]|\w)+')\s(?:(?:>|<|<>|<=>|=|!=|<=|>=)\s(?:'(?:(?:(?:[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])|[ぁ-んァ-ン]|\w)+')|\d+)|BETWEEN\s\d+\sAND\s\d+)))*$/;
      if (!reg.test(str)) throw new Error('syntax Error ' + str);
    }

    if (isConditions(conditions)) {
      _.forEach(conditions, function(value) {
        syntaxChack(value);
        result = result.where(value);
      });
    }
    return result;
  }
};
