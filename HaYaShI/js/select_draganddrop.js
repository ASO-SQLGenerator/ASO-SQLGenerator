//	.drag���h���b�O����Ă���ۂ̓���
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
    });

//});

    //	.drop���h���b�O����Ă���ۂ̓���

    $('.sdrop').draggable({
        connectToSortable : '.sspace',
        helper:'clone',
        //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('dragsdrop');
        },
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
            	greedy: true,
                accept:'.selecttable , .selectall , .selectcondition , .cloned_selecttable',
                drop: function(event, ui) {
                    if($('#find_selecttable').hasClass('selecttable')){ //�I���W�i�����h���b�v�����ꍇ�̂݃N���[���쐬
                        $(this).append($(ui.draggable).clone());
                        $('.selecttable').removeClass('selecttable').addClass('cloned_selecttable'); //�N���[���p�ɃN���X�Ďw��
                        $('.cloned_selecttable').draggable({
                        	connectToSortable:'.sdrop',
                        	revert:'.invalid',
                        });
                    }else{

                    }
                }
            })
        }
    });


    //�~���ɔz�u���ꂽ�p�[�c�̕��ёւ�

	$('.sspace').sortable({
		revert: true
	});

	$('.sdrop').sortable({
		revert: true
	});
});






	