export enum ESurveyType {
  TEXTAREA = 1,
  RANGE3 = 3,
  RANGE4 = 5
}
export interface ISurvey {
  question: string;
  questionCode: string;
  title: string;
  value: any;
  type: ESurveyType; // empty textarea 1-5 1-3
  comments: string;
  required: string;
  additionalComments: boolean;
}

export interface ISurveyPayload {
  stayId: number;
  surveyData: SurveyResult[];
}

export interface ISurveyResult {
  questionCode: string;   // (REQUIRED):  codice della domanda
  responseValue?: number;  // (REQUIRED): se si tratta della riposta a una domanda con type=3 o 5
  responseText?: string;   // (REQUIRED): se si tratta della riposta a una domanda con type=1
  comments?: string;       // (OPTIONAL): eventuali commenti inseriti per le domande con additionalComments=true
}

export class SurveyResult implements ISurveyResult {
  questionCode: string;   // (REQUIRED):  codice della domanda
  responseValue?: number;  // (REQUIRED): se si tratta della riposta a una domanda con type=3 o 5
  responseText?: string;   // (REQUIRED): se si tratta della riposta a una domanda con type=1
  comments?: string;       // (OPTIONAL): eventuali commenti inseriti per le domande con additionalComments=true
  constructor(option: ISurvey) {
    this.questionCode = option.questionCode;
    if(option.type !== ESurveyType.TEXTAREA) {
      this.responseValue = option.value || -1;
    }else{
      this.responseText = option.value || '';
    }
    if(option.additionalComments){
      this.comments = option.comments;
    }
  }
}


// recive point ----> pipe ---> tank -> stock
//                      |        |       | 
//                   analyzer  meter  analyzer

// recive point
// |- pipe
// |- tank <- analyzer
//     |- pipe <- meter
//         |- stock <- analyzer
// |- stock

// <use class="receive"></use>
// <use class="pipe"></use>
// <use P="01" class="tank"></use>
// <use P="11" A="" class="analyzer"></use>
// <use P="01" A="." class="tank"></use>
// <use P="11" A="" class="meter"></use> <----- tag -flow data
// <use P="01" A="." class="stock"></use>
// <use P="11" A="" class="analyzer"></use> <-- tag -flow data
// <use A="." class="pipe"></use> <------------ tag -flow data
// <use A="." class="flow"></use> <------------ tag -flow data
// <use class="stock"></use>