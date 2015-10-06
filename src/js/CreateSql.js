var squel = require('squel');
var createState = require('./createStatement.js');
var _ = require('lodash');


module.exports = {
  _createSql: squel._create = new createState,
  /**
   * create文の生成
   */
  create: function(data){
    var res;
    var array = [];
    var table = data.table;
    var columns = data.columns;
    var primary =_.pluck(data.constraint,'primary_key')[0];
    array = this.columnsToStringArray(columns);

    console.log(primary);
    if(0 >= primary.length){
      res = this._createSql().table(table).columns(array);
    }else {
      res = this._createSql().table(table).columns(array).primaryKey(primary);
    }
    return res.toString();
  },
  /**
   * select文の生成
   */
  select: function(){
    return "select dummy.";
  },
  /**
   * update文の生成
   */
  update: function(){
    return "update dummy."
  },
  /**
   * insert文の生成
   */
  insert: function(){
    return "insert dummy."
  },
  /**
   * delete文を生成
   * deleteが予約語のため後ろにSQLをつけてます。
   */
  deleteSQL: function(){
    return "insert dummy."
  },

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