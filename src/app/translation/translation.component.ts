import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService, TranslationRequest } from '../services/translation.service';


interface LanguageOption {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-translation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css']
})
export class TranslationComponent implements OnInit {
  constructor(private translationService: TranslationService) {}
  // Language options
  sourceLanguages: LanguageOption[] = [
    { value: 'tarifit', label: 'Tarifit', icon: '🏔️' },
    { value: 'auto', label: 'Auto-detect', icon: '🔍' },
    { value: 'arabic', label: 'العربية', icon: '🇲🇦' },
    { value: 'french', label: 'Français', icon: '🇫🇷' }
  ];

  targetLanguages: LanguageOption[] = [
    { value: 'english', label: 'English', icon: '🇺🇸' },
    { value: 'french', label: 'Français', icon: '🇫🇷' },
    { value: 'arabic', label: 'العربية', icon: '🇲🇦' },
    { value: 'spanish', label: 'Español', icon: '🇪🇸' },
    { value: 'tarifit', label: 'Tarifit', icon: '🏔️' }
  ];

  // Form state
  sourceLanguage = 'tarifit';
  targetLanguage = 'english';
  sourceText = '';
  translatedText = '';
  isLoading = false;
  charCount = 0;
  maxChars = 5000;
  outputCharCount = 0;

  // UI state
  sourceAreaActive = false;
  targetAreaActive = false;
  notificationMessage = '';
  showNotification = false;


  ngOnInit(): void {
    // Initialize component
  }

  updateCharCount(): void {
    this.charCount = this.sourceText.length;
  }

  handleInput(): void {
    this.updateCharCount();
    
    if (this.sourceText.trim() === '') {
      this.translatedText = '';
      this.outputCharCount = 0;
      return;
    }

    // Debounce translation
    this.performTranslation();
  }

  performTranslation(): void {
    if (!this.sourceText.trim()) {
      return;
    }

    this.isLoading = true;

    const request: TranslationRequest = {
      text: this.sourceText,
      sourceLanguage: this.sourceLanguage,
      targetLanguage: this.targetLanguage
    };

    this.translationService.translateText(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.translatedText = response.data.translatedText;
          this.outputCharCount = this.translatedText.length;
          this.targetAreaActive = true;
          setTimeout(() => {
            this.targetAreaActive = false;
          }, 2000);
        } else {
          this.translatedText = 'Translation failed';
          this.outputCharCount = this.translatedText.length;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Translation error:', error);
        this.translatedText = 'Translation error occurred';
        this.outputCharCount = this.translatedText.length;
      }
    });
  }




  swapLanguages(): void {
    // Don't swap if source is auto-detect
    if (this.sourceLanguage === 'auto') {
      this.showNotificationMessage('Cannot swap with auto-detect');
      return;
    }

    // Swap language selections
    const tempLang = this.sourceLanguage;
    this.sourceLanguage = this.targetLanguage;
    this.targetLanguage = tempLang;
    
    // Swap text content if there's a translation
    if (this.translatedText) {
      const tempText = this.sourceText;
      this.sourceText = this.translatedText;
      this.translatedText = tempText;
      this.updateCharCount();
      this.outputCharCount = this.translatedText.length;
    }
  }

  clearText(): void {
    this.sourceText = '';
    this.translatedText = '';
    this.charCount = 0;
    this.outputCharCount = 0;
  }

  copyTranslation(): void {
    if (this.translatedText) {
      navigator.clipboard.writeText(this.translatedText).then(() => {
        this.showNotificationMessage('Translation copied to clipboard!');
      });
    }
  }

  playAudio(): void {
    this.showNotificationMessage('🔊 Playing pronunciation...');
  }

  saveTranslation(): void {
    this.showNotificationMessage('💾 Translation saved to favorites!');
  }

  startVoiceInput(): void {
    this.showNotificationMessage('🎤 Voice input activated');
  }

  uploadFile(): void {
    this.showNotificationMessage('📁 File upload feature coming soon');
  }

  private showNotificationMessage(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  getSourceLabel(): string {
    const lang = this.sourceLanguages.find(l => l.value === this.sourceLanguage);
    return lang ? `${lang.icon} ${lang.label}` : '';
  }

  getTargetLabel(): string {
    const lang = this.targetLanguages.find(l => l.value === this.targetLanguage);
    return lang ? `${lang.icon} ${lang.label}` : '';
  }

  get hasTranslation(): boolean {
    return this.translatedText.length > 0;
  }

  get showDefaultMessage(): boolean {
    return !this.isLoading && !this.hasTranslation;
  }

  get charCountClass(): string {
    if (this.charCount > 4500) return 'text-red-500';
    if (this.charCount > 4000) return 'text-orange-500';
    return '';
  }
}