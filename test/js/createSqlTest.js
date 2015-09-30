"use strict";

var assert = require('power-assert');
var createSql = require('../../src/js/createSql.js');

describe('createSqlで',function(){
  var data = {
    "table": "Aテーブル",
    "columns": [
      {
        "name": "a_id",
        "dataType": "int",
        "leng": "4",
        "constraint": [
          "PRIMARY KEY"
        ]
      },
      {
        "name": "b",
        "dataType": "string",
        "leng": "16",
        "constraint": [
          "FOREIGN KEY",
          "notnull"
        ]
      }
    ],
    "data": [
      {
        "id": "0001",
        "b": "ああああ"
      },
      {
        "id": "0002",
        "b": "いいいい"
      }
    ]
  };
  describe('dataからcreate文を生成',function(){
    it('create文のテーブルか表示できているか',function(){
      var actual = createSql.create(data);
      assert.equal(actual,"CREATE TABLE Aテーブル ( a_id int(4) PRIMARY KEY, b string(16) FOREIGN KEY notnull )");
    });
  });

  describe('JsonのColumnsの要素を一行のString配列に',function(){
    it( '一行のColumn定義になっているか',function(){
      var actual = createSql.columnsToStringArray(data.columns);
      assert.equal(actual[0],'a_id int(4) PRIMARY KEY');
    });
  });
});