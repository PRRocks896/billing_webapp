import { FetchProps, ActionProps } from 'types/common';
import { FETCHMODULE, CHANGESTATUSMODULE, DELETEMODULE } from './actions';

const initialState: FetchProps = {
    list: [],
    error: null,
    count: 0,
}

const moduleReducer = (state = initialState, action: ActionProps) => {
    switch (action.type) {
        case FETCHMODULE:
            return {
                ...state,
                list: action.payload.list,
                count: action.payload.count
            }
        case CHANGESTATUSMODULE:
            const updatedList = state.list.map((item) => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        isActive: action.payload.isActive
                    }
                }
                return item;
            })
            return {
                ...state,
                list: updatedList,
            }
        case DELETEMODULE:
            return {
                ...state,
                list: action.payload.list.filter((list: any) => list.id !== action.payload.id)
            }
        default: {
            return { ...state };
        }
    }
}

export default moduleReducer;