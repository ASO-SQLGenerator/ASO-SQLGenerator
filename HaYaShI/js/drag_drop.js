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

          ui.draggable.appendTo(this).attr({name:drop_name,id:"a"+ drop_name});
          drop_name = drop_name + 10;

          $('.cdrop').droppable({
              greedy: true,
              accept: '',
              drop: function (event, ui) {
                  var data1 = $(this).attr('name');
                  var data = Number(data1);


                  $("*[name=" + data + "] > div > *[name=culum]").attr('name', "a" + (data + 1));
                  $("*[name=" + data + "] > div > *[name=type]").attr('name', "a" + (data + 2));
                  $("*[name=" + data + "] > div > *[name=num]").attr('name', "a" + (data + 3));
                  var limit_name = "a" + (limit_count[data] + data);
                  $("*[name=" + data + "] > div > *[name=limit]").attr('name', limit_name);
                  if ($("*[name=" + limit_name + "]").length > 0) {
                      limit_count[data]++;
                  }
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


	


	
	