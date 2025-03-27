import * as bcrypt from 'bcrypt';

/**
 * A utility class for encoding and decoding strings using Base64 format.
 */
export class CryptoUtil {
	/**
	 * Encodes a given string into Base64 format.
	 *
	 * @param data - The string to be encoded.
	 * @returns A promise that resolves to the Base64 encoded string.
	 */
	encodeBase64(data: string): string {
		return Buffer.from(data).toString('base64');
	}

	/**
	 * Decodes a Base64 encoded string.
	 *
	 * @param data - The Base64 encoded string to decode.
	 * @returns A promise that resolves to the decoded string.
	 */
	decodeBase64(data: string): string {
		return Buffer.from(data, 'base64').toString();
	}

	/**
	 * Hashes a given string using bcrypt.
	 *
	 * @param data - The string to be hashed.
	 * @returns A promise that resolves to the hashed string.
	 */
	async hash(
		data: string | Buffer,
		saltOrRounds: string | number,
	): Promise<string> {
		return bcrypt.hash(data, saltOrRounds);
	}

	/**
	 * Compares a string with a hash.
	 *
	 * @param data - The string to compare.
	 * @param hash - The hash to compare with.
	 * @returns A promise that resolves to a boolean indicating whether the string matches the hash.
	 */
	async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
		return bcrypt.compare(data, encrypted);
	}

	/**
	 * Synchronously hashes a given string using bcrypt.
	 *
	 * @param data - The string to be hashed.
	 * @returns The hashed string.
	 */
	hashSync(data: string | Buffer, saltOrRounds: string | number): string {
		return bcrypt.hashSync(data, saltOrRounds);
	}

	/**
	 * Synchronously compares a string with a hash.
	 *
	 * @param data - The string to compare.
	 * @param hash - The hash to compare with.
	 * @returns A boolean indicating whether the string matches the hash.
	 */
	compareSync(data: string | Buffer, encrypted: string): boolean {
		return bcrypt.compareSync(data, encrypted);
	}

	static encodeBase64(data: string): string {
		return new CryptoUtil().encodeBase64(data);
	}

	static decodeBase64(data: string): string {
		return new CryptoUtil().decodeBase64(data);
	}

	static hash(
		data: string | Buffer,
		saltOrRounds: string | number,
	): Promise<string> {
		return new CryptoUtil().hash(data, saltOrRounds);
	}

	static compare(data: string | Buffer, encrypted: string): Promise<boolean> {
		return new CryptoUtil().compare(data, encrypted);
	}

	static hashSync(
		data: string | Buffer,
		saltOrRounds: string | number,
	): string {
		return new CryptoUtil().hashSync(data, saltOrRounds);
	}

	static compareSync(data: string | Buffer, encrypted: string): boolean {
		return new CryptoUtil().compareSync(data, encrypted);
	}
}
