import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt'

@Injectable()
export class AuthService {
  constructor(private jwtHelperService: JwtHelperService) {
  }

  loggedIn() {
    const token: string = this.jwtHelperService.tokenGetter()

    if (!token) {
      return false
    }

    const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token)

    return !tokenExpired
  }

  tokenExpireMsLeft() {
    return this.jwtHelperService.getTokenExpirationDate().getTime() - new Date().getTime() + 1000;
  }
}
