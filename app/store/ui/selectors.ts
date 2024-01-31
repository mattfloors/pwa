import { createSelector } from "@ngrx/store";
import { AppState } from "..";

export const SettingsState = (state: AppState) => state.settings;
export const GetLanguage = createSelector( SettingsState , (state) => state.language )
export const GetCurrentPage = createSelector( SettingsState, (state) => state.currentPage);

export const GetLoggedState = createSelector( SettingsState , (state) => state.logged )
export const GetLoggedErrorMessage = createSelector( SettingsState , (state) => state.logMessage )
export const GetLoggedError = createSelector( GetLoggedState , GetLoggedErrorMessage, (error, message) => !error && !!(message) && message || '' )

export const GetReservationInfos = createSelector( SettingsState , (state) =>  state.reservation );
export const GetServices = createSelector( SettingsState , (state) =>  state.services );
export const GetService = createSelector( SettingsState , (state) =>  state.service );
// export const GetService = createSelector( SettingsState, (state: any, id: any) => state.service && state.service[id] );

export const GetServiceById = (props: { id: number }) =>
  createSelector(GetService, (service) => {
    console.log('GetServiceById', props, service);
    return service && service[props.id];
  });

export const GetSettingsInfos = createSelector( SettingsState , (state) =>  state.settings );
export const GetLanguages = createSelector( GetSettingsInfos , (s) => 
  s && s.languagesList.map( l => ({ name: l.description, value: l.code }) ) || []
)
export const GetUserInfos = createSelector( GetSettingsInfos, GetReservationInfos, (s, r) => ({s , r}) );
export const GetNavigation = createSelector( GetUserInfos, GetLanguage, ({s, r}, l) => 
  r && l && s && s.activeFunctions
  .filter( f => r.avaibleFunctions.includes(f.functionName) )
  .map( f => {
    const d = f.descriptions.translations.find( t => t.lang === l);
    return ({...f, name: d && d.description }) 
  }) || []
)
export const GetGreetings = createSelector( GetSettingsInfos, GetLanguage , (s, l) => 
  s && s.welcomeMessages.translations.find( t => t.lang === l)
);

export const CanUseQRCode = createSelector( GetSettingsInfos , (s) => s && s.useQRCode );
export const GetCurrency = createSelector( GetSettingsInfos , (s) => s && s.currencySimbol );
export const CanUseRestaurantWishes = createSelector( GetSettingsInfos , (s) => s?.useRestaurantWishes || false );
export const GetReservationState = createSelector( GetReservationInfos , (state) => state?.reservationState );
export const GetReservationKey = createSelector( GetReservationState, GetReservationInfos, (rState, reservation ) => 
  {
    if(rState === 'INHOUSE') {
      return {stayId: reservation?.stayId};
    }
    if(rState === 'RESERVED') {
      return {reservationId: reservation?.reservationId};
    }
    return false;
  }
);
export const GetUserInfoState = createSelector( GetReservationInfos , (state) => {
  let innerstate = {};
  if(state?.stayId) {
    innerstate = {...innerstate, stayId: state?.stayId};
  }
  if(state?.reservationId){
    innerstate = {...innerstate, reservationId: state?.reservationId};
  }
  if(state?.guestId) {
    innerstate = {...innerstate, guestId: state?.guestId};
  }
  return innerstate;
} );

export const GetUserCheckInCheckOut = createSelector(GetReservationInfos, (info) => {
  return info ? {
    checkin: info?.urlWebCheckin,
    checkout: info?.urlWebCheckOut
  }: null;
})