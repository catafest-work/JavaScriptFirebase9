//import firebase from 'firebase/app';
import {initializeApp} from 'firebase/app';
import { getFirestore , collection, onSnapshot, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore' 

// authentification import 
import { getAuth, createUs, createUserWithEmailAndPassword, signOut, signIn, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "",
    authDomain: "javascriptfirebase001.firebaseapp.com",
    projectId: "javascriptfirebase001",
    storageBucket: "javascriptfirebase001.appspot.com",
    messagingSenderId: "",
    appId: ""
  };
  
  // init firebase app

  //firebase.initializeApp(firebaseConfig) // this will initialize the application
  initializeApp(firebaseConfig);

  // init services
  const db = getFirestore()
  
  const auth = getAuth()

  // can be used like this:
  //const db = firebase.firestore()
  //db.collection('books')

  // collection ref
  const colRef = collection(db, 'books')

  // queries

  //const q = query(colRef, where("author", "==", "Frank Herbert"), orderBy('title', 'asc'))
  // order by the createdAt new definition line 54 ...
  const q = query(colRef, where("author", "==", "Frank Herbert"), orderBy('createdAt'))

  // realtime collection data
  //onSnapshot(colRef, (snapshot) => {

  // can be use query 
  const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach(doc => {
      books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
  })

// adding documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit',(e) => {
    e.preventDefault()
    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
      })
      .then(() => {
        addBookForm.reset()
      })
})
// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
})
// get a single document 
const docRef = doc(db, 'books', 'tFmkWJx8fAumbcoOHpC3')

/*
getDoc(docRef)
  .then((doc) => {
    console.log(doc.data(), doc.id)
  })
*/

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
});


const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
  e.preventDefault() // typescript:  while executing a listener signals to the operation that caused event 

  const docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, { // firebase: update doc function update with 
    title: 'updated title' // no need to update all just the title with : 'updated title'
  })
  .then(() => {
    updateForm.reset()
  })
})

// signing user up 
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch((err) => {
      console.log(err.message)
    })
})

// logging in and out 
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', (e) => {
  signOut(auth)
    .then(() => {
      // console.log('the user signed out!')
    })
    .catch((err) => {
      console.log(err.message)
    }) 
})

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log('user logged in: ', cred.user)
    })
    .catch((err) => {
      console.log(err.message)
    })
})

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed: ', user)
})

// unsubscribe from auth changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing')
  unsubCol()
  unsubDoc()
  unsubAuth()
})
