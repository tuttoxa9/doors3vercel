import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyCBEzvbVPfnvdHjUo-wCAth0MEJaLuYo1A",
  authDomain: "mebel1-36ef1.firebaseapp.com",
  projectId: "mebel1-36ef1",
  storageBucket: "mebel1-36ef1.firebasestorage.app",
  messagingSenderId: "513158929501",
  appId: "1:513158929501:web:444a44a4a1fff5c90441b4",
  measurementId: "G-6R4D5DM1BN"
}

// Инициализируем Firebase
const app = initializeApp(firebaseConfig)

// Инициализируем Analytics только если поддерживается
let analytics: ReturnType<typeof getAnalytics> | null = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  }).catch((error) => {
    console.warn('Firebase Analytics не поддерживается:', error)
  })
}

// Экспортируем сервисы
export const db = getFirestore(app)
export const storage = getStorage(app)
export { analytics }
export default app
