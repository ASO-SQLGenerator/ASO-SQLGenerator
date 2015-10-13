var squel = require('squel');
var util = require('util');


var CreateQuery;
var ForeignKeyBlock;
var PrimaryKeyBlock;
var ColumnBlock;
var CreateTableBlock;

CreateTableBlock = function(options) {
  squel.cls.AbstractTableBlock.call(this, options);
  CreateTableBlock.prototype.table = function(table, alias) {
    var al = alias;
    if (alias === null || alias === undefined) {
      al = null;
    }
    return this._table(table, al);
  };
};
util.inherits(CreateTableBlock, squel.cls.AbstractTableBlock);

ColumnBlock = function() {
  var _columns = [];

  ColumnBlock.prototype.columns = function(colunms) {
    if (!Array.isArray(colunms)) {
      throw new TypeError(colunms + 'is not Array');
    }
    _columns.push(colunms.join(', '));
  };

  ColumnBlock.prototype.buildStr = function() {
    return '(' + _columns.join(',') + ')';
  };
};
util.inherits(ColumnBlock, squel.cls.Block);

PrimaryKeyBlock = function() {
  var _this = this;
  this.keys = [];

  PrimaryKeyBlock.prototype.primaryKey = function(fields) {
    var field = fields;
    if (Array.isArray(fields)) {
      field = fields.join(', ');
    }
    _this.keys.push(field);
  };

  PrimaryKeyBlock.prototype.buildStr = function() {
    var key;
    var _res;
    var _i;
    var word;
    key = '';
    if (_this.keys.length > 0) {
      _res = _this.keys;
      for (_i = 0; _i < _res.length; _i++) {
        word = _res[_i];
        if (key !== '') {
          key += ', ';
        }
        key += word;
      }
      key = 'PRIMARY KEY(' + key + ')';
    }
    return key;
  };
};
util.inherits(PrimaryKeyBlock, squel.cls.Block);

ForeignKeyBlock = function() {
  var _this = this;
  this.keys = [];

  ForeignKeyBlock.prototype.foreignKeys = function(keys) {
    if (!Array.isArray(keys)) {
      throw new TypeError(keys + 'is not Array.');
    }
    keys.forEach(function(val) {
      _this.foreignKey(val.col_name, val.table, val.parent_col);
    });
  };

  ForeignKeyBlock.prototype.foreignKey = function(col, table, parentCol) {
    var statement;
    statement = 'FOREIGN KEY (' + col + ') REFERENCES ' + table
      + '(' + parentCol + ')';
    _this.keys.push(statement);
  };

  ForeignKeyBlock.prototype.buildStr = function() {
    var key;
    var _res;
    var _i;
    var word;
    key = '';
    if (_this.keys.length > 0) {
      _res = _this.keys;
      for (_i = 0; _i < _res.length; _i++) {
        word = _res[_i];
        if (key !== '') {
          key += ', ';
        }
        key += word;
      }
    }
    return key;
  };
};
util.inherits(ForeignKeyBlock, squel.cls.Block);

/* Create the 'Create' query builder */
CreateQuery = function(options) {
  squel.cls.QueryBuilder.call(this, options, [
    new squel.cls.StringBlock(options, 'CREATE TABLE'),
    new CreateTableBlock({singleTable: true}),
    new ColumnBlock(),
    new PrimaryKeyBlock(options),
    new ForeignKeyBlock(options)
  ]);
};
util.inherits(CreateQuery, squel.cls.QueryBuilder);
exports.createStatement = squel.create = function(options) {
  return new CreateQuery(options);
};

