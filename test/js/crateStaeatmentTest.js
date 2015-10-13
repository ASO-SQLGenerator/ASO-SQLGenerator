"use strict";

var assert = require('power-assert');
var createStatement = require('../../src/js/createStatement.js').createStatement;

describe('CREATE文生成テスト', function(){
  this.timeout(15000);
  var foreignKeys = [
    {
      "col_name": "b",
      "table": "Bテーブル",
      "parent_col": "b"
    },
    {
      "col_name": "c",
      "table": "Cテーブル",
      "parent_col": "c"
    }
  ];
  it('テーブル名が表示されるか',function(){
    var sql = createStatement().table('Aテーブル');
    assert.equal(sql.toString(),"CREATE TABLE Aテーブル ()");
  });
  it('テーブル名とカラムが表示されるか',function(){
    var sql = createStatement().table('Aテーブル').columns(['a_id']);
    assert.equal(sql.toString(),"CREATE TABLE Aテーブル (a_id)");
  });
  it('テーブル名と複数のカラムが表示されるか',function(){
    var sql = createStatement().table('Aテーブル').columns(['a_id','b']);
    assert.equal(sql.toString(),"CREATE TABLE Aテーブル (a_id, b)");
  });
  it('テーブル名とカラムと主キーが表示されるか',function(){
    var sql = createStatement().table('Aテーブル').columns(['a_id']).primaryKey('a_id');
    assert.equal(sql.toString(),"CREATE TABLE Aテーブル (a_id) PRIMARY KEY(a_id)");
  });
  it('テーブル名とカラムと主キーと外部キーが表示されるか',function(){
    var sql = createStatement().table('Aテーブル').columns(['a_id','b']).primaryKey('a_id').foreignKey('b','Bテーブル','b');
    assert.equal(sql.toString(),"CREATE TABLE Aテーブル (a_id, b) PRIMARY KEY(a_id) FOREIGN KEY (b) REFERENCES Bテーブル(b)");
  });
  it('テーブル名とカラムと主キーと外部キー(Array)が表示されるか',function(){
    var sql = createStatement().table('Aテーブル').columns(['a_id','b','c']).primaryKey('a_id').foreignKeys(foreignKeys);
    assert.equal(sql.toString(),"CREATE TABLE Aテーブル (a_id, b, c) PRIMARY KEY(a_id) FOREIGN KEY (b) REFERENCES Bテーブル(b), FOREIGN KEY (c) REFERENCES Cテーブル(c)");
  });
});