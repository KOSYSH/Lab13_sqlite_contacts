import * as SQLite from 'expo-sqlite';

export type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
};

export async function getDBConnection() {
  try {
    const db = await SQLite.openDatabaseAsync('contacts.db');
    return db;
  } catch (error) {
    console.error('Erreur lors de l\'ouverture :', error);
    throw error;
  }
}

export async function createTables() {
  try {
    const db = await getDBConnection();
    const query = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT
    );`;
    await db.execAsync(query);
  } catch (error) {
    console.error('Erreur lors de la création de la table :', error);
    throw error;
  }
}

export async function insertContact(name: string, phone: string, email?: string) {
  try {
    const db = await getDBConnection();
    const query = `INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?);`;
    await db.runAsync(query, [name, phone, email ?? null]);
  } catch (error) {
    console.error('Erreur lors de l\'insertion :', error);
    throw error;
  }
}

export async function getAllContacts() {
  try {
    const db = await getDBConnection();
    const query = `SELECT * FROM contacts ORDER BY name ASC LIMIT 100;`;
    const result = await db.getAllAsync<Contact>(query);
    return result;
  } catch (error) {
    console.error('Erreur lors de la lecture :', error);
    throw error;
  }
}

export async function getContactById(id: number) {
  try {
    const db = await getDBConnection();
    const query = `SELECT * FROM contacts WHERE id = ?;`;
    const result = await db.getFirstAsync<Contact>(query, [id]);
    return result;
  } catch (error) {
    console.error('Erreur lors de la lecture du contact :', error);
    throw error;
  }
}

export async function updateContact(id: number, name: string, phone: string, email?: string) {
  try {
    const db = await getDBConnection();
    const query = `UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?;`;
    await db.runAsync(query, [name, phone, email ?? null, id]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    throw error;
  }
}

export async function deleteContact(id: number) {
  try {
    const db = await getDBConnection();
    const query = `DELETE FROM contacts WHERE id = ?;`;
    await db.runAsync(query, [id]);
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    throw error;
  }
}

export async function insertMultipleContacts(contacts: Array<{name:string, phone:string, email?:string}>) {
  const db = await getDBConnection();
  await db.execAsync('BEGIN TRANSACTION;');
  try {
    for (const c of contacts) {
      const query = `INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?);`;
      await db.runAsync(query, [c.name, c.phone, c.email ?? null]);
    }
    await db.execAsync('COMMIT;');
  } catch (e) {
    await db.execAsync('ROLLBACK;');
    console.error('Transaction échouée', e);
    throw e;
  }
}

export async function createIndexes() {
  try {
    const db = await getDBConnection();
    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_name ON contacts(name);');
  } catch (error) {
    console.error('Erreur lors de la création de l\'index :', error);
    throw error;
  }
}
