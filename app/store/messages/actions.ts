import { createAction, props } from "@ngrx/store";
import { IHotelAreaPayload, IMessagePayload, IMessages, IMessagesPayload, IUnitsPayload } from "../../models/messages.model";

export const SetMessages = createAction( '[MESSAGES] Set', props<{ payload: IMessagesPayload }>() );

export const SetArea = createAction( '[MESSAGES] Set Area', props<{ payload: string }>() );

export const GetUnits = createAction( '[MESSAGES] Get Areas' );
export const GetUnitsFail = createAction( '[MESSAGES] Get Areas Fail' );
export const GetUnitsSuccess = createAction( '[MESSAGES] Get Areas Success', props<{ payload: IHotelAreaPayload[] }>() );

export const GetArea = createAction( '[MESSAGES] Get Areas', props<{ payload: IUnitsPayload }>() );
export const GetAreaFail = createAction( '[MESSAGES] Get Areas Fail' );
export const GetAreaSuccess = createAction( '[MESSAGES] Get Areas Success', props<{ payload: IHotelAreaPayload[] }>() );

export const SendMessage = createAction( '[MESSAGES] Send', props<{ payload: IMessages }>() );
export const SendMessageFail = createAction( '[MESSAGES] Send Fail' );
export const SendMessageSuccess = createAction( '[MESSAGES] Send Success', props<{ payload: IMessagesPayload }>() );

export const OpenedMessages = createAction( '[MESSAGES] Opened', props<{ payload: any[] }>() );
export const OpenedMessagesFail = createAction( '[MESSAGES] Opened Fail');
export const OpenedMessagesSuccess = createAction( '[MESSAGES] Opened Success', props<{ payload: number }>() );

export const SetMessageToken = createAction( '[MESSAGES] Opened Success', props<{ payload: string }>() );