'use strict';

var assert = require('power-assert');
var createSql = require('../../src/js/createSql.js');

describe('createSqlで', function() {
  describe('tableからcreate文を生成', function() {
    var table;
    var table2;
    var table3;
    var table4;
    table = {
      'table': 'Aテーブル',
      'columns': [
        {
          'name': 'a_id',
          'dataType': 'int',
          'leng': '4',
          'const': []
        },
        {
          'name': 'b',
          'dataType': 'string',
          'leng': '16',
          'const': [
            'NOT NULL'
          ]
        },
        {
          'name': 'c',
          'dataType': 'string',
          'leng': '',
          'const': []
        }
      ],
      'constraint': {
        'primary_key': [
          'a_id',
          'b'
        ],
        'foreign_key': [
          {
            'col_name': 'b',
            'table': 'bテーブル',
            'parent_col': 'b'
          }
        ]
      }
    };
    table2 = {
      'table': 'Aテーブル',
      'columns': [
        {
          'name': 'a_id',
          'dataType': 'int',
          'leng': '4',
          'const': []
        }
      ],
      'constraint': {}
    };
    table3 = {
      'table': 'Aテーブル',
      'columns': [
        {
          'name': 'a_id',
          'dataType': 'int',
          'leng': '4',
          'const': []
        }
      ],
      'constraint': {
        'primary_key': [
          'a_id'
        ]
      }
    };
    table4 = {
      'table': 'Aテーブル',
      'columns': [
        {
          'name': 'a_id',
          'dataType': 'int',
          'leng': '4',
          'const': []
        }
      ],
      'constraint': {
        'foreign_key': [
          {
            'col_name': 'b',
            'table': 'bテーブル',
            'parent_col': 'b'
          }
        ]
      }
    };
    it('create文のテーブルか表示できているか', function(done) {
      var actual = createSql.create(table);
      assert.equal(actual, 'CREATE TABLE Aテーブル (a_id int(4), b string(16) NOT NULL, c string) PRIMARY KEY(a_id, b) FOREIGN KEY (b) REFERENCES bテーブル(b)');
      done();
    });
    it('主キー,外部キーがないテーブルが表示されるか', function(done) {
      var actual = createSql.create(table2);
      assert.equal(actual, 'CREATE TABLE Aテーブル (a_id int(4))');
      done();
    });
    it('主キーがあり、外部キーがないテーブルが表示されるか', function(done) {
      var actual = createSql.create(table3);
      assert.equal(actual, 'CREATE TABLE Aテーブル (a_id int(4)) PRIMARY KEY(a_id)');
      done();
    });
    it('主キーがなく、外部キーがあるテーブルが表示されるか', function(done) {
      var actual = createSql.create(table4);
      assert.equal(actual, 'CREATE TABLE Aテーブル (a_id int(4)) FOREIGN KEY (b) REFERENCES bテーブル(b)');
      done();
    });
  });

  describe('INSERT文を生成', function() {
    var insertTable;
    var except;
    var actual;
    beforeEach(function(done) {
      except = '';
      actual = '';
      insertTable = {
        'table': 'Aテーブル',
        'data': [{
          'id': 1,
          'name': 'aaa'
        }]
      };
      done();
    });
    it('INSERT文が表示できているか', function(done) {
      actual = createSql.insert(insertTable);
      except = 'INSERT INTO Aテーブル (id, name) VALUES (1, \'aaa\')';
      assert.equal(actual, except);
      done();
    });

    it('複数の値があるINSERT文が表示できているか', function(done) {
      insertTable.data = [
        {
          'id': 1,
          'name': 'aaa'
        },
        {
          'id': 2,
          'name': 'bbb'
        }];
      actual = createSql.insert(insertTable);
      except = 'INSERT INTO Aテーブル (id, name) VALUES (1, \'aaa\'), (2, \'bbb\')';
      assert.equal(actual, except);
      done();
    });
  });
  describe('DELETE文を生成', function() {
    var deleteTable;
    var except;
    var actual;
    beforeEach(function(done) {
      except = '';
      actual = '';
      deleteTable = {
        'table': 'students',
        'conditions': []
      };
      done();
    });
    it('条件がないDELETE文が表示できているか', function(done) {
      actual = createSql.delete(deleteTable);
      except = 'DELETE FROM students';
      assert.equal(actual, except);
      done();
    });
    it('条件があるDELETE文が表示できているか', function(done) {
      deleteTable.conditions = [
        'id > 5',
        'id < 10',
        'student = \'Jon\''
      ];
      actual = createSql.delete(deleteTable);
      except = 'DELETE FROM students WHERE (id > 5) AND (id < 10) AND (student = \'Jon\')';
      assert(actual === except);
      done();
    });
  });
  describe('UPDATE文を生成', function() {
    var updateTable;
    var except;
    var actual;
    beforeEach(function(done) {
      except = '';
      actual = '';
      updateTable = {
        'table': 'students',
        'values': {
          name: 'Jon'
        }
      };
      done();
    });
    it('条件がないUPDATE文が表示できているか', function(done) {
      actual = createSql.update(updateTable);
      except = 'UPDATE students SET name = \'Jon\'';
      assert.equal(actual, except);
      done();
    });
    it('条件があるUPDATE文が表示できているか', function(done) {
      updateTable.conditions = [
        'id <= 2'
      ];
      updateTable.order = {
        id: true
      };
      actual = createSql.update(updateTable);
      except = 'UPDATE students SET name = \'Jon\' WHERE (id <= 2) ORDER BY id ASC';
      assert.equal(actual, except);
      done();
    });
  });
  describe('SELECT文を生成', function() {
    var selectTable;
    var except;
    var actual;
    beforeEach(function(done) {
      except = '';
      actual = '';
      selectTable = {
        'table': 'students',
        'field': [
          'name',
          'class'
        ],
        distinct: false
      };
      done();
    });
    it('条件がないSELECT文が表示できているか', function(done) {
      actual = createSql.select(selectTable);
      except = 'SELECT name, class FROM students';
      assert.equal(actual, except);
      done();
    });
    it('条件があるSELECT文が表示できているか', function(done) {
      selectTable.conditions = [
        'id <= 2'
      ];
      selectTable.order = {
        id: true
      };
      selectTable.distinct = true;
      actual = createSql.select(selectTable);
      except = 'SELECT DISTINCT name, class FROM students WHERE (id <= 2) ORDER BY id ASC';
      assert.equal(actual, except);
      done();
    });
  });
});
