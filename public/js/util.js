// read and return the value of a cookie (cookie name, aka "key", is provided as parameter. It's value gets returned)
function readCookie(cname) {
    var name = cname + "=";
    var decoded_cookie = decodeURIComponent(document.cookie);
    var carr = decoded_cookie.split(';');
    for (var i = 0; i < carr.length; i++) {
        var c = carr[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}