import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  useTabs,
  useTab,
} from "@chakra-ui/react";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Annoucement,
  getUserMetadatAddress,
  scanAnnouncemets,
  updateAnnouncement,
} from "@/utils/rollupMethods";
import { getStealthAddress, revealStealthKey } from "@/utils/stealthMethods";
import {
  erc20ABI,
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { createWalletClient, http, parseEther } from "viem";
import sha256 from "sha256";
import { privateKeyToAccount } from "viem/accounts";

const Modal = () => {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { chain, chains } = useNetwork();

  const [receiverAddress, setReceieverAddress] = useState<`0x${string}`>();
  const [stealthMetaAddress, setStealthMetaAddress] = useState<string>();
  const [tokenAddress, setTokenAddress] = useState<`0x${string}`>();
  const [amount, setAmount] = useState<string>();
  const [checkReceiverData, setCheckReceiverData] = useState<boolean>(false);
  const [checkTokenTransfer, setCheckTokenTransfer] = useState<boolean>(false);
  const [spendingKey, setSpendingKey] = useState<string>();
  const [viewingKey, setViewingKey] = useState<string>();
  const [announcements, setAnnouncements] = useState<Annoucement[]>();
  const [stealthAddressData, setStealthAddressData] = useState<{
    schemeId: string;
    stealthAddress: `0x${string}`;
    ephemeralPublicKey: string;
    viewTag: number;
  }>();
  const [stealthKey, setStealthKey] = useState<string>();
  const [page, setPage] = useState<number>(0);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [scanData, setScanData] = useState<Annoucement[]>();
  const [chooseStealthAddress, setChooseStealthAddress] = useState<string>();

  const { selectedIndex, setSelectedIndex } = useTabs({});

  const handleSwitchToTab = (tabIndex: number) => {
    setSelectedIndex(tabIndex);
  };

  const steps = [
    { title: "Generation", description: "Stealth Address" },
    { title: "Transfer", description: "Transfer funds" },
    { title: "Announce", description: "Announce SA and EPK" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const handleStepper = () => {
    const condition = true;

    if (condition) {
      if (activeStep < steps.length) {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleGetReceiverData = async () => {
    try {
      if (!receiverAddress) {
        console.log("No Receiver Address Found");
        return;
      }
      const userMetadata = await getUserMetadatAddress(receiverAddress);
      console.log(userMetadata);
      if (!userMetadata) {
        console.log("No Metadata address found");
        return;
      }
      setStealthMetaAddress(userMetadata.stelathMetaAddress);
      const stealthAddressData = await getStealthAddress(
        userMetadata.stelathMetaAddress
      );
      if (!stealthAddressData) {
        console.log("No Stealth address found");
        return;
      }
      setStealthAddressData(stealthAddressData);
      if (stealthAddressData) {
        await setCheckReceiverData(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTokenTransfer = async () => {
    try {
      if (!stealthAddressData) {
        console.log("No Stealth address found");
        return;
      }
      // transfer the funds to the stealth address
      if (!walletClient) {
        console.log("No Wallet Client Found");
        return;
      }
      if (!amount) {
        console.log("No Wallet Client Found");
        return;
      }

      if (tokenAddress === "0xe") {
        try {
          const hash = await walletClient.sendTransaction({
            account: account,
            //@ts-ignore
            to: stealthAddressData.stealthAddress,
            value: parseEther(amount),
          });
          console.log(hash);
          console.log("Transaction Sent");
          const transaction = await publicClient.waitForTransactionReceipt({
            hash: hash,
          });
          console.log(transaction);
        } catch (error) {
          console.log(error);
        }
      } else if (tokenAddress !== "0xe" && tokenAddress) {
        // perform token Transfer
        const data = await publicClient?.simulateContract({
          account,
          address: tokenAddress,
          abi: erc20ABI,
          functionName: "transfer",
          args: [stealthAddressData.stealthAddress, parseEther(amount)],
        });
        console.log(data);
        if (!walletClient) {
          console.log("Wallet client not found");
          return;
        }
        // @ts-ignore
        const hash = await walletClient.writeContract(data.request);
        console.log("Transaction Sent");
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: hash,
        });
        console.log(transaction);
        setTransactionHash(hash);
      } else {
        console.log("No Token Address Found");
        return;
      }
      // await handleStepper();
      setCheckTokenTransfer(true);
    } catch (error) {
      console.log(error);
    }
  };

  const signAndGenerateKey = async () => {
    try {
      if (!walletClient) {
        return;
      }
      const signature = await walletClient.signMessage({
        account,
        message:
          "Sign this message to get access to your app-specific keys. Only Sign this Message while using this app",
      });
      console.log(signature);
      const portion = signature.slice(2, 66);

      const privateKey = sha256(`0x${portion}`);
      console.log(`0x${privateKey}`);

      const newAccount = privateKeyToAccount(`0x${privateKey}`);
      console.log(newAccount);

      setSpendingKey(`0x${privateKey}`);
      setViewingKey(`0x${privateKey}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAnnounce = async () => {
    try {
      if (!stealthAddressData) {
        console.log("No Stealth address found");
        return;
      }

      // update the Registery contract with the stealth address data
      await updateAnnouncement(
        stealthAddressData.stealthAddress,
        stealthAddressData.ephemeralPublicKey,
        stealthAddressData.viewTag
      );

      await handleStepper();
    } catch (error) {
      console.log(error);
    }
  };

  // scan for the user's ephemeral public key set
  const handleScan = async () => {
    try {
      if (!spendingKey || !viewingKey) {
        console.log("Please sign and generate keys");
        return;
      }
      const data = await scanAnnouncemets(spendingKey, viewingKey);
      console.log(data);
      setScanData(data);
      if (data) {
        setAnnouncements(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRevealStealthKey = async () => {
    try {
      if (!spendingKey || !viewingKey) {
        console.log("Please sign and generate keys");
        return;
      }
      if (!stealthAddressData) {
        console.log("No Stealth address found");
        return;
      }
      const data = await revealStealthKey(
        spendingKey,
        viewingKey,
        stealthAddressData?.stealthAddress,
        stealthAddressData?.ephemeralPublicKey
      );
      console.log(data);
      if (data) {
        setStealthKey(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleWithdraw = async () => {
    try {
      if (!stealthKey) {
        console.log("No Stealth Key Found");
        return;
      }
      //@ts-ignore
      const account = privateKeyToAccount(stealthKey);

      const walletClient = createWalletClient({
        account,
        chain: chain,
        transport: http(),
      });

      // withdraw the funds from the stealth address
      // you have stelathPrivate Key

      if (!amount) {
        console.log("No Wallet Client Found");
        return;
      }
      const hash = await walletClient.sendTransaction({
        account: account,
        //@ts-ignore
        to: stealthAddressData.stealthAddress,
        value: parseEther(amount),
      });
      console.log(hash);
      console.log("Transaction Sent");
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      console.log(transaction);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen bg-gradient-to-r from-white via-blue-100 to-rose-200">
      <div className="flex flex-col mx-auto justify-between w-full">
        <div className="mt-20 flex mx-auto justify-center">
          <Tabs index={selectedIndex} variant="soft-rounded" colorScheme="blue">
            <div className="flex mx-auto px-2 w-[300px] py-1 bg-white rounded-xl">
              <TabList>
                <Tab onClick={() => setSelectedIndex(0)}>Transfer</Tab>
                <Tab onClick={() => setSelectedIndex(1)}>Withdraw</Tab>
                <Tab
                  onClick={() => {
                    setSelectedIndex(2);
                    handleScan();
                  }}
                >
                  Scan
                </Tab>
              </TabList>
            </div>
            <TabPanels>
              <TabPanel>
                <div className="flex flex-col px-6 py-2 bg-white rounded-xl w-full mt-6">
                  {/* <p className="font-mono text-md">Transfer</p> */}
                  <Stepper className="mt-3" size="sm" index={activeStep}>
                    {steps.map((step, index) => (
                      <Step key={index}>
                        <StepIndicator>
                          <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                          />
                        </StepIndicator>

                        <Box flexShrink="0">
                          <StepTitle>{step.title}</StepTitle>
                          <StepDescription>{step.description}</StepDescription>
                        </Box>

                        <StepSeparator />
                      </Step>
                    ))}
                  </Stepper>
                  <div className="mt-5 flex flex-col"></div>
                  {activeStep == 0 && page == 0 && (
                    <div>
                      {!checkReceiverData && (
                        <div className="flex flex-col">
                          <div className="mt-5 flex flex-col">
                            <p className="text-md text-gray-600">
                              address of receiver
                            </p>
                            <input
                              type="text"
                              className="px-4 mt-2 py-3 border border-gray-100 rounded-xl w-full"
                              placeholder="Enter address of receiver"
                              onChange={(e) =>
                                setReceieverAddress(e.target.value)
                              }
                            ></input>
                          </div>
                          <div className="mt-7 mx-auto">
                            <button
                              onClick={() => handleGetReceiverData()}
                              className="px-6 mx-auto flex justify-center py-2 bg-blue-500 text-white text-xl rounded-xl font-semibold border hover:scale-105 hover:bg-white hover:border-blue-500 hover:text-blue-500 duration-200"
                            >
                              Generate Stealth for Receiver
                            </button>
                          </div>
                          <div className="mt-3 flex justify-center text-center mx-auto mb-3">
                            <p className="text-sm text-gray-500 w-2/3 text-center">
                              The identity of the receiver will be masked using
                              the stealth address
                            </p>
                          </div>
                        </div>
                      )}
                      {checkReceiverData && (
                        <div className="flex flex-col">
                          <div className="mt-1 flex flex-col">
                            <p className="text-lg text-center text-blue-600">
                              Addresses Generated
                            </p>
                          </div>
                          <div className="mt-4 flex flex-col">
                            <p className="text-md text-gray-600">
                              Stealth Address
                            </p>
                            <p className="text-lg mt-1 text-gray-600">
                              {stealthAddressData?.stealthAddress}
                            </p>
                          </div>
                          <div className="mt-4 flex flex-col">
                            <p className="text-md text-gray-600">
                              Ephemeral Public Key
                            </p>
                            <p className="text-lg mt-1 text-gray-600">
                              {stealthAddressData?.ephemeralPublicKey.slice(
                                0,
                                15
                              )}
                              ....
                              {stealthAddressData?.ephemeralPublicKey.slice(-5)}
                            </p>
                          </div>
                          <div className="mt-4 flex flex-col">
                            <p className="text-md text-gray-600">View Tag</p>
                            <p className="text-lg mt-1 text-gray-600">
                              {stealthAddressData?.viewTag}
                            </p>
                          </div>
                          <div className="mt-4 flex flex-col">
                            <p className="text-md text-gray-600">
                              Meta Address
                            </p>
                            <p className="text-lg mt-1 text-gray-600">
                              {stealthMetaAddress.slice(0, 20)}....
                              {stealthMetaAddress.slice(-15)}
                            </p>
                          </div>
                          <div className="w-full flex mt-6 justify-between">
                            <button className=""></button>
                            <button
                              onClick={() => {
                                setPage((currPage) => currPage + 1);
                                setActiveStep(activeStep + 1);
                              }}
                              className="bg-white border border-blue-500 rounded-xl px-7 py-1 text-lg text-blue-500 font-semibold"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeStep == 1 && page == 1 && (
                    <div>
                      {!checkTokenTransfer && (
                        <div className="flex flex-col">
                          <div className="mt-4 flex flex-col">
                            <p className="text-md text-gray-600">
                              Sending Funds from
                            </p>
                            <p className="text-lg mt-1 text-gray-600">
                              {chooseStealthAddress}
                            </p>
                          </div>
                          <div className="mt-5 flex flex-col">
                            <p className="text-md text-gray-600">amount</p>
                            <div className="flex w-full items-center">
                              <input
                                className="px-4 mt-2 py-3 border border-gray-100 rounded-xl text-2xl w-3/4"
                                placeholder="0"
                                onChange={(e) => setAmount(e.target.value)}
                              ></input>
                              <select
                                onChange={(e) =>
                                  // @ts-ignore
                                  setTokenAddress(e.target.value)
                                }
                                className="mx-2 bg-white border border-blue-500 h-12 mt-1 rounded-xl px-1 py-0.5 text-md text-blue-500 font-semibold w-1/3"
                              >
                                <option value="0xe">{chain?.name}</option>
                                {chain?.id == 80001 && (
                                  <option value="0x326C977E6efc84E512bB9C30f76E30c160eD06FB">
                                    Link
                                  </option>
                                )}
                              </select>
                            </div>
                          </div>
                          <div className="mt-7 mx-auto">
                            <button
                              onClick={() => handleTokenTransfer()}
                              className="px-6 mx-auto flex justify-center py-2 bg-blue-500 text-white text-xl rounded-xl font-semibold border hover:scale-105 hover:bg-white hover:border-blue-500 hover:text-blue-500 duration-200"
                            >
                              Transfer Funds
                            </button>
                          </div>
                          <div className="mt-3 flex justify-center text-center mx-auto mb-3">
                            <p className="text-sm text-gray-500 w-2/3 text-center">
                              The identity of the receiver will be masked using
                              the stealth address
                            </p>
                          </div>
                        </div>
                      )}{" "}
                      {checkTokenTransfer && (
                        <div className="flex flex-col">
                          <div className="mt-1 flex flex-col">
                            <p className="text-lg text-center text-blue-600">
                              Token Transfered
                            </p>
                          </div>
                          <div className="mt-4 flex flex-col">
                            <p className="text-md text-gray-600">
                              Transaction hash
                            </p>
                            <p className="text-lg mt-1 text-gray-600">
                              {transactionHash?.slice(0, 15)}....
                              {transactionHash?.slice(-5)}
                            </p>
                          </div>
                          <div className="w-full flex mt-6 justify-between">
                            <button
                              onClick={() => {
                                setPage((currPage) => currPage - 1);
                                setActiveStep(activeStep - 1);
                                setStealthAddressData(null);
                              }}
                              className="bg-white border border-blue-500 rounded-xl px-7 py-1 text-lg text-blue-500 font-semibold"
                            >
                              Prev
                            </button>
                            <button
                              onClick={() => {
                                setPage((currPage) => currPage + 1);
                                setActiveStep(activeStep + 1);
                              }}
                              className="bg-white border border-blue-500 rounded-xl px-7 py-1 text-lg text-blue-500 font-semibold"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeStep == 2 && (
                    <div>
                      <div className="mt-5 flex flex-col"></div>
                      <div className="mt-2 mx-auto">
                        <button
                          onClick={() => handleAnnounce()}
                          className="px-6 mx-auto flex justify-center py-2 bg-blue-500 text-white text-xl rounded-xl font-semibold border hover:scale-105 hover:bg-white hover:border-blue-500 hover:text-blue-500 duration-200"
                        >
                          Announce Stealth Address
                        </button>
                      </div>
                      <div className="mt-3 flex justify-center text-center mx-auto mb-3">
                        <p className="text-sm text-gray-500 w-2/3 text-center">
                          The identity of the receiver will be masked using the
                          stealth address
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
              <TabPanel>
                <div className="flex flex-col px-6 py-2 bg-white rounded-xl w-full mt-6">
                  <p className="font-mono text-md">Withdraw</p>
                  <div className="mt-5 flex flex-col">
                    <p className="text-md text-gray-600">amount</p>
                    <input
                      className="px-4 mt-2 py-3 border border-gray-100 rounded-xl text-2xl w-[420px]"
                      placeholder="0"
                    ></input>
                  </div>
                  <div className="mt-5 flex flex-col">
                    <p className="text-md text-gray-600">
                      address of receiving wallet
                    </p>
                    <input
                      className="px-4 mt-2 py-3 border border-gray-100 rounded-xl w-[420px]"
                      placeholder="Enter address of receiving wallet"
                    ></input>
                  </div>
                  <div className="mt-7 mx-auto">
                    <button className="px-6 py-2 bg-blue-500 text-white text-xl rounded-xl font-semibold border hover:scale-105 hover:bg-white hover:border-blue-500 hover:text-blue-500 duration-200">
                      Withdraw
                    </button>
                  </div>
                  <div className="mt-3 flex justify-center text-center mx-auto mb-3">
                    <p className="text-sm text-gray-500 w-[300px] text-center">
                      Amount will be withdrawn from Stealth and deposited into
                      the provided wallet addrress
                    </p>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="flex flex-col w-[460px] px-6 py-2 bg-white rounded-xl mt-6">
                  <p className="text-md text-gray-600">Stealth Addresses</p>
                  <div className="mt-7 flex flex-col">
                    {scanData &&
                      scanData.map((data) => {
                        return (
                          <li
                            key={data.stealthAddress}
                            className={`${
                              chooseStealthAddress && "border-blue-500"
                            } border px-3 w-full py-1 mt-2 rounded-xl bg-slate-100`}
                            onClick={() =>
                              setChooseStealthAddress(data.stealthAddress)
                            }
                          >
                            {data.stealthAddress}
                          </li>
                        );
                      })}
                  </div>
                  <div className="flex justify-center mx-auto">
                    <button
                      onClick={() => handleSwitchToTab(1)}
                      className="px-6 py-2 bg-blue-500 text-white text-xl rounded-xl font-semibold border hover:scale-105 hover:bg-white hover:border-blue-500 hover:text-blue-500 duration-200"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Modal;
