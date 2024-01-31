import { createReducer, on } from "@ngrx/store";
import { IHotelAreaPayload } from "../../models/messages.model";
import * as Actions from "./actions";
export interface messagesReducer {
  items: any[],
  area: string;
  areas: IHotelAreaPayload[];
  token: string;
}
const initialState: messagesReducer = {
  items: [],
  areas: [],
  area: '',
  token: ''
}

export const messagesReducer = createReducer(
  initialState,
  on(Actions.SetMessages, (state, action) => ({...state, items: action.payload.messages }) ),
  on(Actions.SendMessageSuccess, (state, action) => ({...state, items: [...state.items, ...action.payload.messages] }) ),
  on(Actions.SetArea, (state, action) => ({...state, area: action.payload }) ),
  on(Actions.GetUnitsSuccess, (state, action) => ({...state, areas: action.payload }) ),
);