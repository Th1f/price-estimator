import { request } from "./client";

export type SuburbResponse = {
  suburbs: string[];
};

export type PredictionResponse = {
  price: number;
  min: number;
  max: number;
  suburb: string;
  bedrooms: number;
  bathrooms: number;
};

export type PredictInput = {
  suburb: string;
  bedrooms: number;
  bathrooms: number;
};

export function getSuburbs() {
  return request<SuburbResponse>("/suburbs");
}

export function predictPrice(input: PredictInput) {
  return request<PredictionResponse>("/predict", {
    method: "POST",
    body: input,
  });
}
