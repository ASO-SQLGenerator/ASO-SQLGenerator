$(function() {
window.tableUpdate0 = function tableUpdate0(edit) {
		var updateTable0 = {};
		var test = getData();
		var editvalues = {};
		for(var i=0; i<edit.length; i++) {
				editvalues[test[1][0][edit[i][0][1]]] = edit[i][0][3];
				alert(test[1][0][edit[i][0][1]]);
				alert(edit[i][0][3]);
		}
		var con = [];
		con = test[1][0][0] +" == \'" + test[0][0][edit[0][0][0]][0] +"\'";
		console.log(editvalues);
		var table = localStorage.getItem(0);
		var tabledata = JSON.parse(table);
		updateTable0['table'] = tabledata.table;
		updateTable0['values'] = editvalues;
		updateTable0['conditions'] = con; 
		console.log(updateTable0);
}
window.tableUpdate1 = function tableUpdate1(edit) {
}
window.tableUpdate2 = function tableUpdate2(edit) {
}
});
