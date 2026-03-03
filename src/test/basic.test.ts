import { sum } from "./basic.ts";
import { describe, expect, test } from "@jest/globals";

describe("sum module", () => {
	test("adds two numbers and return their sum", () => {
		expect(sum(3, 4)).toBe(7);
	});
});
