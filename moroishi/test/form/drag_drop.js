//.dragがドラッグされている際の動き
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

		//.dropがドラッグされている際の動き

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
        		
				ui.draggable.clone().appendTo(this).attr('name', drop_name);
				drop_name = drop_name + 10;
				$(document).ready(function(){
		 			$('.drag').draggable({
        				connectToSortable : '.drop',
        				helper : function() {
            				return $(this).clone().addClass('drag');
        				},
        				revert : 'invalid',
    				});

					$('.drop').droppable({
		  				accept: '.drag',
	  					drop: function(ev, ui) {
        					//ドロップされたDraggable要素を追加
        					ui.draggable.clone().appendTo(this).removeClass('drag');
        					
							var data1 = $(this).attr('name');
							var data = Number(data1);
							
        					
        					$("*[name=" + data + "] > div > *[name=culum]").attr('name',data + 1);
        					$("*[name=" + data + "] > div > *[name=type]").attr('name',data + 2);
        					$("*[name=" + data + "] > div > *[name=num]").attr('name',data + 3);
        					var limit_name = limit_count[data] + data;
        					$("*[name=" + data + "] > div > *[name=limit]").attr('name',limit_name);
        					if($("*[name="+limit_name+"]").length > 0){
								limit_count[data]++;
							}
    					},
					});
				});
    		},
		});
	});