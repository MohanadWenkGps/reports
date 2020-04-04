
function getUserDetails(token){
    var responce = JSON.parse(httpGet(_link+'svc=token/login&params={"token": "'+token+'"}')),
    sid = responce.eid,
    resourceId = responce.user.bact,
    id= responce.user.id,
    username = responce.user.nm 
    return {sid,resourceId, id , username}
}

function getSid(token,username){ //to get sid
    var responce = JSON.parse(httpGet(_link+'svc=token/login&params={"token": "'+token+'","operateAs":"'+username+'","fl":2}'))
    return responce.eid
}
function getAllResources(_sid){
    return getSearchOfObjects(_sid,"avl_resource","*",0,0,(1+4+8192))
}

function getResourcesWithCreatorId(_sid,creatorId){
    var result = getAllResources(_sid)
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
        return resources
    }
}

function getResourceById(_sid,id){ // the responce get reports names and ids
    var svc = "core/search_item"
    var params = JSON.stringify({
        "id":id,
        "flags":1 + 8192
    })
    return makeRequest(_sid,svc,params)
}

// function getReportsName(_sid,resourceId){  // get reports by resource id
//     var svc = 'report/get_report_data'
//     var params = '{"itemId":'+resourceId+', "col":[1,2,3,4,5,6,7,8,9,10,11,12,13]}' 
//     var response = makeRequest(_sid,svc,params)
//     return response;
// }

function getReportsTemplates(_sid,resourceId,reportsId){ //to get objects Ids
    // reportsId should be array
    var svc = 'report/get_report_data'
    var params = JSON.stringify({
        "itemId": resourceId,
        "col": [reportsId],
        "flags":0
    })
    return makeRequest(_sid,svc,params)
}

function getSearchOfObjects(_sid,objType,valueMask,fromIndex,toIndex,flags=1){
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
    return makeRequest(_sid,svc,params)
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

function getUnitGroupIds(_sid,resourceId,reportsId){
    var response = getReportsTemplates(_sid,resourceId,reportsId)
    if(response.length >0){
        var unitGroups = JSON.parse(response[0].p).bind.avl_unit_group
    }
    return unitGroups
}

function getUnitGroupNames(_sid,resourceId,reportsId){
    var groupsIds = getUnitGroupIds(_sid,resourceId,reportsId)
    var groups=""
    groupsIds.forEach(element => {
        groups = groups+ "*"+element +"*|"  //*17241201*|*17594721*
    });
    var unitsGroupsDetails = getSearchOfObjects(_sid,"avl_unit_group",groups,0,0).items,
    _listOfObjects =[]
    unitsGroupsDetails.forEach(unitGroup =>{
        _listOfObjects.push({"name": unitGroup.nm,
                "id":unitGroup.id })
    })
    return _listOfObjects
}



function signOut(_sid){
    var svc = 'core/logout'
    var params = '{}'
    return makeRequest(_sid,svc,params)
}