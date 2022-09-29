import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { hasOwnProperty } from "./common";

export const showNotificationOnError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    showNotification({
      color: "red",
      title: error.message,
      message:
        responseData &&
        responseData instanceof Object &&
        hasOwnProperty(responseData, "description") &&
        typeof responseData.description === "string"
          ? responseData.description
          : "Something went wrong, try later",
    });
  } else {
    if (error instanceof Error) {
      showNotification({
        color: "red",
        message: error.message,
      });
    }
  }
};
