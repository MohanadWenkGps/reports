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

    var stats = analyisReportResult(response).stats
    createTable(document.getElementById("tablesDiv"),stats,"statistic" )

    var tables = analyisReportResult(response).tables
    getAllRowsData(sid,tables)
    console.log(response)
    return response;
}

function analyisReportResult(response){
   return {"stats":response.reportResult.stats,
    "tables": response.reportResult.tables}
}

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
        console.log(tblData[i])
        for(var j = 0; j < tblData[0].length; j++){
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(tblData[i][j]));
                td.style.border = '1px solid black';
        }
    }
    console.log(parent)
    parent.appendChild(tbl);
}

function getAllRowsData(sid , tables){
    var i=0;
    tables.forEach(element => {
        getRowData(sid,i,element.rows - 1);
        i++
    });
}

function createLabel(parent,lblText){
    var lbl = document.createElement("Label");
    lbl.innerHTML = lblText;
    parent.appendChild(lbl)
}

function getRowData(sid,tableIndex,lastRowIndex){
    var svc= '',
    params = JSON.stringify({
		"tableIndex":tableIndex,
		"indexFrom":0,
		"indexTo":lastRowIndex
    })
    var response = makeRequest(sid,svc,params)
    console.log(response);
    return response;
}
