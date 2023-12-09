// "spendingKey": "0x6d2f70a47ddf455feb6a785b9787265f28897546bd1316224300aed627ef8cfc",
// "viewingKey": "0xa2e9f98f845bb6a8d2db0a2a17a9d185fc97afd1b7949983ee367f9f08a5e0b7",
// "metaAddress": "0x02f868433a12a9d57e355176a00ee6b5c80ed1fe2c939d81062e0251081994f039022290fba566a42824f283e54582fc4fefb0767f04551c748aa8bd8b66bef677cf",
// "stealthAddress": "0x084c53dad73b23f7d709fdcc2edbe5caa44bccce",
const getStealthMetaAddress = async (
  spendingKey: string,
  viewingKey: string
) => {
  try {
    const res = await fetch("http://localhost:3030/getMetadataAddress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spendingKey: spendingKey,
        viewingKey: viewingKey,
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

const getStealthAddress = async (metaAddress: string) => {
  try {
    const res = await fetch("http://localhost:3030/getStealthAddress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metaAddress: metaAddress,
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
    // console.log(await res);
  } catch (error) {
    console.log(error);
  }
};

const revealStealthKey = async (
  spendingKey: string,
  viewingKey: string,
  stealthAddress: string,
  ephemeralPublicKey: string
) => {
  try {
    const res = await fetch("http://localhost:3030/revealStealthKeyNoFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spendingKey: spendingKey,
        viewingKey: viewingKey,
        stealthAddress: stealthAddress,
        ephemeralPublicKey: ephemeralPublicKey,
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
