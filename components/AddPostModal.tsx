import { Button, Group, Modal, MultiSelect, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Post } from "@prisma/client";
import { useState } from "react";
import { addPost } from "../app/features/posts/postsSlice";
import { useAppDispatch } from "../app/hooks";
import axiosInstance from "../lib/axios";

export default function AddPostModal({ opened, setOpened }: any) {
  const dispatch = useAppDispatch();

  const form = useForm<Pick<Post, "title" | "body" | "tags">>({
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

  async function handleSubmit(values: typeof form.values) {
    try {
      const { data: createdPost } = await axiosInstance.post("/posts", {
        ...values,
      });
      form.reset();
      dispatch(addPost(createdPost));
      setOpened(false);
    } catch (error: any) {
      showNotification({
        message: error.response.data.description,
        color: "red",
      });
      // console.log(error);
    }
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
