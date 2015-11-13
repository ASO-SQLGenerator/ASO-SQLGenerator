	$(function() {
    $('#find_columname').draggable({
        connectToSortable : '.cdrop_sortable',
        helper:'clone',
        revert : 'invalid',
    });

        $('#find_num').draggable({
            connectToSortable : '.cdrop_sortable',
            helper:'clone',
            revert : 'invalid',
        });

        $('#find_limit').draggable({
            connectToSortable : '.cdrop_sortable',
            helper:'clone',
            revert : 'invalid',
        });




    $('.cdrop').draggable({
        connectToSortable : '.cspace',
        helper:'clone',
        helper : function() {
            return $(this).clone().addClass('dragcdrop');
        },
        revert : 'invalid',
    });

        function getName(){
            var data = $('#a10').attr('name');
            parseInt(data);
            alert(data);
        }



		$('.cspace').sortable({
            revert: true,
            cursor: 'move',
            stop: function (event, ui) {

                var data1 = 0;

                if (!ui.item.hasClass('checked')) {
                    ui.item.addClass('checked').attr({name: drop_name, id: "a" + drop_name});
                    $("*[name=" + drop_name + "] > *[name=culum]").attr('name', "a" + (drop_name + 1));

                   drop_name = drop_name + 10;
                } else {}

                    data1 = ui.item.attr('name');
                    parseInt(data1);



                $('.cdrop_sortable').sortable({
                    //connectWith: '.cdrop_sortable',

                    stop: function (event, ui) {

                        data1 = ui.item.closest('div');
                        alert(data1);
                        $("*[name=" + data1 + "] > div > div > *[name=type]").attr('name', "a" + (+data1 + 2));
                        $("*[name=" + data1 + "] > div > div > *[name=num]").attr('name', "a" + (+data1 + 3));
                        var limit_name = "a" + (limit_count[+data1] + +data1);
                        $("*[name=" + data1 + "] > div > div > *[name=limit]").attr('name', limit_name);
                        if ($("*[name=" + limit_name + "]").length > 0) {
                            limit_count[+data1]++;
                        }
                    }
                })



            }
        })



});


	


	
	