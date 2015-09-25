/**
 * Created by ryu on 15/09/18.
 */
var $ = require('jquery');
var squel = require('squel');

module.exports = function()
{
  $(document).ready(function(){
    var query = squel.select().from("students").toString();
    $('.inner').append("Hello");
    $('.query').append(query);
  });
};