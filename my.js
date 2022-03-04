const height = 1000;
const width = 1200;

const svg = d3.select('#my_svg')
    .attr('width', width)
    .attr('height', height);

// 添加一个背景矩形以显示svg覆盖的范围
// d3.slider();
var x_lens = 500;
var y_lens = 500;
var r_lens = 5;
svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'none')
    .attr('stroke', 'grey');
const g = svg.append('g')
    .attr('id', 'graph_g');
const g2 = svg.append("g").attr("id", "g2");
    // .attr('transform', `translate(${width / 2}, ${height / 2})`);
const brush_data = {left: width / 2 + 20, top : 10, right : width , bottom: height / 10};

for(var i = 0; i < 10; i++){
    g.append("text").attr("id", "id" + i);

}
for(var i = 0; i < 29; i++){
    g2.append("text").attr("id", "year" + i);
}

var year_num = [];
for(var i = 0; i < 29; i++){
    year_num.push(0);
}

d3.csv("../data.csv")
    .then(function first_function(data) {

        console.log(data.length);
        const x_min = d3.min(data, function (d){return +d.x;});
        const x_max = d3.max(data, function (d){return +d.x;});
        const x_scale = d3.scaleLinear()
            .domain([x_min, x_max])
            .range([10, width-10]);

        const y_min = d3.min(data, function (d){return +d.y;});
        const y_max = d3.max(data, function (d){return +d.y;});
        const y_scale = d3.scaleLinear().domain([y_min, y_max]).range([10, height - 10]);
        var rscale = 3;
        painting_data(data);
        function dragged(d){
            var x_change = d3.event.x;
            var y_change = d3.event.y;
            console.log(d3.event);
            var lens = d3.select(this);
            lens.attr("cx", d3.event.x).attr("cy", d3.event.y)
            var r = lens._groups[0][0].r.baseVal.value;
            var word_count = {};
            var year_list = [];
            var circles = g.selectAll("circle").attr("r", function(d){
                var x = x_scale(d.x);
                var y = y_scale(d.y);

                var x_square = (x - x_change) * (x - x_change);
                var y_square = (y - y_change) * (y - y_change);
                var length = Math.sqrt(x_square + y_square);
                if(length <= r){
                    year_list.push(parseInt(d.year));
                    var l = d.text.split(",");
                    for(var i = 0; i < l.length; i++){
                        if(word_count[l[i]]){
                            word_count[l[i]]++;
                        }
                        else{
                            word_count[l[i]] = 1;
                        }
                    }
                    d3.select(this).attr("opacity", 1);
                    return rscale * 2;
                }
                else{
                    return rscale;
                }
        
            })                
            // .attr("opacity", 1);
            var year_num = [];
            for(var i = 0; i < 29; i++){
                year_num.push(0);
            }
            for(var i = 0; i < year_list.length; i++){
                year_num[year_list[i]-1990]++;
            }
            console.log(year_num);
            var rectHeight = 25;
            g2.selectAll("rect").remove();
              g2.selectAll("rect")
              .data(year_num, d => d)
              .enter()
              .append("rect")
              .attr("x", x_change)
              .attr("y", function(d, i){
                  if(i < 15){
                  return y_change + (i - 14) * rectHeight;}
                  else{return y_change + (i - 14) * rectHeight;}
              })
              .attr("width", function(d){
                  return d;
              })
              .attr("height", rectHeight - 2)
              .attr("fill", "steelblue");
              for(var i = 0; i < 29; i++){
                  g2.select("#year" + i).text(1990 + i).attr("fill", "purple").attr("x", x_change - 25).attr("y", y_change + 15 + (i - 14) * rectHeight).attr("text-anchor", "left").style("font-size", '10px');
              }

            //根据透镜内的文本，统计词频，获取关键词
            var list_ = [];
            for(let i in  word_count){
                var o = {};
                o[i] = word_count[i];
                list_.push(o);
            };

            list_.sort(function(a, b){
                for(var a_ in a){
                    for( b_ in b){
                        return b[b_] - a[a_];
                    }
                }
            });
            var result = [];
            for(var i = 0; i < 10; i++){
                    result.push(list_[i]);
            }
            word_result = [];
            for(var i = 0; i < result.length; i++){
                for(item in result[i]){
                    word_result.push(item);
                }
            }
            for(var i = 0; i < 5; i++){
                g.select("#id" + i).text(word_result[i]).attr("fill", "red").attr("x", x_change - 100).attr("y", y_change - i * 20).attr('text-anchor',"middle");
            }
            for(var i = 1, j = 5; i < 6; i++, j++){
                g.select("#id" + j).text(word_result[j]).attr("fill", "red").attr("x", x_change - 100).attr("y", y_change + i * 20).attr('text-anchor',"middle"); 
            }
        }

        var lens = g2.append("g")
            .append("circle")
            .attr("cx", x_lens)
            .attr("cy", y_lens)
            .attr("r", r_lens)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", "5px")
            .attr("opacity", 0.1)
            .call(d3.drag().on("drag", dragged))

        var slider = d3
        .sliderBottom()
        .min(0)
        .max(100)
        // .step(1)
        .width(300)
        // .displayValue(false)
        .on('onchange', (val) => {
            console.log(val);
            d3.select('#value').text(val);
            var word_count = {};
            var year_list = [];
            r_lens_new = r_lens * (+val);
            lens.attr("r", r_lens_new);
            var circles = g.selectAll("circle").attr("r", function(d){
                var x = x_scale(d.x);
                var y = y_scale(d.y);
                console.log("text");
                var x_square = (x - x_lens) * (x - x_lens);
                var y_square = (y - y_lens) * (y - y_lens);
                var length = Math.sqrt(x_square + y_square);
                if(length <= r_lens_new){
                    year_list.push(parseInt(d.year));
                    var l = d.text.split(",");
                    for(var i = 0; i < l.length; i++){
                        if(word_count[l[i]]){
                            word_count[l[i]]++;
                        }
                        else{
                            word_count[l[i]] = 1;
                        }
                    }
                    d3.select(this).attr("opacity", 1);
                    return rscale * 2;
                }
                else{
                    return rscale;
                }
        
            }) 
            var year_num = [];
            for(var i = 0; i < 29; i++){
                year_num.push(0);
            }
            for(var i = 0; i < year_list.length; i++){
                year_num[year_list[i]-1990]++;
            }
            console.log(year_num);
            var rectHeight = 25;
            g2.selectAll("rect").remove();
              g2.selectAll("rect")
              .data(year_num, d => d)
              .enter()
              .append("rect")
              .attr("x", x_lens)
              .attr("y", function(d, i){
                  if(i < 15){
                  return y_lens + (i - 14) * rectHeight;}
                  else{return y_lens + (i - 14) * rectHeight;}
              })
              .attr("width", function(d){
                  return d;
              })
              .attr("height", rectHeight - 2)
              .attr("fill", "steelblue");
              for(var i = 0; i < 29; i++){
                  g2.select("#year" + i).text(1990 + i).attr("fill", "purple").attr("x", x_lens - 25).attr("y", y_lens + 15 + (i - 14) * rectHeight).attr("text-anchor", "left").style("font-size", '10px');
              }

            //根据透镜内的文本，统计词频，获取关键词
            var list_ = [];
            for(let i in  word_count){
                var o = {};
                o[i] = word_count[i];
                list_.push(o);
            };

            list_.sort(function(a, b){
                for(var a_ in a){
                    for( b_ in b){
                        return b[b_] - a[a_];
                    }
                }
            });
            var result = [];
            for(var i = 0; i < 10; i++){
                    result.push(list_[i]);
            }
            word_result = [];
            for(var i = 0; i < result.length; i++){
                for(item in result[i]){
                    word_result.push(item);
                }
            }
            for(var i = 0; i < 5; i++){
                g.select("#id" + i).text(word_result[i]).attr("fill", "red").attr("x", x_lens - 100).attr("y", y_lens - i * 20).attr('text-anchor',"middle");
            }
            for(var i = 1, j = 5; i < 6; i++, j++){
                g.select("#id" + j).text(word_result[j]).attr("fill", "red").attr("x", x_lens - 100).attr("y", y_lens + i * 20).attr('text-anchor',"middle"); 
            } 
            
        }); 
        var selectedNum = g.call(slider);

        const year_min = d3.min(data, function(d){return +d.year;});
        const year_max = d3.max(data, function(d){return +d.year});
        const brush = d3.brushX().extent([[brush_data.left, brush_data.top], [brush_data.right, brush_data.bottom]])
            .on("end", brushed);
        g.append("g").attr("class", "brush").call(brush);
        let x = d3.scaleTime().range([0, brush_data.right - brush_data.left]);
        let xScale = x.domain([new Date(year_min - 1, 12), new Date(year_max + 1, 1)]);

        let xAxis = svg.append("g").attr("class", "xAxis").attr("transform", `translate(${brush_data.left}, ${brush_data.top})`)
            .call(d3.axisBottom(xScale)
                    .tickPadding(0));

        function brushed(){
           const selection = d3.event.selection;
           // 得到所选择的年份
            var interval_ = brush_data.right - brush_data.left;
            var left_num = selection[0] - brush_data.left;

            var right_num = selection[1] - brush_data.left;

            var every_num = interval_ / (year_max - year_min + 1);

            var min_year = 0;
            var max_year = 0;

            for(var i = 0; i < year_max - year_min + 1; i++){
                if (left_num >= i * every_num && left_num <= (i+1) * every_num){
                    min_year = 1990 + i;
                    break;
                }
            }
            for(var i = 0; i < year_max - year_min + 1; i++){
                if(right_num >= i * every_num && right_num <= (i+1) * every_num){
                    max_year = 1990 + i;
                    break;
                }
            }

            year_array = [];
            for(i = min_year; i < max_year + 1; i++){
                year_array.push(i);
            }

            var circles = g.selectAll("circle");
            circles.remove();
            data_ = get_year_data(year_array);
            points = painting_data(data_);
        };

        function get_year_data(year_array){
            var data_remain = [];
            for(var i = 0; i < data.length; i++){
                var wh = 0;
                for(var j = 0; j < year_array.length; j++){
                    if(data[i].year == year_array[j]){
                        wh = 1;
                        break;
                    }
                }
                if(wh == 1){
                    data_remain.push(data[i]);
                }
            }
            return data_remain;
        }

        function painting_data(data){
            result = g.selectAll("circle")
                .data(data, d => d)
                .enter()
                .append("circle")
                .attr("id", function(d){return d.id})
                .attr("cx",function(d){
                    return x_scale(d.x);
                })
                .attr("cy",function(d){
                    return y_scale(d.y);

                })
                .attr("r",function(d){
                    return rscale;
                })
                .attr("fill","black")
                .attr("opacity", 0.5)
                .on("mouseover", function (event, d, id){
                    console.log(event);
                    d3.select(this).attr("r", 6).attr("fill", 'black')
                    .attr("opacity", 0.8);
                }).on("mouseout", function(d){
                d3.select(this).transition()
                    .duration(500)
                    .attr("r", 3)
                    .attr("fill", 'black')
                    .attr("opacity", 0.5);
            });
         return result;
        };

        var topic_relative_filter=[0,0,0,0,0,0,0,0];    //记录topic值的数组
        for(i=1;i<9;i++){   //绘制slider标题
            svg.append("text")
            .attr('y',60*i+10)
            .text("topic" + i)
            .style("font-size", "12px")
        }
        var slider_topic1 = d3.sliderBottom()   //以下很大一段都是slider，不太用管，大概，可能需要在每个onchange部分调用重绘整个图像的代码，交给你了
        .min(0).max(1).ticks(1)
        .on('onchange', (val) => {
            topic_relative_filter[0] = val;
            g.selectAll("circle").attr("fill", function(d){
                var wh = 0;
                if(d.topic1 >= topic_relative_filter[0] &&
                    d.topic2 >= topic_relative_filter[1] &&
                    d.topic3 >= topic_relative_filter[2] &&
                    d.topic4 >= topic_relative_filter[3] &&
                    d.topic5 >= topic_relative_filter[4] &&
                    d.topic6 >= topic_relative_filter[5] &&
                    d.topic7 >= topic_relative_filter[6] &&
                    d.topic8 >= topic_relative_filter[7] )
                    {
                        wh=1;
                    }
                if(wh == 1){return "red";}
            })
        })
        var topic1_filter = svg.append("g")
            .attr("transform", `translate(0, 80)`)
            .call(slider_topic1)


        var slider_topic2 = d3.sliderBottom()
        .min(0).max(1).ticks(1)
        .on('onchange', (val) => {
            topic_relative_filter[1] = val;
            console.log(topic_relative_filter);
            g.selectAll("circle").attr("fill", function(d){
                var wh = 0;
                if(d.topic1 >= topic_relative_filter[0] &&
                    d.topic2 >= topic_relative_filter[1] &&
                    d.topic3 >= topic_relative_filter[2] &&
                    d.topic4 >= topic_relative_filter[3] &&
                    d.topic5 >= topic_relative_filter[4] &&
                    d.topic6 >= topic_relative_filter[5] &&
                    d.topic7 >= topic_relative_filter[6] &&
                    d.topic8 >= topic_relative_filter[7] )
                    {
                        wh=1;
                    }
                if(wh == 1){return "red";}
            })
        })
        var topic2_filter = svg.append("g")
            .attr("transform", `translate(0, 140)`)
            .call(slider_topic2)


        var slider_topic3 = d3.sliderBottom()
        .min(0).max(1).ticks(1)
        .on('onchange', (val) => {
            topic_relative_filter[2] = val;
            console.log(topic_relative_filter);
            g.selectAll("circle").attr("fill", function(d){
                var wh = 0;
                if(d.topic1 >= topic_relative_filter[0] &&
                    d.topic2 >= topic_relative_filter[1] &&
                    d.topic3 >= topic_relative_filter[2] &&
                    d.topic4 >= topic_relative_filter[3] &&
                    d.topic5 >= topic_relative_filter[4] &&
                    d.topic6 >= topic_relative_filter[5] &&
                    d.topic7 >= topic_relative_filter[6] &&
                    d.topic8 >= topic_relative_filter[7] )
                    {
                        wh=1;
                    }
                if(wh == 1){return "red";}
            })


        })
        var topic3_filter = svg.append("g")
            .attr("transform", `translate(0, 200)`)
            .call(slider_topic3)


        var slider_topic4 = d3.sliderBottom()
        .min(0).max(1).ticks(1)
        .on('onchange', (val) => {
            topic_relative_filter[3] = val;
            console.log(topic_relative_filter);
            g.selectAll("circle").attr("fill", function(d){
                var wh = 0;
                if(d.topic1 >= topic_relative_filter[0] &&
                    d.topic2 >= topic_relative_filter[1] &&
                    d.topic3 >= topic_relative_filter[2] &&
                    d.topic4 >= topic_relative_filter[3] &&
                    d.topic5 >= topic_relative_filter[4] &&
                    d.topic6 >= topic_relative_filter[5] &&
                    d.topic7 >= topic_relative_filter[6] &&
                    d.topic8 >= topic_relative_filter[7] )
                    {
                        wh=1;
                    }
                if(wh == 1){return "red";}
            })
        })
        var topic4_filter = svg.append("g")
            .attr("transform", `translate(0, 260)`)
            .call(slider_topic4)


        var slider_topic5 = d3.sliderBottom()
        .min(0).max(1).ticks(1)
        .on('onchange', (val) => {
            topic_relative_filter[4] = val;
            console.log(topic_relative_filter);
            g.selectAll("circle").attr("fill", function(d){
                var wh = 0;
                if(d.topic1 >= topic_relative_filter[0] &&
                    d.topic2 >= topic_relative_filter[1] &&
                    d.topic3 >= topic_relative_filter[2] &&
                    d.topic4 >= topic_relative_filter[3] &&
                    d.topic5 >= topic_relative_filter[4] &&
                    d.topic6 >= topic_relative_filter[5] &&
                    d.topic7 >= topic_relative_filter[6] &&
                    d.topic8 >= topic_relative_filter[7] )
                    {
                        wh=1;
                    }
                if(wh == 1){return "red";}
            })
        })
        var topic5_filter = svg.append("g")
            .attr("transform", `translate(0, 320)`)
            .call(slider_topic5)

        
        var slider_topic6 = d3.sliderBottom()
        .min(0).max(1).ticks(1)
        .on('onchange', (val) => {
            topic_relative_filter[5] = val;
            console.log(topic_relative_filter);
            g.selectAll("circle").attr("fill", function(d){
                var wh = 0;
                if(d.topic1 >= topic_relative_filter[0] &&
                    d.topic2 >= topic_relative_filter[1] &&
                    d.topic3 >= topic_relative_filter[2] &&
                    d.topic4 >= topic_relative_filter[3] &&
                    d.topic5 >= topic_relative_filter[4] &&
                    d.topic6 >= topic_relative_filter[5] &&
                    d.topic7 >= topic_relative_filter[6] &&
                    d.topic8 >= topic_relative_filter[7] )
                    {
                        wh=1;
                    }
                if(wh == 1){return "red";}
            })
        })
        var topic6_filter = svg.append("g")
            .attr("transform", `translate(0, 380)`)
            .call(slider_topic6)


        var slider_topic7 = d3.sliderBottom()
        .min(0).max(1).ticks(1)
        .on('onchange', (val) => {
            topic_relative_filter[6] = val;
            console.log(topic_relative_filter);
            g.selectAll("circle").attr("fill", function(d){
                var wh = 0;
                if(d.topic1 >= topic_relative_filter[0] &&
                    d.topic2 >= topic_relative_filter[1] &&
                    d.topic3 >= topic_relative_filter[2] &&
                    d.topic4 >= topic_relative_filter[3] &&
                    d.topic5 >= topic_relative_filter[4] &&
                    d.topic6 >= topic_relative_filter[5] &&
                    d.topic7 >= topic_relative_filter[6] &&
                    d.topic8 >= topic_relative_filter[7] )
                    {
                        wh=1;
                    }
                if(wh == 1){return "red";}
            })
        })
        var topic7_filter = svg.append("g")
            .attr("transform", `translate(0, 440)`)
            .call(slider_topic7)


        var slider_topic8 = d3.sliderBottom()
        .min(0).max(1).ticks(1)
        .on('onchange', (val) => {
            topic_relative_filter[7] = val;
            console.log(topic_relative_filter);
            g.selectAll("circle").attr("fill", function(d){
                var wh = 0;
                if(d.topic1 >= topic_relative_filter[0] &&
                    d.topic2 >= topic_relative_filter[1] &&
                    d.topic3 >= topic_relative_filter[2] &&
                    d.topic4 >= topic_relative_filter[3] &&
                    d.topic5 >= topic_relative_filter[4] &&
                    d.topic6 >= topic_relative_filter[5] &&
                    d.topic7 >= topic_relative_filter[6] &&
                    d.topic8 >= topic_relative_filter[7] )
                    {
                        wh=1;
                    }
                if(wh == 1){return "red";}
            })
        })
        var topic8_filter = svg.append("g")
            .attr("transform", `translate(0, 500)`)
            .call(slider_topic8)

        function get_topic_relative_data(){     //用于筛选data的部分，逻辑和你的get_year_data是相似的，不过筛选用的数组是全局变量无需传参，可以考虑和你的那个整合一下，使得每次重绘图像都会同时考虑年份和topic关联度
            var data_remain=[]
            for(var i = 0; i < data.length; i++){
                var wh = 0;
                if(data[i].topic1 >= topic_relative_filter[0] &&
                   data[i].topic2 >= topic_relative_filter[1] &&
                   data[i].topic3 >= topic_relative_filter[2] &&
                   data[i].topic4 >= topic_relative_filter[3] &&
                   data[i].topic5 >= topic_relative_filter[4] &&
                   data[i].topic6 >= topic_relative_filter[5] &&
                   data[i].topic7 >= topic_relative_filter[6] &&
                   data[i].topic8 >= topic_relative_filter[7] ){
                       wh=1;
                   }

                if(wh == 1){
                    data_remain.push(data[i]);
                }
            }
            return data_remain;
        }
                //topic1
                const va = 700;
    const topic1 = svg.append('g')
    .attr('class','topic')
    .attr('transform', 'translate(1000,' + (height-100) + ')')
    .on('click',function(){                               
        g.selectAll("circle")
        .attr('fill',function(d){
           if(d.topic1>0.2){
                return 'blue';}               
        })
            })

  topic1.append('rect')
  .attr('width',70)
  .attr('height',20)
  .attr('x',-20)
  .attr('y',-850)
  .attr('fill','blue') ;

  topic1.append('text')
    .attr('x', 60)
    .attr('y', -835)
    .style('text-anchor', "front")
    .style('font-style', 'italic')
    .style('font-family', '"Lucida Console", "Courier New", monospace')
    .style('font-size', '15px')
    .style('font-weight','bold')
    .text('topic1');

    //topic2
    const topic2 = svg.append('g')
    .attr('class','topic')
    .attr('transform', 'translate(1000,' + (height-100) + ')')
    .on('click',function(){                               
        g.selectAll("circle")
        .attr('fill',function(d){
            if(d.topic2>0.2)
            return 'Purple';
        })
            })

  topic2.append('rect')
  .attr('width',70)
  .attr('height',20)
  .attr('x',-20)
  .attr('y',-820)
  .attr('fill','Purple') ;

  topic2.append('text')
    .attr('x', 60)
    .attr('y', -805)
    .style('text-anchor', "front")
    .style('font-style', 'italic')
    .style('font-family', '"Lucida Console", "Courier New", monospace')
    .style('font-size', '15px')
    .style('font-weight','bold')
    .text('topic2');

    //topic3
    const topic3 = svg.append('g')
    .attr('class','topic')
    .attr('transform', 'translate(1000,' + (height-100) + ')')
    .on('click',function(){                               
        g.selectAll("circle")
        .attr('fill',function(d){
            if(d.topic3>0.2)
            return 'Teal';
        })
            })

  topic3.append('rect')
  .attr('width',70)
  .attr('height',20)
  .attr('x',-20)
  .attr('y',-790)
  .attr('fill','Teal') ;

  topic3.append('text')
    .attr('x', 60)
    .attr('y', -775)
    .style('text-anchor', "front")
    .style('font-style', 'italic')
    .style('font-family', '"Lucida Console", "Courier New", monospace')
    .style('font-size', '15px')
    .style('font-weight','bold')
    .text('topic3');

    
    //topic4
    const topic4 = svg.append('g')
    .attr('class','topic')
    .attr('transform', 'translate(1000,' + (height-100) + ')')
    .on('click',function(){                               
        g.selectAll("circle")
        .attr('fill',function(d){
            if(d.topic4>0.2)
            return 'Green';
        })
            })

  topic4.append('rect')
  .attr('width',70)
  .attr('height',20)
  .attr('x',-20)
  .attr('y',-760)
  .attr('fill','Green') ;

  topic4.append('text')
    .attr('x', 60)
    .attr('y', -745)
    .style('text-anchor', "front")
    .style('font-style', 'italic')
    .style('font-family', '"Lucida Console", "Courier New", monospace')
    .style('font-size', '15px')
    .style('font-weight','bold')
    .text('topic4');

    //topic5
    const topic5 = svg.append('g')
    .attr('class','topic')
    .attr('transform', 'translate(1000,' + (height-100) + ')')
    .on('click',function(){                               
        g.selectAll("circle")
        .attr('fill',function(d){
            if(d.topic5>0.2)
            return 'Olive';
        })
            })

  topic5.append('rect')
  .attr('width',70)
  .attr('height',20)
  .attr('x',-20)
  .attr('y',-730)
  .attr('fill','Olive') ;

  topic5.append('text')
    .attr('x', 60)
    .attr('y', -715)
    .style('text-anchor', "front")
    .style('font-style', 'italic')
    .style('font-family', '"Lucida Console", "Courier New", monospace')
    .style('font-size', '15px')
    .style('font-weight','bold')
    .text('topic5');

    //topic6
    const topic6 = svg.append('g')
    .attr('class','topic')
    .attr('transform', 'translate(1000,' + (height-100) + ')')
    .on('click',function(){                               
        g.selectAll("circle")
        .attr('fill',function(d){
            if(d.topic6>0.2)
            return 'Orange';
        })
            })

  topic6.append('rect')
  .attr('width',70)
  .attr('height',20)
  .attr('x',-20)
  .attr('y',-700)
  .attr('fill','Orange') ;

  topic6.append('text')
    .attr('x', 60)
    .attr('y', -685)
    .style('text-anchor', "front")
    .style('font-style', 'italic')
    .style('font-family', '"Lucida Console", "Courier New", monospace')
    .style('font-size', '15px')
    .style('font-weight','bold')
    .text('topic6');

    //topic7
    const topic7 = svg.append('g')
    .attr('class','topic')
    .attr('transform', 'translate(1000,' + (height-100) + ')')
    .on('click',function(){                               
        g.selectAll("circle")
        .attr('fill',function(d){
            if(d.topic7>0.2)
            return 'OrangeRed';
        })
            })

  topic7.append('rect')
  .attr('width',70)
  .attr('height',20)
  .attr('x',-20)
  .attr('y',-670)
  .attr('fill','OrangeRed') ;

  topic7.append('text')
    .attr('x', 60)
    .attr('y', -655)
    .style('text-anchor', "front")
    .style('font-style', 'italic')
    .style('font-family', '"Lucida Console", "Courier New", monospace')
    .style('font-size', '15px')
    .style('font-weight','bold')
    .text('topic7');

    //topic8
    const topic8 = svg.append('g')
    .attr('class','topic')
    .attr('transform', 'translate(1000,' + (height-100) + ')')
    .on('click',function(){                               
        g.selectAll("circle")
        .attr('fill',function(d){
            if(d.topic8>0.2)
            return 'Maroon';
        })
            })

  topic8.append('rect')
  .attr('width',70)
  .attr('height',20)
  .attr('x',-20)
  .attr('y',-640)
  .attr('fill','Maroon') ;

  topic8.append('text')
    .attr('x', 60)
    .attr('y', -625)
    .style('text-anchor', "front")
    .style('font-style', 'italic')
    .style('font-family', '"Lucida Console", "Courier New", monospace')
    .style('font-size', '15px')
    .style('font-weight','bold')
    .text('topic8');

    });