// Function to encrypt
function encrypt(text: any, shift: number) {
  let encryptedText = "";

  for (let i = 0; i < text.length; i++) {
    let char = text[i];

    if (char.match(/[a-z]/i)) {
      let code = text.charCodeAt(i);
      let baseCode = code < 91 ? 65 : 97;
      let newIndex = (code - baseCode + shift) % 26;
      encryptedText += String.fromCharCode(baseCode + newIndex);
    } else {
      encryptedText += char;
    }
  }

  return encryptedText;
}
// Function to decrypt
function decrypt(encryptedText: any, shift: number) {
  let decryptedText = "";

  for (let i = 0; i < encryptedText.length; i++) {
    let char = encryptedText[i];

    if (char.match(/[a-z]/i)) {
      let code = encryptedText.charCodeAt(i);
      let baseCode = code < 91 ? 65 : 97;
      let newIndex = (code - baseCode - shift + 26) % 26;
      decryptedText += String.fromCharCode(baseCode + newIndex);
    } else {
      decryptedText += char;
    }
  }

  return decryptedText;
}


function encryptDictionary(dict: any, shift: number) {
  let encryptedDict = {};

  for (let [key, value] of Object.entries(dict)) {
    let encryptedKey = encrypt(key, shift);
    let encryptedValue = encrypt(value, shift);
    encryptedDict[encryptedKey] = encryptedValue;
  }

  return encryptedDict;
}
function decryptDictionary(encryptedDict: any, shift: number) {
  let decryptedDict = {};

  for (let [key, value] of Object.entries(encryptedDict)) {
    let decryptedKey = decrypt(key, shift);
    let decryptedValue = decrypt(value, shift);
    decryptedDict[decryptedKey] = decryptedValue;
  }

  return decryptedDict;
}


export function setSession(key: any, value: any) {
  if (document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1")) {
    // The cookie exist
    let encryptedDict = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
    let decryptedDict = decryptDictionary(encryptedDict, 11);

    decryptedDict[key] = value;

    let newEncryptedDict = encryptDictionary(decryptedDict, 11);
    document.cookie = "session=" + JSON.stringify(newEncryptedDict) + "; path=/;";
  } else {
    // The cookie doesn't exist
    let dict = {};
    dict[key] = value;
    let encryptedDict = encryptDictionary(dict, 11);
    document.cookie = "session=" + JSON.stringify(encryptedDict) + "; path=/;";
  }
}
export function readSession(key: any) {
  if (document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1")) {
    // The cookie exist
    let encryptedDict = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
    let decryptedDict = decryptDictionary(encryptedDict, 11);

    return decryptedDict[key];
  } else {
    // The cookie doesn't exist
    return null;
  }
}

export function checkSession(key: any) {
  if (document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1")) {
    // The cookie exist
    let encryptedDict = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
    let decryptedDict = decryptDictionary(encryptedDict, 11);

    return decryptedDict[key] ? true : false;
  } else {
    // The cookie doesn't exist
    return false;
  }
}