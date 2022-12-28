import {
  Alert,
  Button,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { DID } from "dids";
import {
  encodeDIDWithLit,
  Secp256k1ProviderWithLit,
} from "key-did-provider-secp256k1-with-lit";
import { getResolver } from "key-did-resolver";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Orbis } from "@orbisclub/orbis-sdk";
import { forceIndexDid } from "@orbisclub/orbis-sdk/utils";
import { useAccount } from "wagmi";
import { AppHeader } from "../components/AppHeader";
import { ConnectKitButton } from "connectkit";
import { useIsMounted } from "../components/hooks";

export default function Home() {
  const router = useRouter();
  const { address, isConnecting, isDisconnected } = useAccount();
  const isMounted = useIsMounted();
  const [encodedDID, setEncodedDid] = useState<string>();
  const [didError, setDidError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // When page load we get the DID from the PKP public Key
  useEffect(() => {
    const run = async () => {
      if (!router.query.pkpPublicKey) return;

      try {
        const encodedDID = await encodeDIDWithLit(
          router.query.pkpPublicKey as string
        );
        setEncodedDid(encodedDID);
      } catch (error) {
        console.error(error);
        setDidError(error.message);
      }
    };
    run();
  }, [router.query]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError(undefined);
    setFormSuccess(false);

    const orbisDescription = e.target["orbis-description"].value;

    if (!orbisDescription) {
      setFormError("Please fill in all fields");
      return;
    }

    if (!encodedDID) {
      setFormError("Please wait for the DID to load");
      return;
    }

    if (!router.query.ipfsId) {
      setFormError("No IPFS ID set");
      return;
    }

    setFormLoading(true);

    const provider = new Secp256k1ProviderWithLit({
      did: encodedDID,
      ipfsId: router.query.ipfsId as string,
    });

    const did = new DID({ provider, resolver: getResolver() });
    try {
      await did.authenticate();
    } catch (error) {
      setFormLoading(false);
      console.error(error);
      if (error.message === "Unauthorized to sign") {
        setFormError("Unauthorized: user is not part of the team");
      } else {
        setFormError("DID authentication failed with error: " + error.message);
      }
      return;
    }

    let orbis = new Orbis();
    // Replicate the Orbis connect logic
    orbis.ceramic.did = did;
    orbis.session = {};
    orbis.session.id = did.id;
    try {
      await forceIndexDid(did.id);
      await orbis.updateProfile({ description: orbisDescription });
    } catch (error) {
      setFormLoading(false);
      console.error(error);
      setFormError(
        "Ceramic profile update failed with error: " + error.message
      );
      return;
    }

    setFormLoading(false);
    setFormSuccess(true);
  };

  return (
    <>
      <AppHeader />

      <Container size="xs">
        <Title order={2} mt="lg">
          Update PKP Orbis Profile
        </Title>
        <Text fz="sm" c="dimmed">
          This page will show you how to authenticate a user and execute the Lit
          Action. The Lit Action will check if you have an active membership in
          the Team, and if you do, it will connect you to ceramic and use the
          Orbis SDK to update the PKP profile description. You can then see on
          the Orbis website that the description has been updated. Inspect the{" "}
          <a
            href="https://github.com/pradel/ceramic-multi-users/blob/main/src/pages/action.tsx"
            target="_blank"
            rel="noreferrer"
          >
            code
          </a>
          .
        </Text>
        <Text fz="sm" c="dimmed">
          You can use the same logic to create a new Post or anything else the
          Orbis SDK allows.
        </Text>
        <Text fz="sm" c="dimmed">
          Try to run the same action for different wallets owning or not the
          unlock membership to see the results!
        </Text>

        {didError && (
          <Alert
            mt="lg"
            title="Error Getting DID from PKP Public Key"
            color="red"
          >
            {didError}
          </Alert>
        )}
        {!encodedDID && !didError && (
          <Group mt="lg" position="center">
            <Loader />
            <Text>Loading DID...</Text>
          </Group>
        )}
        {encodedDID && (
          <>
            <Title mt="lg" order={5}>
              PKP DID
            </Title>
            <Text fz="xs" c="dimmed">
              This is the encoded DID extracted from the PKP public key. It
              represents your PKP identity that you can see on Orbis Club and
              other apps.
            </Text>
            <Text>{encodedDID}</Text>
          </>
        )}

        {isMounted && isDisconnected && !isConnecting && (
          <Stack align="center" mt="lg" mb="lg" spacing="sm">
            <ConnectKitButton />
          </Stack>
        )}

        {address && isMounted && (
          <form onSubmit={handleSubmit}>
            <Textarea
              mt="lg"
              id="orbis-description"
              placeholder="Description..."
              label="Your new Orbis description"
              withAsterisk
            />

            {formError && (
              <Alert mt="lg" title="Error" color="red">
                {formError}
              </Alert>
            )}

            {formLoading && (
              <Group mt="lg" position="center">
                <Loader />
              </Group>
            )}

            {formSuccess && (
              <Alert mt="lg" title="Profile Updated" color="green">
                Orbis Profile updated successfully. You can view the new profile
                description on the{" "}
                <a
                  href={`https://app.orbis.club/profile/${encodedDID}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  PKP Orbis profile page
                </a>
                .
              </Alert>
            )}

            <Stack align="center" mt="lg" mb="lg" spacing="sm">
              <Button
                variant="gradient"
                gradient={{ from: "blue", to: "violet" }}
                type="submit"
                disabled={formLoading}
              >
                Execute Lit Action
              </Button>
            </Stack>
          </form>
        )}
      </Container>
    </>
  );
}
