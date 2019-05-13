console.log('test');

// console.log(Date.now());
var ronde = document.getElementById('ronde')
var time = document.getElementsByClassName('time');
var timeId = document.getElementsByClassName('time')[0].id;
var worldRecordId = document.getElementById('worldRecord')
var worldRecord = document.getElementById('worldRecord').classList
var save = document.getElementsByClassName('save')
var name = document.getElementsByClassName('name')[0].innerText
var clockedTime = document.getElementsByClassName('clockedTime')

console.log(clockedTime);

var interval = setInterval(clocking, 21);

function clocking() {
    if (timeId !== '' && timeId !== undefined && ronde.disabled == false) {
        time[0].innerHTML = ('')
        time[0].innerHTML = (msToTime(checkBetween(timeId)))
        // console.log(msToTime(checkBetween(timeId)));
    }
    if (ronde.disabled == true) {
        time[0].innerHTML = ('')
        time[0].innerHTML = (ronde.className)
        worldRecordId.innerHTML = (worldRecordBreaker(worldRecord[0], worldRecord[1]))
        worldRecordId.classList.add('wr')
        startConfetti();
        // worldRecordId.insertAdjacentHTML('beforeend',`)
        clearInterval(interval);
        saveData()

    }
    // console.log(ronde);
}

function saveData() {
    var endTime = msToTime(checkBetween(timeId));
    var distance = worldRecord[0];
    localStorage.setItem(name, `name:${name}, distance:${distance}, endTime:${endTime }`);

}

function checkBetween(oldTime) {
    return Date.now() - oldTime;
}

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return mins + "." + secs + "." + ms;
}

function worldRecordBreaker(mtr, time) {
    var wr;
    if (mtr == 500 && time < 33610) {
        wr = 'Ongeloveloos! Je hebt het wereldrecord van Pavel Koelizjnikov van 33.61 verbroken!!!'
    }
    if (mtr == 1000 && time < 66180) {
        wr = 'Zodeju! Je hebt het wereldrecord van Kjeld Nuis van 1:06.18 verbroken!!!'
    }
    if (mtr == 1500 && time < 100170) {
        wr = 'Krijg nou wat! Je hebt het wereldrecord van Kjeld Nuis van 1:40.17 verbroken!!!'
    }
    if (mtr == 3000 && time < 217280) {
        wr = 'HolyMoly! Je hebt het wereldrecord van Eskil Ervik van 3:37.28 verbroken!!!'
    }
    if (mtr == 5000 && time < 361860) {
        wr = 'Nee joh! Je hebt het wereldrecord van Ted-Jan Bloemen van 6:02.86 verbroken!!!'
    }
    if (mtr == 10000 && time < 756300) {
        wr = 'God allemachtig! Je hebt het wereldrecord van Ted-Jan Bloemen van 12:36.30 verbroken!!!'
    }
    return wr
}