//	.dragがドラッグされている際の動き
$(function() {
    $('.ddrag').draggable({
        connectToSortable : '.ddrop',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('ddrag');
        },
        revert : 'invalid',
    });

    $('.ddrop').droppable({
        accept: '.ddrag',
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
                $('.ddrag').draggable({
                    connectToSortable : '.ddrop',
                    //helper: 'clone',
                    helper : function() {
                        return $(this).clone().addClass('ddrag').removeAttr('deletecondition');
                    },
                    revert : 'invalid',
                });

                $('.ddrop').droppable({
                    accept: '.ddrag',
                    drop: function(ev, ui) {
                        // ドロップされたDraggable要素を追加

                        ui.draggable.clone().appendTo(this).removeClass('ddrag');
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
            var item = $(this).find('.ddrag');
            //ここでドロップ後のdrag要素に対して処理を行う。
            $(item).removeClass('ddrag');
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






	