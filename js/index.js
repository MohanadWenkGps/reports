var uid;
var resourceId;
var objectsNamesAndIds = []
function loading() {
    // check token

    var token = getCookie("Token")
    if (token == "") location.replace("http://127.0.0.1:8002/login.html");
   
    var res = getUserDetails(token);
  
    setCookie("sid",res.sid,6)
    resourceId = res.resourceId;
    uid = res.id;

    keepSidValid(getCookie("sid"));

    // document.getElementById("demo").innerHTML = document.getElementById("demo").innerHTML + "     sid is: "+getCookie("sid") + 
    //                                             "   resId: "+resourceId  + "   user id: "+uid;
    
    fillReportDropList(getReportsName(getCookie("sid"),resourceId));
    objectsNamesAndIds = getObjectNamesAndIds(getCookie("sid"))
    fillObjectsDropList(objectsNamesAndIds)

    //createTable(document.getElementById("tablesDiv"),null,"abcs")
    //loadExcel();
    // window.parent.location.replace("http://127.0.0.1:8002/excelExample.html")
}


function fillReportDropList(arr){
    var select = document.getElementById("reportNames");
    arr.forEach(element => {
        var option = document.createElement("option");
        option.text = element.n;
        select.add(option);
    });
}

function fillObjectsDropList(arr){
    var select = document.getElementById("objectNames");
    arr.forEach(element => {
        var option = document.createElement("option");
        option.text = element.name;
        select.add(option);
    });
}

function getReportsName(_sid,resourceId){
    var svc = 'report/get_report_data'
    var params = '{"itemId":'+resourceId+', "col":[1,2,3,4,5,6,7,8,9,10,11,12,13]}' 
    var response = makeRequest(_sid,svc,params)
    return response;
}

function getObjectNamesAndIds(_sid){
    var svc = 'core/search_items'
    var params = JSON.stringify({
           "spec": {
            "itemsType": "avl_unit",
            "propName": "sys_name ",
            "propValueMask": "*",
            "sortType": "sys_name ",
            "propType": "",
            "or_logic": 1
        },
        "force": 1,
        "flags": 1,
        "from": 0,
        "to": 20
    });
    var items = makeRequest(_sid,svc,params).items
    var arr= [] ;
    var i=0; 
    items.forEach(item => {
        arr.push({"name" : item.nm , "id" : item.id});
    })
    return arr;
}

function _executeReport(){
    var x = {"a":1 , "b":2}
    console.log(typeof(x))
    var reportList = document.getElementById("reportNames");
    var objectList = document.getElementById("objectNames");
    var itemIndex = objectList.selectedIndex;

    var reportId=reportList.selectedIndex +1
    var itemId = getItemId(objectsNamesAndIds,itemIndex)
    executeReport(getCookie("sid"),resourceId,reportId,itemId,getIntervals().fromTimeStamp,getIntervals().toTimeStamp)
}

function getIntervals(){
    var from = document.getElementById("fromDate"),
        to = document.getElementById("toDate");
    var fromTimeStamp = new Date(from.value).getTime() / 1000;
    var toTimeStamp = new Date(to.value).getTime() / 1000;
    return {fromTimeStamp, toTimeStamp}
}


function getItemId(arr,itemIndex){ 
    return arr[itemIndex].id;
}