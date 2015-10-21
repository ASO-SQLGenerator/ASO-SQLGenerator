//	.dragがドラッグされている際の動き
$(function() {
    $('.selecttable').draggable({
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('selecttable');
        },
        revert : 'invalid',
    });

    $('.selectall').draggable({
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('selectall');
        },
        revert : 'invalid',
    });

    $('.selectcondition').draggable({
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('selectcondition');
        },
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
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('dragsdrop');
        },
        revert : 'invalid',
    });

    $('.sspace').droppable({
        accept: '.sdrop',
        drop: function(ev, ui) {
            // ドロップされたDraggable要素を追加
            /* $('.cspace').append('<div class="drop" name="drop_parts">'); */
            ui.draggable.clone().appendTo(this);
            $(document).ready(function(){

                $('.sdrop').droppable({drop: function(ev, ui) {
                        // ドロップされたDraggable要素を追加
                        ui.draggable.clone().appendTo(this).removeClass('drag');
                    },
                });
            });
        },
    });


    //円内に配置されたパーツの並び替え

    $('.sdrop').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.drag');
            //ここでドロップ後のdrag要素に対して処理を行う。
            $(item).removeClass('drag');
        }
    });

    //組み立てスペースに配置されたパーツの並び替え

    $('.sspace').sortable({
        cursor : 'move',
        receive : function(event, ui) {
            //var item = $(this).find('.sspace');
            //ここでドロップ後のdrop要素に対して処理を行う。
            //$(item).removeClass('drop');
        }
    });
});






	