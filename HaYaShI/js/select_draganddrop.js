//	.drag���h���b�O����Ă���ۂ̓���
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

                $('.sdrop').droppable({drop: function(ev, ui) {
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
        cursor : 'move',
        receive : function(event, ui) {
            //var item = $(this).find('.sspace');
            //�����Ńh���b�v���drop�v�f�ɑ΂��ď������s���B
            //$(item).removeClass('drop');
        }
    });
});






	