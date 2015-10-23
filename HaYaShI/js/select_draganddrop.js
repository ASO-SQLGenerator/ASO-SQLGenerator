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
        drop: function(ev, ui) {
            // ドロップされたDraggable要素を追加
            ui.draggable.clone().appendTo(this);
        },
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
            $('.selecttable').draggable({
                connectToSortable:'.sdrop',
                revert:'.invalid',
            });

            $('.sdrop').droppable({
                accept:'.selecttable',
            })
        }
    });


    //円内に配置されたパーツの並び替え

    $('.sspace').sortable({
        revert: true
    });



});






	