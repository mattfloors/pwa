import { createSelector } from "@ngrx/store";
import { AppState } from "..";
import { GetReservationInfos } from "../ui/selectors";

export const OrderState = (state: AppState) => state.order;
export const GetOrder = createSelector( OrderState , (state) =>  state.items )
export const GetPositionCode = createSelector( OrderState , (state) => state.positionCode )
export const GetLocationCode = createSelector( OrderState , (state) => state.locationCode )
export const GetOrderFullInfo = createSelector( OrderState , (state) => state.positionInfo )
export const GetTableCode = createSelector( OrderState , (state) => state.tableCode )
export const GetOrderInfos = createSelector( GetPositionCode, GetLocationCode , GetTableCode, (position, location, table) => ({ positionCode: position, locationCode: location, tableCode: table}) )
export const GetOrderInfo = createSelector( OrderState , (state) =>  state.info );
export const GetOrderPageInfo = createSelector( GetOrderInfo, GetReservationInfos, GetPositionCode, GetTableCode, (orderPage, reservationInfos, position, table) => orderPage && reservationInfos && {...{}, Description: orderPage.description || '', Room: table || reservationInfos.roomNumber || '', Place: position || ''} );
export const GetMenus = createSelector( OrderState , (state) => state.menus );
export const GetFrequents = createSelector( OrderState , (state) => state.frequents );
export const GetCategories = createSelector( OrderState , (state) => state.categories );
