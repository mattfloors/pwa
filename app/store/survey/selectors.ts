import { createSelector } from "@ngrx/store";
import { AppState } from "..";

export const SurveyState = (state: AppState) => state.survey;
export const GetSurveyQuestions = createSelector( SurveyState , (state) => state.questions )
export const GetSurveySavedQuestions = createSelector( SurveyState , (state) => state.stored )
export const GetSurveyLoading = createSelector( SurveyState , (state) => state.loading )
export const GetSurveyLoaded = createSelector( SurveyState , (state) => state.loaded )
export const GetQuestions = createSelector( GetSurveyQuestions, GetSurveySavedQuestions, (list, stored) => list.map( (q, i) => {
  if(stored[i]){
    return {...q, value: stored[i].responseText || stored[i].responseValue, comments: stored[i].comments || ''  }
  }
  return q;
} ) )



