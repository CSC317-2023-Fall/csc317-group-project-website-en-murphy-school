// read and return the value of a cookie (cookie name, aka "key", is provided as parameter. It's value gets returned)
function readCookie(cname) {
    let name = cname + "=";
    let decoded_cookie = decodeURIComponent(document.cookie);
    let carr = decoded_cookie.split(';');
    for (let i = 0; i < carr.length; i++) {
        let c = carr[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}