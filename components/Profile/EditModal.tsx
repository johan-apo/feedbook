import { useEffect, useMemo } from "react";
import { Button, Divider, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axiosInstance from "../../lib/axios";
import {
  setUser,
  updateUsernameById,
  updateUserPictureById,
} from "../../app/features/user/userSlice";
import { UpdateUsernameRESULT } from "../../prisma/queries";
import { showNotification } from "@mantine/notifications";

/* ---------------------------------- Uppy ---------------------------------- */
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Webcam from "@uppy/webcam";
import AwsS3 from "@uppy/aws-s3";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/webcam/dist/style.css";

interface EditModal {
  modalProps: {
    opened: boolean;
    setOpened: (arg: boolean) => void;
  };
}

const EditModal = ({ modalProps: { opened, setOpened } }: EditModal) => {
  const user = useAppSelector((state) => state.user.value);

  const uppy = useMemo(() => {
    return new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: [".jpg", ".jpeg", ".png"],
      },
      onBeforeFileAdded(currentFile) {
        const name = `${user?.username}__${Date.now()}.${
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
        getUploadParameters(file) {
          return axiosInstance
            .put("/users/sign-url-s3", {
              filename: file.name,
            })
            .then(({ data: { signedUrl } }) => {
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
              console.error(error);
            });
        },
      })
      .on("upload-success", async (_file, { uploadURL }) => {
        if (uploadURL && user?.id) {
          dispatch(updateUserPictureById({ uploadURL, userId: user.id }));

          showNotification({
            color: "green",
            message: "Your profile picture has been updated",
          });
        }
      });
  }, [user?.username]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => uppy.close();
  }, [uppy]);

  const form = useForm({
    initialValues: {
      username: user?.username,
    },
  });

  const handleSubmit = async ({ username }: typeof form.values) => {
    if (user && username) {
      dispatch(updateUsernameById({ userId: user.id, username }));

      showNotification({
        color: "green",
        message: "Changes saved",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Edit your profile"
    >
      <Group position="center">
        <Dashboard
          uppy={uppy}
          plugins={["Webcam"]}
          theme="dark"
          width={300}
          height={300}
        />
      </Group>
      <Divider my="xl" />
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput label="Username" {...form.getInputProps("username")} />
        <Group position="right" mt="md">
          <Button type="submit">Edit</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default EditModal;
