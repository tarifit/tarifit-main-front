import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DictionaryService, DictionaryWord, DictionarySearchRequest } from '../services/dictionary.service';

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dictionary.html',
  styleUrls: ['./dictionary.css']
})
export class DictionaryComponent implements OnInit {
  constructor(private dictionaryService: DictionaryService) {}
  searchQuery = '';
  searchMode: 'semantic' | 'exact' | 'fuzzy' = 'semantic';
  hasSearched = false;

  dialects = {
    aqelei: true,
    waryaghri: true
  };

  searchResults: DictionaryWord[] = [];

  // UI state properties
  showResults = false;
  isLoading = false;
  resultsCount = 'Ready to explore Tarifit vocabulary';
  sortOption = 'relevance';
  Math = Math; // Make Math available in template

  // Removed mock data - now using backend service

  ngOnInit(): void {
    this.createBackgroundStars();
  }

  createBackgroundStars(): void {
    // Background stars will be handled by CSS animations in the template
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.performSearch();
    }
  }

  toggleDialect(dialect: 'aqelei' | 'waryaghri'): void {
    this.dialects[dialect] = !this.dialects[dialect];
    if (this.hasSearched) {
      this.performSearch();
    }
  }

  setSearchMode(mode: 'semantic' | 'exact' | 'fuzzy'): void {
    this.searchMode = mode;
    if (this.hasSearched) {
      this.performSearch();
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.hasSearched = true;
      this.performSearch();
    } else {
      this.hasSearched = false;
      this.searchResults = [];
    }
  }

  performSearch(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.showResults = false;
      return;
    }

    this.showResults = true;
    this.isLoading = true;
    this.hasSearched = true;

    const request: DictionarySearchRequest = {
      query: this.searchQuery,
      searchMode: this.searchMode,
      dialects: this.dialects,
      sortBy: this.sortOption as 'relevance' | 'alphabetical' | 'dialect'
    };

    this.dictionaryService.searchWords(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.searchResults = response.data.results;
          this.updateResultsCount();
        } else {
          this.searchResults = [];
          this.updateResultsCount();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Dictionary search error:', error);
        this.searchResults = [];
        this.updateResultsCount();
      }
    });
  }


  private updateResultsCount(): void {
    if (this.searchResults.length === 0) {
      this.resultsCount = 'No results found';
    } else if (this.searchResults.length === 1) {
      this.resultsCount = 'Found 1 result';
    } else {
      this.resultsCount = `Found ${this.searchResults.length} results`;
    }
  }

  sortResults(): void {
    switch (this.sortOption) {
      case 'alphabetical':
        this.searchResults.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case 'dialect':
        this.searchResults.sort((a, b) => a.dialect.localeCompare(b.dialect));
        break;
      case 'relevance':
      default:
        if (this.searchMode === 'semantic') {
          this.searchResults.sort((a, b) => (b.match || 0) - (a.match || 0));
        }
        break;
    }
  }

  // Word interaction methods
  selectWord(word: string): void {
    console.log('Selected:', word);
  }

  playAudio(word: string, event: Event): void {
    event.stopPropagation();
    console.log('Playing audio for:', word);
  }

  favoriteWord(word: string, event: Event): void {
    event.stopPropagation();
    this.dictionaryService.favoriteWord(word).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Word favorited successfully');
        }
      },
      error: (error) => {
        console.error('Error favoriting word:', error);
      }
    });
  }

  shareWord(word: string, event: Event): void {
    event.stopPropagation();
    console.log('Sharing:', word);
  }

}
