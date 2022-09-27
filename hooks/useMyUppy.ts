import { useMemo } from "react";
import { showNotification } from "@mantine/notifications";
import {
  selectUser,
  updateUserPictureByIdTHUNK,
} from "../app/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createSignedS3UrlREQUEST } from "../prisma/requests";
/* ---------------------------------- Uppy ---------------------------------- */
import Uppy from "@uppy/core";
import Webcam from "@uppy/webcam";
import AwsS3 from "@uppy/aws-s3";

export const useMyUppy = () => {
  const currentLoggedInUser = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const uppy = useMemo(() => {
    return new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: [".jpg", ".jpeg", ".png"],
      },
      onBeforeFileAdded(currentFile) {
        const name = `${currentLoggedInUser?.username}__${Date.now()}.${
          currentFile.extension
        }`;
        const modifiedFile = {
          ...currentFile,
          meta: {
            ...currentFile.meta,
            name,
          },
          name,
        };

        return modifiedFile;
      },
    })
      .use(Webcam, {
        modes: ["picture"],
      })
      .use(AwsS3, {
        // @ts-ignore
        getUploadParameters(file) {
          return createSignedS3UrlREQUEST(file.name)
            .then(({ signedUrl }) => {
              return {
                method: "PUT",
                url: signedUrl,
                fields: [],
                headers: {
                  "Content-Type": file.type,
                },
              };
            })
            .catch((error) => {
              if (error instanceof Error)
                showNotification({
                  color: "red",
                  message: error.message,
                });
              console.error(error);
            });
        },
      })
      .on("upload-success", async (_file, { uploadURL }) => {
        if (uploadURL && currentLoggedInUser?.id) {
          dispatch(
            updateUserPictureByIdTHUNK({
              uploadURL,
              userId: currentLoggedInUser.id,
            })
          );

          showNotification({
            color: "green",
            message: "Your profile picture has been updated",
          });
        }
      });
  }, [currentLoggedInUser?.username]);

  return uppy;
};
