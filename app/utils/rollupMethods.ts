const getAnnouncements = async () => {
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
  
  const getRegisters = async () => {
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
  
  const updateAnnouncement = async (
    stealthAddress: string,
    ephemeralPublicKey: string,
    viewTag: number,
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
          viewTag: viewTag
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
  }