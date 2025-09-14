export interface QuizData {
  Process_Type: string;
  Metal: string;
  Energy_MJ_per_kg: number;
  Quantity_kg: number;
  Energy_MJ_total: number;
  Transport_km: number;
  Transport_Mode: string;
  Transport_emissions_kgCO2: number;
  Water_use_m3_per_ton: number;
  End_of_Life: string;
  Circularity_option: string;
  Process_emissions_kgCO2: number;
  Total_emissions_kgCO2: number;
  Emission_factor_kgCO2_per_MJ: number;
}

export interface QuizPayload {
  sample_row: QuizData;
  question: string;
}

export interface Question {
  id: keyof QuizData;
  title: string;
  type: 'select' | 'number';
  options?: string[];
  unit?: string;
  placeholder?: string;
  helper?: string;
  required?: boolean;
}

export interface QuizState {
  currentQuestion: number;
  answers: Partial<QuizData>;
  isSubmitting: boolean;
  results: any;
  userGoal: string;
}