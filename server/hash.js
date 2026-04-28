const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter password: ', async (password) => {
    const hash = await bcrypt.hash(password, 10);
    console.log('Hash:', hash);
    rl.close();
});