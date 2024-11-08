import { TMedicine } from "@/types/medicine";
import { TTransactionRecord } from "@/types/transaction";
import { openDB } from "idb";

export async function initDB(name: string, store: string) {
  return await openDB(name, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(store)) {
        db.createObjectStore("medicines", {
          keyPath: "id",
        });
        db.createObjectStore("transactions", {
          keyPath: "id",
        });
      }
    },
  });
}

// export async function saveToDB(name: string, store: string, item: any) {
//   const db = await initDB(name, store);
//   const tx = db.transaction(store, "readwrite");
//   if (!item.id) {
//     throw new Error("Item must have an 'id' property.");
//   }
//   await tx.objectStore(store).add(item);
//   await tx.done;
// }

export async function saveToDB<T extends { id: string }>(
  name: string,
  store: string,
  item: T,
) {
  const db = await initDB(name, store);
  const tx = db.transaction(store, "readwrite");
  if (!item.id) {
    throw new Error("Item must have an 'id' property.");
  }
  await tx.objectStore(store).add(item);
  await tx.done;
}

export async function getDatas<T>(name: string, store: string): Promise<T[]> {
  const db = await initDB(name, store);
  const tx = db.transaction(store, "readonly");
  const data = await tx.objectStore(store).getAll();
  await tx.done;
  return data;
}

export async function getData<T>(
  name: string,
  store: string,
  id: IDBValidKey,
): Promise<T> {
  const db = await initDB(name, store);
  const tx = db.transaction(store, "readonly");
  const data = await tx.objectStore(store).get(id);
  await tx.done;
  return data;
}

// export async function updateData(
//   name: string,
//   store: string,
//   id?: IDBValidKey,
//   updates: Partial<any>,
// ) {
//   const db = await initDB(name, store);
//   const tx = db.transaction(store, "readwrite");
//   const objectStore = tx.objectStore(store);

//   if (id) {
//     const data = await objectStore.get(id);

//     if (!data) throw new Error(`item with id: ${id} not found.`);

//     const updateData = { ...data, ...updates };

//     await objectStore.put(updateData);
//     await tx.done;
//     return;
//   } else {
//     await objectStore.put(updates);
//     await tx.done;
//   }
// }

// export async function updateData(
//   name: string,
//   store: string,
//   updates: Partial<any>,
//   id?: IDBValidKey,
// ) {
//   const db = await initDB(name, store);
//   const tx = db.transaction(store, "readwrite");
//   const objectStore = tx.objectStore(store);

//   if (id !== undefined && id !== null) {
//     const data = await objectStore.get(id);

//     if (!data) {
//       throw new Error(`Item with id: ${id} not found.`);
//     }

//     const updatedData = { ...data, ...updates };
//     await objectStore.put(updatedData);
//   } else {
//     await objectStore.put(updates);
//   }

//   await tx.done;
// }

export async function updateData<T extends TMedicine | TTransactionRecord>(
  name: string,
  store: string,
  updates: Partial<T>,
  id?: IDBValidKey,
) {
  const db = await initDB(name, store);
  const tx = db.transaction(store, "readwrite");
  const objectStore = tx.objectStore(store);

  if (id !== undefined && id !== null) {
    const data = await objectStore.get(id);

    if (!data) {
      throw new Error(`Item with id: ${id} not found.`);
    }

    const updatedData = { ...data, ...updates };
    await objectStore.put(updatedData);
  } else {
    await objectStore.put(updates);
  }

  await tx.done;
}
