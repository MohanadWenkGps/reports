var uid,
 resourceId,
 id_amana_baghdad = 16581331,
 user_baghdad_rent = 'baghdad-rent', //id is 16581330
 sidAmana ,
 reportsFlag = '2',
 listOfReports=[],
 listOfObjects=[],
 dataPreparedToexcel

 document.addEventListener('DOMContentLoaded', function() {
    loading()
 }, false);



function loading() {
    // check token

    var token = getCookie("Token")
    if (token == "") location.replace("http://127.0.0.1:8002/login.html");
   
    var res = getUserDetails(token);
    setCookie("sid",res.sid,6)
    resourceId = res.resourceId;
    uid = res.id;
    setUsername(res.username)
    keepSidValid(getCookie("sid"));
    
    sidAmana = getSid(getCookie("Token"),user_baghdad_rent)
    keepSidValid(sidAmana)

    //listOfObjects = getAllUnitGroups(sidAmana)
    var resources = getResourceById(getCookie("sid"),id_amana_baghdad);
    fillResourceNames(resources)
    fillReportDropList(resources)
    //console.log(listOfObjects)
    console.log(getUnitGroupIds(sidAmana,id_amana_baghdad,20))

    document.getElementById("fromDate").defaultValue = "2020-01-01T01:00";
    document.getElementById("toDate").defaultValue = "2020-01-02T01:00";
    
}


function fillReportDropList(arr){
    var select = document.getElementById("reportNames");
    var data = arr.item.rep
    Object.keys(data).map(key => {
        if (data[key].n.indexOf(reportsFlag) > 1)   {
            var option = document.createElement("option");
            option.text = data[key].n;
            select.add(option);
            
            // listOfReports.push({"name":data[key].n,"id":data[key].id})
            listOfReports.push({"name":data[key].n,"id":66})
        }
    })
}

function fillObjectsDropList(arr){
    var select = document.getElementById("objectNames");
    arr.forEach(element => {
        var option = document.createElement("option");
        option.text = element.name;
       // option.setAttribute("id",element.id)
        select.add(option);
    });
}


function _executeReport(){
    var reportList = document.getElementById("reportNames");
     objectList = document.getElementById("objectNames"),
     reportId= getItemId(listOfReports, getSelectedValue(reportList)),
     itemId = getItemId(listOfObjects, getSelectedValue(objectList));

    var response = executeReport(sidAmana,id_amana_baghdad,reportId,itemId,getIntervals().fromTimeStamp,getIntervals().toTimeStamp)
    var rowsCount = response.reportResult.tables[0].rows 
    // console.log(response)
    var rowData =getRowAndSubData(sidAmana,0,0,rowsCount)
    dataPreparedToexcel = analyseRowData(rowData)
    console.log(dataPreparedToexcel)
}

function getSelectedValue(dropList){
   return dropList.options[dropList.selectedIndex].value;
}

function getIntervals(){
    var from = document.getElementById("fromDate"),
        to = document.getElementById("toDate");
    var fromTimeStamp = new Date(from.value).getTime() / 1000,
    toTimeStamp = new Date(to.value).getTime() / 1000;
    return {fromTimeStamp, toTimeStamp}
}


function getItemId(arr,itemName){ 
    var _id=0
    arr.forEach(element =>{
        if(element.name == itemName) _id = element.id
    })
    return _id
}


function fillResourceNames(arr){
    //console.log(arr)
    var resourceDropList = document.getElementById("resourceNames")
   // arr.item.forEach(resource =>{
        var option = document.createElement("option");
        option.text = arr.item.nm;
        resourceDropList.add(option);
   // })
}

function setUsername(_username){
    var user = document.getElementById("username")
    user.innerHTML = _username
}

function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
   }

   function isDateInDuration(valueCompared,_day,_month){
    var a = new Date(valueCompared *1000);
    var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var day = a.getDate();
    // var hour = a.getHours();
    // var min = a.getMinutes();
    // var sec = a.getSeconds();
    //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    if(month == _month && day == _day) return true;
    else return false
   

    // var date = new Date(valueCompared*1000);
    // var month = date.getMonth()
    // var day = date.getDay()
    // console.log(date+" "+day + " "+month)
    // if(month == _month && day == _day) return true;
   }

   function fillObjects(reportList){
    var objectList = document.getElementById("objectNames"),
    reportId= getItemId(listOfReports, getSelectedValue(reportList))
    clearSelectOption(objectList)

    listOfObjects = getUnitGroupNames(sidAmana,id_amana_baghdad,reportId)
    fillObjectsDropList(listOfObjects)
   }

   function clearSelectOption(select){
    var length = select.options.length;
    for (i = length-1; i >= 0; i--) {
      select.options[i] = null;
    }
   }