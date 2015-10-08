//	.drag���h���b�O����Ă���ۂ̓���
$(function() {
    $('.drag').draggable({
        connectToSortable : '.sdrop',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('drag');
        },
        revert : 'invalid',
    });

    $('.sdrop').droppable({
        accept: '.drag',
        drop: function(ev, ui) {
            // �h���b�v���ꂽDraggable�v�f��ǉ�

            ui.draggable.clone().appendTo(this);
        },
    });

//});

    //	.drop���h���b�O����Ă���ۂ̓���

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
            // �h���b�v���ꂽDraggable�v�f��ǉ�
            /* $('.cspace').append('<div class="drop" name="drop_parts">'); */
            ui.draggable.clone().appendTo(this);
            $(document).ready(function(){
                $('.drag').draggable({
                    connectToSortable : '.sdrop',
                    //helper: 'clone',
                    helper : function() {
                        return $(this).clone().addClass('drag');
                    },
                    revert : 'invalid',
                });

                $('.sdrop').droppable({
                    accept: '.drag',
                    drop: function(ev, ui) {
                        // �h���b�v���ꂽDraggable�v�f��ǉ�

                        ui.draggable.clone().appendTo(this).removeClass('drag');
                    },
                });
            });
        },
    });


    //�~���ɔz�u���ꂽ�p�[�c�̕��ёւ�

    $('.sdrop').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.drag');
            //�����Ńh���b�v���drag�v�f�ɑ΂��ď������s���B
            $(item).removeClass('drag');
        }
    });

    //�g�ݗ��ăX�y�[�X�ɔz�u���ꂽ�p�[�c�̕��ёւ�

    $('.sspace').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.sspace');
            //�����Ńh���b�v���drop�v�f�ɑ΂��ď������s���B
            //$(item).removeClass('drop');
        }
    });
});






	