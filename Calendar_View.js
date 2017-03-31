define(['d3'], function (d3) {
	
	return function (instanceData) {
		

		var csv = [];

                // Build the tree...
                var series0 = instanceData.series[0];
                
                for (var index = 0; index < series0.length; ++index) {
                    
                    var record = series0[index];
                    
					csv.push({date: record.date,open: record.open,close: record.close});
                 } 
				 


var width = 960,
    height = 140,
    svg_height = height*((record.end_year-record.start_year)+1),
    cellSize = 17,
      week_days = ['S','M','T','W','T','F','S'],
      x=0,
    month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

var percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var svg= d3.select("#" + instanceData.id).append("svg")
			.attr("width",width)
			.attr("height",svg_height);
			
var g = svg.selectAll(".yearG")
    .data(d3.range(record.start_year, record.end_year+1))
  .enter().append("g")
	.attr("class", "yearG")
    .attr("class", "RdYlGn")
    .attr("transform", function(d,i){
	return "translate(" + ((width - cellSize * 53) / 2) + "," + ((height - cellSize * 7 - 1) + (height * i)) + ")";
    });

var iDiv = document.createElement('div');
iDiv.id = 'appendYears';
document.getElementsByTagName('body')[0].appendChild(iDiv);
 
g.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .attr("dy", "-1.5em")
    .text(function(d) { return d; })
	.attr("class","week_days");
    
    
for (var i=0; i<7; i++)
{    
g.append("text")
    .attr("transform", "translate(-5," + cellSize*(i+1) + ")")
    .style("text-anchor", "end")
    .attr("dy", "-.25em")
    .text(function(d) { return week_days[i]; })
	.attr("class","week_days"); 
 }

for( var j=0;j<12;j++)
{
g.append("text")
   .attr("class", "month_title")
   .style("text-anchor", "middle")
   .attr("dy", "-.25em")
   .attr("x", (j*cellSize*4)+(j*4)+50)
   .text(month[j])
 }  
   
var rect = g.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  	.enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
    .datum(format);

      

rect.append("title")
    .text(function(d) { return d; });

g.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);


  var data = d3.nest()
    .key(function(d) { return d.date; })
    .rollup(function(d) { return d[0].open; })
    .map(csv);

  rect.filter(function(d) { return d in data; })
      .attr("class", function(d) { return "day q" +(Math.ceil(data[d])==0?null:Math.ceil(data[d])<50?"4":Math.ceil(data[d])<100?"5":Math.ceil(data[d])<150?"6":Math.ceil(data[d])<200?"7":Math.ceil(data[d])<250?"8":Math.ceil(data[d])<300?"9":Math.ceil(data[d])>300?"10":null)+ "-11"; })
    .select("title")
      .text(function(d) { return d + ": " + data[d] + " USD"; });
      

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
      d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}
}
});
