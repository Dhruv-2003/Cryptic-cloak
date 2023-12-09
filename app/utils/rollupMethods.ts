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
        publicAddress: "",
        stelathMetaAddress: "",
        schemeId: 0,
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
        stealthAddress: "",
        ephemeralPublicKey: "",
        viewTag: "",
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
  ephemeralPublicKey: string;
  viewTag: number;
};

export type Register = {
  publicAddress: `0x${string}`;
  stelathMetaAddress: string;
  schemeId: number;
};

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
