import type { AppProps } from "next/app";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";

const client = createClient(
  getDefaultClient({
    appName: "Ceramic multi users",
    connectors: [new MetaMaskConnector({ chains: [polygonMumbai] })],
  })
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Ceramic multi users</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              /** Put your mantine theme override here */
              colorScheme: "light",
            }}
          >
            <Component {...pageProps} />
          </MantineProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  );
}
