import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['eddy@yopmail.com', [Validators.required, Validators.email]],
      password: ['123123', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    console.log('Login component initialized');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.message = '';

      const formData = this.loginForm.value;

      console.log('Form submitted with:', formData);
      this.authService.login(formData.email, formData.password).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful:', response);

          if (response && response.data) {
            this.userService.setCurrentUser(response.data);

            this.message = 'Login successful! Welcome back.';
            this.messageType = 'success';

            setTimeout(() => {
              this.router.navigate(['/account']);
            }, 1000);
          } else {
            this.message = 'Invalid response from server. Please try again.';
            this.messageType = 'error';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);

          if (error.status === 401) {
            this.message = 'Invalid email or password. Please try again.';
          } else if (error.status === 0) {
            this.message =
              'Network error. Please check your connection and try again.';
          } else {
            this.message =
              error.error?.message ||
              'An error occurred during login. Please try again.';
          }
          this.messageType = 'error';
        },
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
      this.message = 'Please fix the errors above and try again.';
      this.messageType = 'error';
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}

