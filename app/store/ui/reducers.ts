import { createReducer, on } from "@ngrx/store";
import { IReservation, ISettings } from "../../models/reservation.model";
import * as Actions from "./actions";
export interface settingsReducer {
  logged: boolean;
  loading: boolean;
  loaded: boolean;
  language: string;
  currentPage: string;
  reservation: IReservation | null;
  settings: ISettings | null;
  services: any[];
  service: any;
  logMessage: string;
}
const initialState: settingsReducer = {
  logged: false,
  loading: false,
  loaded: false,
  language: 'en-US',
  currentPage: '',
  reservation: null,
  logMessage: '',
  settings: null,
  services: [],
  service: null,

}
export const settingsReducer = createReducer(
  initialState,
  on(Actions.SetCurrentPage, (state, action) => ({...state, currentPage: action.payload}) ),
  on(Actions.GetReservation, Actions.GetSettings, (state) => ({...state, loading: true, loaded: false}) ),
  on(Actions.SetLanguage, (state, action) => ({ ...state, language: action.payload || 'it-IT' }) ),
  on(Actions.UserLoginFail, (state, action) => ({ ...state, logged: false, logMessage: action.payload }) ),
  on(Actions.UserLoginSuccess, (state, action) => ({ ...state, logged: true }) ),
  on(Actions.GetSettingsSuccess, (state, settings) => ({ ...state, logged: true, settings: {...state.settings, ...settings.payload} })),
  on(Actions.GetReservationSuccess, (state, reservation) => ({ ...state, logged: true, loaded: true, reservation: {...state.reservation, ...reservation.payload} })),
  on(Actions.GetServicesSuccess, (state, action) => ({ ...state, services: action.payload }) ),
  on(Actions.GetServiceSuccess, (state, action) => ({ ...state, service: {...state.service, [action.payload.page]: action.payload} }) ),
);