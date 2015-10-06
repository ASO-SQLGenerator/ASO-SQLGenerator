/**
 * Created by ryu on 15/09/18.
 */
var $ = require('jquery');
var squel = require('squel');
var createSql = require('./createSQL.js')

window.createSql = createSql;

module.exports = function()
{
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
    "constraint": [
      {
        "primary_key": [
          "a_id"
        ],
        "foreign_key": [
          {
            "col_name": "b",
            "table": "bテーブル",
            "parent_col": "b"
          }
        ]
      }
    ],
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

  $(document).ready(function(){
    var query = createSql.create(data);
    $('.query').append(query);
  });
};