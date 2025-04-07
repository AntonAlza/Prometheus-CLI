import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { LoginUsuario } from 'src/app/models/security/login-usuario';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  isLogged = false;
  isLoginFail = false;
  loginUsuario: LoginUsuario;
  nombreUsuario: string;
  password: string;
  roles: string[] = [];
  active:any;
  errMsj: string;
  registro:number;
  siteKey = "6LdrSQ4pAAAAAGKC--KpRMFBcPHSy81G6Jbs1oZM";
  captchaSucces = 0;

  @ViewChild('captcha') captchaComponent!: ReCaptcha2Component;
  
  constructor(private authservice: AuthService, private router: Router, private formBuilder : FormBuilder,
              private tokenService: TokenService, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) { }

  ngOnInit(): void {
    if(this.tokenService.getToken()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin(): void{
    if(this.captchaSucces == 2 || this.captchaSucces == 0){
      this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
      this.authservice.loginUsuario(this.loginUsuario).subscribe(
        data => {
          this.isLogged = true;
          this.isLoginFail = false;
  
          this.tokenService.setToken(data.token);
          this.tokenService.setUserName(data.nombreUsuario);
          this.tokenService.setAuthorities(data.authorities);
          this.tokenService.setNombre(data.nombre);
          this.tokenService.setIdUsuario(data.id);
          this.roles = data.authorities;
          this.portafolioMoliendaIFDService.usuario=this.tokenService.getUserName();
          this.portafolioMoliendaIFDService.perfiles=this.tokenService.getAuthorities();
          this.guardarLogUsuario(1,this.tokenService.getUserName())
          this.router.navigate(['/paginaInicio']);
        },
        err => {
          this.isLogged = false;
          this.isLoginFail = true;
          this.errMsj = err.error;
          if(err.error == 'contraseña expirada'){
            this.passwordExpirado();
          }
          else if(err.error == 'usuario nuevo'){
            this.usuarioNuevo();
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Aviso',
              text: 'Credenciales inválidas',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            });
            if(this.captchaSucces == 2){
              this.captchaSucces = 1;
              this.captchaComponent.resetCaptcha();
            }
          }
        }
      );

    } else{
      Swal.fire({
        icon: 'error',
        title: 'Aviso',
        text: 'Captcha no resuelto',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    }
    
  }

  passwordExpirado(){
    Swal.fire({
      icon: 'warning',
      title: 'Contraseña expirada',
      html: 'Su contraseña ha expirado.<br>Por favor, actualice su contraseña para poder ingresar a Prometheus.',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    });
    this.router.navigate(['/auth/forgot-password']);
  }

  usuarioNuevo(){
    Swal.fire({
      icon: 'warning',
      title: 'Cambiar contraseña',
      html: 'Debe actualizar su contraseña al ser este su primer ingreso a Prometheus.',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    });
    this.router.navigate(['/auth/forgot-password']);
  }


  public guardarLogUsuario(idEvento:number,usuario:string): void {
      this.portafolioMoliendaIFDService.guardarLogUsuario(idEvento,usuario).subscribe(
        (response: number) => {
          this.registro = response;
          
  
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

    onCaptchaResolved(response: string){
      this.captchaSucces = 2;
    }

    handleLoad(){
      this.captchaSucces = 1;
    }
  
}
