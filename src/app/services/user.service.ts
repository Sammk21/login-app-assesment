import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  sessionToken: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string | null;
  image: string;
  phoneCode: string;
  phone: string;
  nationality: string;
  isPhoneVerified: number;
  isEmailVerified: number;
  deviceToken: string;
  deviceType: string;
  deviceModel: string;
  appVersion: string;
  osVersion: string;
  createDate: string;
  gender: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  setCurrentUser(userData: any) {
    const user: User = {
      sessionToken: userData.sessionToken || userData.sesatonToken, // Handle typo in API response
      firstName: userData.FirstName || userData.firstName,
      lastName: userData.LastName || userData.lastName || userData.InstName, // Handle different field names
      email: userData.email,
      dob: userData.dob,
      image: userData.image,
      phoneCode: userData.phoneCode,
      phone: userData.phone,
      nationality: userData.nationality,
      isPhoneVerified: userData.IsPhoneVerified || userData.isPhoneVerified,
      isEmailVerified: userData.isEmailVerified,
      deviceToken: userData.deviceToken,
      deviceType: userData.deviceType,
      deviceModel: userData.deviceModel,
      appVersion: userData.appVersion,
      osVersion: userData.osVersion || userData.osversion,
      createDate: userData.CreateDate || userData.createDate,
      gender: userData.gender,
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  clearCurrentUser() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user: User = JSON.parse(userData);
      this.currentUserSubject.next(user);
    }
  }

  getSessionToken(): string | null {
    const user = this.getCurrentUser();
    return user ? user.sessionToken : null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}
