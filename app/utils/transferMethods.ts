export async function transferERC20(
  tokenContract: any, //ERC20_TOKEN_ADDRESS
  wallet: any,
  provider: any,
  toAddress: string,
  amount: number
) {
  try {
    const gasEstimate = await tokenContract.estimateGas.transfer(
      toAddress,
      amount
    );

    const transaction = await tokenContract.populateTransaction.transfer(
      toAddress,
      amount,
      {
        gasLimit: gasEstimate,
      },    
    );

    const signedTransaction = await wallet.signTransaction(transaction);

    const transactionResponse = await provider.sendTransaction(
      signedTransaction
    );

    console.log("Transaction Hash:", transactionResponse.hash);
  } catch (error) {
    console.error("Error transferring tokens:", error);
  }
}

export async function transferNFT(
    tokenContract: any,
    wallet: any,
    provider: any,
    toAddress: string,
    amount: number
  ) {
    try {
      const gasEstimate = await tokenContract.estimateGas.transfer(
        toAddress,
        amount
      );
  
      const transaction = await tokenContract.populateTransaction.transfer(
        toAddress,
        amount,
        {
          gasLimit: gasEstimate,
        },    
      );
  
      const signedTransaction = await wallet.signTransaction(transaction);
  
      const transactionResponse = await provider.sendTransaction(
        signedTransaction
      );
  
      console.log("Transaction Hash:", transactionResponse.hash);
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  }
  