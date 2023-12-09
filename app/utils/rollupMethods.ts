import { Domain } from "domain";
import { getAccount, getWalletClient } from "wagmi/actions";

const getAnnouncements = async (): Promise<Annoucement[] | undefined> => {
  try {
    const res = await fetch("http://localhost:8080/announcements", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log(res);
        const data = await res.json();
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(res.currentAnnouncement);
    return res.currentAnnouncement;
  } catch (error) {
    console.log(error);
  }
};

const getRegisters = async (): Promise<Register[] | undefined> => {
  try {
    const res = await fetch("http://localhost:8080/registers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log(res);
        const data = await res.json();
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(res.currentRegistry);
    return res.currentRegistry;
  } catch (error) {
    console.log(error);
  }
};

// const domain = {
//   name: "Stackr MVP v0",
//   version: "1",
//   chainId: 69420,
//   verifyingContract: "0x778855a567ba97db108d84e9c88e02ec676fc444",
//   salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
// } as const;
// const types = {
//   "update-announcement": [
//     {
//       name: "type",
//       type: "string",
//     },
//     {
//       name: "stealthAddress",
//       type: "address",
//     },
//     {
//       name: "ephemeralPublicKey",
//       type: "bytes",
//     },
//     {
//       name: "viewTag",
//       type: "uint256",
//     },
//     {
//       name: "publicAddress",
//       type: "address",
//     },
//     {
//       name: "stelathMetaAddress",
//       type: "bytes",
//     },
//     {
//       name: "schemeId",
//       type: "uint256",
//     },
//   ],
// } as const;

// const updateAnnouncement = async (
//   stealthAddress: `0x${string}`,
//   ephemeralPublicKey: `0x${string}`,
//   viewTag: bigint
// ) => {
//   const walletClient = await getWalletClient();
//   const account = await getAccount();
//   if (!walletClient?.account.address) {
//     console.log("Account not found");
//     return;
//   }
//   try {
//     const announcementData: AnnouncementActionInput = {
//       type: "announce",
//       stealthAddress: stealthAddress,
//       ephemeralPublicKey: ephemeralPublicKey,
//       viewTag: viewTag,
//       publicAddress: "0xCB5160610F4655B938eE67729fD542AFb5d1586F",
//       stelathMetaAddress:
//         "0x025227b7d6a0163ac13dc25854c8da65ea84a3994e3b0fb56debebac4e75ba2d7e025227b7d6a0163ac13dc25854c8da65ea84a3994e3b0fb56debebac4e75ba2d7e",
//       schemeId: BigInt(0),
//     };

//     const sign = await walletClient?.signTypedData({
//       account: walletClient.account.address,
//       domain: domain,
//       types: types,
//       primaryType: "update-announcement",
//       message: announcementData,
//     });

//     const res = await fetch("http://localhost:8080/update", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         msgSender: walletClient?.account.address,
//         signature: sign,
//         payload: announcementData,
//       }),
//     })
//       .then(async (res) => {
//         console.log(res);
//         const data = await res.json();
//         console.log(data);
//         return res;
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     console.log(res);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const updateRegister = async (
//   publicAddress: `0x${string}`,
//   stelathMetaAddress: `0x${string}`,
//   schemeId: bigint
// ) => {
//   const walletClient = await getWalletClient();
//   if (!walletClient?.account) {
//     console.log("Account not found");
//     return;
//   }
//   try {
//     const registerData: AnnouncementActionInput = {
//       type: "register",
//       stealthAddress: "0xf056c1bbf293799910ac551f405ac91e28e1d831",
//       ephemeralPublicKey:
//         "0x0397fce4b5618ea3c2f125b44e04d708b3318b9e3df4fb733d0002d105288fd54b",
//       viewTag: BigInt(0),
//       publicAddress: publicAddress,
//       stelathMetaAddress: stelathMetaAddress,
//       schemeId: schemeId,
//     };

//     const sign = await walletClient?.signTypedData({
//       account: walletClient?.account,
//       domain: domain,
//       types: types,
//       primaryType: "update-announcement",
//       message: registerData,
//     });

//     const res = await fetch("http://localhost:8080/update", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         msgSender: walletClient?.account.address,
//         signature: sign,
//         payload: registerData,
//       }),
//     })
//       .then(async (res) => {
//         console.log(res);
//         const data = await res.json();
//         console.log(data);
//         return res;
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     console.log(res);
//   } catch (error) {
//     console.log(error);
//   }
// };

const updateAnnouncement = async (
  stealthAddress: string,
  ephemeralPublicKey: string,
  viewTag: number
) => {
  try {
    const res = await fetch("http://localhost:8080/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "announce",
        stealthAddress: stealthAddress,
        ephemeralPublicKey: ephemeralPublicKey,
        viewTag: viewTag,
        publicAddress: "0xCB5160610F4655B938eE67729fD542AFb5d1586F",
        stelathMetaAddress:
          "0x025227b7d6a0163ac13dc25854c8da65ea84a3994e3b0fb56debebac4e75ba2d7e025227b7d6a0163ac13dc25854c8da65ea84a3994e3b0fb56debebac4e75ba2d7e",
        schemeId: 0,
      }),
    })
      .then(async (res) => {
        console.log(res);
        const data = await res.json();
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const updateRegister = async (
  publicAddress: string,
  stelathMetaAddress: string,
  schemeId: number
) => {
  try {
    const res = await fetch("http://localhost:8080/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "register",
        stealthAddress: "0xf056c1bbf293799910ac551f405ac91e28e1d831",
        ephemeralPublicKey:
          "0x0397fce4b5618ea3c2f125b44e04d708b3318b9e3df4fb733d0002d105288fd54b",
        viewTag: 237,
        publicAddress: publicAddress,
        stelathMetaAddress: stelathMetaAddress,
        schemeId: schemeId,
      }),
    })
      .then(async (res) => {
        console.log(res);
        const data = await res.json();
        console.log(data);
        return res;
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export { getAnnouncements, getRegisters, updateAnnouncement, updateRegister };

export type Annoucement = {
  stealthAddress: `0x${string}`;
  ephemeralPublicKey: `0x${string}`;
  viewTag: number;
};

export type Register = {
  publicAddress: `0x${string}`;
  stelathMetaAddress: `0x${string}`;
  schemeId: number;
};

export interface AnnouncementActionInput {
  type: "announce" | "register";
  stealthAddress: `0x${string}`;
  ephemeralPublicKey: `0x${string}`;
  viewTag: bigint;
  publicAddress: `0x${string}`;
  stelathMetaAddress: `0x${string}`;
  schemeId: bigint;
}

// const scanAnnouncemets = async (
//   spendingKey: string,
//   viewingKey: string
// ): Promise<Register | undefined> => {
//   try {
//     const announcementData = await getAnnouncements();
//     if (!announcementData) {
//       return;
//     }
//     // announcementData[0].
//     // find the object which has the userAddress as publicAddress
//   } catch (error) {
//     console.log(error);
//   }
// };

const getUserMetadatAddress = async (
  userAddress: `0x${string}`
): Promise<Register | undefined> => {
  try {
    const registerData = await getRegisters();
    if (!registerData) {
      return;
    }
    // find the object which has the userAddress as publicAddress
    const userMetadataObject = registerData.find(
      (object: Register) => object.publicAddress === userAddress
    );

    return userMetadataObject;
  } catch (error) {
    console.log(error);
  }
};

export { getUserMetadatAddress };
