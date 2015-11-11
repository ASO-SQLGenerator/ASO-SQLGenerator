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

		$('.cspace').sortable({
            revert: true,
            cursor: 'move',
            stop: function (event, ui) {


                if (!ui.item.hasClass('checked')) {
                    ui.item.addClass('checked').attr({name: drop_name, id: "a" + drop_name});
                    $("*[name=" + drop_name + "] > *[name=culum]").attr('name', "a" + (drop_name + 1));

                    drop_name = drop_name + 10;
                } else {
                }

                        $('.cdrop_sortable').sortable({
                            connectWith: '.cdrop_sortable',

                            stop: function (event, ui) {

                                var data1 = $(this).attr('name');
                                var data = Number(data1);

                                $("*[name=" + data + "] > div > div > *[name=type]").attr('name', "a" + (data + 2));
                                $("*[name=" + data + "] > div > *[name=num]").attr('name', "a" + (data + 3));
                                var limit_name = "a" + (limit_count[data] + data);
                                $("*[name=" + data + "] > *[name=limit]").attr('name', limit_name);
                                if ($("*[name=" + limit_name + "]").length > 0) {
                                    limit_count[data]++;
                                }
                            }
                        })

            }
        })



});


	


	
	