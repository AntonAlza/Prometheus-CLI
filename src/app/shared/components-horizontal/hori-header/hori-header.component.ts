import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hori-header',
  templateUrl: './hori-header.component.html',
  styleUrls: ['./hori-header.component.scss']
})
export class HoriHeaderComponent implements OnInit {

  public isCollapsed = true;
  public isSidebar = false;
  isLogged = false;
  isGestorUsuarios = false;
  nombreUsuario= '';
  nombre= '';
  Body:any = document.querySelector('body')

  constructor(private portafolioMoliendaIFDService: PortafolioIFDMoliendaService, private tokenService: TokenService, private router: Router) { }

  ngOnInit(): void {
    if(this.tokenService.getToken()){
      this.isLogged = true;
      this.nombreUsuario = this.tokenService.getNombre();
      this.nombre = this.tokenService.getNombre();
      this.portafolioMoliendaIFDService.usuario=this.tokenService.getUserName();
      this.portafolioMoliendaIFDService.perfiles=this.tokenService.getAuthorities();
      this.isGestorUsuarios = this.tokenService.roles.some(item => item.startsWith('Gestor'));

    }else{
      this.isLogged = false;
      this.nombreUsuario = '';
    }
  }

  toggleSidebarNotification() {
  }

  toggleSidebar(){
    const sidebar:boolean = this.Body.classList.value.includes('active');
    
    if (sidebar == true) {
      this.Body.classList.remove('active');
    }
    else {
      this.Body.classList.add('active');
    }
  }
 
  searchOpen(){
    this.Body?.classList.add('search-show')
  }
  
  search(e:any){
    e.preventDefault();
    
    this.Body?.classList.remove('search-show')
  }

  ngAfterViewInit(){
  }

  registrarUsuario(){
    this.router.navigate(['/auth/register-user']);
  }

  cerrarSesion(): void{
    this.tokenService.logOut();
     this.router.navigate(['/auth/login']);
  }

  iniciarSesion(): void{
     this.router.navigate(['/auth/login']);
  }
}
