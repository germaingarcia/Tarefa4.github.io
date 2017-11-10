//indexjs

var myMainDiv=document.getElementById("MyMainDiv");
var MyRadVizDiv=document.getElementById("RadVizDiv");
var MyStarCor=document.getElementById("StarCor");
var MyParalell=document.getElementById("MyParalellDiv");


var Margin1=30;
var Margin2=20;
var CircleSize=6;
//MyScDiv=
//MyRadVizDiv=
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var HeightMainDivSize=myMainDiv.clientWidth;
var HeightMyRadVizDivSize=MyRadVizDiv.clientWidth;
var HeightStarCorSize=MyStarCor.clientWidth;

//document.getElementById('divatable').style.height=HeightMainDivSize;
//document.getElementById('tableDetail').style.height=HeightMainDivSize;

//---------------------First Projection PCA
var Main = d3.select("#MyMainDiv").append("svg")
        .attr("width", HeightMainDivSize)
        .attr("height", HeightMainDivSize);

var PanelMain = Main.append("g")
          .attr("transform", "translate(" + 0 + "," + 0 + ")");

PanelMain.append("rect")
  		.attr("class","frame")
    	.attr("x", 0)
      	.attr("y", 0)
      	.attr("width", HeightMainDivSize )
      	.attr("height", HeightMainDivSize  );

//---------------------Second Projection Radviz
var SecondPanel=d3.select("#RadVizDiv").append("svg")
        .attr("width", HeightMyRadVizDivSize)
        .attr("height", HeightMyRadVizDivSize);
SecondPanel.append("rect")
  		.attr("class","frame")
    	.attr("x", 0)
      	.attr("y", 0)
      	.attr("width", HeightMyRadVizDivSize )
      	.attr("height", HeightMyRadVizDivSize  );

//---------------------Third Projection Radviz
var ThirdPanel=d3.select("#StarCor").append("svg")
        .attr("width", HeightStarCorSize)
        .attr("height", HeightStarCorSize);
ThirdPanel.append("rect")
  		.attr("class","frame")
    	.attr("x", 0)
      	.attr("y", 0)
      	.attr("width", HeightStarCorSize )
      	.attr("height", HeightStarCorSize  );


//-----------------------------------------------LOAD O CSV DOCUMENT 
var Dados=loadData('University01.csv');
var CONTROLPOINTS=Dados.ControlPoints;
var Universidades=Dados.Universidades;
//------------------------------------------------

//----------------------											PROJECTION --PCA 
var ValueMatrix=GetMatrixValues(Universidades); // Values Matrix extraxtrion
respuesta=PCA(ValueMatrix,Universidades); //PCA Calculation

console.log(Universidades);
var xPCAScale=d3.scale.linear().domain([d3.min(respuesta.ejex),d3.max(respuesta.ejex)]).range([CircleSize/2,HeightMainDivSize-CircleSize/2]);
var yPCAScale=d3.scale.linear().domain([d3.min(respuesta.ejey),d3.max(respuesta.ejey)]).range([CircleSize/2,HeightMainDivSize-CircleSize/2]);



var BrushStarFirst = d3.svg.polybrush()
                 .x(xPCAScale)
                 .y(yPCAScale)
                 .on("brushstart",function(){
                          clearALLTable("tableDetail");
                          BrushStarFirst.clear();
                           PanelMain.selectAll("circle")
                           .attr("class","circle")
                               .attr("stroke-width",1);


                            SecondPanel.selectAll("circle")
                           .attr("class","circle")
                               .attr("stroke-width",1);


                            ThirdPanel.selectAll("circle")
                           .attr("class","circle")
                               .attr("stroke-width",1);

                             })
                            .on("brush",function(){

                             PanelMain.selectAll("circle")
                             .attr("class",function(d){
                                   if ( BrushStarFirst.isWithinExtent(xPCAScale(d.x), yPCAScale(d.y))) {
                                           d.drag=1;
                                           return "circle";
                                    } else {
                                     d.drag=0;
                                           return "no_selected";
                                    }
                                    })
                              .attr("stroke-width",1);

                              SecondPanel.selectAll("circle")
                               .attr("class",function(d){
                                   if ( d.drag==1) {
                                           d.drag=1;
                                           return "circle";
                                    } else {
                                     d.drag=0;
                                           return "no_selected";
                                    }
                                    })
                               .attr("stroke-width",1);

                               ThirdPanel.selectAll("circle")
                               .attr("class",function(d){
                                   if ( d.drag==1) {
                                           d.drag=1;
                                           return "circle";
                                    } else {
                                     d.drag=0;
                                           return "no_selected";
                                    }
                                    })
                               .attr("stroke-width",1);
                                    })
                                    .on("brushend",function(){
                                      paralellCorr();
                                      BrushStarSecond.clear();
                                    BrushStarThird.clear();
                                 BrushStar.clear();
                                 	clearALLTable("tableDetail");
                           
                                    });
    PanelMain.append("svg:g")
                .attr("class", "brush")
                .call(BrushStarFirst);                             

PanelMain.selectAll(".pca_points")
        .data(Universidades)
        .enter().append("g").append("circle")
        .attr("cx",function(d){return xPCAScale(parseFloat(d.x));})
        .attr("cy",function(d){return yPCAScale(parseFloat(d.y));})
        .attr("r",CircleSize)
        .attr("stroke",function(d){return d.color;})
        .attr("stroke-width",1)
        .attr("fill",function(d){return d.color;})
        .attr("class","circleData")
        .on("mouseover",function(d){
									 div.transition()
									.duration(25)
									.style("border","solid 1px "+d["color"])
									.style("opacity", .9);
								     div.html(d.id)
									.style("left", (d3.event.pageX) + "px")
									.style("top", (d3.event.pageY) + "px");
									})
			.on("mouseout", function(d) {
					   div.transition()
						.duration(100)
						.style("opacity", 0);
				});

//----------------------											PROJECTION --RADVIZ
distribucionLocal(CONTROLPOINTS,1);//calculamos la distribucion de los puntos de control
Radviz(Universidades,CONTROLPOINTS);
var xRadvizScale=d3.scale.linear().domain([-1.08,1.08]).range([CircleSize/2,HeightMyRadVizDivSize-CircleSize/2]);
var yRadvizScale=d3.scale.linear().domain([-1.08,1.08]).range([CircleSize/2,HeightMyRadVizDivSize-CircleSize/2]);




var BrushStarSecond = d3.svg.polybrush()
                 .x(xRadvizScale)
                 .y(yRadvizScale)
                 .on("brushstart",function(){
                 	clearALLTable("tableDetail");

                        SecondPanel.selectAll("circle")
                                 .attr("class","circle")
                                     .attr("stroke-width",1);

                          ThirdPanel.selectAll("circle")
                                   .attr("class","circle")
                                       .attr("stroke-width",1);

                                     

                          BrushStarSecond.clear();

                           PanelMain.selectAll("circle")
                           .attr("class","circle")
                               .attr("stroke-width",1);


                          })
                            
                            .on("brush",function(){

                             SecondPanel.selectAll("circle")
                             .attr("class",function(d){
                                   if ( BrushStarSecond.isWithinExtent(xRadvizScale(d.xRadviz), yRadvizScale(d.yRadviz))) {
                                           d.drag=1;
                                           return "circle";
                                    } else {
                                     d.drag=0;
                                           return "no_selected";
                                    }
                                    })
                              .attr("stroke-width",1);

                              PanelMain.selectAll("circle")
                               .attr("class",function(d){
                                   if ( d.drag==1) {
                                           d.drag=1;
                                           return "circle";
                                    } else {
                                     d.drag=0;
                                           return "no_selected";
                                    }
                                    })
                               .attr("stroke-width",1);

                               ThirdPanel.selectAll("circle")
                               .attr("class",function(d){
                                   if ( d.drag==1) {
                                           d.drag=1;
                                           return "circle";
                                    } else {
                                     d.drag=0;
                                           return "no_selected";
                                    }
                                    })
                               .attr("stroke-width",1);
                                    })
                                    .on("brushend",function(){
                                      paralellCorr();
                                      BrushStarSecond.clear();
                          BrushStarThird.clear();
                           BrushStar.clear();
                         	clearALLTable("tableDetail");
                                    });
    SecondPanel.append("svg:g")
                .attr("class", "brush")
                .call(BrushStarSecond); 

SecondPanel.selectAll(".radviz_points")
        .data(Universidades)
        .enter().append("g").append("circle")
        .attr("cx",function(d){return xRadvizScale(d.xRadviz);})
        .attr("cy",function(d){return yRadvizScale(d.yRadviz);})
        .attr("r",CircleSize)
        .attr("stroke",function(d){return d.color;})
        .attr("stroke-width",1)
        .attr("fill",function(d){return d.color;})
        .attr("class","circleData")
         .on("mouseover",function(d){
									 div.transition()
									.duration(25)
									.style("border","solid 1px "+d["color"])
									.style("opacity", .9);
								     div.html(d.id)
									.style("left", (d3.event.pageX) + "px")
									.style("top", (d3.event.pageY) + "px");
									})
			.on("mouseout", function(d) {
					   div.transition()
						.duration(100)
						.style("opacity", 0);
				});

 SecondPanel.selectAll(".head_coordinates")
                         .data(CONTROLPOINTS)
                         .enter()
                         .append("circle")
                         .attr("stroke", "black" )
                         .attr("stroke-width",3)
                         .attr("id",function(d,i){return "cp";})
                         .attr("cx",function(d){ return xRadvizScale(d.xRadviz);})
                         .attr("cy",function(d){ return yRadvizScale(d.yRadviz);})
                         .attr("r",12)
                         .attr("fill",function(d){return d.color; })
                         .attr("opacity",2)
                         .on("mouseover",function(d){
									 div.transition()
									.duration(25)
									.style("border","solid 1px "+d["color"])
									.style("opacity", .9);
								     div.html(d.Texto)
									.style("left", (d3.event.pageX) + "px")
									.style("top", (d3.event.pageY) + "px");
									});/*
						.on("mouseout", function(d) {
								   div.transition()
									.duration(100)
									.style("opacity", 0);
							});*/


//---------------------------------------------------			Star Coordinates Projection
var extremos=[10000,-10000,10000,-10000];
StarCoordinates(Universidades,CONTROLPOINTS,extremos);

var myextrem=Math.abs(d3.min(extremos))<Math.abs(d3.max(extremos))?Math.abs(d3.max(extremos)):Math.abs(d3.min(extremos));


var xStarCScale=d3.scale.linear().domain([-1*myextrem,myextrem]).range([CircleSize/2,HeightStarCorSize-CircleSize/2]);
var yStarCScale=d3.scale.linear().domain([-1*myextrem,myextrem]).range([CircleSize/2,HeightStarCorSize-CircleSize/2]);



var BrushStarThird = d3.svg.polybrush()
                 .x(xStarCScale)
                 .y(yStarCScale)
                 .on("brushstart",function(){
                 	//clearALLTable("tableDetail");
                       BrushStarThird.clear();

                         ThirdPanel.selectAll("circle")
                                   .attr("class","circle")
                                       .attr("stroke-width",1);


                        SecondPanel.selectAll("circle")
                                 .attr("class","circle")
                                     .attr("stroke-width",1);

                           PanelMain.selectAll("circle")
                           .attr("class","circle")
                               .attr("stroke-width",1);



                          })
                            
                            .on("brush",function(){

                             ThirdPanel.selectAll("circle")
                             .attr("class",function(d){
                                   if ( BrushStarThird.isWithinExtent(xStarCScale(d.xStarC), yStarCScale(d.yStarC))) {
                                           d.drag=1;
                                           return "circle";
                                    } else {
                                     d.drag=0;
                                           return "no_selected";
                                    }
                                    })
                              .attr("stroke-width",1);

                              PanelMain.selectAll("circle")
                               .attr("class",function(d){
                                   if ( d.drag==1) {
                                           d.drag=1;
                                           return "circle";
                                    } else {
                                     d.drag=0;
                                           return "no_selected";
                                    }
                                    })
                               .attr("stroke-width",1);

                               SecondPanel.selectAll("circle")
                               .attr("class",function(d){
                                   if ( d.drag==1) {
                                           d.drag=1;
                                           return "circle";
                                    } else {
                                     d.drag=0;
                                           return "no_selected";
                                    }
                                    })
                               .attr("stroke-width",1);
                                    })
                                    .on("brushend",function(){
                                      paralellCorr();
                                      BrushStarSecond.clear();
                                      BrushStarThird.clear();
                                       BrushStar.clear();
                                    clearALLTable("tableDetail");
                                    });
    ThirdPanel.append("svg:g")
                .attr("class", "brush")
                .call(BrushStarThird); 

ThirdPanel.selectAll(".starc_points")
        .data(Universidades)
        .enter().append("g").append("circle")
        .attr("cx",function(d){return xStarCScale(d.xStarC);})
        .attr("cy",function(d){return yStarCScale(d.yStarC);})
        .attr("r",CircleSize)
        .attr("stroke",function(d){return d.color;})
        .attr("stroke-width",1)
        .attr("fill",function(d){return d.color;})
        .attr("class","circleData")
         .on("mouseover",function(d){
									 div.transition()
									.duration(25)
									.style("border","solid 1px "+d["color"])
									.style("opacity", .9);
								     div.html(d.id)
									.style("left", (d3.event.pageX) + "px")
									.style("top", (d3.event.pageY) + "px");
									})
			.on("mouseout", function(d) {
					   div.transition()
						.duration(100)
						.style("opacity", 0);
				});


                ThirdPanel.selectAll("line")
                        .data(CONTROLPOINTS)
                       .enter()
                       .append("line")
                       .attr("id",function(d,i){  return "lcp"+i;})
                       .attr("x1",function(d){ return xStarCScale(0);})
                       .attr("y1",function(d){ return yStarCScale(0);})
                       .attr("x2",function(d){ return xStarCScale(d.xStarC);})
                       .attr("y2",function(d){ return yStarCScale(d.yStarC);})
                       .attr("stroke-width",2)
                        .attr("stroke",function(d,i){return d.color;});



               ThirdPanel.selectAll(".head_coordinates")
                         .data(CONTROLPOINTS)
                         .enter()
                         .append("circle")
                         .attr("stroke", "black" )
                         .attr("stroke-width",3)
                         .attr("id",function(d,i){return "cp";})
                         .attr("cx",function(d){ return xStarCScale(d.xStarC);})
                         .attr("cy",function(d){ return yStarCScale(d.yStarC);})
                         .attr("r",12)
                         .attr("fill",function(d){return d.color; })
                         .attr("opacity",2)
                         .call(d3.behavior.drag()
		                        .on("dragstart",dragStart)
		                        .on("drag",drag)
		                        .on("dragend",DragEnd))
                         .on("mouseover",function(d){
									 div.transition()
									.duration(25)
									.style("border","solid 1px "+d["color"])
									.style("opacity", .9);
								     div.html(d.Texto)
									.style("left", (d3.event.pageX) + "px")
									.style("top", (d3.event.pageY) + "px");
									})
						.on("mouseout", function(d) {
								   div.transition()
									.duration(100)
									.style("opacity", 0);
							});


 function dragStart(){
    d3.event.sourceEvent.stopPropagation();
}
function drag(){
            d3.select(this)
            .attr("class","Selected")
            .attr("cx",function(d){
             d.xStarC=xStarCScale.invert(Math.max(10, Math.min(HeightStarCorSize , d3.event.x)));
                    return xStarCScale(d.xStarC);
             })
             .attr("cy",function(d){
			 d.yStarC=yStarCScale.invert(Math.max(10, Math.min(HeightStarCorSize , d3.event.y)));
				return yStarCScale(d.yStarC);
             })
             .attr("r",11);

             ThirdPanel.selectAll("line")
             .data(CONTROLPOINTS)
                 .transition()
                 .duration(1)
                 .each("start", function() {  // Start animation
                     d3.select(this)  // 'this' means the current element
                       //  .attr("fill", "red");  // Change color

                 })
                 .delay(function(d, i) {
                     return 1;// i / controlPoints1.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
                 })
                 .attr("x1",function(d){ return xStarCScale(0);})
                  .attr("y1",function(d){ return yStarCScale(0);})
                  .attr("x2",function(d){ return xStarCScale(d.xStarC);})
                  .attr("y2",function(d){ return yStarCScale(d.yStarC);})

                  .attr("stroke-width",2)
                  .attr("stroke",function(d,i){return d.color;})
                  .each("end", function() {  // End animation
                     d3.select(this)  // 'this' means the current element
                         .transition()
                         .duration(100);
                         //.attr("fill",function(d){return myColors(parseInt(d.klasses));});
                 });
                 var V=new Array();
				 
				 
                 CONTROLPOINTS.forEach(function(d,i){
                              V[i]=[parseFloat(d.xStarC),parseFloat(d.yStarC)]
                   });

                 ThirdPanel.selectAll("circle")
                    .data(Universidades)
                        .transition()
                        .duration(1)
                        .each("start", function() {  // Start animation
                            d3.select(this)  // 'this' means the current element
                               // .attr("fill", "red");  // Change color
                        })
                        .delay(function(d, i) {
                                return i / Universidades.length * 100;  // Dynamic delay (i.e. each item delays a little longer)
                        })
                        .attr("cx",function(d){
									var Aux=numeric.dot(d.values,V);
                                    d.xStarC=Aux[0];
                                    d.yStarC=Aux[1];
                                        return xStarCScale(d.xStarC);
                                        })
                                .attr("cy",function(d){return yStarCScale(d.yStarC);})
                                .each("end", function() {  // End animation
                                 d3.select(this)  // 'this' means the current element
                                        .transition()
                                        .duration(100)
                                        .attr("fill",function(d){return d.color;});
                                  });
         }


         function DragEnd(){
                 //Actualizamos los puntos las ubicaciones de los puntos de control
            var V=new Array();


       }



//------------------------------------------------------------------------------------------------------ PARALELL COORDINATES
var margin= {top: 20, right: 30, bottom: 20, left: 30};

		var width= MyParalell.clientWidth;		
		var height= MyRadVizDiv.clientWidth;

		var svgs= d3.select("#MyParalellDiv")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		svgs.append("rect")
  		.attr("class","frame")
    	.attr("x", 0)
      	.attr("y", 0)
      	.attr("width", MyParalell.clientWidth)
      	.attr("height", MyRadVizDiv.clientWidth);

		var paralell=svgs.append("g")
				.attr("width", width- margin.left- margin.right)
				.attr("height", height- margin.top- margin.bottom)
				.attr("transform", "translate("+ margin.left +", "+ margin.top +")");

		textos=[]
		CONTROLPOINTS.forEach(function(d,i){textos.push(d.Texto)});
		

   paralellCorr();

    function paralellCorr(){
        paralell.selectAll().remove();

        	var scaleX= d3.scale.ordinal()
			.domain(textos)
			.rangePoints([margin.left, width-2*margin.right]);

		var scaleY= d3.scale.linear().domain([0,1]).range([height-2*margin.bottom, 0]);

		var line= d3.svg.line();
		var axis= d3.svg.axis().orient("left");

    		var links= paralell.append("g")
    				.attr("class", "link")
    				.selectAll("path")
    				.data(Universidades)
    				.enter().append("path")
    					.attr("d", path)
              .attr("class","circle")
    					.attr("stroke",function(d){return  d.color;}); //if( d.drag==1){return "black";}else{return  d.color;}

    		var g= paralell.selectAll(".dimension") 
    				.data(CONTROLPOINTS)
    				.enter().append("g")
    					.attr("class", "dimension")
    					.attr("transform", function(d) { return "translate(" + scaleX(d.Texto) + ")"; });

    		g.append("g")
    				.attr("class", "axis")
    				.each(function(d) { d3.select(this).call(axis.scale(scaleY)); })
    				.append("text")
    				.style("text-anchor", "middle")
    				.attr("y", -5)
    				.text(function(d) { return d.Texto; });

    		function path(d) {
			return line(CONTROLPOINTS.map(function(p,i) { return [scaleX(p.Texto), scaleY(d.values[i])]; }));
		};

    }
		

var isDragged=false;

function ChargeDetailTable(){
        var id=["University"];
        var attributes=["Teaching_Rating","Inter_Outlook_Rating","Research_Rating","Citations_Rating","Industry_Income_Rating","Num_Students","Student/Staff_Ratio","%_Inter_Students","%_Female_Students"];
        var titulo=id.concat(attributes,["clase"]);
        var matrix=new Array();
        Universidades.forEach(function(d,i){
          if(d.drag==1){
            var id=[d.id];
            var vares=[];
            d.values.forEach(function(d){vares.push(d.toFixed(3))});
            var myArray=id.concat(vares,[d.class]);
            matrix.push(myArray);
        }})

        if(matrix.length>0){isDragged=true;}else{isDragged=false;}

        chargeTable(titulo,matrix,"tableDetail");
    }

//----------------------------------------Algoritmo Star Coordinates
function StarCoordinates(MisUniversidades,control,extremos){
	anchorPoints=[];
	control.forEach(function(d){
		anchorPoints.push([parseFloat(d.xStarC),parseFloat(d.yStarC)])
	});
	
	MisUniversidades.forEach(function(d){
		var valores=d.values;
		var Aux=numeric.dot(valores,anchorPoints);
		d.xStarC=parseFloat(Aux[0]);
		d.yStarC=parseFloat(Aux[1]);

		if(d.xStarC<extremos[0]){extremos[0]=d.xStarC; }
		if(d.xStarC>extremos[1]){extremos[1]=d.xStarC; }

		if(d.yStarC<extremos[2]){extremos[2]=d.yStarC; }
		if(d.yStarC>extremos[3]){extremos[3]=d.yStarC; }
	});
}

//-----------------------------------------RadvizAlgorithm
function Radviz(MisUniversidades,control){

	anchorPoints=[];
	control.forEach(function(d){
		anchorPoints.push([parseFloat(d.xRadviz),parseFloat(d.yRadviz)])
	});
	MisUniversidades.forEach(function(d){
		var valores=d.values;
		suma=d3.sum(valores);
		var Aux=numeric.dot(valores,anchorPoints);

		d.xRadviz=parseFloat(Aux[0]/suma);
		d.yRadviz=parseFloat(Aux[1]/suma);
	});
}


//------------------------------------------PCA algorithm
function PCA_Components(X){
    var m = X.length;
    var sigma = numeric.div(numeric.dot(numeric.transpose(X), X), m);
	//var u=numeric.svd(sigma).U;
    //console.log(u);
	var uwvt = thinsvd(sigma);
	var U = uwvt[0];
	var equ=new Array();
	var Comp1=[];
	var Comp2=[]
	for(i=0;i<X[0].length;i++){
		equ.push([parseFloat(U[i][0]),parseFloat(U[i][1])]); Comp1.push(parseFloat(U[i][0])); Comp2.push(parseFloat(U[i][1]));
	}
	return {'Comp1':Comp1,'Comp2':Comp2}
}

function PCA(X,MisUniversidades){
	var componentes= PCA_Components(X);
	var ejex=[];
	var ejey=[];
	for(i=0;i<X.length;i++){
		var x=ProductoPunto(X[i],componentes.Comp1);
		var y=ProductoPunto(X[i],componentes.Comp2);
		ejex.push(x); ejey.push(y)
		MisUniversidades[i].x=x; MisUniversidades[i].y=y;
	}
	return {"ejex":ejex,"ejey":ejey};
}



