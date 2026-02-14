const ITERATIONS = 100000;
const HASH_LENGTH = 64;
const SALT_LENGTH = 16;

export async function hashPassword(password: string, providedSalt?: Uint8Array): Promise<string> {
	const salt = providedSalt || crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
	const passwordBuffer = new TextEncoder().encode(password);
	const key = await crypto.subtle.importKey("raw", passwordBuffer, { name: "PBKDF2" }, false, [
		"deriveBits",
	]);
	const hashBuffer = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: salt as BufferSource,
			iterations: ITERATIONS,
			hash: "SHA-256",
		},
		key,
		HASH_LENGTH * 8
	);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const saltArray = Array.from(salt);
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	const saltHex = saltArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(
	storedHash: string,
	passwordAttempt: string
): Promise<boolean> {
	const [saltHex, originalHash] = storedHash.split(":");
	if (!saltHex || !originalHash) {
		return false;
	}
	const saltArray = new Uint8Array(
		saltHex.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) || []
	);
	const attemptHash = await hashPassword(passwordAttempt, saltArray);
	return attemptHash === storedHash;
}
