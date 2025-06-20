import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalsComponent } from './auth-modals/auth-modals.component';
import { NavbarComponent } from './navbar/navbar';
import { DictionaryComponent } from './dictionary/dictionary';
import { TranslationComponent } from './translation/translation.component';
import { UiKitShowcaseComponent } from './ui-kit-showcase/ui-kit-showcase';
import {ConjugationComponent} from './conjugation/conjugation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AuthModalsComponent, NavbarComponent, DictionaryComponent, TranslationComponent, UiKitShowcaseComponent, ConjugationComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'tarifit-main-front';

  @ViewChild(AuthModalsComponent) authModals!: AuthModalsComponent;

  // Navbar state
  activeSection = 'dictionaries';
  isLoggedIn = false;

  openAuthModal(mode: 'login' | 'register' | 'reset-password' | 'forgot-password' = 'login') {
    this.authModals.openAuthModal(mode);
  }

  onAuthSuccess(event: any) {
    console.log('Authentication successful:', event);
    this.isLoggedIn = true;
    // Handle successful authentication here
  }

  // Navbar event handlers
  onNavigation(section: string) {
    this.activeSection = section;
    console.log('Navigation clicked:', section);
  }

  onBrandClick() {
    this.activeSection = 'dictionaries';
    console.log('Brand clicked - navigating to Dictionary');
  }

  onLogin() {
    this.openAuthModal('login');
  }

  onJoinCommunity() {
    this.openAuthModal('register');
  }

  onProfile() {
    console.log('Profile clicked');
    // Navigate to profile page
  }

  onLogout() {
    this.isLoggedIn = false;
    console.log('User logged out');
    // Handle logout logic
  }
}
