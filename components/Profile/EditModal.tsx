import { Button, Divider, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateUsernameByIdTHUNK } from "../../app/features/user/userSlice";
import { showNotification } from "@mantine/notifications";

import UppyDashboard from "./UppyDashboard";

interface EditModal {
  modalProps: {
    opened: boolean;
    setOpened: (arg: boolean) => void;
  };
}

const EditModal = ({ modalProps: { opened, setOpened } }: EditModal) => {
  const currentLoggedInUser = useAppSelector((state) => state.user.value);
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      username: currentLoggedInUser?.username,
    },
  });

  const handleSubmit = async ({ username }: typeof form.values) => {
    if (currentLoggedInUser && username) {
      dispatch(
        updateUsernameByIdTHUNK({ userId: currentLoggedInUser.id, username })
      );

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
        <UppyDashboard />
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
