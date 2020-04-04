var _link = 'http://hst-api.wialon.com/wialon/ajax.html?',
sidRequestTime = 1 * 60 * 1000;

function makeRequest(sid,svc,params){
    var link = _link+'sid='+sid+'&svc='+svc+'&params='+params;
    var response = JSON.parse(httpGet(link))
    return response;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
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
            var responce = JSON.parse(httpGet('http://hst-api.wialon.com/avl_evts?sid='+sid));
        }
        , sidRequestTime);
}



