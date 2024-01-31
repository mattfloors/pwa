import { createAction, props } from "@ngrx/store";
import { SubscriptionToken } from "../../models/messages.model";
import { IReservation, ISettings } from "../../models/reservation.model";
import { IService, IServiceContent } from "../../models/service.model";

export const SetLanguage = createAction( '[SETTINGS] Set Language', props<{ payload: string }>() );
export const SetCurrentPage = createAction( '[SETTINGS] Set Current Page', props<{ payload: string }>() );

export const GetSettings = createAction( '[SETTINGS] Get' );
export const GetSettingsFail = createAction( '[SETTINGS] Get Fail' );
export const GetSettingsSuccess = createAction( '[SETTINGS] Get Success', props<{ payload: ISettings }>() );

export const GetReservation = createAction( '[SETTINGS] Set Reservation', props<{ payload: any }>() );
export const GetReservationFail = createAction( '[SETTINGS] Set Reservation Fail' );
export const GetReservationSuccess = createAction( '[SETTINGS] Set Reservation Success', props<{ payload: IReservation, redirect?: boolean }>() );

export const UserLogin = createAction( '[USER] Login', props<{ hotelId: string, reservationId: string | number, surname: string }>()  );
export const UserLoginFail = createAction( '[USER] Login Fail' , props<{ payload: string }>() );
export const UserLoginSuccess = createAction( '[USER] Login Success', props<{ payload: string, reservationId: number | string }>() );

export const GetVersion = createAction( '[SETTINGS] Version' );
export const GetVersionFail = createAction( '[SETTINGS] Version Fail' );
export const GetVersionSuccess = createAction( '[SETTINGS] Version Success', props<{ payload: number }>() );

export const GetMeteo = createAction( '[SETTINGS] Get Meteo' );
export const GetMeteoFail = createAction( '[SETTINGS] Get Meteo Fail' );
export const GetMeteoSuccess = createAction( '[SETTINGS] Get Meteo Success', props<{ payload: any[] }>() );

export const GetServices = createAction( '[SERVICES] Get' );
export const GetServicesFail = createAction( '[SERVICES] Get Fail' );
export const GetServicesSuccess = createAction( '[SERVICES] Get Success', props<{ payload: IService[] }>() );

export const GetService = createAction( '[SERVICE] Get', props<{ payload: number }>() );
export const GetServiceFail = createAction( '[SERVICE] Get Fail' );
export const GetServiceSuccess = createAction( '[SERVICE] Get Success', props<{ payload: IServiceContent }>() );

export const SubscribeToken = createAction( '[SERVICE] Subscribe', props<{ payload: SubscriptionToken }>() );
export const SubscribeTokenFail = createAction( '[SERVICE] Subscribe Fail' );
export const SubscribeTokenSuccess = createAction( '[SERVICE] Subscribe Success' );

export const UnSubscribeToken = createAction( '[SERVICE] UnSubscribe', props<{ payload: SubscriptionToken }>() );
export const UnSubscribeTokenFail = createAction( '[SERVICE] UnSubscribe Fail' );
export const UnSubscribeTokenSuccess = createAction( '[SERVICE] UnSubscribe Success' );

export const AddServices = createAction( '[SERVICES] Add', props<{ payload: SubscriptionToken }>() );
export const AddServicesFail = createAction( '[SERVICES] Add Fail' );
export const AddServicesSuccess = createAction( '[SERVICES] Add Success', props<{ payload: any }>() );

export const AddService = createAction( '[SERVICE] Add', props<{ payload: number }>() );
export const AddServiceFail = createAction( '[SERVICE] Add Fail' );
export const AddServiceSuccess = createAction( '[SERVICE] Add Success', props<{ payload: any }>() );