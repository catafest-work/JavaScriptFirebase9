//import firebase from 'firebase/app';
import {initializeApp} from 'firebase/app';
import { getFirestore , collection, onSnapshot, getDocs, addDoc, deleteDoc, doc, query, where, orderBy} from 'firebase/firestore' 

const firebaseConfig = {
    apiKey: "AIzaSyBtQJfpDvAsbwI4C9UIEgv75aJO7z0t4Tg",
    authDomain: "javascriptfirebase001.firebaseapp.com",
    projectId: "javascriptfirebase001",
    storageBucket: "javascriptfirebase001.appspot.com",
    messagingSenderId: "955216490492",
    appId: "1:955216490492:web:67712a226b741126ec0c79"
  };

  // init firebase app

  //firebase.initializeApp(firebaseConfig) // this will initialize the application
  initializeApp(firebaseConfig);

  // init services
  const db = getFirestore()

  // can be used like this:
  //const db = firebase.firestore()
  //db.collection('books')

  // collection ref
  const colRef = collection(db, 'books')

  // queries

  const q = query(colRef, where("author", "==", "Frank Herbert"))

  // realtime collection data
  //onSnapshot(colRef, (snapshot) => {

  // can be use query 
  onSnapshot(q, (snapshot) => {
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