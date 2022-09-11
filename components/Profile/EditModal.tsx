import { useEffect, useMemo } from "react";
import { Button, Divider, Group, Modal, TextInput } from "@mantine/core";

/* ---------------------------------- Uppy ---------------------------------- */
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/webcam/dist/style.css";
import Webcam from "@uppy/webcam";
import { useForm } from "@mantine/form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axiosInstance from "../../lib/axios";
import { setUser } from "../../app/features/user/userSlice";
import { UpdateUserResult } from "../../prisma/queries";

interface EditModal {
  modalProps: {
    opened: boolean;
    setOpened: (arg: boolean) => void;
  };
}

const EditModal = ({ modalProps: { opened, setOpened } }: EditModal) => {
  const user = useAppSelector((state) => state.user.value);
  const uppy = useMemo(() => {
    return new Uppy().use(Webcam, {
      modes: ["picture"],
    });
  }, []);
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
    if (user) {
      const { data } = await axiosInstance.patch<UpdateUserResult>(
        `/users/${user.id}`,
        { username }
      );
      dispatch(setUser(data));
      setOpened(false);
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
