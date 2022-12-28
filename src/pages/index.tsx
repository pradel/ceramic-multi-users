import {
  Alert,
  Button,
  Container,
  Group,
  Input,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";

const ipfsId = "QmeV6rLfZRZyuCJy9UdVFGGmcyrzTjzVoDmR5Dj5q8EMQB";
const pkpPublicKey =
  "0x04062350f2f578a0733c7e264a845efd7ae2150c433595bdeff04b33e4e8a63a449c37a77379038672b7a28c7f7b4fcdd15381a4e9526460c1eb2d99249d37a42b";

export default function Home() {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError(undefined);

    const pkpPublicKey = e.target["pkp-public-key"].value;
    const ipfsId = e.target["ipfs-id"].value;
    const lockAddress = e.target["lock-address"].value;

    if (!pkpPublicKey || !ipfsId || !lockAddress) {
      setFormError("Please fill in all fields");
      return;
    }

    router.push(
      `/action?pkpPublicKey=${pkpPublicKey}&ipfsId=${ipfsId}&lockAddress=${lockAddress}`
    );
  };

  return (
    <>
      <AppHeader />

      <Container size="xs">
        <Title order={2} mt="lg">
          Get Started
        </Title>
        <Text fz="sm" c="dimmed">
          In order to get started, please fill in the following form. Not sure
          where to start? Have a look at the{" "}
          <a
            href="https://github.com/pradel/ceramic-multi-users#ceramic-multi-users"
            target="_blank"
            rel="noreferrer"
          >
            Documentation
          </a>{" "}
          on GitHub.
        </Text>

        <form onSubmit={handleSubmit}>
          <Input.Wrapper
            mt="lg"
            id="pkp-public-key"
            withAsterisk
            label="Lit PKP Public Key"
            description="Please enter the PKP public key"
          >
            <Input id="pkp-public-key" placeholder="PKP public key" />
          </Input.Wrapper>

          <Input.Wrapper
            mt="lg"
            id="ipfs-id"
            withAsterisk
            label="Lit Action IPFS Id"
            description="Please enter the IPFS id of the Lit Action"
          >
            <Input id="ipfs-id" placeholder="IPFS id" />
          </Input.Wrapper>

          <Input.Wrapper
            mt="lg"
            id="lock-address"
            withAsterisk
            label="Unlock Lock Address"
            description="Please enter the Unlock Protocol lock address"
          >
            <Input id="lock-address" placeholder="Lock address" />
          </Input.Wrapper>

          {formError && (
            <Alert mt="lg" title="Error" color="red">
              {formError}
            </Alert>
          )}

          <Group position="right" mt="lg">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Container>
    </>
  );
}
