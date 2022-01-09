export enum eReadingModeStage {
  START,
  VIEWING,
  EDITING,
}

export interface iState {
  stage: eReadingModeStage;
  mode: string;
}

export interface iPayload {
  type: string;
  payload: eReadingModeStage | string | Record<string, any>;
}

export const init_state = {
  mode: "",
  stage: eReadingModeStage.START,
};

export function reducer(state: iState, action: iPayload) {
  switch (action.type) {
    case "change_stage":
      return { ...state, stage: action.payload as eReadingModeStage };
    case "change_mode":
      return { ...state, mode: action.payload as string };
    default:
      return { ...state };
  }
}
