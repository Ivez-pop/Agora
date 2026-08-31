import { describe, expect, it } from "vitest";
import { DEFAULT_PAGE_SIZE } from "../../../lib/bookshelf/constants";
import { resourceListSelect } from "../../../lib/bookshelf/types";

describe("bookshelf constants", () => {
  it("defines default page size", () => {
    expect(DEFAULT_PAGE_SIZE).toBe(6);
  });
});

describe("bookshelf types & selectors", () => {
  it("defines resourceListSelect with required card fields", () => {
    expect(resourceListSelect).toEqual({
      id: true,
      title: true,
      author: true,
      type: true,
      resourceLink: true,
      imageUrl: true,
      category: {
        select: {
          name: true,
        },
      },
    });
  });
});
