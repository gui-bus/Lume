import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("Utility Function cn()", () => {
  it("should merge Tailwind classes correctly and remove duplicates", () => {
    const result = cn("px-2 py-1", "bg-red-500", "px-4");
    expect(result).toBe("py-1 bg-red-500 px-4");
  });

  it("should ignore falsy values like undefined, null, and false", () => {
    const result = cn(
      "text-sm",
      undefined,
      null,
      false && "hidden",
      "font-bold",
    );
    expect(result).toBe("text-sm font-bold");
  });

  it("should handle arrays and conditional objects", () => {
    const result = cn(["flex", "items-center"], {
      "bg-blue-500": true,
      hidden: false,
    });
    expect(result).toBe("flex items-center bg-blue-500");
  });
});
