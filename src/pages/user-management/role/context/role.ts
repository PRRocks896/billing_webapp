import { FetchProps, ActionProps } from 'types/common';
import { FETCHROLE, CHANGESTATUSROLE, DELETEROLE } from './actions';

const initialState: FetchProps = {
    list: [],
    error: null,
    count: 0,
}

const roleReducer = (state = initialState, action: ActionProps) => {
    switch (action.type) {
        case FETCHROLE:
            return {
                ...state,
                list: action.payload.list,
                count: action.payload.count
            }
        case CHANGESTATUSROLE:
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
        case DELETEROLE:
            return {
                ...state,
                list: action.payload.list.filter((list: any) => list.id !== action.payload.id)
            }
        default: {
            return { ...state };
        }
    }
}

export default roleReducer;