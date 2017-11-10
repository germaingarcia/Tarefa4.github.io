function loadFile(file) {
		var request;
		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest();
		} else {
			// code for IE6, IE5
			request = new ActiveXObject('Microsoft.XMLHTTP');
		}
		// load
		request.open('GET', file, false);
		request.send();
		var rows = request.responseText.split("\n");
		return rows;//request.responseText;
	   // parseCSV(request.responseText);
   }


function loadData(file){
	   var arreglo=this.loadFile(file);
	   var Atributos=arreglo[0].split(',');
	   var Universidades=[];
	   var ControlPoints=[];
	   for(i=1;i<Atributos.length-1;i++){
	   		ControlPoints.push({'Texto':Atributos[i],'color':FirstPalette[i]});
	   }
	   //Atributos.forEach(function(d){
	   //		ControlPoints.push({'Texto':d});
	   //});

	   for(i=1; i<arreglo.length; i++){
	   		arre=arreglo[i].split(',');
	   		valores=[]
	   		for(j=1;j<arre.length-1;j++){valores.push(parseFloat(arre[j]));}

	   		Universidades.push({'id':arre[0],'class':arre[arre.length-1],'values':valores,'color':DataPalette[parseInt(arre[arre.length-1])]});
	   }
	   return {'Universidades':Universidades,'ControlPoints':ControlPoints};	   
}

function GetMatrixValues(Object){
	ValueMatrix=[];
	for (i=0;i<Object.length;i++){
		ValueMatrix.push(Object[i].values);
	}
	return ValueMatrix;
}

function ProductoPunto(vector1,vector2){
	var respuesta=new Array();
	var elementoUno=0;
	for (var i = 0; i < vector1.length; i++) {
		elementoUno+=vector1[i]*vector2[i];
		
	}
	return elementoUno;
}


function distribucionLocal(ControlPoints, radio){
             //var puntos=new Array(parseInt(attributos.length));
            // var radio=(parseFloat(BEST)+parseFloat(WORST))/2.0;
             var PI=3.14159;
             var b=parseFloat(360.0/parseFloat(ControlPoints.length));

            var vector=new Array(ControlPoints.length);
            for(i=0;i<parseInt(ControlPoints.length);i++){
                 var valor=(i)*parseFloat(b);
                 var Radianes=(parseFloat(valor)*parseFloat(PI)/parseFloat(180.0));
                 var x=Math.cos(parseFloat(Radianes))*parseFloat(radio);
                 var y=Math.sin(parseFloat(Radianes))*parseFloat(radio);

                 ControlPoints[i].xRadviz=x;
                 ControlPoints[i].yRadviz=y;

                 ControlPoints[i].xStarC=x;
                 ControlPoints[i].yStarC=y;
             }
}


function chargeTable(titles,matrix,id){
	console.log(matrix);
     var table = document.getElementById(id);
    	// clearTable(id);
       // $("#"+id+" tr").remove();
         // $("#"+id+" td").remove();
         //   $("#"+id+" *").remove();
        clearALLTable(id);

    //    console.log("este es el numero: "+matrix.length);
        matrix.forEach(function(d,i){
             var row = table.insertRow(i);
             d.forEach(function(a,j){
                 var cell1 = row.insertCell(j);
                 cell1.innerHTML = "<th>"+a+"</th>";
             });

        });
       var header = table.createTHead();
       var row = header.insertRow(0);

       titles.forEach(function(d,i){
             var cell1 = row.insertCell(i);
             cell1.innerHTML = "<td>"+titles[i]+"</td>";
       });

}

function clearALLTable(tableID){
	var Parent = document.getElementById(tableID);
    while(Parent.hasChildNodes())
    {
       Parent.removeChild(Parent.firstChild);
    }
}
