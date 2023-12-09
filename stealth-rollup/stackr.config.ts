import { KeyPurpose, SignatureScheme, StackrConfig } from "@stackr/stackr-js";
import dotenv from "dotenv";
dotenv.config();
// this file is generated by the deployment script
import * as deployment from "./deployment.json";

const stackrConfig: StackrConfig = {
  stackrApp: {
    appId: deployment.app_id,
    appInbox: deployment.app_inbox,
  },
  builder: {
    batchSize: 16,
    batchTime: 1000,
  },
  syncer: {
    slotTime: 1000,
    vulcanRPC: "http://vulcan.stf.xyz",
    L1RPC: "http://rpc.stf.xyz",
  },
  operator: {
    accounts: [
      {
        privateKey: "c4d6b77f8fddbfcd907922b753b71467ae4f7d6b5591b2ec0b9e817e7d7043bb",
        purpose: KeyPurpose.BATCH,
        scheme: SignatureScheme.ECDSA,
      },
    ],
  },
  domain: {
    name: "Stackr MVP v0",
    version: "1",
    chainId: 69420,
    verifyingContract: deployment.app_inbox,
    salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  },
  datastore: {
    filePath: "./datastore",
  },
};

export { stackrConfig };
