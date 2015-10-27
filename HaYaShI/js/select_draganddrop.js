//	.dragがドラッグされている際の動き
$(function() {
    $('.selecttable').draggable({
        helper:'clone',
        revert : 'invalid',
    });

    $('.selectall').draggable({
        helper:'clone',
        revert : 'invalid',
    });

    $('.selectcondition').draggable({
        helper:'clone',
        revert : 'invalid',
    });

    $('.sdrop').droppable({
        accept: '.zenbudame',
    });

//});

    //	.dropがドラッグされている際の動き

    $('.sdrop').draggable({
        connectToSortable : '.sspace',
        helper:'clone',
        //helper: 'clone',
        //helper : function() {
            //return $(this).clone().addClass('dragsdrop');
        //},
        revert : 'invalid',
    });

    $('.sspace').droppable({
        accpet:'.sdrop',
        greedy: true,
        drop: function( event, ui ) {
//            $('.selecttable').draggable({
//                connectToSortable:'.sdrop',
//                revert:'.invalid',
//            });

            $('.sdrop').droppable({
            	greedy: true,
                accept:'.selecttable , .selectall , .selectcondition',
		drop: function(event, ui) {
                	$(this).append($(ui.draggable).clone());
            	}
            })
        }
    });


    //円内に配置されたパーツの並び替え

    $('.sspace').sortable({
        revert: true
    });



});






	