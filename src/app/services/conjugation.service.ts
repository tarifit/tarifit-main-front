import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface VerbConjugation {
  preterit: string;
  preteritNeg: string;
  aoristIntensif: string;
  aoristIntensifNeg: string;
  aorist: string;
}

export interface Participles {
  preterit: string;
  preteritNeg: string;
  aoristIntensif: string;
  aoristIntensifNeg: string;
}

export interface VerbData {
  meaning: string;
  TmazightVerb?: string;
  conjugations: { [pronoun: string]: VerbConjugation };
  participles: Participles;
  examples: Array<{ Tmazight: string; french: string }>;
}

export interface ConjugationResponse {
  success: boolean;
  data?: VerbData;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConjugationService {
  private baseUrl = environment.contentServiceUrl;

  constructor(private http: HttpClient) {}

  searchVerb(verb: string): Observable<ConjugationResponse> {
    return this.http.get<ConjugationResponse>(`${this.baseUrl}/api/conjugation/search`, {
      params: { verb }
    });
  }

  getVerbSuggestions(partial: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/conjugation/suggestions`, {
      params: { q: partial }
    });
  }
}