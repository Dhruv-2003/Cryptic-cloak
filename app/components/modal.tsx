import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
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
import { getUserMetadatAddress } from "@/utils/rollupMethods";
import { getStealthAddress } from "@/utils/stealthMethods";

const Modal = () => {
  const [receiverAddress, setReceieverAddress] = useState<string>();
  const [stealthMetaAddress, setStealthMetaAddress] = useState<string>();

  const [stealthAddressData, setStealthAddressData] = useState<{
    schemeId: string;
    stealthAddress: string;
    ephemeralPublicKey: string;
    viewTag: string;
  }>();

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

      // await handleStepper();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen bg-gradient-to-r from-white via-blue-100 to-rose-200">
      <div className="flex flex-col mx-auto justify-between w-full">
        <div className="mt-20 flex mx-auto justify-center">
          <Tabs variant="soft-rounded" colorScheme="blue">
            <div className="flex mx-auto px-2 w-[300px] py-1 bg-white rounded-xl">
              <TabList>
                <Tab>Transfer</Tab>
                <Tab>Withdraw</Tab>
                <Tab>History</Tab>
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
                  {activeStep == 0 && (
                    <div>
                      <div className="mt-5 flex flex-col">
                        <p className="text-md text-gray-600">
                          address of receiver
                        </p>
                        <input
                          type="text"
                          className="px-4 mt-2 py-3 border border-gray-100 rounded-xl w-full"
                          placeholder="Enter address of receiver"
                          onChange={(e) => setReceieverAddress(e.target.value)}
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
                          The identity of the receiver will be masked using the
                          stealth address
                        </p>
                      </div>
                    </div>
                  )}
                  {activeStep == 1 && (
                    <div>
                      <div className="mt-5 flex flex-col">
                        <p className="text-md text-gray-600">amount</p>
                        <input
                          className="px-4 mt-2 py-3 border border-gray-100 rounded-xl text-2xl w-full"
                          placeholder="0"
                        ></input>
                      </div>
                      <div className="mt-7 mx-auto">
                        <button
                          onClick={() => handleStepper()}
                          className="px-6 mx-auto flex justify-center py-2 bg-blue-500 text-white text-xl rounded-xl font-semibold border hover:scale-105 hover:bg-white hover:border-blue-500 hover:text-blue-500 duration-200"
                        >
                          Transfer Funds
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
                  {activeStep == 2 && (
                    <div>
                      <div className="mt-5 flex flex-col"></div>
                      <div className="mt-2 mx-auto">
                        <button
                          onClick={() => handleStepper()}
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
                <div className="flex flex-col px-6 py-2 bg-white rounded-xl w-full mt-6"></div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Modal;
