import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AuthModalsComponent } from './auth-modals.component';

describe('AuthModalsComponent', () => {
  let component: AuthModalsComponent;
  let fixture: ComponentFixture<AuthModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModalsComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal in login mode by default', () => {
    component.openAuthModal();
    expect(component.isModalOpen).toBe(true);
    expect(component.currentMode).toBe('login');
  });

  it('should open modal in register mode', () => {
    component.openAuthModal('register');
    expect(component.isModalOpen).toBe(true);
    expect(component.currentMode).toBe('register');
  });

  it('should close modal and clear form', () => {
    component.openAuthModal();
    component.formData.username = 'testuser';
    component.closeAuthModal();
    
    expect(component.isModalOpen).toBe(false);
    expect(component.formData.username).toBe('');
  });

  it('should switch between login and register modes', () => {
    component.switchMode('register');
    expect(component.currentMode).toBe('register');
    
    component.switchMode('login');
    expect(component.currentMode).toBe('login');
  });

  describe('Form Validation', () => {
    it('should validate required username', () => {
      component.formData.username = '';
      const isValid = component.validateForm();
      
      expect(isValid).toBe(false);
      expect(component.errors.username).toBe('Username required');
    });

    it('should validate required password', () => {
      component.formData.username = 'testuser';
      component.formData.password = '';
      const isValid = component.validateForm();
      
      expect(isValid).toBe(false);
      expect(component.errors.password).toBe('Password required');
    });

    it('should validate email in register mode', () => {
      component.currentMode = 'register';
      component.formData.username = 'testuser';
      component.formData.password = 'password123';
      component.formData.email = '';
      
      const isValid = component.validateForm();
      
      expect(isValid).toBe(false);
      expect(component.errors.email).toBe('Email required');
    });

    it('should validate password length in register mode', () => {
      component.currentMode = 'register';
      component.formData.username = 'testuser';
      component.formData.email = 'test@example.com';
      component.formData.password = '12345';
      
      const isValid = component.validateForm();
      
      expect(isValid).toBe(false);
      expect(component.errors.password).toBe('Password too short');
    });

    it('should validate password confirmation in register mode', () => {
      component.currentMode = 'register';
      component.formData.username = 'testuser';
      component.formData.email = 'test@example.com';
      component.formData.password = 'password123';
      component.formData.confirmPassword = 'different';
      
      const isValid = component.validateForm();
      
      expect(isValid).toBe(false);
      expect(component.errors.confirmPassword).toBe('Passwords do not match');
    });

    it('should pass validation with correct data', () => {
      component.currentMode = 'login';
      component.formData.username = 'testuser';
      component.formData.password = 'password123';
      
      const isValid = component.validateForm();
      
      expect(isValid).toBe(true);
      expect(Object.keys(component.errors).length).toBe(0);
    });
  });

  it('should emit authSuccess event on successful submission', (done) => {
    component.formData.username = 'testuser';
    component.formData.password = 'password123';
    
    component.authSuccess.subscribe((result) => {
      expect(result.mode).toBe('login');
      expect(result.data.username).toBe('testuser');
      done();
    });
    
    const event = new Event('submit');
    component.handleSubmit(event);
  });

  it('should clear field error on input', () => {
    component.errors.username = 'Username required';
    component.clearFieldError('username');
    
    expect(component.errors.username).toBeUndefined();
  });
});