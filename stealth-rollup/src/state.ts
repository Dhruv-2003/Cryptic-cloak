import { RollupState, STF } from "@stackr/stackr-js/execution";
import { ethers } from "ethers";

export type StateVariable = number;

interface StateTransport {
  currentCount: StateVariable;
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
