import { describe, expect, it } from "vitest";
import { createUlid, newId, prefixes, type Prefix, ulid } from "./index.js";

describe("id-util", () => {
	describe("createUlid", () => {
		it("should create a valid ULID", () => {
			const id = createUlid();
			expect(id).toBeDefined();
			expect(typeof id).toBe("string");
			expect(id.length).toBe(26);
		});

		it("should create unique ULIDs", () => {
			const id1 = createUlid();
			const id2 = createUlid();
			expect(id1).not.toBe(id2);
		});
	});

	describe("newId", () => {
		it("should create an ID with todo prefix", () => {
			const id = newId("todo");
			expect(id.startsWith("todo_")).toBe(true);
			const parts = id.split("_");
			expect(parts.length).toBe(2);
			expect(parts[0]).toBe("todo");
			expect(parts[1].length).toBe(26);
		});

		it("should create unique IDs with same prefix", () => {
			const id1 = newId("todo");
			const id2 = newId("todo");
			expect(id1).not.toBe(id2);
		});
	});

	describe("prefixes", () => {
		it("should have all expected prefixes", () => {
			expect(prefixes).toEqual({
				todo: "todo",
			});
		});
	});

	describe("ulid export", () => {
		it("should export the ulid function", () => {
			expect(typeof ulid).toBe("function");
			const id = ulid();
			expect(typeof id).toBe("string");
			expect(id.length).toBe(26);
		});
	});

	describe("Prefix type", () => {
		it("should accept valid prefix keys", () => {
			const validPrefixes: Prefix[] = ["todo"];
			expect(validPrefixes.length).toBe(1);
		});
	});
});
