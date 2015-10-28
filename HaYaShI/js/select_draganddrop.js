$(function() {

var i = 0;

    $('.selecttable').draggable({
    	connectToSortable : '.sdrop', //ドロップ先にクローン作成
        helper:'clone',
        revert : 'invalid',
    });

    $('.selectall').draggable({
    	connectToSortable : '.sdrop',
        helper:'clone',
        revert : 'invalid',
    });

    $('.selectcondition').draggable({
        connectToSortable : '.sdrop',
        helper:'clone',
        revert : 'invalid',
    });
    
    $('.sdrop').droppable({
    });



    $('.sdrop').draggable({
        connectToSortable : '.sspace',
        helper:'clone',
        helper : function() {
            return $(this).clone().addClass('dragsdrop');
        },
        revert : 'invalid',
    });

    $('.sspace').droppable({
        accpet:'.sdrop',
        greedy: true,
        drop: function( event, ui ) {
        $('.sdrop').sortable({
        	
	});
            
            $('.sdrop').droppable({
            	greedy: true,
                accept:'.selecttable , .selectall , .selectcondition',
                drop: function(event, ui) {
                    
                    $('#find_selecttable').removeClass('cloned_selecttable' + i);
                    $(function(){
    			$('#find_selecttable').each(function(){
        			$(this).addClass('cloned_selecttable' + (i+1));
        			i++;
   			});
		    });
                    
                }
            })
        }
    });


    //円内に配置されたパーツの並び替え

	$('.sspace').sortable({
		revert : true
	});


//	                $(this).append($(ui.draggable).clone());  クローン作成


});






	