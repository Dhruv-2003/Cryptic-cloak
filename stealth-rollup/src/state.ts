import { RollupState, STF } from "@stackr/stackr-js/execution";
import { ethers, concat } from "ethers";
import { MerkleTree } from "merkletreejs";

export type Annoucement = {
  stealthAddress: string;
  ephemeralPublicKey: string;
  viewTag: number;
};

export type Register = {
  publicAddress: string;
  stelathMetaAddress: string;
  schemeId: number;
};

// export type StateVariable = {
//   announcements: Annoucement[];
//   registers: Register[];
// };

export type AnnouncementVariable = {
  announcements: Annoucement[];
  registers: Register[];
};

class AnnouncementTransport {
  public merkletreeAnnouncement: MerkleTree;
  public announcementLeaves: Annoucement[];

  public merkletreeRegister: MerkleTree;
  public registerLeaves: Register[];

  constructor(announcements: Annoucement[], registers: Register[]) {
    let { merkletreeAnnouncement, merkletreeRegister } = this.createTree(
      announcements,
      registers
    );

    this.merkletreeAnnouncement = merkletreeAnnouncement;
    this.merkletreeRegister = merkletreeRegister;

    this.announcementLeaves = announcements;
    this.registerLeaves = registers;
  }

  createTree(announcements: Annoucement[], registers: Register[]) {
    const hashedLeavesAnnouncement = announcements.map((leaf: Annoucement) => {
      return ethers.solidityPackedKeccak256(
        ["address", "bytes", "uint"],
        [leaf.stealthAddress, leaf.ephemeralPublicKey, leaf.viewTag]
      );
    });

    let merkletreeAnnouncement = new MerkleTree(
      hashedLeavesAnnouncement,
      ethers.solidityPackedKeccak256
    );

    const hashedLeavesRegister = registers.map((leaf: Register) => {
      return ethers.solidityPackedKeccak256(
        ["address", "bytes", "uint"],
        [leaf.publicAddress, leaf.stelathMetaAddress, leaf.schemeId]
      );
    });

    let merkletreeRegister = new MerkleTree(
      hashedLeavesRegister,
      ethers.solidityPackedKeccak256
    );

    return { merkletreeAnnouncement, merkletreeRegister };
  }
}

export interface AnnouncementActionInput {
  type: "announce" | "register";
  stealthAddress: string;
  ephemeralPublicKey: string;
  viewTag: number;
  publicAddress: string;
  stelathMetaAddress: string;
  schemeId: number;
}

export class AnnouncementRollup extends RollupState<
  AnnouncementVariable,
  AnnouncementTransport
> {
  constructor(initialAnnouncement: AnnouncementVariable) {
    super(initialAnnouncement);
  }

  createTransport(state: AnnouncementVariable): AnnouncementTransport {
    const newTree = new AnnouncementTransport(
      state.announcements,
      state.registers
    );
    // console.log(newTree);
    return newTree;
  }

  getState(): AnnouncementVariable {
    return {
      announcements: this.transport.announcementLeaves,
      registers: this.transport.registerLeaves,
    };
  }

  calculateRoot(): ethers.BytesLike {
    // const finalRoot = concat([
    //   ethers.toUtf8Bytes(this.transport.merkletreeAnnouncement.getHexRoot()),
    //   ethers.toUtf8Bytes(this.transport.merkletreeRegister.getHexRoot()),
    // ]);

    const finalRoot = ethers.solidityPackedKeccak256(
      ["string", "string"],
      [
        this.transport.merkletreeAnnouncement.getHexRoot(),
        this.transport.merkletreeRegister.getHexRoot(),
      ]
    );

    console.log(finalRoot);
    return finalRoot;
  }
}

export const announcementSTF: STF<AnnouncementRollup, AnnouncementActionInput> =
  {
    identifier: "announcementSTF",

    apply(inputs: AnnouncementActionInput, state: AnnouncementRollup): void {
      let newState = state.getState();
      // console.log(newState);
      if (inputs.type === "announce") {
        const newAnnouncement: Annoucement = {
          stealthAddress: inputs.stealthAddress,
          ephemeralPublicKey: inputs.ephemeralPublicKey,
          viewTag: inputs.viewTag,
        };
        console.log(newAnnouncement);
        newState.announcements.push(newAnnouncement);
        console.log(newState);
      } else if (inputs.type === "register") {
        const newRegister: Register = {
          publicAddress: inputs.publicAddress,
          stelathMetaAddress: inputs.stelathMetaAddress,
          schemeId: inputs.schemeId,
        };
        console.log(newRegister);
        newState.registers.push(newRegister);
        console.log(newState);
        // const arrays = newState.registers;
        // arrays.findIndex((element) => element.publicAddress === inputs.publicAddress);
      } else {
        throw new Error("Not implemented");
      }

      state.transport.announcementLeaves = newState.announcements;
      state.transport.registerLeaves = newState.registers;
    },
  };
