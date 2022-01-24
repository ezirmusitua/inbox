export interface iState {
    db_data: any;
}

export interface iAction {
    type: string;
    payload: any;
}

export const init_state: iState = {
    db_data: {},
};

export function reducer(state: iState, action: iAction) {
    switch (action.type) {
        case "set_db_data":
            return { ...state, db_data: action.payload };
    }
    return { ...state };
}
