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

     array = this.columnsToStringArray(columns);

    res = this._createSql().table(table).columns(array);
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
      return val.leng
        ? val.name + ' ' + val.dataType + '(' + val.leng + ') ' + val.constraint.join(" ")
        : val.name + ' ' + val.dataType  + ' ' + val.constraint.join(" ");

    });
    return res;
  }

};