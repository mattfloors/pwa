import { createSelector } from "@ngrx/store";
import { AppState } from "..";

export const MessagesState = (state: AppState) => state.messages;
export const GetMessages = createSelector( MessagesState , (state) => state.items )
export const GetAreas = createSelector( MessagesState , (state) => state.areas )
export const GetArea = createSelector( MessagesState , (state) => state.area )
export const GetCurrentArea = createSelector( GetAreas , GetArea, (areas, area) => areas && areas.find( (a: any) => a.code === area) || null )
export const GetTotalMessages = createSelector( GetAreas, (areas) => areas && areas.reduce( ( (acc: any, a: { NewMessages: any; }) => acc += a.NewMessages ), 0) || 0 );
