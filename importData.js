// import firebase-admin and data files
const admin = require('firebase-admin');
const employees = require('./src/data/employees.json');
const branches = require('./src/data/branches.json');

admin.initializeApp({ credential: admin.credential.cert('bed-assignment-3-801a3-firebase-adminsdk-fbsvc-ee05930002.json') });
const db = admin.firestore();

// Import employees
employees.forEach(async (employee) => {
  // To import employees data and keep the employee id
  await db.collection('employees').doc(employee.id).set(employee);
});

// Import branches
branches.forEach(async (branch) => {
  // To import branches data and keep the branch id
  await db.collection('branches').doc(branch.id).set(branch);
});