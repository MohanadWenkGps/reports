var Promise = XlsxPopulate.Promise;

var borderStyle ={
    "border": true,
    "borderStyle": "thin"
}

//----------------------------------------------------------------------------------
function getWorkbook() {
    return XlsxPopulate.fromBlankAsync();
}

function generate(data,details,type) {
    return getWorkbook()
        .then(function (workbook) {
            var sheet =workbook.sheet(0)

            var lastRow = data.length+1;
            sheet.cell("A1").value(data);
            setColWidth(sheet,data)
            setFormulaPerUnit(sheet,("AH4:AH"+data.length),"=SUM(C4:AG4)") 
            setFormulaPerUnit(sheet,("C"+(lastRow)+":AH"+(lastRow)),"=SUM(C4:C"+data.length+")")
            styleTable(sheet,("A3:AH"+lastRow),"A3:AH3",("A3:A"+lastRow))
            sheet.cell("B"+lastRow).value("المجموع اليومي")
            setBoldRange(sheet,'AH3:AH'+lastRow)
            setBoldRange(sheet,'A'+lastRow+':AH'+lastRow)
            colorCell(sheet,lastRow,34,'FFFF00')

            var firstRowTitle = details.reportName+"      |      "+details.groupName;
            var secondRowTitle = "From: "+details.fromDate+"  -  To: "+details.toDate
            setTitleStyle(sheet,"B1:AG1","C2:Y2",firstRowTitle,secondRowTitle,30)

            
        

            // const maxStringLength = sheet.range("A1:A20").reduce((max, cell) => {
            //     const value = cell.value();
            //     if (value === undefined) return max;
            //     return Math.max(max, value.toString().length);
            // }, 0);
            // console.log(maxStringLength)            
            // sheet.column(1).width(maxStringLength + widthFactor);



            //mergeRange(sheet,"C1:AF1","Report Name",true,14)
            //sheet

            //workbook.sheet(0).cell("A2").style("fill","#ff0000")
            // fillCellsWithCondition(data,workbook.sheet(0))
            // mergeRang(workbook.sheet(0))
            //addBorder(workbook.sheet(0),7,2)
            // const r = workbook.sheet(0).range("A1:C3");
            // // Set all cell values to the same value:
            // r.value(5);
           // workbook.sheet(0).cell("A1").value("This was created in the browser!").style("fontColor", "ff0000");
            return workbook.outputAsync({ type: type });
        });
}

function generateExcel(data,excelDetails) {
    return generate(data,excelDetails)
        .then(function (blob) {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob,(excelDetails.excelTitle +".xlsx"));
            } else {
                var a = document.createElement("a");
                var url = window.URL.createObjectURL(blob);
                document.body.appendChild(a);
                a.href = url;
                a.download = excelDetails.excelTitle +".xlsx";
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        })
        .catch(function (err) {
            alert(err.message || err);
            throw err;
        });
}



function colorEmptyCell(sheet,_range,colorCode)
{
    var range = sheet.range(_range);
    range.forEach(cell =>{
        if(cell.value() == '-')
            cell.style("fill", {
                type: "solid",
                color: {
                    rgb: colorCode
                }
            });
    })
}

function fontStyle(sheet,row,col){
    var cell = sheet.row(row).cell(col)
    cell.style({ fontColor: "0563c1", underline: true , blod : true , italic : true}) // chane font color and make it (bolid,italic and underLine)
    .hyperlink({ hyperlink: "http://example.com", tooltip: "example.com" }); //add hyperlink and tooltip
}

function colorCell(sheet,row,col,colorCode){
    var cell = sheet.row(row).cell(col)
    cell.style("fill",colorCode)
}

function fillCellsWithCondition(data,sheet){
    // let condition fill cells with red if value < 10
    var row =1;
    var colorCode="f54949"
    data.forEach(element => {
        var col = 1;
        element.forEach(value =>{
            if (value < 10 ) {
            colorCell(sheet,row,col,colorCode)
        }
        col++
    })
    row++
    });
}


function mergeRange(sheet,_range,text,hasBorder,_fonSize){
    const range = sheet.range(_range);
    range.value(text);
    range.merged(true)
    range.style({horizontalAlignment: "center",
    verticalAlignment: "center",
    blod : true ,
    fontSize : _fonSize})
    if(hasBorder) range.style(borderStyle)
}


function styleTable(sheet,_range,topTitleRange,leftTitleRange){
    const range = sheet.range(_range);
    range.style(borderStyle) //add border
    range.style({horizontalAlignment: 'center'})
    colorEmptyCell(sheet,_range,'FF0000')

    var titleStyle = {
        bold: true,
        "fill": {
            type: "solid",
            color: {rgb: '8ac3f2'}
        }
    }
    if(topTitleRange){
        sheet.range(topTitleRange).style(titleStyle)
    } 
    if(leftTitleRange){
        sheet.range(leftTitleRange).style(titleStyle)
    }
}

function setBoldRange(sheet,_range){
    var range = sheet.range(_range)
    range.style("bold",true)
}

function headerData(){
    var header = [], firstRow = [] , secondRow=[],thirdRow=[]
    
    for(var x=0; x<34 ;x++){
        firstRow.push('')
        secondRow.push('')
    }

    thirdRow.push('#')
    thirdRow.push('Name')
    for(var i = 1;i<= 31;i++) {
        thirdRow.push(i)
    }
    thirdRow.push('المجموع الشهري')

    header.push(firstRow)
    header.push(secondRow)
    header.push(thirdRow)

    return header
}

function setFormulaPerUnit(sheet,range,formula){
  //  console.log(range)
    var cellFormula = formula;       
    sheet.range(range).formula(cellFormula);
}



function fitCellWidth(sheet,data){
    for(var col=1; col <= data[1].length;col++){
        const maxStringLength = sheet.range(1,col,data.length,col).reduce((max, cell) => {
            const value = cell.value();
            if (value === undefined) return max;
            return Math.max(max, value.toString().length);
        }, 0);
        //console.log("col: "+col +"  maxWidth: "+maxStringLength)
        sheet.column(col).width(maxStringLength)
    }
}

function setColWidth(sheet,data){
    for(var col=1; col <= data[1].length;col++){
        var width = 4
        if(col ==2) width=40
        else if(col == data[1].length) width = 13
        sheet.column(col).width(width)
    }
}


function setTitleStyle(sheet,rangeFirstRow,rangeSecondRow,titleFirstRow,titleSecRow,rowHeight){
    styleEachRowTitle(sheet,rangeFirstRow,titleFirstRow,14)
    styleEachRowTitle(sheet,rangeSecondRow,titleSecRow,11)
    sheet.row(1).height(rowHeight)
    sheet.row(2).height(rowHeight)

    function styleEachRowTitle(sheet,_range,title,_fontSize){
        var range = sheet.range(_range)
        var titleStyle = {
            fontSize: _fontSize,
            bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
            fill: {
                type: "solid",
                color: {rgb: '8ac3f2'}
            },
            border: true,
            borderStyle:"thin"
        }
        range.style(titleStyle)
        range.merged(true)
        range.value(title)

      
    }
}



