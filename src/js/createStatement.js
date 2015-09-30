/**
 * Created by ryu on 15/09/18.
 */
var squel = require('squel');

module.exports = function(){
  Function.prototype.inheritsFrom = function( parentClassOrObject ) {
    this.prototype = new parentClassOrObject;
    this.prototype.constructor = this;
    this.prototype.parent = parentClassOrObject.prototype;
    this.prototype.parent.constructor = parentClassOrObject;
  };

  var CreateTableBlock = function(options){
    this.parent.constructor.apply(this,options);
  };

  CreateTableBlock.inheritsFrom(squel.cls.AbstractTableBlock);


  CreateTableBlock.prototype.table = function(table,alias){
    if (alias == null) {
      alias = null;
    }
      return this._table(table,alias);
  };


  var ColumnBlock = function() {
    var _columns = [];

    ColumnBlock.prototype.columns = function(colunms){
      if (Array.isArray(colunms)){
        _columns.push(colunms.join(", "));
      }
      else{
        throw new TypeError(colunms + "is not Array")
      }

    }
    ColumnBlock.prototype.column = function(column) {
      column = this._sanitizeName(column,"column property")
      _columns.push(column);
    }

    ColumnBlock.prototype.buildStr = function() {
      return "( " + _columns.join(", ") + " )";
    }
  };

  ColumnBlock.inheritsFrom(squel.cls.Block);

  /* Create the 'Create' query builder */

  var CreateQuery = function(_options) {
    this.parent.constructor.call(this, _options, [
      new squel.cls.StringBlock(_options, 'CREATE TABLE'),
      new CreateTableBlock({singleTable: true}),
      new ColumnBlock()
    ]);
  };
  CreateQuery.inheritsFrom(squel.cls.QueryBuilder);



    return function(options){
      return new CreateQuery(options)
    };

}