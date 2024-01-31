import { createReducer, on } from "@ngrx/store";
import { ICategory, OrderInfo } from "../../models/order.model";
import * as Actions from "./actions";
export interface orderReducer {
  info: OrderInfo | null;
  positionInfo: any,
  roomNumber: string,
  orderPosition: string,
  positionCode: string,
  locationCode: string,
  tableCode: string,
  categories: ICategory[],
  position: string,
  menus: any,
  frequents: any
  items: any[]
}
const initialState: orderReducer = {
  info: null,
  positionInfo: null,
  roomNumber: '',
  orderPosition: '',
  positionCode: '',
  position: '',
  locationCode: '',
  tableCode: '',
  categories: [],
  menus: null,
  frequents: null,
  items: []
}

export const orderReducer = createReducer(
  initialState,
  on(Actions.SetOrderInfo, (state, action) => ({...state, info: action.payload, locationCode: action.payload.code, positionCode: action.payload.resourceCode }) ),
  on(Actions.SetOrderPosition, (state, action) => ({...state, orderPosition: action.payload || '' }) ),
  on(Actions.SetTableCode, (state, action) => ({...state, tableCode: action.payload || '' }) ),
  on(Actions.SetPositionCode, (state, action) => ({...state, position: action.payload || '' }) ),
  on(Actions.SetPositionInfo, (state, action) => ({...state, positionInfo: action.payload || '' }) ),
  // on(Actions.SetOrderInfo, state => ({ ...state, home: state.home + 1 })),
  on(Actions.GetMenuItemsSuccess, (state, action) => ({...state, menus: action.payload }) ),
  on(Actions.GetFavoritesItemsSuccess, (state, action) => ({...state, frequents: action.payload }) ),
  on(Actions.GetCategoriesSuccess, (state, action) => ({...state, categories: action.payload }) ),
  on(Actions.CheckQRCodeAreaSuccess, (state, action) => ({...state, tableCode: action.payload?.servicePositions[0].tableCode, locationCode: action.payload?.code, positionCode: action.payload?.resourceCode, position: action.payload?.servicePositions[0].code }) ),
);