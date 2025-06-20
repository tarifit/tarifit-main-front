import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DictionaryWord {
  word: string;
  translation: string;
  dialect: string;
  match?: number;
  isNew?: boolean;
  example?: string;
  etymology?: string;
  examples?: string[];
  phonetic?: string;
  similarity?: number;
}

export interface DictionarySearchRequest {
  query: string;
  searchMode: 'semantic' | 'exact' | 'fuzzy';
  dialects: {
    aqelei: boolean;
    waryaghri: boolean;
  };
  sortBy?: 'relevance' | 'alphabetical' | 'dialect';
  limit?: number;
}

export interface DictionarySearchResponse {
  success: boolean;
  data?: {
    results: DictionaryWord[];
    totalCount: number;
    queryTime: number;
  };
  message?: string;
}

export interface WordDetailsResponse {
  success: boolean;
  data?: DictionaryWord;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private baseUrl = environment.contentServiceUrl;

  constructor(private http: HttpClient) {}

  searchWords(request: DictionarySearchRequest): Observable<DictionarySearchResponse> {
    return this.http.post<DictionarySearchResponse>(`${this.baseUrl}/api/dictionary/search`, request);
  }

  getWordDetails(word: string): Observable<WordDetailsResponse> {
    return this.http.get<WordDetailsResponse>(`${this.baseUrl}/api/dictionary/word/${encodeURIComponent(word)}`);
  }

  getWordSuggestions(partial: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/dictionary/suggestions`, {
      params: { q: partial }
    });
  }

  favoriteWord(word: string): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean; message?: string }>(`${this.baseUrl}/api/dictionary/favorite`, { word });
  }

  getFavoriteWords(): Observable<DictionaryWord[]> {
    return this.http.get<DictionaryWord[]>(`${this.baseUrl}/api/dictionary/favorites`);
  }
}