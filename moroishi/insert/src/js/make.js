for(var i=0; i<localStorage.length; i++) {
var index = localStorage.key(i);
var table = localStorage.getItem(index);
var tabledata = JSON.parse(table);


var a,b,c;
var test = [];
var test2 = [[]];
var d = 0;
for(a=0; b=tabledata.data[a++];) {
var low = [];
		var e = 0;
		for(c in b) {
			test[e] = b[c];
			e++;
		}
		for(var z=0; z<test.length; z++) {
				low[z] = test[z];
		}
		test2[d] = low;
		alert(test2);
		d++;
}		

}
