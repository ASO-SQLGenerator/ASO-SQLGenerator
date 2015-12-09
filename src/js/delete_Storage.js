
$(function() {
    window.tabledelete = function tabledelete() {

        var delete_stock = [];
        var stock_count = 0;
        var delete_count = 0;

        var clearAll_flag = 0;


        var dget = document.getElementById('cdspace_parts');
        var delete_counter = dget.getElementsByClassName('ddrop checked').length;



        for(+delete_count; +delete_count < +delete_counter; +delete_count++) {
            console.log(delete_counter);
            console.log(delete_count);


            var ui_tableitem = $('.dspace').children('div:eq(' + delete_count + ')');
            var delete_number = ui_tableitem.attr('name');

            var tablename = document.getElementsByName('a' + (+delete_number + 1))[0].value;

            var deletecondtion1;
            var deletecondtion2;
            var deletecondtion3;
            if ($("*[name=" + delete_number + "] > div > div").length) {
                console.log('find');
                deletecondition1 = document.getElementsByName('a' + (+delete_number + 2))[0].value;
                deletecondition2 = document.getElementsByName('a' + (+delete_number + 3))[0].value;
                deletecondition3 = document.getElementsByName('a' + (+delete_number + 4))[0].value;
                console.log(deletecondition1.toString());
                console.log(deletecondition2.toString());
                console.log(deletecondition3.toString());
                
                var k1 = deletecondition1.toString();
                var k2 = deletecondition3.toString();
                
                
                var tation ='';
                     if (deletecondition2 == "equal") {
                        tation = "=";
                    } else if (deletecondition2 == "dainari") {
                        tation = ">";
                    } else if (deletecondition2 == "syounari") {
                        tation = "<";
                    } else if (deletecondition2 == "dainari equal") {
                        tation = ">=";
                    } else if (deletecondition2 == "syounari equal") {
                        tation = "<=";
                    }
                
                var sql ='';
                sql = "DELETE FROM "+ tablename + " WHERE " + k1 + " " + tation + " " + k2 + ";";
                
            } else {
                console.log('undefind');
                clearAll_flag = 1;
                
                var sql ='';
                sql = "DELETE FROM " + tablename + ";";
                
            }


            var countKey = 0; //cannot move
            for (countKey; localStorage.key(countKey); countKey++) {
                console.log(localStorage.key(countKey));
                var getkeys = localStorage.key(countKey);


                var delete_storage = JSON.parse(localStorage.getItem(getkeys));
                console.log(delete_storage.table);


                if (delete_storage.table == tablename) {

                    if (clearAll_flag == 1) {
                        clearAll();
                    } else if (deletecondition2 == "equal") {
                        equal();
                    } else if (deletecondition2 == "dainari") {
                        dainari();
                    } else if (deletecondition2 == "syounari") {
                        syounari();
                    } else if (deletecondition2 == "dainari equal") {
                        dainari_equal();
                    } else if (deletecondition2 == "syounari equal") {
                        syounari_equal();
                    }


                    for (var z in delete_stock) {
                        for (var g in delete_storage.data) {
                            if (delete_storage.data[g] == delete_stock[z]) {
                                delete_storage.data.splice(g, 1);
                                console.log('delete finish');
                            }
                        }
                    }
                    console.log(delete_stock[0]);
                    console.log(delete_stock[1]);
                    localStorage.setItem(localStorage.key(countKey), JSON.stringify(delete_storage));
                }
                  
                console.log(sql);

                function clearAll() {
                    for (var v in delete_storage.data) {
                    }
                    delete_storage.data.splice(0, v + 1);
                    console.log("start action clearAll");
                    clearAll_flag = 0;
                }

                function equal() {
                    console.log("start action equal");
                    for (var j in delete_storage.data) {
                        for (var i in delete_storage.data[j]) {
                            if (i == deletecondition1 && delete_storage.data[j][i] == deletecondition3) {
                                console.log("match this columns >>> loaclStorage : key = " + localStorage.key(countKey) + " >>> data >>> " + " Line >>> " + j + " >>> " + i + " = " + delete_storage.data[j][i]);
                                delete_stock[stock_count] = delete_storage.data[j];
                                stock_count++;
                            }
                        }
                    }
                }

                function dainari() {
                    console.log("start action dainari");
                    for (var j in delete_storage.data) {
                        for (var i in delete_storage.data[j]) {
                            if (i == deletecondition1) {
                                if (+delete_storage.data[j][i] > deletecondition3) {
                                    console.log("match this columns >>> loaclStorage : key = " + localStorage.key(countKey) + " >>> data >>> " + " Line >>> " + j + " >>> " + i + " = " + delete_storage.data[j][i]);
                                    delete_stock[stock_count] = delete_storage.data[j];
                                    stock_count++;
                                }
                            }
                        }
                    }
                }

                function syounari() {
                    console.log("start action syounari");
                    for (var j in delete_storage.data) {
                        for (var i in delete_storage.data[j]) {
                            if (i == deletecondition1) {
                                if (+delete_storage.data[j][i] < deletecondition3) {

                                    console.log("match this columns >>> loaclStorage : key = " + localStorage.key(countKey) + " >>> data >>> " + " Line >>> " + j + " >>> " + i + " = " + delete_storage.data[j][i]);
                                    delete_stock[stock_count] = delete_storage.data[j];
                                    stock_count++;
                                }
                            }
                        }
                    }
                }

                function dainari_equal() {
                    console.log("start action dainari equal");
                    for (var j in delete_storage.data) {
                        for (var i in delete_storage.data[j]) {
                            if (i == deletecondition1) {
                                if (+delete_storage.data[j][i] >= deletecondition3) {
                                    console.log("match this columns >>> loaclStorage : key = " + localStorage.key(countKey) + " >>> data >>> " + " Line >>> " + j + " >>> " + i + " = " + delete_storage.data[j][i]);
                                    delete_stock[stock_count] = delete_storage.data[j];
                                    stock_count++;
                                }
                            }
                        }
                    }
                }

                function syounari_equal() {
                    console.log("start action syounari equal");
                    for (var j in delete_storage.data) {
                        console.log(j);
                        for (var i in delete_storage.data[j]) {
                            if (i == deletecondition1) {
                                if (+delete_storage.data[j][i] <= deletecondition3) {
                                    console.log("match this columns >>> loaclStorage : key = " + localStorage.key(countKey) + " >>> data >>> " + " Line >>> " + j + " >>> " + i + " = " + delete_storage.data[j][i]);
                                    delete_stock[stock_count] = delete_storage.data[j];
                                    stock_count++;
                                }
                            }
                        }
                    }
                }
            }
        }

    }
});