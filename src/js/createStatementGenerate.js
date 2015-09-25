/**
 * Created by ryu on 15/09/18.
 */
var squel = require('squel');

module.exports = function(){
  /* OOP Inheritance mechanism (substitute your own favourite library for this!) */
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
      return "(" + _columns.join(", ") + ")";
    }
  };

  ColumnBlock.inheritsFrom(squel.cls.Block);

  /* Create the 'Create' query builder */

  var CreateQuery = function(options) {
    this.parent.constructor.call(this, options, [
      new squel.cls.StringBlock(options, 'CREATE TABLE'),
      new CreateTableBlock({singleTable: true}),
      new ColumnBlock()
    ]);
  };
  CreateQuery.inheritsFrom(squel.cls.QueryBuilder);


  /* Create squel.create() convenience method */

  squel.create = function(options) {
    return new CreateQuery(options)
  };


  /* Try it out! */
  var col = ["cc","dd"]

  console.log(
    squel.create()
      .table('test')
      .column("a b")
      .columns(col)
      .column("c d")
      .toString()
  );
}