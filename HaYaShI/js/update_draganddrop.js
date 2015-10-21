//	.dragがドラッグされている際の動き
$(function() {
    //updatesetパーツへ動作の割当
    $('.updateset').draggable({
        connectToSortable : '.udrop',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('updateset');
        },
        revert : 'invalid',
    });

    //updatecondtionパーツへ動作の割当
    $('.updatecondition').draggable({
        connectToSortable : '.udrop',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('updatecondition');
        },
        revert : 'invalid',
    });

    $('.udrop').droppable({ drop: function(ev, ui) {
            // ドロップされたDraggable要素を追加
            ui.draggable.clone().appendTo(this);
        },
    });

//});

    //	.dropがドラッグされている際の動き

    $('.udrop').draggable({
        connectToSortable : '.uspace',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('dragudrop');
        },
        revert : 'invalid',
    });

    $('.uspace').droppable({
        accept: '.udrop',
        drop: function(ev, ui) {
            // ドロップされたDraggable要素を追加
            /* $('.cspace').append('<div class="drop" name="drop_parts">'); */
            ui.draggable.clone().appendTo(this);
            $(document).ready(function(){
                $('.updateset').draggable({
                    connectToSortable : '.udrop',
                    //helper: 'clone',
                    helper : function() {
                        return $(this).clone().addClass('updateset');
                    },
                    revert : 'invalid',
                });

                $('.udrop').droppable({drop: function(ev, ui) {
                    // ドロップされたDraggable要素を追加
                    ui.draggable.clone().appendTo(this).removeClass("updateset updatecondition");
                    }
                });



            });
        },
    });


    //円内に配置されたパーツの並び替え

    $('.udrop').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.udrag');
            //ここでドロップ後のdrag要素に対して処理を行う。
            $(item).removeClass('udrag');
        }
    });

    //組み立てスペースに配置されたパーツの並び替え

    $('.uspace').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.uspace');
            //ここでドロップ後のdrop要素に対して処理を行う。
            //$(item).removeClass('drop');
        }
    });
});






