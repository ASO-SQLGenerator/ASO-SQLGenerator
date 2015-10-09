	//	.dragがドラッグされている際の動き
	$(function() {
    $('.cdrag').draggable({
        connectToSortable : '.cdrop',
      //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('cdrag');
        },
        revert : 'invalid',
    });
	
		$('.cdrop').droppable({
	  accept: '.cdrag',
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
		 $('.cdrag').draggable({
        connectToSortable : '.cdrop',
      //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('cdrag');
        },
        revert : 'invalid',
    });
	
		$('.cdrop').droppable({
	  accept: '.cdrag',
	  drop: function(ev, ui) {
        // ドロップされたDraggable要素を追加
		
        ui.draggable.clone().appendTo(this).removeClass('cdrag');
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
             var item = $(this).find('.cdrag');
            //ここでドロップ後のdrag要素に対して処理を行う。
            $(item).removeClass('cdrag');
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


	


	
	