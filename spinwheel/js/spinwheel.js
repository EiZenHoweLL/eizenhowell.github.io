const defaultData = [
    {
        "label":"Test 1"
        ,"value": 1
        ,"caption": "This is the text for test 1"
    },{
        "label":"Test 2"
        ,"value": 2
        ,"caption": "This is the text for test 2"
    },{
        "label":"Test 3"
        ,"value": 3
        ,"caption": "This is the text for test 3"
    },{
        "label":"Test 4"
        ,"value": 4
        ,"caption": "This is the text for test 4"
    },{
        "label":"Test 5"
        ,"value": 5
        ,"caption": "This is the text for test 5"
    },{
        "label":"Test 6"
        ,"value": 6
        ,"caption": "This is the text for test 6"
    },{
        "label":"Test 7"
        ,"value": 7
        ,"caption": "This is the text for test 7"
    },{
        "label":"Test 8"
        ,"value": 8
        ,"caption": "This is the text for test 8"
    },{
        "label":"Test 9"
        ,"value": 9
        ,"caption": "This is the text for test 9"
    },];



function initializeData(data){
    // use default data if no data was provided.
    data = data == null? defaultData : data;
    // default values
    var padding = {top:0, right:40, bottom:0, left:20};
    var dW = 500 - padding.left - padding.right;
    var dH = 500 - padding.top - padding.bottom;
    var dR = Math.min(dW,dH)/2;
    var rotation = 0;
    var oldrotation = 0;
    var color = d3.scale.category20();
    var ele = document.getElementById("chart");
    ele.innerHTML = "";
    var svg         = d3.select("#chart")
                        .append("svg")
                        .data([data])
                            .attr("width", dW + padding.left + padding.right)
                            .attr("height", dH + padding.top + padding.bottom);
    var container   = svg.append("g")
                        .attr("transform", "translate(" + (dW/2 + padding.left) +","+ (dH/2 + padding.top) + ")");
    var vis         = container.append("g");
    var pie         = d3.layout.pie().sort(null).value(function(d){return 1;});
    // generatem and draw the chart using arc generator
    var arc         = d3.svg.arc().outerRadius(dR);
    var arcs        = vis.selectAll("g.slice")
                        .data(pie)
                        .enter()
                        .append("g")
                        .attr("class", "slice");
    arcs.append("path")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", function(d, i){return color(i);})
        .attr("d", function(d){ return arc(d)});
    
    arcs.append("text").attr("transform", function(d){
        d.innerRadius = 0;
        d.outerRadius = dR;
        d.angle = (d.startAngle + d.endAngle)/2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) +")translate("+(d.outerRadius-10)+")";})
        .attr("text-anchor", "end")
        .text(function (d, i){
            return data[i].label
        });
    container.on("click", spin);
    function spin(d){
        container.on("click", null);
        var ps = 360/data.length, 
            pieslice = Math.round(1440/data.length),
            rng = Math.floor((Math.random() * 1440)+360);

            rotation = (Math.round(rng/ps)*ps);
            picked = Math.round(data.length - (rotation%360)/ps);
            picked = picked >= data.length ? (picked % data.length): picked;
            
            rotation += 90 - Math.round(ps/2);
            vis.transition()
                .duration(3000) //3s
                .attrTween("transform", rotTween)
                .each("end", function(){
                    //d3.select(".slice:nth-child(" + (picked+1)+") path")
                    //.attr("fill", "")
                    d3.select("#caption .text")
                    .text(data[picked].caption);
                    oldrotation = rotation;
                    container.on("click", spin);
                })
    }
    //make arrow
    svg.append("g")
    .attr("transform", "translate(" + (dW + padding.left + padding.right) + "," + ((dH/2)+padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (dR*.15) + ",0L0," + (dR*.05) + "L0,-" + (dR*.05) + "Z")
    .style({"fill":"black"});
    var logo = document.customForm.logo.value;
    if (logo==null || logo==""){
        //draw spin circle
        container.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 60)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .style({"fill":"white","cursor":"pointer"});

        //spin text
        container.append("text")
            .attr("x", 0)
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .text("SPIN")
            .style({"font-weight":"bold", "font-size":"30px","cursor":"pointer"});
    } else {
        container.append("defs")
            .append("pattern")
            .attr("id", "customlogo")
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("viewbox", "0 0 120 120")
            .append("image")
            .attr("x", "0%")
            .attr("y", "0%")
            .attr("height", 120)
            .attr("width", 120)
            .attr("xlink:href", logo);
        //draw spin circle
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 60)
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("fill","url(#customlogo)")
            .style({"cursor":"pointer",});
    }

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

}

function delNode(rowNumber){
    var tableData = document.getElementById("data-table");
    tableData.deleteRow(rowNumber);
    renderData();

}

function addNode(){
    addNode(null);
}

function addNode(data){
    var tableData = document.getElementById("data-table");
    var rowCount = tableData.rows.length;
    var row = tableData.insertRow(-1);
    var cell = row.insertCell(0); // Text 
    cell.appendChild(generateInput("text", "text", data!=null?data.label:"Test "+rowCount , null));
    var cell = row.insertCell(1); // Caption 
    cell.appendChild(generateInput("caption", "text", data!=null?data.caption:"Caption for Text "+rowCount, null));
    var cell = row.insertCell(2); // hidden value + button 
    cell.appendChild(generateInput("caption", "hidden", data!=null?data.value:rowCount, null));
    cell.appendChild(generateInput("del", "button", "-", "delNode("+ (rowCount) + ")"));
    renderData();
}

function generateInput(name, type, value, onclick){
    var inputEl = document.createElement("input");
    inputEl.type = type;
    inputEl.name = name;
    inputEl.value = value;
    if (type == "text"){
        inputEl.setAttribute("onchange","renderData();");
    }
    if (onclick!= null){
        inputEl.setAttribute("onclick", onclick);
    }
    return inputEl;
}

function generateDefault(){
    var dataTable = document.getElementById("data-table");
    var rowCount = dataTable.rows.length;
    // delete all row, to make place for new data
    while(rowCount > 1){
        dataTable.deleteRow(-1);
        rowCount = dataTable.rows.length;
    }
    for (var i=0; i<defaultData.length;i++){
        addNode(defaultData[i]);
    }
    renderData();
}

function processData(){
    var returnData = [];
    var dataTable = document.getElementById("data-table");
    var rowCount = dataTable.rows.length;
    for (var i=0;i<rowCount-1;i++){
        var arrayData = {label:"",caption:"",value:""}
        arrayData.label = dataTable.rows[i+1].cells[0].children[0].value;
        arrayData.caption = dataTable.rows[i+1].cells[1].children[0].value;
        arrayData.value = dataTable.rows[i+1].cells[2].children[0].value;
        returnData[i]=arrayData;
    }
    return returnData;
}

function renderData(){
    var spinwheeldata = processData();
    document.dataForm.textData.value = JSON.stringify(spinwheeldata);
    initializeData(spinwheeldata);
}

function applyPageCustomization(){
    var customForm = document.customForm;
    var spinny = document.getElementById("spinny");
    if (customForm.color.value!=null){
        spinny.setAttribute("style", "background-color:"+customForm.color.value);
    }
    renderData();

}