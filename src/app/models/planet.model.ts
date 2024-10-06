// src/app/models/planet.model.ts

export interface AccuracyErrors {
  period: string;
  lambda: string;
  phi: string;
  rho: string;
}

export interface Accuracy {
  nominalErrors: AccuracyErrors;
  historicErrors: AccuracyErrors;
}

export interface Planet {
  name: string;
  size: number;
  distance: number;
  texture: string;
  lambda: number;
  phi: number;
  rho: number;
  diameter: string;
  distanceFromSun: string;
  orbitalPeriod: string;
  atmosphere: string;
  temperature: string;
  moons: string;
  accuracy: Accuracy;
}
