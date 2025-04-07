import { Injectable } from '@angular/core';


const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';
const NAME_KEY = 'AuthName';
const ID_KEY = 'AuthID';



@Injectable({
  providedIn: 'root'
})
export class TokenService {
  token: string;
  roles: Array<string> = [];

  constructor() { }

  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    this.token = sessionStorage.getItem(TOKEN_KEY)!
    // console.log(this.token);
    return this.token;
  }

  public setUserName(userName: string): void {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }

  public getUserName(): string {
    return sessionStorage.getItem(USERNAME_KEY)!;
  }

  public setNombre(nombre: string): void {
    window.sessionStorage.removeItem(NAME_KEY);
    window.sessionStorage.setItem(NAME_KEY, nombre);
  }

  public getNombre(): string {
    return sessionStorage.getItem(NAME_KEY)!;
  }

  public setAuthorities(authorities: string[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];
    if (sessionStorage.getItem(AUTHORITIES_KEY)) {
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)!).forEach(authority => {
        this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }

  public getIdUsuario(): number{
    return Number(sessionStorage.getItem(ID_KEY))!;
  }

  public setIdUsuario(id: number): void{
    window.sessionStorage.removeItem(ID_KEY);
    window.sessionStorage.setItem(ID_KEY, id.toString());
  }

  public logOut(): void {
    window.sessionStorage.clear();
  }

}
