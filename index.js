"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSession = exports.setSession = void 0;
// fonction pour encrypter un texte avec l'algorithme de César
function encrypt(text, shift) {
    var encryptedText = "";
    for (var i = 0; i < text.length; i++) {
        // récupérer le caractère courant
        var char = text[i];
        // appliquer le décalage (shift) à chaque caractère alphabétique
        if (char.match(/[a-z]/i)) {
            var code = text.charCodeAt(i);
            // si le caractère est en majuscule, on ajoute 65 pour le code ASCII, sinon on ajoute 97
            var baseCode = code < 91 ? 65 : 97;
            // appliquer le décalage à l'index du caractère dans l'alphabet (0-25)
            var newIndex = (code - baseCode + shift) % 26;
            // ajouter le nouveau caractère chiffré à la chaîne de texte chiffré
            encryptedText += String.fromCharCode(baseCode + newIndex);
        }
        else {
            // si le caractère n'est pas alphabétique, on l'ajoute tel quel
            encryptedText += char;
        }
    }
    return encryptedText;
}
// fonction pour décrypter un texte chiffré avec l'algorithme de César
function decrypt(encryptedText, shift) {
    var decryptedText = "";
    for (var i = 0; i < encryptedText.length; i++) {
        // récupérer le caractère courant
        var char = encryptedText[i];
        // appliquer le décalage inverse pour décrypter le texte
        if (char.match(/[a-z]/i)) {
            var code = encryptedText.charCodeAt(i);
            // si le caractère est en majuscule, on ajoute 65 pour le code ASCII, sinon on ajoute 97
            var baseCode = code < 91 ? 65 : 97;
            // appliquer le décalage inverse à l'index du caractère dans l'alphabet (0-25)
            var newIndex = (code - baseCode - shift + 26) % 26;
            // ajouter le nouveau caractère déchiffré à la chaîne de texte déchiffré
            decryptedText += String.fromCharCode(baseCode + newIndex);
        }
        else {
            // si le caractère n'est pas alphabétique, on l'ajoute tel quel
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
function readSession(key, value) {
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
