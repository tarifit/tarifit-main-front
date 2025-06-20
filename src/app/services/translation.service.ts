import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  success: boolean;
  data?: {
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    confidence?: number;
  };
  message?: string;
}

export interface LanguageDetectionResponse {
  success: boolean;
  data?: {
    detectedLanguage: string;
    confidence: number;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private baseUrl = environment.contentServiceUrl;

  constructor(private http: HttpClient) {}

  translateText(request: TranslationRequest): Observable<TranslationResponse> {
    return this.http.post<TranslationResponse>(`${this.baseUrl}/api/translation/translate`, request);
  }

  detectLanguage(text: string): Observable<LanguageDetectionResponse> {
    return this.http.post<LanguageDetectionResponse>(`${this.baseUrl}/api/translation/detect`, { text });
  }

  getSupportedLanguages(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/translation/languages`);
  }
}