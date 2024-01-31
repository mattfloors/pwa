import { createAction, props } from "@ngrx/store";
import { ERoomType, ICategory, IOrderItem, IOrderItemLight, IOrderItemSemplify, IOrderPayload, IRoom, IRoomPositions, OrderInfo } from "../../models/order.model";

export const SetOrderInfo = createAction( '[ORDER] Set Info', props<{ payload: OrderInfo }>() );
export const SetOrderPosition = createAction( '[ORDER] Set Position', props<{ payload: string }>() );
export const SetTableCode = createAction( '[ORDER] Set Table', props<{ payload: string }>() );
export const SetPositionCode = createAction( '[ORDER] Set Position Code', props<{ payload: string }>() );

export const SetPositionInfo = createAction( '[ORDER] Set Position Infos', props<{ payload: any }>() );

export const GetPositions = createAction( '[ORDER] Get Position' );
export const GetPositionsFail = createAction( '[ORDER] Get Position Fail' );
export const GetPositionsSuccess = createAction( '[ORDER] Get Position Success', props<{ payload: IRoom[] }>() );

export const GetPositionsContent = createAction( '[ORDER] Get Position Content', props<{ payload: string }>() );
export const GetPositionsContentFail = createAction( '[ORDER] Get Position Content Fail' );
export const GetPositionsContentSuccess = createAction( '[ORDER] Get Position Content Success', props<{ payload: IRoomPositions }>() );

export const PreviewOrder = createAction( '[ORDER] Preview', props<{ payload: IOrderItemSemplify[] }>() );
export const PreviewOrderFail = createAction( '[ORDER] Preview Fail' );
export const PreviewOrderSuccess = createAction( '[ORDER] Preview Success', props<{ payload: IOrderItemSemplify[], increase: number }>() );

export const PlaceOrder = createAction( '[ORDER] Place', props<{ payload: IOrderItemSemplify[] }>() );
export const PlaceOrderFail = createAction( '[ORDER] Place Fail' );
export const PlaceOrderSuccess = createAction( '[ORDER] Place Success' );

export const UpdateItemOrder = createAction( '[ORDER] Update Item' ); // not sure

export const GetItemOrderDetail = createAction( '[ORDER] Get Item Detail', props<{ payload: string }>() );
export const GetItemOrderDetailsFail = createAction( '[ORDER] Get Item Detail Fail' );
export const GetItemOrderDetailsSuccess = createAction( '[ORDER] Get Item Detail Success', props<{ payload: any }>() );

export const GetItemSubType = createAction( '[ORDER] Get Item Subtype', props<{ payload: string, subType?: string }>() );
export const GetItemSubTypeFail = createAction( '[ORDER] Get Item Subtype Fail' );
export const GetItemSubTypeSuccess = createAction( '[ORDER] Get Item Subtype Success', props<{ payload: IOrderItem[], types: string }>() );





export const GetMenuItems = createAction( '[ORDER] Get Menus' );
export const GetMenuItemsFail = createAction( '[ORDER] Get Menus Fail' );
export const GetMenuItemsSuccess = createAction( '[ORDER] Get Menus Success', props<{ payload: any[] }>() );

export const CheckMenuItems = createAction( '[ORDER] Check Menus' );
export const CheckMenuItemsFail = createAction( '[ORDER] Check Menus Fail',  props<{ payload: any[] }>() );
export const CheckMenuItemsSuccess = createAction( '[ORDER] Check Menus Success', props<{ payload: any[] }>() );

export const GetFavoritesItems = createAction( '[ORDER] Get Favorites' );
export const GetFavoritesItemsFail = createAction( '[ORDER] Get Favorites Fail' );
export const GetFavoritesItemsSuccess = createAction( '[ORDER] Get Favorites Success', props<{ payload: any[] }>() );

export const CheckFavoritesItems = createAction( '[ORDER] Check Favorites' );
export const CheckFavoritesItemsFail = createAction( '[ORDER] Check Favorites Fail',  props<{ payload: any[] }>() );
export const CheckFavoritesItemsSuccess = createAction( '[ORDER] Check Favorites Success', props<{ payload: any[] }>() );


export const GetSearchItems = createAction( '[ORDER] Get Search', props<{ payload: string }>() );
export const GetSearchItemsFail = createAction( '[ORDER] Get Search Fail' );
export const GetSearchItemsSuccess = createAction( '[ORDER] Get Search Success', props<{ payload: any[] }>() );

export const GetCategories = createAction( '[ORDER] Get Categories' );
export const GetCategoriesFail = createAction( '[ORDER] Get Categories Fail' );
export const GetCategoriesSuccess = createAction( '[ORDER] Get Categories Success', props<{ payload: ICategory[] }>() );

export const GetMainCourses = createAction( '[ORDER] Get Courses' );
export const GetMainCoursesFail = createAction( '[ORDER] Get Courses Fail' );
export const GetMainCoursesSuccess = createAction( '[ORDER] Get Courses Success', props<{ payload: IOrderItemLight[] }>() );

export const CheckQRCodeArea = createAction( '[ORDER] Qr Code', props<{ payload: string }>() );
export const CheckQRCodeAreaFail = createAction( '[ORDER] Qr Code Fail' );
export const CheckQRCodeAreaSuccess = createAction( '[ORDER] Qr Code Success', props<{ payload: IRoomPositions }>() );
