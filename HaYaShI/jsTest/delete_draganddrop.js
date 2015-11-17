//	.drag���h���b�O����Ă���ۂ̓���
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
            // �h���b�v���ꂽDraggable�v�f��ǉ�

            ui.draggable.clone().appendTo(this);
        },
    });

//});

    //	.drop���h���b�O����Ă���ۂ̓���

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
            // �h���b�v���ꂽDraggable�v�f��ǉ�
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
                        // �h���b�v���ꂽDraggable�v�f��ǉ�

                        ui.draggable.clone().appendTo(this).removeClass('ddrag');
                    },
                });
            });
        },
    });


    //�~���ɔz�u���ꂽ�p�[�c�̕��ёւ�

    $('.ddrop').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.ddrag');
            //�����Ńh���b�v���drag�v�f�ɑ΂��ď������s���B
            $(item).removeClass('ddrag');
        }
    });

    //�g�ݗ��ăX�y�[�X�ɔz�u���ꂽ�p�[�c�̕��ёւ�

    $('.dspace').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.dspace');
            //�����Ńh���b�v���drop�v�f�ɑ΂��ď������s���B
            //$(item).removeClass('drop');
        }
    });
});






	