var uid,
 resourceId,
 id_manager3 = 8943764,
 id_amana_baghdad = 16581331,
 user_baghdad_rent = 'baghdad-rent', //id is 16581330
 sidAmana ,
 reportsFlag = 'custom',
 listOfResources = [],
 listOfReports=[],
 listOfObjects=[],
 dataPreparedToexcel,

 //HTML elements
 e_reportsList,
 e_objectsList,
 e_fromDatePicker,
 e_toDatePicker,
 e_executeReportBtn,
 e_loadingDiv


 document.addEventListener('DOMContentLoaded', function() {
    loading(() =>{
        document.getElementById("loading").style.visibility = "hidden";
        
    })
 }, false);



function loading(callback) {
    console.log(getNumFromStr("ajhasd8797aydh327egb"))
    // check token
    defineElements()
    var token = getCookie("Token")
    if (token == "") location.replace("login.html");
   
    getUserDetails(token, res =>{
        setCookie("sid",res.sid,6)
        
        resourceId = res.resourceId;
        uid = res.id;
        setUsername(res.username)
        keepSidValid(getCookie("sid"));
        setLocalization(getCookie("sid"),res=>{console.log(res)})
        
        
        // getSid(getCookie("Token"),user_baghdad_rent, eid =>{
        //     sidAmana = eid
        //     keepSidValid(sidAmana)

            getResourceById(getCookie("sid"),id_amana_baghdad, response =>{
                if(response.hasOwnProperty('item')){
                     fillResourceNames(response)
                     fillReportDropList(response)
                     _fillObjects(e_reportsList)
                 }else {
                     alert('لا يمكن الوصول الى تقارير البلديات بصلاحيات حسابك, يرجى الدخول بأسم مستخدم اخر')
                     clickSignOut()
                    }
                 callback();
            });

      //  })
    });
    // listOfResources = getResourcesWithCreatorId(getCookie('sid'),id_manager3)
    // console.log(listOfResources)
   // console.log(response)

    //fillReportDropList(getReportsNames(listOfResources,id_amana_baghdad))
    

    e_fromDatePicker.defaultValue = "2020-01-01T00:00";
    e_toDatePicker.defaultValue = "2020-01-01T23:59";

    // console.log(listOfResources)
}

function defineElements(){
    e_resourcesList = document.getElementById("resourceNames")
    e_reportsList = document.getElementById("reportNames")
    e_objectsList = document.getElementById("objectNames")
    e_fromDatePicker = document.getElementById("fromDate")
    e_toDatePicker = document.getElementById("toDate")
    e_executeReportBtn =document.getElementById("executBtn")
    e_userLabel = document.getElementById("username")
    e_loadingDiv = document.getElementById("loadingDiv")
}

// function getReportsNames(listOfResources,IdResource){
//     var data = function(){
//         var reps ;
//         listOfResources.forEach(element =>{
//             if(element.id == IdResource) reps = element.reports
//         })
//         return reps
//     }
//     console.log('data')
//     console.log(data())
//     var minReportList = [] //clear list of reports
//     Object.keys(data()).map(key => {
//             var option = document.createElement("option");
//             option.text = data()[key].n;
//             e_reportsList.add(option);
//             minReportList.push({"name":data()[key].n,"id":data()[key].id})
//     })
//     return minReportList
// }

// function fillReportDropList(arr){
//     arr.forEach(element =>{
//         var option = document.createElement("option");
//         option.text = element.name;
//         e_reportsList.add(option);
//     })
// }

function fillReportDropList(arr){
    if(arr.hasOwnProperty('item')){
        var select = document.getElementById("reportNames");
        var data = arr.item.rep
        Object.keys(data).map(key => {
            if (data[key].n.indexOf(reportsFlag) > 1)   {
                var option = document.createElement("option");
                option.text = data[key].n;
                select.add(option);
                listOfReports.push({"name":data[key].n,"id":data[key].id})
                //listOfReports.push({"name":data[key].n,"id":66})
            }
        })
    }else addEmptyOption(e_reportsList)
}

function fillObjectsDropList(arr){
    if(arr.length > 0)
        arr.forEach(element => {
            var option = document.createElement("option");
            option.text = element.name;
        // option.setAttribute("id",element.id)
        e_objectsList.add(option);
        });
    else addEmptyOption(e_objectsList)
}

function showLoadingSpinner(callback){
    e_loadingDiv.removeAttribute("hidden");
    callback()
}

function executeReport(callback){
    var reportId= getItemId(listOfReports, getSelectedValue(e_reportsList)),
    itemId = getItemId(listOfObjects, getSelectedValue(e_objectsList));

    if(reportId ==0 )alert('يرجى اختيار التقرير اولا')
    else{
        if(itemId > 0){
            console.log('from: '+getIntervals().fromTimeStamp+'  To: '+getIntervals().toTimeStamp)
        getExecuteReport(getCookie('sid'),id_amana_baghdad,reportId,itemId,getIntervals().fromTimeStamp,getIntervals().toTimeStamp,
        response=>{
            console.log(response)
            if(response.reportResult.tables.length >0){
                var rowsCount = response.reportResult.tables[0].rows 
                getRowAndSubData(getCookie('sid'),0,0,rowsCount,rowData=>{
                    analyseRowData(rowData,_row =>{
                        // var unitNumbers = []
                        // _row.forEach(row =>{
                        //     var num = getNumFromStr(row[1])
                        //     row[1]= num
                        //     // unitNumbers.push(getNumFromStr(row[1]))
                        // })
                        // console.log(_row)
                        generateExcelSheet(_row)
    
                    })
                })
            }
            else alert('لا توجد نتائج , تأكد من المعطيات')
            callback()
        })
    }else {
        alert('يرجى اختيار المجموعة اولا')
        callback()
    }

    }
}

function _executeReport(){
    showLoadingSpinner(() =>{
        setTimeout(()=>{
            executeReport(()=>{
                e_loadingDiv.hidden = true
            })
        },700)
    })
}

function getSelectedValue(dropList){
   return dropList.options[dropList.selectedIndex].value;
}

function getIntervals(){
    var fromTimeStamp = new Date(e_fromDatePicker.value).getTime() / 1000,
    toTimeStamp = new Date(e_toDatePicker.value).getTime() / 1000;
    return {fromTimeStamp, toTimeStamp}
}


function getItemId(arr,itemName){ 
    var _id=0
    arr.forEach(element =>{
        if(element.name == itemName) _id = element.id
    })
    return _id
}


// function fillResourceNames(arr){
//     arr.forEach(resource =>{
//         var option = document.createElement("option");
//         option.text = resource.name;
//         e_resourcesList.add(option);
//     })
// }

function fillResourceNames(data){
    // var resourceDropList = document.getElementById("resourceNames")
   // arr.item.forEach(resource =>{
      
        var option = document.createElement("option");
        option.text = data.item.nm;
        e_resourcesList.add(option);
      

   // })
}

function setUsername(_username){
    e_userLabel.innerHTML = _username
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

   function _fillObjects(reportList){
    var reportId= getItemId(listOfReports, getSelectedValue(reportList))
    clearSelectOption(e_objectsList)

    getUnitGroupNames(getCookie('sid'),id_amana_baghdad,reportId, _listOfObjects=>{
        listOfObjects = _listOfObjects
        fillObjectsDropList(listOfObjects)
    })
   }

   function fillReports(resourceList){
    var resourceId= getItemId(listOfResources, getSelectedValue(resourceList))
    clearSelectOption(e_reportsList)

    listOfReports = getReportsNames(listOfResources,resourceId)
    fillReportDropList(listOfReports)
   }

   function clearSelectOption(select){
    var length = select.options.length;
    for (i = length-1; i >= 0; i--) {
      select.options[i] = null;
    }
   }

   function clickSignOut(){
    signOut(getCookie('sid'), response=>{
        if(response.error == 0 ) {
            deleteCookie('Token')
            deleteCookie('sid')
            location.reload();
            return false;
        }
    })
   }

   function generateExcelSheet(data){
    var excelDetails = {
        excelTitle: 'Custom report '+(new Date().toLocaleString().replace(',','')).replace('/','-'),
        reportName: getSelectedValue(e_reportsList),
        groupName: getSelectedValue(e_objectsList),
        fromDate: e_fromDatePicker.value,
        toDate: e_toDatePicker.value,
    }

//     var data = [
//   //  ["#", "Name", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, "Total"],
//         [1, "طلال كامل- مرسيدس قلاب - 41163", 2, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     ,[2, "R 58146 - سامر حميد عباس - مارسيدس قلاب", 2, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     ,[3, "علاء رحمن - مرسيدس قلاب - 32567", 2, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     , [4, "محمد عبد العباس خضر - سكانيا قلاب - R 53905", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     ,[5, "M 16030 - اسامة محمد حسن - مارسيدس قلاب", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     ,[6, "محمد علي حسن-  مارسدس قلاب - 74291", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     ,[7, "محمد احسان علي - مان لوري قلاب - R 39564", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     , [8, "جاسم شياع - مرسيدس قلاب - K 31441", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     , [9, "عامر محمد - مارسدس قلاب -W 19814", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     ,[10, "N 13120 - عادل محمد حسن -مارسيدس قلاب", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     , [11, "حسين كريم لفتة - مرسيدس قلاب - 66751", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     , [12, "علي كريم لفتة - مارسيدس قلاب-3007", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     , [13, "عادل محمد - مرسيدس قلاب - T 60419", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     , [14, "احمد حميد - مارسيدس قلاب - A 66870", 1, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
//     ]

    data.splice(0,0,headerData()[2])
    data.splice(0,0,headerData()[1])
    data.splice(0,0,headerData()[0])

    generateExcel(data,excelDetails)
}

function addEmptyOption(parent){
    var option = document.createElement("option");
    option.text = 'لايوجد';
    parent.add(option);
}

function getNumFromStr(str){
    var numbers = str.match(/\d+/g).map(Number);
    return numbers[0]
}