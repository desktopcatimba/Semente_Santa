const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Uso: npm run hash-password -- \"tua-senha\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nCopia isto para o .env / Vercel:\n");
console.log(hash);
console.log("");
