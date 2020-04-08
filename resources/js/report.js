function getExecuteReport(sid,resId,reportId,itemId,from,to,callbackSuccess){
    cleanReportResult(sid,res=>{if(res.error ==0) console.log('!!!report cleaned')})
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
    makeRequest(sid,svc,params,res=>{callbackSuccess(res)})


//     var stats = response.reportResult.stats
//     createTable(document.getElementById("tablesDiv"),stats,"statistic" )
//     createButtonForList("statistic",-1,true)
//     var tables = response.reportResult.tables
//    // console.log(analyseTables(sid,tables))
//     getTablesNames(tables)
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

function cleanReportResult(sid,callbackSuccess){
    var svc='report/cleanup_result'
    var params = JSON.stringify({});
    makeRequest(sid,svc,params,res=>callbackSuccess(res));
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

// function getRowData(sid,tableIndex,fromIndex,toIndex){
//     var svc= 'report/get_result_rows',
//     params = JSON.stringify({
// 		"tableIndex":tableIndex,
// 		"indexFrom":fromIndex,
// 		"indexTo":toIndex
//     })

//     var response = makeRequest(sid,svc,params)
//     return response;
// }

function getRowAndSubData(sid,tableIndex,fromIndex,toIndex,callbackSuccess){
    var svc= 'report/select_result_rows',
    params = JSON.stringify({
		"tableIndex":tableIndex,
		"config":{
			"type":"range",
			"data":{
				"from":fromIndex,
				"to":toIndex,
				"level":1
			}
        }
    })

    makeRequest(sid,svc,params,callbackSuccess)

}

function analyseRowData(rowData, callback){
    // eachRow [index,unitName,numOfTrips fpr day 1 ,numOfTrips fpr day 2,numOfTrips fpr day 3 .....]
    var _row = []
    var count=1;
    rowData.forEach(row =>{
        var eachRow = [] 
        for(var i=0;i<34;i++) eachRow.push('-')

        eachRow.splice(0,1,count)  //add sequence
        eachRow.splice(1,1,row.c[1]) //add unit name
        fillNumberOFTripsPerDays(eachRow,row.r)
        _row.push(eachRow)
        count++
    })
    callback(_row)
    //return _row
}

function fillNumberOFTripsPerDays(eachRow,data){
   // var tripsPerDays = []
    data.forEach(element =>{
        var timeStart = new Date(element.t1 *1000);
        var day = timeStart.getDate()
        eachRow.splice(day+1 ,1, element.d)
    })
    //console.log(eachRow)

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