import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @Input() activeSection: string = 'dictionaries';
  @Input() isLoggedIn: boolean = false;

  @Output() navClick = new EventEmitter<string>();
  @Output() brandClick = new EventEmitter<void>();
  @Output() loginClick = new EventEmitter<void>();
  @Output() joinCommunityClick = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  onNavClick(section: string): void {
    this.activeSection = section;
    this.navClick.emit(section);
  }

  onBrandClick(): void {
    this.brandClick.emit();
  }

  onLoginClick(): void {
    this.loginClick.emit();
  }

  onJoinCommunityClick(): void {
    this.joinCommunityClick.emit();
  }

  onProfileClick(): void {
    this.profileClick.emit();
  }

  onLogoutClick(): void {
    this.logoutClick.emit();
  }
}