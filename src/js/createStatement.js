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
      if (!Array.isArray(colunms)) {
        throw new TypeError(colunms + "is not Array")
      }
        _columns.push(colunms.join(", "));


    };

    ColumnBlock.prototype.buildStr = function() {
      return "(" + _columns.join(", ") + ")";
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

  var ForeignKeyBlock = function (options) {
    this.parent.constructor.call(this, options);
    this.keys = [];
    var self = this;

    ForeignKeyBlock.prototype.foreignKeys = function (keys) {
      if (!Array.isArray(keys)) {
        throw new TypeError(keys +'is not Array.');
      }
      keys.forEach(function(val){
        self.foreignKey(val.col_name,val.table,val.parent_col);
      })
    };


    ForeignKeyBlock.prototype.foreignKey = function (col, table, parentCol) {
      var statement;
      statement = "FOREIGN KEY (" + col + ") REFERENCES " + table
        + "(" + parentCol + ")";
      this.keys.push(statement);
    };

    ForeignKeyBlock.prototype.buildStr = function () {
      var key, _res, _i, f;
      key = "";
      if (0 < this.keys.length) {
        _res = this.keys;
        for (_i = 0; _i < _res.length; _i++) {
          f = _res[_i];
          if ("" !== key) {
            key += ", ";
          }
          key += f;
        }
      }
      return key;
    };
  };

  ForeignKeyBlock.inheritsFrom(squel.cls.Block);

    /* Create the 'Create' query builder */

    var CreateQuery = function (options) {
      this.parent.constructor.call(this, options, [
        new squel.cls.StringBlock(options, 'CREATE TABLE'),
        new CreateTableBlock({singleTable: true}),
        new ColumnBlock(),
        new PrimaryKeyBlock(options),
        new ForeignKeyBlock(options)
      ]);
    };
    CreateQuery.inheritsFrom(squel.cls.QueryBuilder);


    squel.create = function (options) {
      return new CreateQuery(options)
    };
  return new squel.create;
};