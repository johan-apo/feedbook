import { Container, Button, Text, Group, Avatar } from "@mantine/core";
import Link from "next/link";
import { useEffect } from "react";
import { fetchInfo, selectReqres } from "../../app/features/reqres/reqresSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface Support {
  url: string;
  text: string;
}

export interface Data {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: Support;
}

export type InfoState = Data | null;

const Test = () => {
  const dispatch = useAppDispatch();
  const { status, value } = useAppSelector(selectReqres);

  useEffect(() => {
    async function fetchData() {
      dispatch(fetchInfo());
    }
    fetchData();
  }, []);

  return (
    <Container>
      <h5>Hello</h5>
      <Link href="/test/data">
        <Button variant="light">To data page</Button>
      </Link>
      {status === "idle" ? (
        value &&
        value.data.map((user) => {
          return (
            <Group my="md" key={user.id}>
              <Avatar src={user.avatar} />
              <Text>{user.first_name}</Text>
              <Text weight="lighter">{user.email}</Text>
            </Group>
          );
        })
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default Test;
