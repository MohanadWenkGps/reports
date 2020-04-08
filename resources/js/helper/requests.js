
function getUserDetails(token,callback){
    httpGet((_link+'svc=token/login&params={"token": "'+token+'"}'), responce =>{
    var sid = responce.eid,
    resourceId = responce.user.bact,
    id= responce.user.id,
    username = responce.user.nm 
    callback({sid,resourceId,id,username})
    })
    // var responce = httpGet(_link+'svc=token/login&params={"token": "'+token+'"}'),
    // sid = responce.eid,
    // resourceId = responce.user.bact,
    // id= responce.user.id,
    // username = responce.user.nm 
    // return {sid,resourceId, id , username}
}

function getSid(token,username,callbackSuccess){ //to get sid
    httpGet(_link+'svc=token/login&params={"token": "'+token+'","operateAs":"'+username+'","fl":2}',
    response=>{
        callbackSuccess(response.eid)
    })
}
function getAllResources(_sid,callbackSuccess){
    getSearchOfObjects(_sid,"avl_resource","*",0,0,(1+4+8192), res=>{callbackSuccess(res)})
}

function getResourcesWithCreatorId(_sid,creatorId,callbackSuccess){
    getAllResources(_sid, result=>{
        var resources = []
        if(result.items.length > 0){
            result.items.forEach(element =>{
                if (element.bpact == creatorId) {
                    resources.push({
                        "name":element.nm,
                        "id":element.id,
                        "reports":element.rep
                    })
                }
            })
            callbackSuccess(resources)
        }
    })
}

function getResourceById(_sid,id,callbackSuccess){ // the responce get reports names and ids
    var svc = "core/search_item"
    var params = JSON.stringify({
        "id":id,
        "flags":1 + 8192
    })
    makeRequest(_sid,svc,params,res =>{
        callbackSuccess(res)
    })
}

// function getReportsName(_sid,resourceId){  // get reports by resource id
//     var svc = 'report/get_report_data'
//     var params = '{"itemId":'+resourceId+', "col":[1,2,3,4,5,6,7,8,9,10,11,12,13]}' 
//     var response = makeRequest(_sid,svc,params)
//     return response;
// }

function getReportsTemplates(_sid,resourceId,reportsId,callbackSuccess){ //to get objects Ids
    // reportsId should be array
    var svc = 'report/get_report_data'
    var params = JSON.stringify({
        "itemId": resourceId,
        "col": [reportsId],
        "flags":0
    })
    makeRequest(_sid,svc,params,res =>{callbackSuccess(res)})
}

function getSearchOfObjects(_sid,objType,valueMask,fromIndex,toIndex,flags=1,callbackSuccess){
    var svc = 'core/search_items'
    var params = JSON.stringify({
           "spec": {
            "itemsType": objType,
            "propName": "sys_id",
            "propValueMask": valueMask,
            "sortType": "sys_name",
            "propType": "",
            "or_logic": 1
        },
        "force": 1,
        "flags": flags,
        "from": fromIndex,
        "to": toIndex
    });
    makeRequest(_sid,svc,params,res=>{
        callbackSuccess(res)
    })
}

// function getAllUnitGroups(_sid){
//     var array =[];
//     var response = getSearchOfObjects(_sid,"avl_unit_group",0,0)
//    // console.log(response)
//     response.items.forEach(element => {
//         array.push({"name": element.nm,
//         "id":element.id,
//         "units": element.u
//         })
//     })
//     return array
// }

function getUnitGroupIds(_sid,resourceId,reportsId,callbackSuccess){
    getReportsTemplates(_sid,resourceId,reportsId,response =>{
        var unitGroups =[]
        if(response.length >0){
            unitGroups = JSON.parse(response[0].p).bind.avl_unit_group
        }
        callbackSuccess(unitGroups)
    })
}

function getUnitGroupNames(_sid,resourceId,reportsId,callbackSuccess){
    getUnitGroupIds(_sid,resourceId,reportsId,groupsIds=>{
        var groups=""
        console.log(groupsIds)
        groupsIds.forEach(element => {
            groups = groups+ "*"+element +"*|"  //*17241201*|*17594721*
        });
        getSearchOfObjects(_sid,"avl_unit_group",groups,0,0,1, res =>{
           var unitsGroupsDetails = res.items,
            _listOfObjects =[]
            unitsGroupsDetails.forEach(unitGroup =>{
                _listOfObjects.push({"name": unitGroup.nm,
                        "id":unitGroup.id })
            })
            callbackSuccess(_listOfObjects)
        })
    })
}



function signOut(_sid,callbackSuccess){
    var svc = 'core/logout'
    var params = '{}'
    makeRequest(_sid,svc,params,res =>{callbackSuccess(res)})
}

function setLocalization(_sid,callbackSuccess){
    var svc = "render/set_locale";
    var params = JSON.stringify(
        {
          "tzOffset":134228528,
          "language":"en",
          "flags":0,
          "formatDate":"%25Y-%25m-%25E %25H:%25M:%25S",
          "density":1
        }
      )
    makeRequest(_sid,svc,params,res=>{callbackSuccess(res)})
}