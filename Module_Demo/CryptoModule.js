// ============================================================
// crypto-demo.js
// Demonstrates Node's BUILT-IN `crypto` module.
//
// WHY CRYPTO MATTERS:
//   Every real backend has to:
//     - Store passwords safely (never plain text!)
//     - Encrypt sensitive data at rest (names, IDs, addresses)
//     - Verify data integrity (hashes)
//     - Sign and verify messages (HMAC)
//     - Generate unforgeable tokens
//   All of these come from Node's `crypto` module.
//
// WHAT THIS FILE COVERS:
//   1.  crypto.randomBytes()      → secure random data
//   2.  crypto.scryptSync()       → password hashing (KDF)
//   3.  crypto.timingSafeEqual()  → constant-time comparison
//   4.  crypto.createCipheriv()   → AES-256-CBC encryption
//   5.  crypto.createDecipheriv() → decryption
//   6.  crypto.createHash()       → SHA-256 integrity hash
//   7.  crypto.createHmac()       → HMAC signature
//   8.  crypto.randomBytes(32)    → secure token generation
//
// RUN:
//     node crypto-demo.js
//
// NO INSTALLATION:
//   `crypto` ships with Node.js.
//
// ⚠️  PRODUCTION NOTES:
//   - In real code, `encryptionKey` and `hmacSecret` MUST come
//     from environment variables, never generated per run.
//   - Use `scryptSync`/`scrypt` with a UNIQUE salt per user.
//   - Prefer `crypto.randomUUID()` for IDs when that's all you need.
// ============================================================

const crypto = require("crypto");

// ============================================================
// APPLICATION SECRET KEYS
//
// In a real app, these live in `.env` and never change between
// restarts, because:
//   - If the encryption key changes, old encrypted data can't
//     be decrypted.
//   - If the HMAC secret changes, all previously signed
//     messages become invalid.
//
// randomBytes(32) = 32 bytes = 256 bits → strong enough for
// AES-256 and HMAC-SHA256.
// ============================================================
const encryptionKey = crypto.randomBytes(32); // 256-bit key for AES-256
const hmacSecret = crypto.randomBytes(32); // 256-bit secret for HMAC

// ============================================================
// 1. PASSWORD HASHING — hashPassword(password)
//
// GOAL:
//   Turn a plain-text password into a value you can store safely.
//   Later, you verify by re-hashing the input and comparing.
//
// WHY SALT?
//   A salt is random data added to the password before hashing.
//   Same password + different salt = different hash. This makes
//   rainbow-table attacks useless and prevents two users with
//   the same password from having the same stored hash.
//
// WHY scryptSync?
//   scrypt is a Key Derivation Function (KDF) designed to be
//   MEMORY-HARD — expensive for attackers, fast enough for
//   legitimate logins.
//     Arguments:
//       password → plain text
//       salt     → 16 random bytes (per-user, unique)
//       64       → derived key length in bytes
//
// RETURN:
//   { salt: hex, hash: hex }  → store both in the DB.
// ============================================================
function hashPassword(password) {
  // 1a. Generate a UNIQUE random salt for this user.
  const salt = crypto.randomBytes(16);

  // 1b. Derive the key using scryptSync.
  //     The 3rd argument (64) is the output length in bytes.
  const hash = crypto.scryptSync(password, salt, 64);

  // 1c. Store both salt and hash as hex strings.
  //     NEVER store the plain password.
  return {
    salt: salt.toString("hex"),
    hash: hash.toString("hex"),
  };
}

// ============================================================
// 2. PASSWORD VERIFICATION — verifyPassword(pwd, salt, hash)
//
// GOAL:
//   Check whether a login attempt matches the stored hash.
//
// STEPS:
//   a) Re-derive a key using the SAME salt that was stored.
//   b) Compare the new hash with the stored hash.
//
// WHY timingSafeEqual() INSTEAD OF ===?
//   Normal string comparison short-circuits on the first
//   differing byte. An attacker can measure how long the
//   comparison takes to guess the hash byte by byte
//   ("timing attack"). timingSafeEqual always takes the same
//   time regardless of where the mismatch is.
// ============================================================
function verifyPassword(password, storedSalt, storedHash) {
  // 2a. Re-derive a key using the SAME salt (as bytes).
  const derivedKey = crypto.scryptSync(
    password,
    Buffer.from(storedSalt, "hex"),
    64,
  );

  // 2b. Convert the stored hash string back to bytes.
  const storedBuffer = Buffer.from(storedHash, "hex");

  // 2c. Constant-time comparison — same duration either way.
  //     Must be same length (64 bytes here).
  return crypto.timingSafeEqual(derivedKey, storedBuffer);
}

// ============================================================
// 3. ENCRYPTION — encryptData(data)
//
// ALGORITHM: AES-256-CBC
//   - 256-bit key → extremely strong symmetric encryption
//   - CBC mode    → each block XORed with the previous one
//
// WHY AN IV (Initialization Vector)?
//   CBC needs a random "starting point" per message. Using the
//   same key + same IV for two messages leaks information.
//   We generate a FRESH IV for every encryption and ship it
//   alongside the ciphertext (IVs are not secret).
//
// RETURN:
//   { iv: hex, encryptedData: hex }
//   Store/transmit BOTH — decryption needs the IV.
// ============================================================
function encryptData(data) {
  // 3a. Fresh 16-byte IV (AES block size = 16 bytes).
  const iv = crypto.randomBytes(16);

  // 3b. Create a cipher instance.
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);

  // 3c. Feed in the plaintext.
  //     - Convert the object to JSON first (strings only).
  //     - "utf8" → input encoding
  //     - "hex"  → output encoding
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");

  // 3d. Finalize — flushes any remaining buffered blocks.
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
}

// ============================================================
// 4. DECRYPTION — decryptData(encryptedData, ivHex)
//
// Mirrors encryptData — same algorithm, same key, same IV.
// If the key or IV is wrong, cipher.final() throws.
// ============================================================
function decryptData(encryptedData, ivHex) {
  // 4a. Create decipher — same algorithm + key + IV.
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    encryptionKey,
    Buffer.from(ivHex, "hex"),
  );

  // 4b. Feed in the ciphertext.
  //     Input hex → output utf8 (the original JSON string).
  let decrypted = decipher.update(encryptedData, "hex", "utf8");

  // 4c. Finalize.
  decrypted += decipher.final("utf8");

  // 4d. Parse JSON back into an object.
  return JSON.parse(decrypted);
}

// ============================================================
// 5. INTEGRITY HASH — createHash(data) → SHA-256 hex
//
// GOAL:
//   Produce a fixed-size fingerprint of any data.
//   If a single byte changes, the hash changes completely.
//
// USE CASES:
//   - File checksums
//   - Content-addressable storage (like Git)
//   - Password-less integrity checks
//
// NOTE:
//   This is NOT encryption — it is one-way. You cannot reverse
//   a hash. But it is also NOT keyed, so anyone can compute it.
//   For "signed" integrity, use HMAC (next function).
// ============================================================
function createHash(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

// ============================================================
// 6. HMAC SIGNATURE — createSignature(data)
//
// GOAL:
//   Prove that a message came from someone who knows a shared
//   secret. Unlike a plain hash, HMAC requires the secret to
//   compute — so attackers cannot forge it without the key.
//
// USE CASES:
//   - Webhook verification (Stripe, GitHub)
//   - JWT signatures (HS256)
//   - API request signing
//
// HOW:
//   HMAC = Hash(secret-key ⊕ opad || Hash(secret-key ⊕ ipad || msg))
//   `crypto.createHmac` handles all of that for you.
// ============================================================
function createSignature(data) {
  return crypto.createHmac("sha256", hmacSecret).update(data).digest("hex");
}

// ============================================================
// 7. SECURE TOKEN — generateAccessToken()
//
// GOAL:
//   Produce a random, unpredictable string suitable for:
//     - Session IDs
//     - Password reset links
//     - API keys
//     - CSRF tokens
//
// WHY 32 BYTES?
//   256 bits of entropy → 2^256 possible values, effectively
//   uncrackable by brute force.
//
// WHY NOT Math.random()?
//   Math.random() is NOT cryptographically secure — its output
//   is predictable. Always use crypto.randomBytes for secrets.
// ============================================================
function generateAccessToken() {
  return crypto.randomBytes(32).toString("hex");
}

// ============================================================
// 8. APPLICATION EXECUTION — run the demo end-to-end.
//
// We wrap everything in try/catch so any crypto failure
// (bad key length, wrong IV, wrong algorithm, ...) is caught
// and printed instead of crashing the process.
// ============================================================
try {
  // ---------- Step A: Hash a password ----------
  const password = "Student@2026";
  const passwordData = hashPassword(password);

  console.log("Password Hash Created");
  // Internally: { salt: "…hex…", hash: "…hex…" } — store both.

  // ---------- Step B: Verify the password ----------
  // Same input → should return true.
  const passwordValid = verifyPassword(
    "Student@2026",
    passwordData.salt,
    passwordData.hash,
  );

  console.log("Password Valid:", passwordValid);
  // → Password Valid: true

  // ---------- Step C: Prepare a student record ----------
  const student = {
    id: 101,
    name: "John Doe",
    department: "Software Engineering",
    grade: 92,
  };

  // ---------- Step D: Encrypt the record ----------
  const encrypted = encryptData(student);

  console.log("\nEncrypted Record:");
  console.log(encrypted.encryptedData);
  // → e.g. "a1f3c4…" (long hex string)

  // ---------- Step E: Decrypt the record ----------
  // Uses the same key + the IV we saved.
  const decrypted = decryptData(encrypted.encryptedData, encrypted.iv);

  console.log("\nDecrypted Record:");
  console.log(decrypted);
  // → { id: 101, name: "John Doe", … }

  // ---------- Step F: Integrity hash (SHA-256) ----------
  const recordHash = createHash(student);

  console.log("\nRecord Hash:", recordHash);
  // → 64-char hex string

  // ---------- Step G: HMAC signature ----------
  // Signs the ENCRYPTED form (common for transmitted payloads).
  const signature = createSignature(encrypted.encryptedData);

  console.log("\nHMAC Signature:", signature);
  // → 64-char hex string

  // ---------- Step H: Generate a secure token ----------
  const accessToken = generateAccessToken();

  console.log("\nAccess Token:", accessToken);
  // → 64-char hex string (32 random bytes)
} catch (error) {
  // Any crypto failure (bad key, bad IV, wrong length, …) lands here.
  console.log("Security Error:", error.message);
}
