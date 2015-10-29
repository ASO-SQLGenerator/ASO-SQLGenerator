$(function() {

var i = 0;

    $('.selecttable').draggable({
    	connectToSortable : '.sdrop',
        helper:'clone',
        revert : 'invalid',
    });

    $('.selectall').draggable({
    	connectToSortable : '.sdrop',
        helper:'clone',
        revert : 'invalid',
    });

    $('.selectcondition').draggable({
        connectToSortable : '.sdrop',
        helper:'clone',
        revert : 'invalid',
    });
    



    $('.sdrop').draggable({
        connectToSortable : '.sspace',
        helper:'clone',
        helper : function() {
            return $(this).clone().addClass('dragsdrop');
        },
        revert : 'invalid',
    });

    $('.sspace').droppable({
        accpet:'.sdrop',
        greedy: true,
        drop: function( event, ui ) {
        $('.sdrop').sortable({
		connectWith: '.sdrop'
	});

            $('.sdrop').droppable({
            	greedy: true,
                accept:'.selecttable , .selectall , .selectcondition',
                drop: function(event, ui) {


                    if($('#find_selecttable').hasClass('selecttable')){
                    	$('#find_selecttable').removeClass('cloned_selecttable' + (i-1)).addClass('cloned_selecttable' + i);
		    	i++;
		    }
                }
            })
        }
    });


    //円内に配置されたパーツの並び替え

	$('.sspace , .sdrop').sortable({
		revert : true
	});


//	                $(this).append($(ui.draggable).clone());  クローン作成


});






	