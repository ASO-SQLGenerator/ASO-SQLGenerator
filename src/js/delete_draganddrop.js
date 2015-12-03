$(function() {
    $('#find_dtable').draggable({
        connectToSortable : '.ddrop_sortable',
        helper : 'clone',
        revert : 'invalid',
    });

    $('#find_deletecondition').draggable({
        connectToSortable : '.ddrop_sortable',
        helper : 'clone',
        revert : 'invalid',
    });



    $('.ddrop').draggable({
        connectToSortable : '.dspace',
        helper: 'clone',
        revert : 'invalid',
    });

    $('.removeZone').droppable({
        drop:function(event,ui){
            if(ui.draggable.hasClass('used')) {
                ui.draggable.parents('[class^=ddrop]').find('div').addClass('ddrop_sortable');
                ui.draggable.remove();
            }
        }
    })

    $('.dspace').sortable({
        revert:true,
        stop: function(ev, ui) {

            var numof_deleteparam = 0;

            if (!ui.item.hasClass('checked')) {
                ui.item.addClass('checked').attr({name: drop_name, id: "a" + drop_name});
                $("*[name=" + drop_name + "] > *[name=tablename]").attr('name', "a" + (drop_name + 1));


                drop_name = drop_name + 10;
            }

            if(ui.item.hasClass('usedcheck')){
                ui.item.removeClass('usedcheck').addClass('used');
            }

            $('.ddrop_sortable').sortable({
                //connectWith: '.cdrop_sortable',

                stop: function (event, ui) {

                    numof_deleteparam = $(this).parents('[class^=ddrop]').attr('name');
                    //alert(numof_deleteparam);
                    $("*[name=" + numof_deleteparam + "] > div > div > *[name=deletecolum]").attr('name', "a" + (+numof_deleteparam + 2));
                    $("*[name=" + numof_deleteparam + "] > div > div > *[name=dcons]").attr('name', "a" + (+numof_deleteparam + 3));
                    var limit_name = "a" + (limit_count[+numof_deleteparam] + +numof_deleteparam);
                    $("*[name=" + numof_deleteparam + "] > div > div > *[name=deletecolum2]").attr('name', limit_name);
                    if ($("*[name=" + limit_name + "]").length > 0) {
                        //limit_count[+numof_deleteparam]++;
                    }

                    if(ui.item.hasClass('usedcheck')){
                        ui.item.removeClass('usedcheck').addClass('used');
                        $(this).removeClass('ddrop_sortable').addClass('disabled');
                    }
                }
            })
        },
    });
});






	