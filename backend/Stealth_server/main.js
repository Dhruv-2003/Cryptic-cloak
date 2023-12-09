const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(require("child_process").exec);

const cliPath = "../Stealthereum-cli/target/release/stealthereum";

const command = `${cliPath} show-meta-address -k ./keyfile.json --help`;

const generateKeys = async (keygen) => {
  //  "stealthereum keygen -k ./keyfile.json"
  const command = `stealthereum keygen -k ${keyfile}`;
  const result = await exectueCommandAsync(command);
  return result;
};

const showMetaAddress = async (keyfile) => {
  //  "stealthereum show-meta-address -k ./keyfile.json"
  const command = `${cliPath} show-meta-address -k ${keyfile}`;
  const result = await exectueCommandAsync(command);
  return result;
};

const getMetaAddress = async (spendingKey, viewingKey) => {
  //  "stealthereum get-meta-address -s 0x6d2f70a47ddf455feb6a785b9787265f28897546bd1316224300aed627ef8cfc -v 0xa2e9f98f845bb6a8d2db0a2a17a9d185fc97afd1b7949983ee367f9f08a5e0b7"
  const command = `${cliPath} get-meta-address -s ${spendingKey} -v ${viewingKey}`;
  const result = await exectueCommandAsync(command);
  return result;
};

const getStealthAddress = async (metaAddress) => {
  //  "stealthereum stealth-address -k ./keyfile.json -m 0x02f868433a12a9d57e355176a00ee6b5c80ed1fe2c939d81062e0251081994f039"
  const command = `${cliPath} stealth-address -r ${metaAddress}`;
  const result = await exectueCommandAsync(command);
  return result;
};

const revealStealthKey = async (
  keyfile,
  stealthAddress,
  ephemeralPublicKey
) => {
  //  "stealthereum reveal-stealth-key -k ./keyfile.json -s 0x4f0ee9771b4cd3e40ee80af8516bed32689ad904 -e 0x023ea3dfbd49d5c147c671173e3287d94caa49aba846cf3a665f5bb625ccb7da19";
  const command = `${cliPath} reveal-stealth-key -k ${keyfile} -s ${stealthAddress} -e ${ephemeralPublicKey}`;
  const result = await exectueCommandAsync(command);
  return result;
};

const revealStealthKeyNoFile = async (
  spendingKey,
  viewingKey,
  stealthAddress,
  ephemeralPublicKey
) => {
  //  "stealthereum reveal-stealth-key -k ./keyfile.json -s 0x4f0ee9771b4cd3e40ee80af8516bed32689ad904 -e 0x023ea3dfbd49d5c147c671173e3287d94caa49aba846cf3a665f5bb625ccb7da19";
  const command = `${cliPath} reveal-stealth-key-no-file --spendingkey ${spendingKey} --viewingkey ${viewingKey} --stealthaddr ${stealthAddress} --ephemeralpub ${ephemeralPublicKey}`;
  const result = await exectueCommandAsync(command);
  return result;
};

const checkStealth = async (
  spendingKey,
  viewingKey,
  stealthAddress,
  ephemeralPublicKey,
  viewTag
) => {
  //  "stealthereum reveal-stealth-key -k ./keyfile.json -s 0x4f0ee9771b4cd3e40ee80af8516bed32689ad904 -e 0x023ea3dfbd49d5c147c671173e3287d94caa49aba846cf3a665f5bb625ccb7da19";
  const command = `${cliPath} check-stealth --spendingkey ${spendingKey} --viewingkey ${viewingKey} --stealthaddr ${stealthAddress} --ephemeralpub ${ephemeralPublicKey} --viewtag ${viewTag}`;
  const result = await exectueCommandAsync(command);
  return result;
};

const exectueCommandAsync = async (command) => {
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    if (stderr) {
      console.error(`Error output: ${stderr}`);
      throw new Error(stderr);
    }

    const result = stdout;
    // console.log(`Output: ${result}`);
    return result;
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    throw error;
  }
};

const exectueCommand = (command, callback) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      callback(error, null);

      return error;
    }

    if (stderr) {
      console.error(`Error output: ${stderr}`);
      callback(new Error(stderr), null);
      return stderr;
    }

    const result = stdout.trim();
    console.log(`Output: ${result}`);
    callback(null, result);
    return result;
  });
};

module.exports = {
  generateKeys,
  getMetaAddress,
  getStealthAddress,
  revealStealthKey,
  revealStealthKeyNoFile,
  showMetaAddress,
  exectueCommand,
  checkStealth,
};
// exec(command, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error executing command: ${error.message}`);
//     return;
//   }

//   if (stderr) {
//     console.error(`Error output: ${stderr}`);
//     return;
//   }

//   const result = stdout.trim();
//   console.log(`Output: ${result}`);
// });

// getMetaAddress(
//   "0x6d2f70a47ddf455feb6a785b9787265f28897546bd1316224300aed627ef8cfc",
//   "0xa2e9f98f845bb6a8d2db0a2a17a9d185fc97afd1b7949983ee367f9f08a5e0b7"
// );

// getStealthAddress(
//   "0x02f868433a12a9d57e355176a00ee6b5c80ed1fe2c939d81062e0251081994f039022290fba566a42824f283e54582fc4fefb0767f04551c748aa8bd8b66bef677cf"
// );

// Output: ------ STEALTH ADDRESS ------
// schemeId: 0
// stealth address: 0x084c53dad73b23f7d709fdcc2edbe5caa44bccce
// ephepmeral pubkey: 0x0391e14240e98bc771f00b5ad49f3f7ec92fd498e43f04708fd61f02fddc0931f2
// view tag: 33

// checkStealth(
//   "0x6d2f70a47ddf455feb6a785b9787265f28897546bd1316224300aed627ef8cfc",
//   "0xa2e9f98f845bb6a8d2db0a2a17a9d185fc97afd1b7949983ee367f9f08a5e0b7",
//   "0x084c53dad73b23f7d709fdcc2edbe5caa44bccce",
//   "0x0391e14240e98bc771f00b5ad49f3f7ec92fd498e43f04708fd61f02fddc0931f2",
//   33
// );

// revealStealthKeyNoFile(
//   "0x6d2f70a47ddf455feb6a785b9787265f28897546bd1316224300aed627ef8cfc",
//   "0xa2e9f98f845bb6a8d2db0a2a17a9d185fc97afd1b7949983ee367f9f08a5e0b7",
//   "0x084c53dad73b23f7d709fdcc2edbe5caa44bccce",
//   "0x0391e14240e98bc771f00b5ad49f3f7ec92fd498e43f04708fd61f02fddc0931f2"
// );
