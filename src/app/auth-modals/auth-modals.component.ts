import { Component, EventEmitter, Output, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// Auth service for backend API calls
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.authServiceUrl;

  constructor(private http: HttpClient) {}

  forgotPassword(identifier: string) {
    return this.http.post(`${this.baseUrl}/api/auth/forgot-password`, { identifier });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/api/auth/reset-password`, { token, newPassword });
  }

  login(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/api/auth/login`, { username, password });
  }

  register(username: string, email: string, password: string) {
    return this.http.post(`${this.baseUrl}/api/auth/register`, { username, email, password });
  }
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

@Component({
  selector: 'app-auth-modals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modals.component.html',
  styleUrls: ['./auth-modals.component.scss'],
  providers: [AuthService]
})
export class AuthModalsComponent {
  @Output() authSuccess = new EventEmitter<{ mode: string; data: FormData }>();
  
  currentMode: 'login' | 'register' | 'reset-password' | 'forgot-password' = 'login';
  resetToken: string = ''; // Token from email link
  isModalOpen = false;
  isLoading = false;
  
  formData: FormData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  errors: FormErrors = {};

  constructor(private authService: AuthService) {}

  /**
   * Opens the auth modal in the specified mode
   * @param mode - 'login', 'register', 'reset-password', or 'forgot-password'
   */
  openAuthModal(mode: 'login' | 'register' | 'reset-password' | 'forgot-password' = 'login'): void {
    this.currentMode = mode;
    this.isModalOpen = true;
    this.switchMode(mode);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  /**
   * Opens the reset password modal with a token
   * @param token - Reset token from email link
   */
  openResetPasswordModal(token: string): void {
    this.resetToken = token;
    this.openAuthModal('reset-password');
  }

  /**
   * Opens the forgot password modal
   */
  openForgotPasswordModal(): void {
    this.openAuthModal('forgot-password');
  }

  /**
   * Closes the auth modal
   */
  closeAuthModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
    this.clearErrors();
    this.clearForm();
  }

  /**
   * Switches between login, register, reset password, and forgot password modes
   * @param mode - 'login', 'register', 'reset-password', or 'forgot-password'
   */
  switchMode(mode: 'login' | 'register' | 'reset-password' | 'forgot-password'): void {
    this.currentMode = mode;
    this.clearErrors();
  }

  /**
   * Handles forgot password form submission - calls backend service
   */
  private forgotPassword(): void {
    const identifier = this.formData.username || this.formData.email;
    
    this.authService.forgotPassword(identifier).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Password reset email sent! Check your inbox.');
        this.closeAuthModal();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Forgot password error:', error);
        alert('Failed to send reset email. Please try again.');
      }
    });
  }

  /**
   * Validates the form based on current mode
   * @returns true if form is valid, false otherwise
   */
  validateForm(): boolean {
    this.clearErrors();
    let isValid = true;

    // Login mode validation
    if (this.currentMode === 'login') {
      // Username validation
      if (!this.formData.username.trim()) {
        this.showError('username', 'Username required');
        isValid = false;
      }

      // Password validation
      if (!this.formData.password) {
        this.showError('password', 'Password required');
        isValid = false;
      }
    }

    // Register mode validation
    if (this.currentMode === 'register') {
      // Username validation
      if (!this.formData.username.trim()) {
        this.showError('username', 'Username required');
        isValid = false;
      }

      // Email validation
      if (!this.formData.email.trim()) {
        this.showError('email', 'Email required');
        isValid = false;
      }

      // Password validation
      if (!this.formData.password) {
        this.showError('password', 'Password required');
        isValid = false;
      }

      // Password length validation
      if (this.formData.password.length < 6) {
        this.showError('password', 'Password too short');
        isValid = false;
      }

      // Confirm password validation
      if (this.formData.password !== this.formData.confirmPassword) {
        this.showError('confirmPassword', 'Passwords do not match');
        isValid = false;
      }
    }

    // Reset password mode validation
    if (this.currentMode === 'reset-password') {
      // Password validation
      if (!this.formData.password) {
        this.showError('password', 'New password required');
        isValid = false;
      }

      // Password length validation
      if (this.formData.password.length < 6) {
        this.showError('password', 'Password too short (min 6 characters)');
        isValid = false;
      }

      // Confirm password validation
      if (this.formData.password !== this.formData.confirmPassword) {
        this.showError('confirmPassword', 'Passwords do not match');
        isValid = false;
      }
    }

    // Forgot password mode validation
    if (this.currentMode === 'forgot-password') {
      // Username validation
      if (!this.formData.username.trim()) {
        this.showError('username', 'Username required');
        isValid = false;
      }

      // Email validation
      if (!this.formData.email.trim()) {
        this.showError('email', 'Email required');
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Handles form submission
   * @param event - Form submit event
   */
  handleSubmit(event: Event): void {
    event.preventDefault();
    
    if (!this.validateForm() || this.isLoading) {
      return;
    }
    
    this.isLoading = true;

    if (this.currentMode === 'reset-password') {
      this.resetPassword();
    } else if (this.currentMode === 'forgot-password') {
      this.forgotPassword();
    } else if (this.currentMode === 'login') {
      this.login();
    } else if (this.currentMode === 'register') {
      this.register();
    }
  }

  /**
   * Handles login - calls backend service
   */
  private login(): void {
    this.authService.login(this.formData.username, this.formData.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Emit success event
        this.authSuccess.emit({
          mode: this.currentMode,
          data: { ...this.formData }
        });
        
        this.closeAuthModal();
        alert('Logged in successfully!');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      }
    });
  }

  /**
   * Handles registration - calls backend service
   */
  private register(): void {
    this.authService.register(this.formData.username, this.formData.email, this.formData.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Emit success event
        this.authSuccess.emit({
          mode: this.currentMode,
          data: { ...this.formData }
        });
        
        this.closeAuthModal();
        alert('Account created successfully!');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }

  /**
   * Handles password reset - calls backend service
   */
  private resetPassword(): void {
    this.authService.resetPassword(this.resetToken, this.formData.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Emit success event
        this.authSuccess.emit({
          mode: this.currentMode,
          data: { ...this.formData }
        });
        
        this.closeAuthModal();
        alert('Password reset successfully! You can now login with your new password.');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Reset password error:', error);
        alert('Failed to reset password. Please try again or request a new reset link.');
      }
    });
  }

  /**
   * Shows error message for a specific field
   * @param field - Field name
   * @param message - Error message
   */
  showError(field: keyof FormErrors, message: string): void {
    this.errors[field] = message;
  }

  /**
   * Clears all error messages
   */
  clearErrors(): void {
    this.errors = {};
  }

  /**
   * Clears error for a specific field
   * @param field - Field name
   */
  clearFieldError(field: keyof FormErrors): void {
    delete this.errors[field];
  }

  /**
   * Clears the form data
   */
  clearForm(): void {
    this.formData = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    this.isLoading = false;
  }
}