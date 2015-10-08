//	.dragがドラッグされている際の動き
$(function() {
    $('.drag').draggable({
        connectToSortable : '.ddrop',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('drag');
        },
        revert : 'invalid',
    });

    $('.ddrop').droppable({
        accept: '.drag',
        drop: function(ev, ui) {
            // ドロップされたDraggable要素を追加

            ui.draggable.clone().appendTo(this);
        },
    });

//});

    //	.dropがドラッグされている際の動き

    $('.ddrop').draggable({
        connectToSortable : '.dspace',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('dragddrop');
        },
        revert : 'invalid',
    });

    $('.dspace').droppable({
        accept: '.ddrop',
        drop: function(ev, ui) {
            // ドロップされたDraggable要素を追加
            /* $('.cspace').append('<div class="drop" name="drop_parts">'); */
            ui.draggable.clone().appendTo(this);
            $(document).ready(function(){
                $('.drag').draggable({
                    connectToSortable : '.ddrop',
                    //helper: 'clone',
                    helper : function() {
                        return $(this).clone().addClass('drag');
                    },
                    revert : 'invalid',
                });

                $('.ddrop').droppable({
                    accept: '.drag',
                    drop: function(ev, ui) {
                        // ドロップされたDraggable要素を追加

                        ui.draggable.clone().appendTo(this).removeClass('drag');
                    },
                });
            });
        },
    });


    //円内に配置されたパーツの並び替え

    $('.ddrop').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.drag');
            //ここでドロップ後のdrag要素に対して処理を行う。
            $(item).removeClass('drag');
        }
    });

    //組み立てスペースに配置されたパーツの並び替え

    $('.dspace').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.dspace');
            //ここでドロップ後のdrop要素に対して処理を行う。
            //$(item).removeClass('drop');
        }
    });
});






	