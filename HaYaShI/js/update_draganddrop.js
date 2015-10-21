//	.drag���h���b�O����Ă���ۂ̓���
$(function() {
    //updateset�p�[�c�֓���̊���
    $('.updateset').draggable({
        connectToSortable : '.udrop',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('updateset');
        },
        revert : 'invalid',
    });

    //updatecondtion�p�[�c�֓���̊���
    $('.updatecondition').draggable({
        connectToSortable : '.udrop',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('updatecondition');
        },
        revert : 'invalid',
    });

    $('.udrop').droppable({ drop: function(ev, ui) {
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
                $('.updateset').draggable({
                    connectToSortable : '.udrop',
                    //helper: 'clone',
                    helper : function() {
                        return $(this).clone().addClass('updateset');
                    },
                    revert : 'invalid',
                });

                $('.udrop').droppable({drop: function(ev, ui) {
                    // �h���b�v���ꂽDraggable�v�f��ǉ�
                    ui.draggable.clone().appendTo(this).removeClass("updateset updatecondition");
                    }
                });



            });
        },
    });


    //�~���ɔz�u���ꂽ�p�[�c�̕��ёւ�

    $('.udrop').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
            var item = $(this).find('.udrag');
            //�����Ńh���b�v���drag�v�f�ɑ΂��ď������s���B
            $(item).removeClass('udrag');
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






