// Give the service worker access to Firebase Messaging.

// Note that you can only use Firebase Messaging here, other Firebase libraries

// are not available in the service worker.

importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');

importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the

var config = {
  apiKey: "AIzaSyDnSr32WkhtSqVuWNbLGPAmmp8wFWyB71Q",
  authDomain: "hotelcube-msg.firebaseapp.com",
  databaseURL: "https://hotelcube-msg.firebaseio.com",
  projectId: "hotelcube-msg",
  storageBucket: "",
  messagingSenderId: "17422901445",
  appId: "1:17422901445:web:faa27e5cb6d87f60ae10ac"
};

// @ts-ignore
const app = firebase.initializeApp(config);

// @ts-ignore
const messaging = firebase.messaging();