function changeCursorStyle(tag,cursorStyle) {
    cursorStyle = createImageUrl(cursorStyle);
    $(tag).css('cursor', cursorStyle);
}

function createImageUrl(cursorStyle) {
    var imgPath = chrome.extension.getURL(cursorStyle);
    return 'url(' + imgPath + '), auto';
}

changeCursorStyle("p","images/balls.png");
