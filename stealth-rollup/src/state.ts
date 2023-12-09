import { RollupState, STF } from "@stackr/stackr-js/execution";
import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";

export type Annoucement = {
  stealthAddress: string;
  ephemeralPublicKey: string;
  viewTag: number;
};

export type AnnouncementVariable = Annoucement[];

class AnnouncementTransport {
  public merkletree: MerkleTree;
  public leaves: Annoucement[];

  constructor(leaves: Annoucement[]) {
    this.merkletree = this.createTree(leaves);
    this.leaves = leaves;
  }

  createTree(leaves: Annoucement[]) {
    const hashedLeaves = leaves.map((leaf: Annoucement) => {
      return ethers.solidityPackedSha256(
        ["address", "bytes", "uint16"],
        [leaf.stealthAddress, leaf.ephemeralPublicKey, leaf.viewTag]
      );
    });

    return new MerkleTree(hashedLeaves, ethers.solidityPackedSha256, {
      sort: true,
    });
  }
}

export interface AnnouncementActionInput {
  type: "announce";
  stealthAddress: string;
  ephemeralPublicKey: string;
  viewTag: number;
}

export class AnnouncementRollup extends RollupState<
  AnnouncementVariable,
  AnnouncementTransport
> {
  constructor(initialAnnouncement: AnnouncementVariable) {
    super(initialAnnouncement);
  }

  createTransport(state: AnnouncementVariable): AnnouncementTransport {
    const newTree = new AnnouncementTransport(state);
    return newTree;
  }

  getState(): AnnouncementVariable {
    return this.transport.leaves;
  }

  calculateRoot(): ethers.BytesLike {
    return this.transport.merkletree.getHexRoot();
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
        state.transport.leaves.push(newAnnouncement);
      } else {
        throw new Error("Not implemented");
      }
      state.transport.leaves = newState;
    },
  };
