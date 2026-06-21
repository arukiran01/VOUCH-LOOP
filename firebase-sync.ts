import { readFileSync } from 'fs';
import { join } from 'path';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let firestore: Firestore | null = null;

export function initFirebase() {
  try {
    let firebaseConfig: any = {};
    try {
      const configPath = join(process.cwd(), 'firebase-applet-config.json');
      firebaseConfig = JSON.parse(readFileSync(configPath, 'utf8'));
    } catch (e) {
      console.error('Failed to load firebase-applet-config.json:', e);
    }

    const projectId = firebaseConfig.projectId || 'mrdu-adm';
    const databaseId = firebaseConfig.firestoreDatabaseId;

    const app = getApps().length ? getApps()[0] : initializeApp({
      projectId: projectId,
    });
    
    if (databaseId) {
      firestore = getFirestore(app, databaseId);
    } else {
      firestore = getFirestore(app);
    }
    
    try {
        firestore.settings({ ignoreUndefinedProperties: true });
    } catch(e) {}
    
    console.log('--- FIREBASE ACTIVE: METADATA SYNCHRONIZED ---');
    return firestore;
  } catch (err) {
    console.error('Failed to initialize Firebase Admin:', err);
    return null;
  }
}

export async function syncToFirebase(db: any) {
  if (!firestore) return;
  
  try {
    const batch = firestore.batch();
    
    // Sync Users
    if (db.users && db.users.length > 0) {
      for (const u of db.users) {
        const ref = firestore.collection('users').doc(u.id);
        batch.set(ref, u, { merge: true });
      }
    }

    // Sync Coupons
    if (db.coupons && db.coupons.length > 0) {
      for (const c of db.coupons) {
        const ref = firestore.collection('coupons').doc(c.id);
        batch.set(ref, c, { merge: true });
      }
    }

    // Sync Transactions
    if (db.transactions && db.transactions.length > 0) {
      for (const tx of db.transactions) {
        const ref = firestore.collection('transactions').doc(tx.id);
        batch.set(ref, tx, { merge: true });
      }
    }

    // Sync Reviews
    if (db.reviews && db.reviews.length > 0) {
      for (const r of db.reviews) {
        const ref = firestore.collection('reviews').doc(r.id);
        batch.set(ref, r, { merge: true });
      }
    }
    
    // System logs
    if (db.systemLogs && db.systemLogs.length > 0) {
       // Just take the top 10 to prevent batch overflow
       for (const l of db.systemLogs.slice(0, 10)) {
           const ref = firestore.collection('systemLogs').doc(l.id);
           batch.set(ref, l, { merge: true });
       }
    }

    await batch.commit();
  } catch (err) {
    console.error('Firebase async push exception:', err);
  }
}

export async function pullFromFirebase(db: any) {
  if (!firestore) return false;
  
  try {
    console.log('Loading dataset from Firebase instance...');
    let dataFound = false;

    // Pull Users
    const usersSnap = await firestore.collection('users').get();
    if (!usersSnap.empty) {
      dataFound = true;
      usersSnap.forEach((doc) => {
        const u = doc.data();
        const localId = u.id || doc.id;
        const existing = db.users.find((lu: any) => lu.id === localId);
        if (existing) {
           Object.assign(existing, u);
        } else {
           db.users.push(u);
        }
      });
    }

    // Pull Coupons
    const couponsSnap = await firestore.collection('coupons').get();
    if (!couponsSnap.empty) {
      dataFound = true;
      couponsSnap.forEach((doc) => {
        const c = doc.data();
        const existing = db.coupons.find((lc: any) => lc.id === (c.id || doc.id));
        if (existing) {
           Object.assign(existing, c);
        } else {
           db.coupons.push(c);
        }
      });
    }

    // Pull Transactions
    const txSnap = await firestore.collection('transactions').get();
    if (!txSnap.empty) {
      dataFound = true;
      txSnap.forEach((doc) => {
        const tx = doc.data();
        const existing = db.transactions.find((ltx: any) => ltx.id === (tx.id || doc.id));
        if (!existing) {
           db.transactions.push(tx);
        }
      });
    }
    
    return dataFound;
  } catch (err) {
    console.error('Failed to pull from Firebase:', err);
    return false;
  }
}
