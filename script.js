function hideQuestion() {
    let question = document.getElementById('question')
            question.style.display = 'none'
            question.style.visibility = 'none'
            question.style.opacity = '0'
} 

const congratulations = (label1, label2) => {
    return label1 + '         ' +label2
    
}
// handling data from csv
const rawCsv = 'Cameron Greene,Samantha Russell,Lucas Peters,Gordon Churchill,Austin Hill,Ava MacLeod,Katherine Newman,Max Poole,Paul Arnold'
const rawData = rawCsv.split(',')
const data = rawData.map(name => {
    const names = name.split(' ')
    let firstName = names[0]
    let secondName = names[1]
    return ({ label1: firstName, label2: secondName,  question() {return congratulations(this.label1, this.label2)} })
})

//Setting-up spinning wheel
var padding = {top:20, right:40, bottom:0, left:0},
    w = 610 - padding.left - padding.right,
    h = 610 - padding.top  - padding.bottom,
    r = Math.min(w, h)/2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    myColors = ['#FDDD19', '#C7E3D4', '#E94548'],
    color = d3.scale.ordinal().domain(data).range(myColors);//category20c()
    //randomNumbers = getRandomNumbers();
//http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results
var cheer = new Audio('assets/cheer.mp3')
var clicks = new Audio('assets/clicksQ.mp3')

var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width",  w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
var vis = container
    .append("g");
    
var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");
    
arcs.append("path")
    .attr("fill", function(d, i){return color(i)})
    .attr("d", function (d) { return arc(d); });
// add the text
arcs.append("text").attr("transform", function(d){
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle)/2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 115) +", " + (-12) + ")";
    })
    .attr("text-anchor", "middle")
    .text( function(d, i) {
        return data[i].label1;
    });
arcs.append("text").attr("transform", function(d){
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle)/2;
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 115) +", " + (12) + ")";
})
.attr("text-anchor", "middle")
.text( function(d, i) {
    return data[i].label2;
});
container.on("click", spin);
function spin(d){
    clicks.play()
    container.on("click", null);
    //all slices have been seen, all done
    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if(oldpick.length == data.length){
        console.log("done");
        container.on("click", null);
        return;
    }
    var  ps       = 360/data.length,
        pieslice = Math.round(1440/data.length),
        rng      = Math.floor((Math.random() * 1440) + 360);
        
    rotation = (Math.round(rng / ps) * ps);
    
    picked = Math.round(data.length - (rotation % 360)/ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
    if(oldpick.indexOf(picked) !== -1){
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }
    rotation += 90 - Math.round(ps/2);
    vis.transition()
        .duration(3500)
        .attrTween("transform", rotTween)
        .each("end", function(){
            //mark question as seen
            d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                .attr("fill", "#000");
            //populate question
            d3.select("#question h1")
                .text(data[picked].question());
            oldrotation = rotation;
            
            //confetti trigger
              var count = 200;
              var defaults = {
                origin: { y: 0.7 }
              };
              
              function fire(particleRatio, opts) {
                confetti(Object.assign({}, defaults, opts, {
                  particleCount: Math.floor(count * particleRatio)
                }));
              }
              
              fire(0.25, {
                spread: 26,
                startVelocity: 55,
              });
              fire(0.2, {
                spread: 60,
              });
              fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
              });
              fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2
              });
              fire(0.1, {
                spread: 120,
                startVelocity: 45,
              });

            //cheer trigger
            cheer.play()

            //display #question div
            let question = document.getElementById('question')
            question.style.display = 'block'
            question.style.visibility = 'visible'
            question.style.opacity = '1'
        
            /* Get the result value from object "data" */
            console.log(data[picked].label)
        
            /* Comment the below line for restrict spin to sngle time */
            container.on("click", spin);
        });
}
//make arrow
svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r*.18) + ",0L0," + (r*.10) + "L0,-" + (r*.10) + "Z")
    .style({"fill":"black"});
//draw spin circle
container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({"fill":"#black","cursor":"pointer"});
//draw border circle
container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 281)
    .style({"fill":"transparent","cursor":"pointer","stroke":"black","stroke-width":"8"});
//spin text
container.append("text")
    .attr("x", 0)
    .attr("y", 12)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({"font-weight":"bold", "font-family": "bbr-medium", "font-size":"30px", "fill":"#E94548"});


function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function(t) {
    return "rotate(" + i(t) + ")";
    };
}


function getRandomNumbers(){
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
    if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
        //no support for crypto, get crappy random numbers
        for(var i=0; i < 1000; i++){
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}