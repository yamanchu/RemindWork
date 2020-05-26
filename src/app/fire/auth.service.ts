import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUser: firebase.User = null;

  constructor(private angularFireAuth: AngularFireAuth) {
    // this.loginUser = null;
  }

  get hasLoginUser(): boolean {
    if (this.loginUser != null) {
      return true;
    }
    return (environment.user.id !== '');
  }

  public TryGetUID(): string {
    let ret = '';

    if (this.loginUser != null) {
      ret = this.loginUser.uid;
    }
    else if (environment.user.id !== '') {
      ret = environment.user.id;
    }
    return ret;
  }

  public googleLogin(
    command: string,
    route: Router) {
    const provider = new firebase.auth.GoogleAuthProvider();

    if (this.loginUser == null) {
      this.angularFireAuth.signInWithPopup(provider)
        .then(
          (result: firebase.auth.UserCredential) => {
            this.loginUser = result.user;
            route.navigate([command]);
          });
    }
    else {
      route.navigate([command]);
    }
  }

  public eMailLogin(
    command: string,
    route: Router) {
    const provider = new firebase.auth.EmailAuthProvider();

    if (this.loginUser == null) {
      this.angularFireAuth.signInWithPopup(provider)
        .then(
          (result: firebase.auth.UserCredential) => {
            this.loginUser = result.user;
            route.navigate([command]);
          });
    }
    else {
      route.navigate([command]);
    }

  }
}
