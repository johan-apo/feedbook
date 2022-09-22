import { Button, Group, Modal, MultiSelect, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { addPostTHUNK } from "../app/features/posts/postsSlice";
import { useAppDispatch } from "../app/hooks";
import type { NewPostData } from "../prisma/queries";

export default function AddPostModal({ opened, setOpened }: any) {
  const dispatch = useAppDispatch();

  const form = useForm<NewPostData>({
    initialValues: {
      title: "",
      body: "",
      tags: [],
    },
  });

  const [multiselectData, setMultiselectData] = useState([
    "Good job",
    "Must improve",
    "Needs feature",
  ]);

  async function handleSubmit(formData: typeof form.values) {
    dispatch(addPostTHUNK(formData));
    setOpened(false);
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Add a new feedback post"
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput required label="Title" {...form.getInputProps("title")} />
        <TextInput
          required
          label="Description"
          {...form.getInputProps("body")}
        />
        <MultiSelect
          label="Pick tags for this post"
          data={multiselectData}
          placeholder="Select items"
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) =>
            setMultiselectData((current) => [...current, query])
          }
          {...form.getInputProps("tags")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Modal>
  );
}
