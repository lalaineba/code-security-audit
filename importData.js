// import firebase-admin and data files
const admin = require('firebase-admin');
const { employees } = require('./src/data/employees');
const { branches } = require('./src/data/branches');

admin.initializeApp({ credential: admin.credential.cert('bed-assignment-3-801a3-firebase-adminsdk-fbsvc-ee05930002.json') });
const db = admin.firestore();

// Import employees
employees.forEach(async (employee) => {
  await db.collection('employees').add(employee);
});

// Import branches
branches.forEach(async (branch) => {
  await db.collection('branches').add(branch);
});