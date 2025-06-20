import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConjugationService, VerbData } from '../services/conjugation.service';


@Component({
  selector: 'app-conjugation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conjugation.component.html',
  styleUrls: ['./conjugation.component.css']
})
export class ConjugationComponent {
  constructor(private conjugationService: ConjugationService) {}
  selectedLanguage = 'tmazight';
  verbInput = '';
  currentVerb: string | null = null;
  conjugationResults: VerbData | null = null;
  showResults = false;
  isLoading = false;
  showTips = false; // Tips are hidden by default


  readonly pronouns = ['necc', 'cekk', 'cemm', 'netta', 'nettat', 'neccin', 'kenniv', 'kennint', 'nitni', 'nitnint'];

  handleVerbInput(): void {
    // Can add auto-suggest functionality here in the future
  }

  searchVerb(): void {
    const input = this.verbInput.trim().toLowerCase();

    if (!input) {
      this.showNotification('Veuillez entrer un verbe à rechercher');
      return;
    }

    this.showLoadingState();

    this.conjugationService.searchVerb(input).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.currentVerb = input;
          this.displayConjugation(response.data);
        } else {
          this.displayNoResults();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Conjugation search error:', error);
        this.displayNoResults();
      }
    });
  }

  private showLoadingState(): void {
    this.showResults = true;
    this.isLoading = true;
    this.conjugationResults = null;
  }

  private displayConjugation(verb: VerbData): void {
    this.isLoading = false;
    this.conjugationResults = verb;
  }

  private displayNoResults(): void {
    this.isLoading = false;
    this.conjugationResults = null;
  }

  clearSearch(): void {
    this.verbInput = '';
    this.showResults = false;
    this.currentVerb = null;
    this.conjugationResults = null;
  }

  toggleKeyboard(): void {
    this.showNotification('🔤 Clavier Tmazight activé');
  }

  toggleTips(): void {
    this.showTips = !this.showTips;
  }

  getDisplayVerb(): string {
    if (!this.conjugationResults || !this.currentVerb) return '';
    return this.conjugationResults.TmazightVerb || this.currentVerb;
  }

  onEnterPressed(): void {
    this.searchVerb();
  }

  private showNotification(message: string): void {
    // Simple notification - could be enhanced with a proper notification service
    console.log(message);
  }
}
