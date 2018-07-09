const redirectUrl = 'http://i4u.me/cdX5h';
const siteRegex = /(.+)\.infopage\.mobi\/index\.php\?page=landing&id=(.+)&token=(.+)/gm

////// values //////
const fullName = "אריה אולשנצקי";
const phone = "0507369191";
const cardNumber = "6990";
const amount = "30";
const hour = "20:00";

////// place holders //////
const FULL_NAME_PH = '[placeholder="שם מלא"]';
const PHONE_PH = '[placeholder="טלפון"]';
const CARD_NUM_PH = '[placeholder="מספר כרטיס טבע קסטל 4 ספרות"]';
const AMOUNT_PH = '[placeholder="סכום לחיוב בשח"]';
const HOUR_PH = '[placeholder="לחיוב עד שעה"]';

$(function () { // jQuery on load function
    run();
});

function run() {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (sender.tab) { //message wasn't sent by our extension
                return;
            }
            if (request.buttonClicked == "pay") {
                sendResponse({ msg: "Performing payment" });
                performPayment();
            }
        });
}

function performPayment() {
    var currSite = document.location.href;
    if (currSite.search(siteRegex) < 0) {
        console.log("redirecting to site");
        document.location.href = redirectUrl;
    }
    console.log("changing full name");
    document.querySelectorAll(FULL_NAME_PH)[0].value = fullName;
    console.log("changing phone");
    document.querySelectorAll(PHONE_PH)[0].value = phone;
    console.log("changing card number");
    document.querySelectorAll(CARD_NUM_PH)[0].value = cardNumber;
    console.log("changing pay amount");
    document.querySelectorAll(AMOUNT_PH)[0].value = amount;
    console.log("changing hour");
    document.querySelectorAll(HOUR_PH)[0].value = hour;

    document.getElementById("form_desktop").submit();
}
