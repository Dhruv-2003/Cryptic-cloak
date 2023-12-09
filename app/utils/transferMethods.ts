import { ethers } from "ethers";

const transferABI = [
    {
      name: "transfer",
      type: "function",
      inputs: [
        {
          name: "_to",
          type: "address",
        },
        {
          type: "uint256",
          name: "_tokens",
        },
      ],
      constant: false,
      outputs: [],
      payable: false,
    },
  ];

export async function transferERC20(
  tokenAddress: any, //ERC20_TOKEN_ADDRESS
  signer:any,
  amount: string,
  Recipient_Wallet_Address: string
) {
  try {
    const token = new ethers.Contract(tokenAddress, transferABI, signer);
    const amountTransfer = ethers.parseUnits(amount, 18);
    await token
      .transfer(Recipient_Wallet_Address, amountTransfer)
      .then((transferResult: any) => {
        console.log("transferResult", transferResult);
      })
      .catch((error: any) => {
        console.error("Error", error);
      });

  } catch (error) {
    console.error("Error transferring tokens:", error);
  }
}

export const transferNativeToken = async (
  walletClient: any,
  account: any,
  value: number,
  to: string
) => {
  try {
    const hash = await walletClient.sendTransaction({
      account: account,
      to: to,
      value: value,
    });
    console.log(hash);
  } catch (error) {
    console.log(error);
  }
};
