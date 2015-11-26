var updateset = $('.updateset');
var uspace = $('.uspace');
var updatecondition = $('.updatecondition');
var udrop = $('.udrop');

updateset.draggable({
  cursor: 'move',
  revert: 'invalid',
  connectToSortable: '.uspace',
  helper: 'clone'
});

uspace.droppable({
  accept: '.updateset, .updatecondition',
  drop: function(ev, ui) {
    var cloneClass;
    cloneClass = ui.draggable.hasClass('updateset') ? 'cloneSet' : 'cloneCondition';
    ui.draggable.clone().appendTo(this).addClass(cloneClass);
  }});

updatecondition.draggable({
  connectToSortable: '.udrop',
  helper: 'clone',
  revert: 'invalid'
});
