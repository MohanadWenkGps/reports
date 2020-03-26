// var workbook = new Excel.Workbook();
// const ExcelJS = require('exceljs');

function executeReport(sid,resId,reportId,itemId,from,to){
    cleanReportResult(sid)
    var svc = 'report/exec_report'
    var params = JSON.stringify({
        "reportResourceId": resId,
        "reportTemplateId": reportId,
        "reportObjectId": itemId,
        "reportObjectSecId": 0,
        "interval": {
            "from": from,
            "to": to,
            "flags": 0
        }
    })
    var response = makeRequest(sid,svc,params)

    var stats = response.reportResult.stats
    createTable(document.getElementById("tablesDiv"),stats,"statistic" )
    createButtonForList("statistic",-1,true)
    var tables = response.reportResult.tables
   // console.log(analyseTables(sid,tables))
    getTablesNames(tables)
    console.log(response)
    return response;
}

function getTablesNames(tables){
    var allTables = []    //tables = {label ="", headers = [] , rows = [] }
    var i =0;    
    tables.forEach(tbl => {
        allTables.push({
            "label": tbl.label,
            "rows": tbl.rows
        })
        createButtonForList(tbl.label,i)
        i++
    });
    return allTables
}

// function analyseTables(sid,tables){
//     var eachTable = []    //tables = {label ="", headers = [] , rows = [] }
//     var i=0;
//     tables.forEach(tbl => {
//         eachTable.push({
//             "label": tbl.label,
//             "headers": tbl.header,
//             "rows": getRowData(sid,i,0,(tbl.rows - 1))
//         })
//         i++
//     });
//     return eachTable
// }

function cleanReportResult(sid){
    var svc='report/cleanup_result'
    var params = JSON.stringify({});
    makeRequest(sid,svc,params);
}

function createTable(parent,tblData,tblName){
    createLabel(parent,tblName)
    var tableLen = tblData.length;
    var tbl  = document.createElement('table');
    tbl.style.width  = '400px';
    tbl.style.border = '1px solid black';
    for(var i = 0; i < tableLen; i++){
        var tr = tbl.insertRow();
        for(var j = 0; j < tblData[0].length; j++){
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(tblData[i][j]));
                td.style.border = '1px solid black';
        }
    }
    parent.appendChild(tbl);
}

// function getAllRowsData(sid , tables){
//     var i=0;
//     tables.forEach(element => {
//         getRowData(sid,i,(element.rows - 1));
//         i++
//     });
// }

function createLabel(parent,lblText){
    var lbl = document.createElement("Label");
    lbl.innerHTML = lblText;
    parent.appendChild(lbl)
}

function getRowData(sid,tableIndex,fromIndex,toIndex){
    var svc= 'report/get_result_rows',
    params = JSON.stringify({
		"tableIndex":tableIndex,
		"indexFrom":fromIndex,
		"indexTo":toIndex
    })

    var response = makeRequest(sid,svc,params)
    return response;
}

function createExcel(){
// var wb = XLSX.utils.book_new();
// wb.Props = {
//         Title: "SheetJS Tutorial",
//         Subject: "Test",
//         Author: "Red Stapler",
//         CreatedDate: new Date(2017,12,19)
// };

// wb.SheetNames.push("Test Sheet");
// var ws_data = [['hello' , 'world'],[11,44]];
// var ws = XLSX.utils.aoa_to_sheet(ws_data);
// wb.Sheets["Test Sheet"] = ws;
// var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
// function s2ab(s) {

//         var buf = new ArrayBuffer(s.length);
//         var view = new Uint8Array(buf);
//         for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
//         return buf;
        
// }

//     saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');

}


function createButtonForList(name,id,active){
    var _class="";
    var parent = document.getElementById("listOfTables")
    var btn = document.createElement('button')
    btn.setAttribute("id",id)
    btn.innerHTML= name
    if(active) _class = " active"
    btn.setAttribute("class","list-group-item list-group-item-action"+_class)
    parent.appendChild(btn)
}