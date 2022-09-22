import { Paper } from "@mantine/core";

const PaperContainer = ({
  children,
  mb,
}: {
  children: React.ReactNode;
  mb?: string;
}) => {
  return (
    <Paper
      p="md"
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[6],
      })}
      mb={mb}
    >
      {children}
    </Paper>
  );
};

export default PaperContainer;
