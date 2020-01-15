const bcrypt = require('bcrypt');

// Generate the salt and Hash the Password by combining the Salt (before / after) the hash password..
// async function run() {
//     const salt = await bcrypt.genSalt(10);
//     // Adding the salt to hash (before / after)
//     const hash = await bcrypt.hash('1234', salt);
//     console.log(salt);
//     console.log(hash);
// }

// run();

// Takes the salt from previous hash password, and re-hash the plain text password (1234) 
// - if they are equal, it will return true
async function compare() {
    console.log(await bcrypt.compare('1234', '$2b$10$rw5MVs9E2g/Yoy5QbTE0outSWlCCoNgVsj0O6e5zcIL6WoqOcoEL.'));
}

compare();