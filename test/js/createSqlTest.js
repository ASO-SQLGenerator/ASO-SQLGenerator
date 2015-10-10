"use strict";

var assert = require('power-assert');
var createSql = require('../../src/js/createSql.js');

describe('createSqlで',function(){
  var table = {
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
      }
  };
  var table2 = {
    "table": "Aテーブル",
    "columns": [
      {
        "name": "a_id",
        "dataType": "int",
        "leng": "4",
        "const":[]
      }
    ],
    "constraint": {}
  };
  var table3 = {
    "table": "Aテーブル",
    "columns": [
      {
        "name": "a_id",
        "dataType": "int",
        "leng": "4",
        "const":[]
      }
    ],
    "constraint": {
      "primary_key": [
        "a_id"
      ]
    }
  };
  var table4 = {
    "table": "Aテーブル",
    "columns": [
      {
        "name": "a_id",
        "dataType": "int",
        "leng": "4",
        "const":[]
      }
    ],
    "constraint": {
      "foreign_key": [
        {
          "col_name": "b",
          "table": "bテーブル",
          "parent_col": "b"
        }
      ]
    }
  };

  describe('tableからcreate文を生成', function(){
    it('create文のテーブルか表示できているか',function(){
      var actual = createSql.create(table);
      assert.equal(actual,"CREATE TABLE Aテーブル (a_id int(4), b string(16) NOT NULL, c string) PRIMARY KEY(a_id, b) FOREIGN KEY (b) REFERENCES bテーブル(b)");
    });
    it('主キー,外部キーがないテーブルが表示されるか', function(){
      var actual = createSql.create(table2);
      assert.equal(actual,"CREATE TABLE Aテーブル (a_id int(4))");
    });
    it('主キーがあり、外部キーがないテーブルが表示されるか', function(){
      var actual = createSql.create(table3);
      assert.equal(actual,"CREATE TABLE Aテーブル (a_id int(4)) PRIMARY KEY(a_id)");
    });
    it('主キーがなく、外部キーがあるテーブルが表示されるか', function(){
      var actual = createSql.create(table4);
      assert.equal(actual,"CREATE TABLE Aテーブル (a_id int(4)) FOREIGN KEY (b) REFERENCES bテーブル(b)");
    });
  });
});