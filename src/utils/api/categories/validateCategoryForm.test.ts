/**
 * To run these tests:
 * - Run this file test: pnpm test validateCategoryForm
 * - Run with coverage: pnpm test validateCategoryForm -- --coverage
 * - Run in watch mode: pnpm test validateCategoryForm -- --watch
 */

import validateCategoryForm from "./validateCategoryForm";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";

describe("validateCategoryForm", () => {
  const createValidFormData = () => ({
    name: "Valid Category Name"
  });

  describe("Name Validation", () => {
    it("should validate required name", () => {
      const data = createValidFormData();
      data.name = "";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBe(RESPONSE_MESSAGES.category.VALIDATIONS.NAME_REQUIRED);
    });

    it("should validate minimum name length", () => {
      const data = createValidFormData();
      data.name = "a";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBe(RESPONSE_MESSAGES.category.VALIDATIONS.NAME_TOO_SHORT);
    });

    it("should validate maximum name length", () => {
      const data = createValidFormData();
      data.name = "a".repeat(51);
      const errors = validateCategoryForm(data);
      expect(errors.name).toBe(RESPONSE_MESSAGES.category.VALIDATIONS.NAME_TOO_LONG);
    });

    it("should validate name starting with number", () => {
      const data = createValidFormData();
      data.name = "1Invalid Name";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBe(RESPONSE_MESSAGES.category.VALIDATIONS.NAME_STARTS_WITH_NUMBER_OR_DOT);
    });

    it("should validate name starting with dot", () => {
      const data = createValidFormData();
      data.name = ".Invalid Name";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBe(RESPONSE_MESSAGES.category.VALIDATIONS.NAME_STARTS_WITH_NUMBER_OR_DOT);
    });

    it("should validate name starting with hyphen", () => {
      const data = createValidFormData();
      data.name = "-Invalid Name";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBe(RESPONSE_MESSAGES.category.VALIDATIONS.NAME_STARTS_OR_ENDS_WITH_HYPHEN);
    });

    it("should validate name ending with hyphen", () => {
      const data = createValidFormData();
      data.name = "Invalid Name-";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBe(RESPONSE_MESSAGES.category.VALIDATIONS.NAME_STARTS_OR_ENDS_WITH_HYPHEN);
    });

    it("should validate consecutive hyphens", () => {
      const data = createValidFormData();
      data.name = "Invalid--Name";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBe(RESPONSE_MESSAGES.category.VALIDATIONS.NAME_CONSECUTIVE_HYPHENS);
    });

    it("should validate minimum letters requirement", () => {
      const data = createValidFormData();
      data.name = "123456";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBe(RESPONSE_MESSAGES.category.VALIDATIONS.NAME_MINIMUM_LETTERS);
    });

    it("should validate allowed characters", () => {
      const data = createValidFormData();
      data.name = "Invalid@Name";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBe(RESPONSE_MESSAGES.category.VALIDATIONS.NAME_INVALID_CHARS);
    });

    it("should accept valid name with letters and numbers", () => {
      const data = createValidFormData();
      data.name = "Category 123";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBeUndefined();
    });

    it("should accept valid name with hyphens", () => {
      const data = createValidFormData();
      data.name = "Category-Name";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBeUndefined();
    });

    it("should accept valid name with dots", () => {
      const data = createValidFormData();
      data.name = "Category.Name";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBeUndefined();
    });

    it("should accept valid name with spaces", () => {
      const data = createValidFormData();
      data.name = "Category Name";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBeUndefined();
    });

    it("should accept valid name with Arabic characters", () => {
      const data = createValidFormData();
      data.name = "تصنيف جديد";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBeUndefined();
    });

    it("should accept valid name with mixed Arabic and English", () => {
      const data = createValidFormData();
      data.name = "تصنيف Category";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBeUndefined();
    });

    it("should accept valid name with Arabic and numbers", () => {
      const data = createValidFormData();
      data.name = "تصنيف 123";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBeUndefined();
    });

    it("should accept valid name with Arabic and special characters", () => {
      const data = createValidFormData();
      data.name = "تصنيف-جديد.123";
      const errors = validateCategoryForm(data);
      expect(errors.name).toBeUndefined();
    });
  });

  describe("Multiple Field Validation", () => {
    it("should return no errors for valid data", () => {
      const data = createValidFormData();
      const errors = validateCategoryForm(data);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
});
