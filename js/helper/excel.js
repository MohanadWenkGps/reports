var Promise = XlsxPopulate.Promise;

function getWorkbook() {
    return XlsxPopulate.fromBlankAsync();
}

function generate(data,type) {
    return getWorkbook()
        .then(function (workbook) {
            workbook.sheet(0).cell("A1").value(data);
            //workbook.sheet(0).cell("A2").style("fill","#ff0000")
            fillCellsWithCondition(data,workbook.sheet(0))
            mergeRang(workbook.sheet(0))
            addBorder(workbook.sheet(0),7,2)
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
    data = [
        [10,2,3],
        [4,40,14],
        [11,8,9]
    ]
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

function mergeRang(sheet){
    const range = sheet.range("D1:F3");
    range.value("WenkGPS");
    range.merged(true)
    range.style({horizontalAlignment: "center", verticalAlignment: "center"})
    range.style(borderStyle)
}

function addBorder(sheet,row,col){
    var cell = sheet.row(row).cell(col)
    cell.style(borderStyle);
}