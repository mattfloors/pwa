import { createAction, props } from "@ngrx/store";
import { ISurveyResult } from "../../models/survey.model";

export const SetSurvey = createAction( '[SURVEY] Set', props<{ payload: ISurveyResult[] }>() );
export const SetSurveyFail = createAction( '[SURVEY] Set Fail', props<{ payload: string }>() );
export const SetSurveySuccess = createAction( '[SURVEY] Set Success', props<{ payload: any[], result: string | boolean }>() );

export const GetSurvey = createAction( '[SURVEY] Get' );
export const GetSurveyFail = createAction( '[SURVEY] Get Fail', props<{ payload: string }>() );
export const GetSurveySuccess = createAction( '[SURVEY] Get Success', props<{ payload: any[] }>() );
