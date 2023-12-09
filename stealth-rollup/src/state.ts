import { RollupState, STF } from "@stackr/stackr-js/execution";
import { ethers } from "ethers";
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
        ["address", "bytes33", "uint16"],
        [leaf.stealthAddress, leaf.ephemeralPublicKey, leaf.viewTag]
      );
    });

    let merkletreeAnnouncement = new MerkleTree(hashedLeavesAnnouncement);

    const hashedLeavesRegister = registers.map((leaf: Register) => {
      return ethers.solidityPackedKeccak256(
        ["address", "bytes66", "uint16"],
        [leaf.publicAddress, leaf.stelathMetaAddress, leaf.schemeId]
      );
    });

    let merkletreeRegister = new MerkleTree(hashedLeavesRegister);

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
    console.log(state);
    const newTree = new AnnouncementTransport(
      state.announcements,
      state.registers
    );
    return newTree;
  }

  getState(): AnnouncementVariable {
    return {
      announcements: this.transport.announcementLeaves,
      registers: this.transport.registerLeaves,
    };
  }

  calculateRoot(): ethers.BytesLike {
    return this.transport.merkletreeAnnouncement
      .getHexRoot()
      .concat(this.transport.merkletreeRegister.getHexRoot());
  }
}

export const announcementSTF: STF<AnnouncementRollup, AnnouncementActionInput> =
  {
    identifier: "announcementSTF",

    apply(inputs: AnnouncementActionInput, state: AnnouncementRollup): void {
      let newState = state.getState();
      if (inputs.type === "announce") {
        const newAnnouncement: Annoucement = {
          stealthAddress: inputs.stealthAddress,
          ephemeralPublicKey: inputs.ephemeralPublicKey,
          viewTag: inputs.viewTag,
        };
        newState.announcements.push(newAnnouncement);
        state.transport.announcementLeaves = newState.announcements;
      } else if (inputs.type === "register") {
        const newRegister: Register = {
          publicAddress: inputs.publicAddress,
          stelathMetaAddress: inputs.stelathMetaAddress,
          schemeId: inputs.schemeId,
        };
        newState.registers.push(newRegister);
        // const arrays = newState.registers;
        // arrays.findIndex((element) => element.publicAddress === inputs.publicAddress);
        state.transport.registerLeaves = newState.registers;
      } else {
        throw new Error("Not implemented");
      }
    },
  };
