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

export interface CounterActionInput {
  type: "increment" | "decrement";
}

export class CounterRollup extends RollupState<StateVariable, StateTransport> {
  constructor(count: StateVariable) {
    super(count);
  }

  createTransport(state: StateVariable): StateTransport {
    return { currentCount: state };
  }

  getState(): StateVariable {
    return this.transport.currentCount;
  }

  calculateRoot(): ethers.BytesLike {
    return ethers.solidityPackedKeccak256(
      ["uint256"],
      [this.transport.currentCount]
    );
  }
}

export const counterSTF: STF<CounterRollup, CounterActionInput> = {
  identifier: "counterSTF",

  apply(inputs: CounterActionInput, state: CounterRollup): void {
    let newState = state.getState();
    if (inputs.type === "increment") {
      newState += 1;
    } else if (inputs.type === "decrement") {
      throw new Error("Not implemented");
    }
    state.transport.currentCount = newState;
  },
};
