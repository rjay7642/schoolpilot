import Dexie from 'dexie';

export const db = new Dexie('SchoolPilotDB');

// Schema definition
db.version(1).stores({
  users: '++id, email, schoolName', // Primary key ++id, indexed email and schoolName
  records: '++id, studentName, rollNumber, ownerEmail, createdAt', // Indexed for searching
  subjectPrefs: 'email', // Setting per email
});

export default db;
