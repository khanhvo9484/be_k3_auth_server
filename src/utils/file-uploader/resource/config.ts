// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
const firebaseConfig = {
	apiKey: 'AIzaSyB6JZjqitXS0jKlqfia2IzaHyceZrkui8g',
	authDomain: 'k3-learning.firebaseapp.com',
	projectId: 'k3-learning',
	storageBucket: 'k3-learning.appspot.com',
	messagingSenderId: '847417402354',
	appId: '1:847417402354:web:397b924a9c33c1bd29c16b',
	measurementId: 'G-FRV83EZZTC'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
