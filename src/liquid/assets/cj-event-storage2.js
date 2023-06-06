var referralPeriod = 365;
var url = window.location.href;
var cjEvent;
var isCjCookiePresent = false;
if (url.includes('cjevent')) {
  var start = url.indexOf('cjevent');
  var end = url.length;
  var query = url.substring(start, end);
  var newEnd = query.indexOf('&');
  if (newEnd == -1) {
    newEnd = query.length;
  }
  cjEvent = query.substring(8, newEnd);
  checkForCjCookie();
} else {
  checkForCjCookie();
}
function checkForCjCookie() {
  var name = 'cjevent=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) == 0) {
      var value = c.substring(name.length);
      if (cjEvent != undefined) {
        isCjCookiePresent = true;
        updateCookie();
      } else if (value != undefined) {
        setCjCookie('cjevent', value, referralPeriod);
      } else {
        17;
      }
    }
  }
  if (cjEvent && !isCjCookiePresent) {
    setCjCookie('cjevent', cjEvent, referralPeriod);
  }
}
function setCjCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/;domain=.' + location.hostname.replace(/^www\./i, '');
}
function updateCookie() {
  if (isCjCookiePresent) {
    setCjCookie('cjevent', '', -1);
    setCjCookie('cjevent', cjEvent, referralPeriod);
  }
}
