import { createReducer, on } from "@ngrx/store";
import { ICategory, OrderInfo } from "../../models/order.model";
import { ESurveyType, ISurvey, ISurveyResult } from "../../models/survey.model";
import * as Actions from "./actions";
export interface surveyReducer {
  questions: ISurvey[];
  stored: ISurveyResult[],
  loading: boolean;
  loaded: boolean;
}
const initialState: surveyReducer = {
  questions: [],
  stored: [],
  loading: false,
  loaded: false
}

export const surveyReducer = createReducer(
  initialState,
  on(Actions.SetSurvey, (state, action) => ({...state, loading: true}) ),
  on(Actions.SetSurveyFail, (state, action) => ({...state, loading: false }) ),
  on(Actions.SetSurveySuccess, (state, action) => ({...state, loading: false, stored: action.payload }) ),
  // on(Actions.SetOrderInfo, state => ({ ...state, home: state.home + 1 })),
  on(Actions.GetSurvey, (state, action) => ({...state, questions: [], loading: true }) ),
  on(Actions.GetSurveyFail, (state, action) => ({...state, questions: [], loaded: false }) ),
  on(Actions.GetSurveySuccess, (state, action) => ({...state, loading: false, questions: action.payload.map( s => ({...s, value: s.type === ESurveyType.TEXTAREA ? '' : -1 }) ), loaded: true  }) ),
  
);