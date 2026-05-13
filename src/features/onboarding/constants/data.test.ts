import { describe, expect, it } from "vitest";
import { groupHealthConditionsByCategory } from "./data";

describe("health condition data", () => {
  it("renders musculoskeletal, other, and none categories last", () => {
    const categories = Object.keys(groupHealthConditionsByCategory());

    expect(categories.slice(-3)).toEqual(["musculoskeletal", "other", "none"]);
  });
});
