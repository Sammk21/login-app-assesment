import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, User } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroUserSolid,
  heroEyeSolid,
  heroTrashSolid,
  heroArrowLeftOnRectangleSolid,
  heroCog6ToothSolid,
} from '@ng-icons/heroicons/solid';
import {
  heroEye,
  heroEyeSlash,
  heroQuestionMarkCircle,
} from '@ng-icons/heroicons/outline';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  viewProviders: [
    provideIcons({
      heroEyeSlash,
      heroEye,
      heroCog6ToothSolid,
      heroUserSolid,
      heroEyeSolid,
      heroTrashSolid,
      heroArrowLeftOnRectangleSolid,
      heroQuestionMarkCircle,
    }),
  ],
})
export class AccountComponent implements OnInit {
  profileForm: FormGroup;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      oldPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
    });
  }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phone,
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'old':
        this.showOldPassword = !this.showOldPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  onSave() {
    if (this.profileForm.valid) {
      console.log('Form saved:', this.profileForm.value);
    }
  }

  onLogout() {
    this.userService.clearCurrentUser();

    this.authService.logout();

    this.router.navigate(['/login']);

    console.log('User logged out successfully');
  }
}
