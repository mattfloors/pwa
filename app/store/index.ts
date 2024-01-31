/** Effects */
import { MessagesEffects  } from './messages/effects';
import { OrderEffects } from './orders/effects';
import { SettingsEffects } from './ui/effects';
import { SurveyEffects } from './survey/effects';
/** Reducers */
import * as fromOrder from "./orders/reducers";
import * as fromSettings from "./ui/reducers";
import * as fromMessages from "./messages/reducers";
import * as fromSurvey from "./survey/reducers";
/** Reducers MAP */
import { ActionReducerMap } from '@ngrx/store';

export const Effects = [OrderEffects, SettingsEffects, MessagesEffects, SurveyEffects];

export interface AppState {
  order: fromOrder.orderReducer;
  settings: fromSettings.settingsReducer;
  messages: fromMessages.messagesReducer;
  survey: fromSurvey.surveyReducer;
}

export const Reducers: ActionReducerMap<AppState> = {
  order: fromOrder.orderReducer,
  settings: fromSettings.settingsReducer,
  messages: fromMessages.messagesReducer,
  survey:  fromSurvey.surveyReducer
}
