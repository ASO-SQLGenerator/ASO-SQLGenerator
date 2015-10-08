//	.drag���h���b�O����Ă���ۂ̓���
$(function() {
    $('.drag').draggable({
        connectToSortable : '.udrop',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('drag');
        },
        revert : 'invalid',
    });

    $('.udrop').droppable({
        accept: '.drag',
        drop: function(ev, ui) {
            // �h���b�v���ꂽDraggable�v�f��ǉ�

            ui.draggable.clone().appendTo(this);
        },
    });

//});

    //	.drop���h���b�O����Ă���ۂ̓���

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
            // �h���b�v���ꂽDraggable�v�f��ǉ�
            /* $('.cspace').append('<div class="drop" name="drop_parts">'); */
            ui.draggable.clone().appendTo(this);
            $(document).ready(function(){
                $('.drag').draggable({
                    connectToSortable : '.udrop',
                    //helper: 'clone',
                    helper : function() {
                        return $(this).clone().addClass('drag');
                    },
                    revert : 'invalid',
                });

                $('.udrop').droppable({
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

    $('.udrop').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.drag');
            //�����Ńh���b�v���drag�v�f�ɑ΂��ď������s���B
            $(item).removeClass('drag');
        }
    });

    //�g�ݗ��ăX�y�[�X�ɔz�u���ꂽ�p�[�c�̕��ёւ�

    $('.uspace').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.uspace');
            //�����Ńh���b�v���drop�v�f�ɑ΂��ď������s���B
            //$(item).removeClass('drop');
        }
    });
});






