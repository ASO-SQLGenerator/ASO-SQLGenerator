$(function() {
window.tableUpdate0 = function tableUpdate0(edit) {
				
				var odata = JSON.parse(localStorage.getItem(0));
				
				var ucollen = odata.columns.length;
				var otname = odata.table;
				var ucol = odata.columns;
				var line = odata.data.length;
				
				var linenum;
				for(var j=0; j<ucollen; j++) {
				eval("var col"+ j + "='"+odata.columns[j].name+"'");
				}
				
				for(var a=0; a<ucollen; a++){
					eval("var edit" + a);
				}
				
				for(var k=0; k<edit.length; k++) {
				linenum = edit[k][0][1];
				eval("edit"+ linenum +"='"+ edit[k][0][3] + "'");
				}
				var col = [];
				
				if(edit[0][0][0] == 0){
				var udata1 ={};
				var map = odata.data[0];
				var test = [];
				for(key in map){
				test.push(map[key]);
				}
				for(var i=0; i<ucollen; i++){
					
					if(eval("edit" + i) == null){
					
					udata1[eval("col" + i)] = test[i];
					}else{
					
					udata1[eval("col" + i)]= eval("edit" + i);
					}
				}
				var udata2 =odata.data[1];
				var udata3 =odata.data[2];
				}else
				if(edit[0][0][0] == 1){
				var udata2 ={};
				var map = odata.data[1];
				var test = [];
				for(key in map){
				test.push(map[key]);
				}
				for(var i=0; i<ucollen; i++){
					
					if(eval("edit" + i) == null){
					
					udata2[eval("col" + i)] = test[i];
					}else{
					
					udata2[eval("col" + i)]= eval("edit" + i);
					}
				}
				var udata1 = odata.data[0];
				var udata3 = odata.data[2];
				}else
				if(edit[0][0][0] == 2){
				var udata3 ={};
				var map = odata.data[2];
				var test = [];
				for(key in map){
				test.push(map[key]);
				}
				for(var i=0; i<ucollen; i++){
					
					if(eval("edit" + i) == null){
					
					udata3[eval("col" + i)] = test[i];
					}else{
					
					udata3[eval("col" + i)]= eval("edit" + i);
					}
				}
				var udata1 = odata.data[0];
				var udata2 = odata.data[1];
				}	
				var table1 = {
						"table":otname,
						"columns":ucol,
						"data":[udata1,udata2,udata3]
						};
						var t1 = JSON.stringify(table1);
						console.log(t1);
						
				
				localStorage.setItem(0,t1);
				window.location.reload();
}				
window.tableUpdate1 = function tableUpdate1(edit) {
				var odata = JSON.parse(localStorage.getItem(1));
				
				var ucollen = odata.columns.length;
				var otname = odata.table;
				var ucol = odata.columns;
				
				var line = odata.data.length;
				
				var linenum;
				for(var j=0; j<ucollen; j++) {
				eval("var col"+ j + "='"+odata.columns[j].name+"'");
				}
				
				for(var a=0; a<ucollen; a++){
					eval("var edit" + a);
				}
				
				for(var k=0; k<edit.length; k++) {
				linenum = edit[k][0][1];
				eval("edit"+ linenum +"='"+ edit[k][0][3] + "'");
				}
				var col = [];
				
				if(edit[0][0][0] == 0){
				var udata1 ={};
				var map = odata.data[0];
				var test = [];
				for(key in map){
				test.push(map[key]);
				}
				for(var i=0; i<ucollen; i++){
					
					if(eval("edit" + i) == null){
					
					udata1[eval("col" + i)] = test[i];
					}else{
					
					udata1[eval("col" + i)]= eval("edit" + i);
					}
				}
				var udata2 =odata.data[1];
				var udata3 =odata.data[2];
				}else
				if(edit[0][0][0] == 1){
				var udata2 ={};
				var map = odata.data[1];
				var test = [];
				for(key in map){
				test.push(map[key]);
				}
				for(var i=0; i<ucollen; i++){
					
					if(eval("edit" + i) == null){
					
					udata2[eval("col" + i)] = test[i];
					}else{
					
					udata2[eval("col" + i)]= eval("edit" + i);
					}
				}
				var udata1 = odata.data[0];
				var udata3 = odata.data[2];
				}else
				if(edit[0][0][0] == 2){
				var udata3 ={};
				var map = odata.data[2];
				var test = [];
				for(key in map){
				test.push(map[key]);
				}
				for(var i=0; i<ucollen; i++){
					
					if(eval("edit" + i) == null){
					
					udata3[eval("col" + i)] = test[i];
					}else{
					
					udata3[eval("col" + i)]= eval("edit" + i);
					}
				}
				var udata1 = odata.data[0];
				var udata2 = odata.data[1];
				}	
				var table1 = {
						"table":otname,
						"columns":ucol,
						"data":[udata1,udata2,udata3]
						};
						var t1 = JSON.stringify(table1);
						console.log(t1);
				
				localStorage.setItem(1,t1);
}
window.tableUpdate2 = function tableUpdate2(edit) {
				var odata = JSON.parse(localStorage.getItem(2));
				
				var ucollen = odata.columns.length;
				var otname = odata.table;
				var ucol = odata.columns;
				
				var line = odata.data.length;
				
				var linenum;
				for(var j=0; j<ucollen; j++) {
				eval("var col"+ j + "='"+odata.columns[j].name+"'");
				}
				
				for(var a=0; a<ucollen; a++){
					eval("var edit" + a);
				}
				
				for(var k=0; k<edit.length; k++) {
				linenum = edit[k][0][1];
				eval("edit"+ linenum +"='"+ edit[k][0][3] + "'");
				}
				var col = [];
				
				if(edit[0][0][0] == 0){
				var udata1 ={};
				var map = odata.data[0];
				var test = [];
				for(key in map){
				test.push(map[key]);
				}
				for(var i=0; i<ucollen; i++){
					
					if(eval("edit" + i) == null){
					
					udata1[eval("col" + i)] = test[i];
					}else{
					
					udata1[eval("col" + i)]= eval("edit" + i);
					}
				}
				var udata2 =odata.data[1];
				var udata3 =odata.data[2];
				}else
				if(edit[0][0][0] == 1){
				var udata2 ={};
				var map = odata.data[1];
				var test = [];
				for(key in map){
				test.push(map[key]);
				}
				for(var i=0; i<ucollen; i++){
					
					if(eval("edit" + i) == null){
					
					udata2[eval("col" + i)] = test[i];
					}else{
					
					udata2[eval("col" + i)]= eval("edit" + i);
					}
				}
				var udata1 = odata.data[0];
				var udata3 = odata.data[2];
				}else
				if(edit[0][0][0] == 2){
				var udata3 ={};
				var map = odata.data[2];
				var test = [];
				for(key in map){
				test.push(map[key]);
				}
				for(var i=0; i<ucollen; i++){
					
					if(eval("edit" + i) == null){
					
					udata3[eval("col" + i)] = test[i];
					}else{
					
					udata3[eval("col" + i)]= eval("edit" + i);
					}
				}
				var udata1 = odata.data[0];
				var udata2 = odata.data[1];
				}	
				var table1 = {
						"table":otname,
						"columns":ucol,
						"data":[udata1,udata2,udata3]
						};
						var t1 = JSON.stringify(table1);
						console.log(t1);
				
				localStorage.setItem(2,t1);
}
});
