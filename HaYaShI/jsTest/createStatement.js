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

    };

    ColumnBlock.prototype.buildStr = function() {
      return "(" + _columns.join(",") + ")";
    };
  };

  ColumnBlock.inheritsFrom(squel.cls.Block);

  var PrimaryKeyBlock = function(options) {
    this.parent.constructor.call(this,options);
    this.keys = [];

    PrimaryKeyBlock.prototype.primaryKey = function(field){
      if(Array.isArray(field)){
        field = field.join(", ");
      };
      this.keys.push(field);
    };

    PrimaryKeyBlock.prototype.buildStr = function() {
      var key, _res, _i, f;
      key = "";
      if(0 < this.keys.length){
        _res = this.keys;
        for(_i = 0; _i < _res.length; _i ++){
          f = _res[_i];
          if ("" !== key) {
            key += ", ";
          }
          key += f;
        }
        key = "PRIMARY KEY(" + key + ")";
      }
      return key;
    };

  };

  PrimaryKeyBlock.inheritsFrom(squel.cls.Block);

  /* Create the 'Create' query builder */

  var CreateQuery = function(_options) {
    this.parent.constructor.call(this, _options, [
      new squel.cls.StringBlock(_options, 'CREATE TABLE'),
      new CreateTableBlock({singleTable: true}),
      new ColumnBlock(),
      new PrimaryKeyBlock(_options)
    ]);
  };
  CreateQuery.inheritsFrom(squel.cls.QueryBuilder);



    return function(options){
      return new CreateQuery(options)
    };

}