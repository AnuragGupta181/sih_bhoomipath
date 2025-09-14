import { Question } from '@/types/quiz';

export const quizQuestions: Question[] = [
  {
    id: 'Process_Type',
    title: 'What type of process are you analyzing?',
    type: 'select',
    options: ['Primary', 'Secondary'],
    required: true
  },
  {
    id: 'Metal',
    title: 'Which metal are you working with?',
    type: 'select',
    options: ['Aluminium', 'Copper', 'Steel'],
    required: true
  },
  {
    id: 'Energy_MJ_per_kg',
    title: 'Energy consumption per kg of metal?',
    type: 'number',
    unit: 'MJ/kg',
    placeholder: '200',
    helper: 'Primary Aluminium: 200-250 MJ/kg, Copper: 60-80 MJ/kg'
  },
  {
    id: 'Quantity_kg',
    title: 'Total quantity of metal processed?',
    type: 'number',
    unit: 'kg',
    placeholder: '1000',
    helper: 'Enter the total mass being processed'
  },
  {
    id: 'Energy_MJ_total',
    title: 'Total energy consumption?',
    type: 'number',
    unit: 'MJ',
    placeholder: '200000',
    helper: 'Total energy for the entire process'
  },
  {
    id: 'Transport_km',
    title: 'Transportation distance?',
    type: 'number',
    unit: 'km',
    placeholder: '500',
    helper: 'Distance from source to processing/end user'
  },
  {
    id: 'Transport_Mode',
    title: 'Primary transportation method?',
    type: 'select',
    options: ['Truck', 'Ship', 'Train'],
    required: true
  },
  {
    id: 'Transport_emissions_kgCO2',
    title: 'Transportation emissions?',
    type: 'number',
    unit: 'kg CO₂',
    placeholder: '150',
    helper: 'CO₂ emissions from transportation'
  },
  {
    id: 'Water_use_m3_per_ton',
    title: 'Water usage per ton?',
    type: 'number',
    unit: 'm³/ton',
    placeholder: '50',
    helper: 'Water consumption for processing'
  },
  {
    id: 'End_of_Life',
    title: 'End-of-life scenario?',
    type: 'select',
    options: ['Recycle', 'Landfill', 'Reuse'],
    required: true
  },
  {
    id: 'Circularity_option',
    title: 'Circularity approach?',
    type: 'select',
    options: ['Closed-loop', 'Open-loop'],
    required: true
  },
  {
    id: 'Process_emissions_kgCO2',
    title: 'Process-related emissions?',
    type: 'number',
    unit: 'kg CO₂',
    placeholder: '2000',
    helper: 'Direct emissions from the production process'
  },
  {
    id: 'Total_emissions_kgCO2',
    title: 'Total CO₂ emissions?',
    type: 'number',
    unit: 'kg CO₂',
    placeholder: '2500',
    helper: 'Sum of all emissions (process + transport + energy)'
  },
  {
    id: 'Emission_factor_kgCO2_per_MJ',
    title: 'Emission factor?',
    type: 'number',
    unit: 'kg CO₂/MJ',
    placeholder: '0.25',
    helper: 'CO₂ emissions per unit of energy consumed'
  }
];