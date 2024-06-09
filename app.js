import {documentReady} from 'https://unpkg.com/html-ready';
import {BrowserQRCodeSvgWriter} from 'https://unpkg.com/@zxing/library?module';

await documentReady;

const ssid = document.querySelector('#ssid');
const password = document.querySelector('#password');
const auth = document.querySelector('#auth');
const stealth = document.querySelector('#stealth');
const eap = document.querySelector('#eap-method');
const ph2 = document.querySelector('#ph2-method');
const identity = document.querySelector('#identity');
const anonymous = document.querySelector('#anonymous');

const wpa2eap = document.querySelector('#wpa2-eap');
const qrcode = document.querySelector('#qrcode');

// initialize inputs
ssid.value = localStorage.getItem('ssid') ?? '';
password.value = localStorage.getItem('password') ?? '';
auth.value = localStorage.getItem('auth') ?? 'WPA2-PSK';
stealth.checked = localStorage.getItem('stealth') ?? false;
eap.value = localStorage.getItem('eap-method') ?? '';
ph2.value = localStorage.getItem('ph2-method') ?? '';
identity.value = localStorage.getItem('identity') ?? '';
anonymous.value = localStorage.getItem('anonymous') ?? '';

if (auth.value !== 'WPA2-EAP') {
  wpa2eap.style.display = 'none';
}

function generateString() {
  // https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11
  const T = `T:${auth.value};`;
  const S = `S:${ssid.value};`;
  const P = `P:${password.value};`;
  const H = stealth.checked ? `H:true;` : '';

  // for WPA2-EAP
  const E = eap.value ? `E:${eap.value};` : '';
  const PH2 = ph2.value ? `PH2:${ph2.value};` : '';
  const A = anonymous.value ? `A:${anonymous.value};` : '';
  const I = identity.value ? `I:${identity.value};` : '';
  const WPA2_EAP = auth.value === 'WPA2-EAP' ? `${E}${PH2}${A}${I}` : '';

  return `WIFI:${T}${S}${P}${H}${WPA2_EAP};`;
}

function generateCode() {
  const qrcodeWriter = new BrowserQRCodeSvgWriter();
  const svg = qrcodeWriter.write(generateString(), 256, 256);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  qrcode.src = `data:image/svg+xml,${encodeURIComponent(svg.outerHTML.replaceAll(/\r?\n/g, ''))}`;
}

ssid.addEventListener('input', () => {
  localStorage.setItem('ssid', ssid.value);

  generateCode();
});

password.addEventListener('input', () => {
  localStorage.setItem('password', password.value);

  generateCode();
});

auth.addEventListener('input', () => {
  if (auth.value === 'WPA2-EAP') {
    wpa2eap.style.display = 'block';
  } else {
    wpa2eap.style.display = 'none';
  }

  localStorage.setItem('auth', auth.value);

  generateCode();
});

stealth.addEventListener('input', () => {
  if (stealth.checked) {
    localStorage.setItem('stealth', true);
  } else {
    localStorage.removeItem('stealth');
  }

  generateCode();
});

eap.addEventListener('input', () => {
  localStorage.setItem('eap-method', eap.value);

  generateCode();
});

ph2.addEventListener('input', () => {
  localStorage.setItem('ph2-method', ph2.value);

  generateCode();
});

identity.addEventListener('input', () => {
  localStorage.setItem('identity', identity.value);

  generateCode();
});

anonymous.addEventListener('input', () => {
  localStorage.setItem('anonymous', anonymous.value);

  generateCode();
});

generateCode();
