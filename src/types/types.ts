// types.ts
export interface LocateBusinessData {
    name: string;
    contactName: string;
    location: string;
    rating: number;
    image: string;
    photos: string[];
    buttons: string[];
  }
  

export  interface MetaData {
    title: string;
    description: string;
    keywords: string[];
  }


export  interface  AgreementData  {
    weekdayScreenTime: string;
    weekendScreenTime: string;
    phoneAwayTime: string;
    homeworkFirst: string;
    allowedApps: string;
    downloadPermission: string;
    socialMediaAge: string;
    meanOnlineAction: string;
    parentCheckFrequency: string;
    physicalActivity: string;
    rulesBroken: string;
    reviewFrequency: string;
  };