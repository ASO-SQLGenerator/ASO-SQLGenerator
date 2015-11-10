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
    it('create文のテーブルか表示できているか', function() {
      var actual = createSql.create(table);
      assert.equal(actual, 'CREATE TABLE Aテーブル (a_id int(4), b string(16) NOT NULL, c string) PRIMARY KEY(a_id, b) FOREIGN KEY (b) REFERENCES bテーブル(b)');
    });
    it('主キー,外部キーがないテーブルが表示されるか', function() {
      var actual = createSql.create(table2);
      assert.equal(actual, 'CREATE TABLE Aテーブル (a_id int(4))');
    });
    it('主キーがあり、外部キーがないテーブルが表示されるか', function() {
      var actual = createSql.create(table3);
      assert.equal(actual, 'CREATE TABLE Aテーブル (a_id int(4)) PRIMARY KEY(a_id)');
    });
    it('主キーがなく、外部キーがあるテーブルが表示されるか', function() {
      var actual = createSql.create(table4);
      assert.equal(actual, 'CREATE TABLE Aテーブル (a_id int(4)) FOREIGN KEY (b) REFERENCES bテーブル(b)');
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
    it('INSERT文が表示できているか', function() {
      actual = createSql.insert(insertTable);
      except = 'INSERT INTO Aテーブル (id, name) VALUES (1, \'aaa\')';
      assert.equal(actual, except);
    });

    it('複数の値があるINSERT文が表示できているか', function() {
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
    it('条件がないDELETE文が表示できているか', function() {
      actual = createSql.delete(deleteTable);
      except = 'DELETE FROM students';
      assert.equal(actual, except);
    });
    it('条件があるDELETE文が表示できているか', function() {
      deleteTable.conditions = [
        '\'id\' > 5',
        '\'id\' < 10'
      ];
      actual = createSql.delete(deleteTable);
      except = 'DELETE FROM students WHERE (\'id\' > 5) AND (\'id\' < 10)';
      assert.equal(actual, except);
    });
  });
});
