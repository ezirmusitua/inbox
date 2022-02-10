export enum eReadingModeStage {
  START,
  VIEWING,
  EDITING,
}

export enum eActionType {
  CHANGE_STAGE,
  CHANGE_MODE,
}

export interface iState {
  stage: eReadingModeStage;
  mode: string;
}

export interface iAction {
  type: eActionType;
  payload: eReadingModeStage | string | Record<string, any>;
}

export const init_state: iState = {
  mode: "",
  stage: eReadingModeStage.START,
};

export function reducer(state: iState, action: iAction) {
  switch (action.type) {
    case eActionType.CHANGE_STAGE:
      return { ...state, stage: action.payload as eReadingModeStage };
    case eActionType.CHANGE_MODE:
      return { ...state, mode: action.payload as string };
    default:
      return { ...state };
  }
}
