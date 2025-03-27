import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
	const saltRounds: number = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10');
	const salt = await bcrypt.genSalt(saltRounds);
	return await bcrypt.hash(password, salt);
}
