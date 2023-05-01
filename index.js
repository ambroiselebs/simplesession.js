"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSession = exports.readSession = exports.setSession = void 0;
// Function to encrypt
function encrypt(text, shift) {
    var encryptedText = "";
    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        if (char.match(/[a-z]/i)) {
            var code = text.charCodeAt(i);
            var baseCode = code < 91 ? 65 : 97;
            var newIndex = (code - baseCode + shift) % 26;
            encryptedText += String.fromCharCode(baseCode + newIndex);
        }
        else {
            encryptedText += char;
        }
    }
    return encryptedText;
}
// Function to decrypt
function decrypt(encryptedText, shift) {
    var decryptedText = "";
    for (var i = 0; i < encryptedText.length; i++) {
        var char = encryptedText[i];
        if (char.match(/[a-z]/i)) {
            var code = encryptedText.charCodeAt(i);
            var baseCode = code < 91 ? 65 : 97;
            var newIndex = (code - baseCode - shift + 26) % 26;
            decryptedText += String.fromCharCode(baseCode + newIndex);
        }
        else {
            decryptedText += char;
        }
    }
    return decryptedText;
}
function encryptDictionary(dict, shift) {
    var encryptedDict = {};
    for (var _i = 0, _a = Object.entries(dict); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var encryptedKey = encrypt(key, shift);
        var encryptedValue = encrypt(value, shift);
        encryptedDict[encryptedKey] = encryptedValue;
    }
    return encryptedDict;
}
function decryptDictionary(encryptedDict, shift) {
    var decryptedDict = {};
    for (var _i = 0, _a = Object.entries(encryptedDict); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var decryptedKey = decrypt(key, shift);
        var decryptedValue = decrypt(value, shift);
        decryptedDict[decryptedKey] = decryptedValue;
    }
    return decryptedDict;
}
function setSession(key, value) {
    if (document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1")) {
        // The cookie exist
        var encryptedDict = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
        var decryptedDict = decryptDictionary(encryptedDict, 11);
        decryptedDict[key] = value;
        var newEncryptedDict = encryptDictionary(decryptedDict, 11);
        document.cookie = "session=" + JSON.stringify(newEncryptedDict);
    }
    else {
        // The cookie doesn't exist
        var dict = {};
        dict[key] = value;
        var encryptedDict = encryptDictionary(dict, 11);
        document.cookie = "session=" + JSON.stringify(encryptedDict);
    }
}
exports.setSession = setSession;
function readSession(key) {
    if (document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1")) {
        // The cookie exist
        var encryptedDict = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
        var decryptedDict = decryptDictionary(encryptedDict, 11);
        return decryptedDict[key];
    }
    else {
        // The cookie doesn't exist
        return null;
    }
}
exports.readSession = readSession;
function checkSession(key) {
    if (document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1")) {
        // The cookie exist
        var encryptedDict = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
        var decryptedDict = decryptDictionary(encryptedDict, 11);
        return decryptedDict[key] ? true : false;
    }
    else {
        // The cookie doesn't exist
        return false;
    }
}
exports.checkSession = checkSession;
