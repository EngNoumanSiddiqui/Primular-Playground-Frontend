import { Injectable } from '@angular/core';
import { IUserInfo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userInfoKey: string = 'CurrentUserInfo';

  login(response: any): boolean {
    if (response) {
      localStorage.setItem(this.userInfoKey, JSON.stringify(response.data));
      return true;
    } else {
      return false;
    }
  }

  getUserInfo() {
    return JSON.parse(localStorage.getItem(this.userInfoKey));
  }

  getUserRoles() {
    let roles = [];
    let userInfo: IUserInfo = this.getUserInfo();
    if (userInfo && userInfo.roles && userInfo.roles.length > 0) {
      roles = userInfo.roles.map((x) => x.name);
    }
    return roles;
  }

  isAuthenticated(): boolean {
    return this.getUserInfo() ? true : false;
  }

  logout() {
    // setting Function for removing the Grid Filters When User logout.
    let keys = Object.keys(localStorage);
    if (keys && keys.length > 0) {
      keys.forEach((key) => {
        if (key.includes('SetFilters-')) {
          localStorage.removeItem(key);
        }
      });
    }
    // removing the UserName & Password When User logout.
    localStorage.removeItem(this.userInfoKey);
  }
}
