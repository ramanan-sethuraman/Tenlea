import { db } from './config';
import { collection, addDoc, getDocs, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Diagnostic test utility to verify Firestore read/write permissions directly from the browser
 */
export async function runFirestoreTest() {
  console.log('🧪 [Firestore Diagnostic]: Starting end-to-end connection test to database "default"...');

  try {
    // 1. Write a test document to 'connection_test' collection
    const testDoc = {
      testOrigin: 'Tenlea Web Frontend',
      testedAt: serverTimestamp(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Client',
      status: 'CONNECTED_SUCCESSFULLY',
      clientTimestamp: new Date().toISOString()
    };

    console.log('📝 [Firestore Test]: Writing document to collection "connection_test"...');
    const docRef = await addDoc(collection(db, 'connection_test'), testDoc);
    console.log('✅ [Firestore Test Success]: Document successfully written! ID:', docRef.id);

    // 2. Read documents back from 'connection_test'
    console.log('📖 [Firestore Test]: Reading back documents from collection "connection_test"...');
    const querySnapshot = await getDocs(collection(db, 'connection_test'));
    console.log(`✅ [Firestore Test Success]: Successfully read ${querySnapshot.size} document(s) from "connection_test"!`);

    return {
      success: true,
      docId: docRef.id,
      totalCount: querySnapshot.size,
      message: `Connection Verified! Successfully wrote document "${docRef.id}" to Cloud Firestore. You can now see collection "connection_test" in your Firebase Console.`
    };
  } catch (error) {
    console.error('❌ [Firestore Connection Error]:', error.code, error.message, error);
    return {
      success: false,
      code: error.code || 'unknown-error',
      message: error.message || 'Failed to connect to Cloud Firestore.'
    };
  }
}
