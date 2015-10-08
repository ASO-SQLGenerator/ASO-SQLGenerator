	//	.dragがドラッグされている際の動き
	$(function() {
    $('.drag').draggable({
        connectToSortable : '.cdrop',
      //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('drag');
        },
        revert : 'invalid',
    });
	
		$('.cdrop').droppable({
	  accept: '.drag',
	  drop: function(ev, ui) {
        // ドロップされたDraggable要素を追加
		
        ui.draggable.clone().appendTo(this);
    },
});

//});

	//	.dropがドラッグされている際の動き

    $('.cdrop').draggable({
        connectToSortable : '.cspace',
      //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('dragcdrop');
        },
        revert : 'invalid',
    });
	
	$('.cspace').droppable({
	  accept: '.cdrop',
	  drop: function(ev, ui) {
        // ドロップされたDraggable要素を追加
		/* $('.cspace').append('<div class="drop" name="drop_parts">'); */
		ui.draggable.clone().appendTo(this);
		$(document).ready(function(){
		 $('.drag').draggable({
        connectToSortable : '.cdrop',
      //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('drag');
        },
        revert : 'invalid',
    });
	
		$('.cdrop').droppable({
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

		$('.cdrop').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
             var item = $(this).find('.drag');
            //ここでドロップ後のdrag要素に対して処理を行う。
            $(item).removeClass('drag');
        }
    });
	
	//組み立てスペースに配置されたパーツの並び替え

		$('.cspace').sortable({
        revert : true,
        cursor : 'move',
        receive : function(event, ui) {
             var item = $(this).find('.cspace');
            //ここでドロップ後のdrop要素に対して処理を行う。
            //$(item).removeClass('drop');
        }
    });
});


	


	
	