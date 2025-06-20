import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-kit-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-kit-showcase.html',
  styleUrls: ['./ui-kit-showcase.css']
})
export class UiKitShowcaseComponent {
  demoSearchQuery = '';
  searchMode: 'semantic' | 'exact' | 'fuzzy' = 'semantic';
  alignment: 'left' | 'center' | 'right' = 'left';
  
  toggles = {
    notifications: true,
    darkMode: false
  };

  toggleExample(toggle: keyof typeof this.toggles): void {
    this.toggles[toggle] = !this.toggles[toggle];
  }

  setSearchMode(mode: 'semantic' | 'exact' | 'fuzzy'): void {
    this.searchMode = mode;
  }

  setAlignment(alignment: 'left' | 'center' | 'right'): void {
    this.alignment = alignment;
  }
}