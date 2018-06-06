function generateChart(month){
    var canvas_width =500;
    var canvas_height = 500;
    var chart_width = 300;
    var chart_height = 400;
    var bar_padding = 5;
    var chart_ceiling = 300;
    var padding = 30;
    var sumTotal = 0;

    var marginx = {top: 20, right: 10, bottom: 30, left: 1},
        widthx = 300 - marginx.left - marginx.right,
        heightx = 400 - marginx.top - marginx.bottom;

    dataFile = dataFile + month;

        var svg=d3.select('#chartpie1')
            .append('svg')
            .attr('width', 500)
            .attr('height', 400)
            .attr("transform", "translate(" + ( 110) + "," + 0 +")");

        var width = chart_width;
        var height = chart_height;
        var radius = Math.min(width, height) / 2;


        var g = svg.append("g").attr("transform", "translate(" + chart_width / 2 + "," + chart_height / 2 + ")");

        var color = d3.scaleOrdinal(["#7dcced", "#c01f2f", "#4db8ff", "#1affff", "#009999", "#00cca3", "#00cc66"]);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d["Number of items"]; });
        
        var path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);
        
        var label = d3.arc()
            .outerRadius(radius + 32)
            .innerRadius(radius - 40);        

        // Reads and process the CSV file
        d3.csv(dataFile, function(d, i, columns) {
            d["Number of items"] = +d["Number of items"];
            sumTotal = sumTotal + d["Number of items"];
            return d;
        }, function(error, data) {
             if (error) {
                console.log('file not found');
                return;
            }

            var dataNew=[];
            dataNew["0"] = data["0"];
            dataNew["1"] = data["2"];            
            dataNew["columns"] = ["Visit Type", "Number of items" ];
            var globalitems = data["1"]["Number of items"];
            var localitems =  data["0"]["Number of items"];           
        
            var arc = g.selectAll(".arc")
            .data(pie(dataNew))
            .enter().append("g")
                .attr("class", "arc");
        
            arc.append("path")
                .attr("d", path)
                .attr("class","path-line")
                .attr("fill", function(d) { return color(d.data["Visit Type"]); });
        
            arc.append("text")
                .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
                .attr("class","path-text")
                .text(function(d) {
                    return d.data["Visit Type"] + "(" + d.data["Number of items"] + "%)"; 
                    });
 
                
            arc.append("text")
                .attr("x", 0)
                .attr("y", 180)
                .text(function(){
                    var diff = globalitems - localitems;
                    var compareMessage = ((diff > 0) ? "% Below" : "% Above") + " Global Average" ;
                    return (Math.abs(diff)).toFixed(2) + compareMessage;
                    }
                )
                .attr('font-size',16)
                .attr('text-anchor','middle')
                .attr('fill','#000000');   

        });        
}

