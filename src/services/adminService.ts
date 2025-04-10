import axiosInstance from "@/api/axios";
import { ValidationErrorResponse } from "@/types";
import ERROR_MESSAGES from "@/utils/api/ERROR_MESSAGES";
import { isAxiosError, AxiosError } from "axios";

export const createCategory = async (name: string) => {
  try {
    const response = await axiosInstance.post("admin/categories", { name });

    if (response.data) {
      return response.data;
    }

    throw new Error(ERROR_MESSAGES.category.DEFAULT);
  } catch (error) {
    console.error("Error creating category:", error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Handle specific HTTP status codes
      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data as ValidationErrorResponse;
        throw new Error(errorData.message || ERROR_MESSAGES.category.VALIDATION_ERROR);
      }

      if (axiosError.response?.status === 401) {
        throw new Error(ERROR_MESSAGES.auth.UNAUTHORIZED);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.category.NOT_FOUND);
      }

      if (axiosError.response?.status === 403) {
        throw new Error(ERROR_MESSAGES.category.FORBIDDEN);
      }

      if (axiosError.response?.status === 409) {
        throw new Error(ERROR_MESSAGES.category.CONFLICT);  // Handle conflict
      }
    }

    // Handle unexpected errors
    throw new Error(ERROR_MESSAGES.category.DEFAULT);
  }
};
