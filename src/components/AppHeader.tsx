import { Container, createStyles, Group, Header, Title } from "@mantine/core";
import { ConnectKitButton } from "connectkit";

const HEADER_HEIGHT = 60;

const useStyles = createStyles(() => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
}));

export const AppHeader = () => {
  const { classes } = useStyles();

  return (
    <Header height={HEADER_HEIGHT} mb="xl" className={classes.root}>
      <Container className={classes.header} size="xs">
        <Title order={4}>Ceramic multi users</Title>

        <Group>
          <ConnectKitButton />
        </Group>
      </Container>
    </Header>
  );
};
