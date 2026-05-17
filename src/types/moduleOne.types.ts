/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Item {
  id: string;
  text: string;
  image?: {
    url: string;
    publicId: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: {
    url: string;
    publicId: string;
  };
}

export interface InteractiveTask {
  config: {
    items: Item[];
    categories: Category[];
    correctMapping: Record<string, string>;
    scenarios: any[];
    components: any[];
    validationRules: any[];
    activityToolbox: any[];
    balanceTips: any[];
    badges: any[];
  };
  type: string;
  title: string;
  description: string;
  instructions: string;
  points: number;
}

export interface Question {
  id: string;
  text: string;
  correctBox: string;
  image?: {
    url: string;
    publicId: string;
  };
}

export interface Box {
  items: Question[];
  label: string;
  description: string;
  image?: {
    url: string;
    publicId: string;
  };
}

export interface Boxes {
  [key: string]: Box;
}

// Quiz Types
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}
