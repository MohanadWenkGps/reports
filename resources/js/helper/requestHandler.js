var _link = 'http://hst-api.wialon.com/wialon/ajax.html?',
sidRequestTime = 1 * 60 * 1000;

function makeRequest(sid,svc,params,callbackSuccess){
    var link = _link+'sid='+sid+'&svc='+svc+'&params='+params;
    httpGet(link,result=>{
        callbackSuccess(result)
    })
    // console.log(response)
    // return response;
}

async function httpGet(theUrl,callbackSuccess)
{
    // var xmlHttp = new XMLHttpRequest();
    // xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
    // xmlHttp.setRequestHeader("crossDomain", true);
    // xmlHttp.send( null );
    // return xmlHttp.responseText;

 await  $.ajax({
        type: "POST",
        enctype: "application/json",
        processData: !1,
        contentType: !1,
        crossDomain: true,
        dataType: "jsonp",
        url: theUrl,
        success: function(result){
            callbackSuccess(result)
        },
        error: function (error){
            console.log('Error from response: '+JSON.stringify(error))
        }
      })
}

function handledError(errorValue){
    // switch(errorValue){
    //     case 0: ;
    //     case 1: invalid sessionStorage;
    //     case 4:
    //     case 8: 
    // }
}

function keepSidValid(sid){
    var sidTimer = setInterval(function()
        { 
            httpGet('http://hst-api.wialon.com/avl_evts?sid='+sid,res=>{});
        }
        , sidRequestTime);
}



