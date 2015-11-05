	$(function() {
    $('#find_columname').draggable({
        connectToSortable : '.cdrop',
        helper:'clone',
        revert : 'invalid',
    });

        $('#find_num').draggable({
            connectToSortable : '.cdrop',
            helper:'clone',
            revert : 'invalid',
        });

        $('#find_limit').draggable({
            connectToSortable : '.cdrop',
            helper:'clone',
            revert : 'invalid',
        });

        $('.cdropHead').draggable({
            disabled:true
        });







    $('.cdrop').draggable({
        connectToSortable : '.cspace',
        helper:'clone',
        helper : function() {
            return $(this).clone().addClass('dragcdrop');
        },
        revert : 'invalid',
    });
	
	$('.cspace').droppable({
	  accept: '.cdrop',
	  drop: function(ev, ui) {
          $('.cdrop').sortable({
              connectWith: '.cdrop',
          });

          $('.cdrop').droppable({
              greedy: true,
              accept: '',
              drop: function (event, ui) {
              }
          })
      }
    });
	

	
		//円内に配置されたパーツの並び替え

		$('.cdrop').sortable({
        cursor : 'move',
        receive : function(event, ui) {
             var item = $(this).find('.cdrag');
            $(item).removeClass('cdrag');
        }
    });
	
	//組み立てスペースに配置されたパーツの並び替え

		$('.cspace').sortable({
        //revert : true,
        cursor : 'move',
        receive : function(event, ui) {
             //$(this).addClass('reSize');
             //var item = $(this).find('.cspace');
            //ここでドロップ後のdrop要素に対して処理を行う。
            //$(item).removeClass('drop');
        }
        });
});


	


	
	