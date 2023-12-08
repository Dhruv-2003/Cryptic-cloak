const { exec } = require("child_process");

const command =
  "stealthereum reveal-stealth-key -k ./keyfile.json -s 0x4f0ee9771b4cd3e40ee80af8516bed32689ad904 -e 0x023ea3dfbd49d5c147c671173e3287d94caa49aba846cf3a665f5bb625ccb7da19";

const generateKeys = (keygen) => {
  //  "stealthereum keygen -k ./keyfile.json"
  const command = `stealthereum keygen -k ${keyfile}`;
  exectueCommand(command);
};

const getMetaAddress = (keyfile) => {
  //  "stealthereum show-meta-address -k ./keyfile.json"
  const command = `stealthereum show-meta-address -k ${keyfile}`;
  exectueCommand(command);
};

const getStealthAddress = (metaAddress) => {
  //  "stealthereum stealth-address -k ./keyfile.json -m 0x02f868433a12a9d57e355176a00ee6b5c80ed1fe2c939d81062e0251081994f039"
  const command = `stealthereum stealth-address -r ${metaAddress}`;
  exectueCommand(command);
};

const revealStealthKey = (keyfile, stealthAddress, ephemeralAddress) => {
  //  "stealthereum reveal-stealth-key -k ./keyfile.json -s 0x4f0ee9771b4cd3e40ee80af8516bed32689ad904 -e 0x023ea3dfbd49d5c147c671173e3287d94caa49aba846cf3a665f5bb625ccb7da19";
  const command = `stealthereum reveal-stealth-key -k ${keyfile} -s ${stealthAddress} -e ${ephemeralAddress}`;
  exectueCommand(command);
};

const exectueCommand = (command) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }

    const result = stdout.trim();
    console.log(`Output: ${result}`);
  });
};
