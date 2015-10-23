	//	.dragがドラッグされている際の動き
	$(function() {
    $('.drag').draggable({
        connectToSortable : '.drop',
      //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('drag');
        },
        revert : 'invalid',
    });
	
		$('.drop').droppable({
	  accept: '.drag',
	  drop: function(ev, ui) {
        // ドロップされたDraggable要素を追加
		
        ui.draggable.clone().appendTo(this);
    },
});

//});

	//	.dropがドラッグされている際の動き

    $('.drop').draggable({
        connectToSortable : '.cspace',
      //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('drop');
        },
        revert : 'invalid',
    });
	
	$('.cspace').droppable({
	  accept: '.drop',
	  drop: function(ev, ui) {
        // ドロップされたDraggable要素を追加
		/* $('.cspace').append('<div class="drop" name="drop_parts">'); */
		ui.draggable.clone().appendTo(this);
		$(document).ready(function(){
		 $('.drag').draggable({
        connectToSortable : '.drop',
      //helper: 'clone',
        helper : function() {
            return $(this).clone().addClass('drag');
        },
        revert : 'invalid',
    });
	
		$('.drop').droppable({
	  accept: '.drag',
	  drop: function(ev, ui) {
        // ドロップされたDraggable要素を追加
		
        ui.draggable.clone().appendTo(this).removeClass('drag');
    },
});
});
    },
});

});

	


	
	