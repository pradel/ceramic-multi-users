const go = async () => {
  const conditions = [
    {
      conditionType: "evmBasic",
      contractAddress: "REPLACE_WITH_LOCK_ADDRESS",
      standardContractType: "ERC721",
      chain: "mumbai",
      method: "balanceOf",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    },
  ];

  const testResult = await Lit.Actions.checkConditions({
    conditions,
    authSig,
    chain: "mumbai",
  });

  // only sign if the access condition is true
  if (!testResult) {
    return;
  }

  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await LitActions.signEcdsa({
    toSign,
    publicKey,
    sigName,
  });
};

go();
