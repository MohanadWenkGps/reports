function loading() {
    var ref =window.location.href;
    var indexOfToken = ref.indexOf('access_token=');
    var lenOf = 'access_token='.length;
    var token = ref.substring(indexOfToken+lenOf)
    //alert("token is: " + token);
    document.getElementById("demo").innerHTML = token;
    checkCookie("Token",token,6)
 
    window.parent.location.replace("http://127.0.0.1:8002/index.html")
   //location.href = "/page2.html";
}