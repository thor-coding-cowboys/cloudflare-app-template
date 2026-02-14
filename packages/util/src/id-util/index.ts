import { ulid } from "ulid";

export const createUlid = (): string => {
	return ulid();
};

const prefixes = {
	todo: "todo",
} as const;

export const newId = (prefix: keyof typeof prefixes): string => {
	return [prefixes[prefix], ulid()].join("_");
};

export const isValidId = (id: string, expectedPrefix?: keyof typeof prefixes): boolean => {
	if (!id || typeof id !== "string") return false;

	const parts = id.split("_");
	if (parts.length !== 2) return false;

	const [prefix, idPart] = parts;

	if (!Object.values(prefixes).includes(prefix as (typeof prefixes)[keyof typeof prefixes])) {
		return false;
	}

	if (expectedPrefix && prefix !== prefixes[expectedPrefix]) {
		return false;
	}

	const ulidRegex = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i;
	return ulidRegex.test(idPart);
};

export const getIdPrefix = (id: string): string | null => {
	if (!isValidId(id)) return null;
	return id.split("_")[0] || null;
};

export const hasPrefix = (id: string, prefix: keyof typeof prefixes): boolean => {
	return isValidId(id) && id.startsWith(`${prefixes[prefix]}_`);
};

export const createIdSchema = (prefix: keyof typeof prefixes) => {
	return z
		.string()
		.refine(
			(val) => isValidId(val, prefix),
			`Invalid ID format. Expected: ${prefixes[prefix]}_{ulid}`
		);
};

export const createOptionalIdSchema = (prefix: keyof typeof prefixes) => {
	return z
		.string()
		.optional()
		.refine((val) => {
			if (val === undefined) return true;
			return isValidId(val, prefix);
		}, `Invalid ID format. Expected: ${prefixes[prefix]}_{ulid}`);
};

import { z } from "zod";
export { ulid };
export { prefixes };
export type Prefix = keyof typeof prefixes;
