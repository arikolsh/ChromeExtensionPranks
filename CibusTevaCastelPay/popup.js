$(function () {
    run();
});

function run() {
    chrome.storage.sync.get(['lastPayDate'], function (result) {
        console.log('loaded last pay date: ' + result.lastPayDate);
        var lastPayDate = result.lastPayDate;
        doProcess(lastPayDate);
    });
}

function doProcess(lastPayDate) {
    var dateStr = lastPayDate == undefined ? "never" : toDateStr(lastPayDate);
    document.getElementById('lastPayInput').value = dateStr;
    if (isDayPassed(lastPayDate)) {
        console.log("day has passed since last payment on " + dateStr);
        if (new Date().getHours() >= 19) {
            savePaymentDate();
            notifyPayScript();
        } else {
            console.log("the hour is not passed 7pm");
        }
    }
    else {
        console.log("day has not passed since last payment, not performing payment");
    }
}

function toDateStr(date) {
    var dateStr = (date[0] + "/" + date[1] + "/" + date[2]);
    return dateStr;
}

// Save provided settings using the Chrome extension storage API.
function savePaymentDate() {
    var date = getCurrentDate();
    chrome.storage.sync.set({ 'lastPayDate': date }, function () {
        console.log('saved pay date: ' + date);
    });
    animateNewDate(date);
}

async function animateNewDate(date) {
    var dateStr = toDateStr(date);
    var oldDateStr = document.getElementById('lastPayInput').value;
    for (let i = 0; i < Math.min(dateStr.length, oldDateStr.length); i++) {
        await sleep(150);
        var tmp = dateStr.substring(0, i) + oldDateStr.substring(i);
        document.getElementById('lastPayInput').value = tmp;
    }
    document.getElementById('lastPayInput').value = dateStr;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isDayPassed(datePrev) {
    if (datePrev == null) { return true; }
    var dateNow = getCurrentDate();
    if (dateNow[2] - datePrev[2] > 0) { //more than one year passed
        return true;
    }

    if (dateNow[1] - datePrev[1] > 0) { //more than one month passed
        return true;
    }

    if (dateNow[0] - datePrev[0] > 0) { //more than one day passed
        return true;
    }

    return false;
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }
    return [dd, mm, yyyy, today];
}

function notifyPayScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            { buttonClicked: "pay" },
            function (response) {
                console.log("notifying content script to perform payment");
                if (response) {
                    console.log(response.msg);
                }
            });
    });
}

