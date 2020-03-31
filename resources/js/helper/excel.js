var Promise = XlsxPopulate.Promise;

function getWorkbook() {
    return XlsxPopulate.fromBlankAsync();
}

function generate(data,type) {
    return getWorkbook()
        .then(function (workbook) {
            var sheet =workbook.sheet(0)
            sheet.cell("A1").value(data);
            console.log('data length: '+data.length)
            addRangeBorder(sheet,("A1:AH"+data.length))

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

function generateExcel(data) {
    return generate(data)
        .then(function (blob) {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, "out.xlsx");
            } else {
                var a = document.createElement("a");
                var url = window.URL.createObjectURL(blob);
                document.body.appendChild(a);
                a.href = url;
                a.download = "out.xlsx";
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

function clickBtn(){
    data = dataPreparedToexcel
    data.splice(0,0,headerData()[0])
    console.log('????????')
    console.log(data)
    generateExcel(data)
}

function colorCell(sheet,row,col,colorCode)
{
    var cell = sheet.row(row).cell(col)
    cell.style("fill", {
        type: "solid",
        color: {
            rgb: colorCode
        }
    });
}

function fontStyle(sheet,row,col){
    var cell = sheet.row(row).cell(col)
    cell.style({ fontColor: "0563c1", underline: true , blod : true , italic : true}) // chane font color and make it (bolid,italic and underLine)
    .hyperlink({ hyperlink: "http://example.com", tooltip: "example.com" }); //add hyperlink and tooltip
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

var borderStyle ={"border": true,
"borderColor": "red",
"borderStyle": "thin"
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

function addRangeBorder(sheet,_range){
    const range = sheet.range(_range);
    range.style(borderStyle)
}

function headerData(){
    var headerCol = 34,
    header = [], firstRow = []
    firstRow.push('#')
    firstRow.push('Name')
    for(var i = 1;i<= 31;i++) firstRow.push(i)
    firstRow.push('Total')
    header.push(firstRow)
    console.log(header)
    return header
}

