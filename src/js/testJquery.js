/**
 * Created by ryu on 15/09/18.
 */
var $ = require('jquery');
var squel = require('squel');
var createSql = require('./createSQL.js')


module.exports = function()
{
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

  $(document).ready(function(){
    var query = createSql.create(data);
    $('.inner').append("Hello");
    $('.query').append(query);
  });
};