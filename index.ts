// fonction pour encrypter un texte avec l'algorithme de César
function encrypt(text: any, shift: number) {
  let encryptedText = "";

  for (let i = 0; i < text.length; i++) {
    // récupérer le caractère courant
    let char = text[i];

    // appliquer le décalage (shift) à chaque caractère alphabétique
    if (char.match(/[a-z]/i)) {
      let code = text.charCodeAt(i);
      // si le caractère est en majuscule, on ajoute 65 pour le code ASCII, sinon on ajoute 97
      let baseCode = code < 91 ? 65 : 97;
      // appliquer le décalage à l'index du caractère dans l'alphabet (0-25)
      let newIndex = (code - baseCode + shift) % 26;
      // ajouter le nouveau caractère chiffré à la chaîne de texte chiffré
      encryptedText += String.fromCharCode(baseCode + newIndex);
    } else {
      // si le caractère n'est pas alphabétique, on l'ajoute tel quel
      encryptedText += char;
    }
  }

  return encryptedText;
}
// fonction pour décrypter un texte chiffré avec l'algorithme de César
function decrypt(encryptedText: any, shift: number) {
  let decryptedText = "";

  for (let i = 0; i < encryptedText.length; i++) {
    // récupérer le caractère courant
    let char = encryptedText[i];

    // appliquer le décalage inverse pour décrypter le texte
    if (char.match(/[a-z]/i)) {
      let code = encryptedText.charCodeAt(i);
      // si le caractère est en majuscule, on ajoute 65 pour le code ASCII, sinon on ajoute 97
      let baseCode = code < 91 ? 65 : 97;
      // appliquer le décalage inverse à l'index du caractère dans l'alphabet (0-25)
      let newIndex = (code - baseCode - shift + 26) % 26;
      // ajouter le nouveau caractère déchiffré à la chaîne de texte déchiffré
      decryptedText += String.fromCharCode(baseCode + newIndex);
    } else {
      // si le caractère n'est pas alphabétique, on l'ajoute tel quel
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


export function setSession(key: string, value: any) {
  if (document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1")) {
    // The cookie exist
    let encryptedDict = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
    let decryptedDict = decryptDictionary(encryptedDict, 11);

    decryptedDict[key] = value;

    let newEncryptedDict = encryptDictionary(decryptedDict, 11);
    document.cookie = "session=" + JSON.stringify(newEncryptedDict);
  } else {
    // The cookie doesn't exist
    let dict = {};
    dict[key] = value;
    let encryptedDict = encryptDictionary(dict, 11);
    document.cookie = "session=" + JSON.stringify(encryptedDict);
  }
}
export function readSession(key: string, value: any) {
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