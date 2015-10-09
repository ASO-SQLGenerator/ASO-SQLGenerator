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
        "const":[]
      },
      {
        "name": "b",
        "dataType": "string",
        "leng": "16",
        "const":[
          "NOT NULL"
        ]
      },
      {
        "name": "c",
        "dataType": "string",
        "leng": "",
        "const":[
        ]
      }
    ],
    "constraint": {
        "primary_key": [
          "a_id",
          "b"
        ],
        "foreign_key": [
          {
            "col_name": "b",
            "table": "bテーブル",
            "parent_col": "b"
          }
        ]
      },
    "data": [
      {
        "id": "0001",
        "b": "ああああ",
        "c": "aaa"
      },
      {
        "id": "0002",
        "b": "いいいい",
        "c": "iiii"
      }
    ]
  };
  describe('dataからcreate文を生成', function(){
    it('create文のテーブルか表示できているか',function(){
      var actual = createSql.create(data);
      assert.equal(actual,"CREATE TABLE Aテーブル (a_id int(4), b string(16) NOT NULL, c string) PRIMARY KEY(a_id, b)");
    });
  });

  describe('JsonのColumnsの要素を一行のString配列に',function(){
    var actual = createSql.columnsToStringArray(data.columns);
    it('一行のColumn定義になっているか', function(){
      assert.equal(actual[0],'a_id int(4)');
    });
    it('桁数指定なしのSQLになっているか', function(){
      assert.equal(actual[2],'c string');
    })
  });
});