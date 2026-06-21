import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = "mrdu-adm";

if (!getApps().length) {
  initializeApp({
    projectId: projectId,
  });
}

const firestore = getFirestore();

async function main() {
  const colls = ['coupons'];
  for (const c of colls) {
    const snap = await firestore.collection(c).get();
    const batch = firestore.batch();
    snap.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deleted ${snap.size} from ${c}`);
  }
}

main().catch(console.error);
