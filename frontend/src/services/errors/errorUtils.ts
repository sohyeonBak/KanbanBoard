import { ApiError } from "./errors";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    // If there are field-specific errors, return the first one
    if (error.errors && Object.keys(error.errors).length > 0) {
      const firstField = Object.keys(error.errors)[0];
      const firstError = error.errors[firstField][0];
      return firstError;
    }
    // Return the main error message
    return error.message;
  }

  // Handle axios errors
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as any;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
  }

  // Fallback to generic error
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};
