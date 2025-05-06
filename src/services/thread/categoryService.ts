import { isAxiosError } from "axios";

import { AxiosError } from "axios";

import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import axiosInstance from "@/api/axios";
import { CategoryResponse } from "@/types";

export const fetchCategories = async (): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.get<CategoryResponse>('/threads/categories');

    if (response.data) {
      return response.data;
    }

    return {
      data: []
    };
  } catch (error) {
    console.error('Categories fetching error:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 404) {
        throw new Error(RESPONSE_MESSAGES.thread.NOT_FOUND);
      }
    }

    throw new Error(RESPONSE_MESSAGES.thread.DEFAULT);
  }
};