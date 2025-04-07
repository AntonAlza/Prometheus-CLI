import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { options } from 'fusioncharts';
import { LoadingService } from 'src/app/components/loading.service';
import { NuevoUsuario } from 'src/app/models/security/nuevo-usuario';
import { Rol } from 'src/app/models/security/rol';
import { RolPorUsuario } from 'src/app/models/security/rol-usuario';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  listDominiosCorreos: string[] = [];
  dominioSeleccionado: string = '@prometheus.com.pe';
  usuarioModeloSeleccionado: number = 0;
  listRolesDisponibles: Rol[] = [];
  listRolesSeleccionados: Rol[] = [];
  listRolesPorUsuarios: RolPorUsuario[] = [];
  listUsuariosActivos: RolPorUsuario[] = [];
  nombreApellidos: string = '';
  nombreUsuario: string = '';
  listArchivosSustento: string[] = [];

  flgCargando: boolean = false;
  flgSeleccionarUsuarioModelo = false;

  // selectedFiles: FileList | null = null;

  files: any[] = [];
  carpetaArchivosBlob: string = 'RegistroUsuario/'
  isDragging: boolean = false;

  constructor(private tokenService: TokenService, private router: Router, private authservice: AuthService, private blobService: AzureBlobStorageService) { }

  ngOnInit(): void {
    if(!this.tokenService.getToken()){
      this.router.navigate(['/error/error404']);
    }
    console.log("Usuario: ", this.tokenService.getAuthorities().includes('Administrador'))
    console.log("Usuario: ", this.tokenService.roles)
    console.log("Usuario - Token: ", this.tokenService.getToken());
    
    this.authservice.getDominiosCorreos().subscribe(
      (response: any) => {
        this.listDominiosCorreos = response;
        console.log("Dominios: ", this.listDominiosCorreos);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    
    this.authservice.getRolesByUsuarioGestor(this.tokenService.getUserName()).subscribe(
      (response: Rol[]) => {
        this.listRolesDisponibles = response.sort((a, b) => a.descripcion.localeCompare(b.descripcion));

        this.authservice.getRolesPorUsuarios().subscribe(
          (response: RolPorUsuario[]) => {
            this.listRolesPorUsuarios = response.filter(e => this.listRolesDisponibles.map(i => i.id).includes(e.idRol));
            this.listUsuariosActivos = this.listRolesPorUsuarios.filter((valor, indice, self) => 
              self.findIndex((t) => t.idUsuario === valor.idUsuario) === indice
            );
            console.log("Roles disponibles: ", this.listRolesDisponibles);
            console.log("Roles por Usuarios: ",  this.listRolesPorUsuarios);
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  registrar(){
    if(this.listRolesSeleccionados.length <= 0){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Es necesario asignar al menos un rol al usuario.',
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#4b822d'
      });
      return;
    }
    if(this.nombreApellidos == ''){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Es necesario ingresar el nombre del usuario.',
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#4b822d'
      });
      return;
    }
    if(this.nombreUsuario == '' || this.dominioSeleccionado == ''){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Es necesario ingresar el correo del usuario.',
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#4b822d'
      });
      return;
    }
    if(this.listArchivosSustento.length <= 0){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Es necesario adjuntar al menos un archivo de sustento para el registro del usuario.',
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#4b822d'
      });
      return;
    }
    let usuario: NuevoUsuario = new NuevoUsuario();
    usuario.nombre = this.nombreApellidos;
    usuario.email = this.nombreUsuario + this.dominioSeleccionado;
    usuario.estado = true;
    usuario.nombreUsuario = this.nombreUsuario;
    usuario.password = 'Prometheus' + new Date().getFullYear();;
    usuario.roles = this.listRolesSeleccionados.map(e => e.rolNombre);
    usuario.registradoPor = this.tokenService.getIdUsuario();
    usuario.sustentos = this.listArchivosSustento.map(item => this.nombreUsuario + ' - ' + item);

    this.flgCargando = true;

    for (const item of this.files) {
      this.blobService.uploadFile(item, this.carpetaArchivosBlob + this.nombreUsuario + ' - ' + item.name, () => {
      });
    }
    

    this.authservice.crearUsuario(usuario).subscribe(
      response => {
        this.flgCargando = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro exitoso.',
          html: "<p>Le llegará un correo al usuario registrado con sus credenciales e instrucciones de ingreso.</p>",
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#4b822d'
        });
        this.router.navigate(['/paginaInicio']);
      },
      error => {
        this.flgCargando = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Registro fallido',
          text: error.error ? error.error : 'Ocurrió un error inesperado',
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#4b822d'
        });
      }
    );

  }

  onInput(event: any) {
    const value = event.target.value;
    if (value.includes('@')) {
      event.target.value = value.replace('@', '');
    }
  }

  obtenerRolesPorUsuario(){
    let rolesModelo = this.listRolesPorUsuarios.filter(e => e.idUsuario == this.usuarioModeloSeleccionado);
    this.seleccionarRoles('selected', 'available', this.listRolesDisponibles.map(e => e.id));
    this.seleccionarRoles('available', 'selected', rolesModelo.map(e => e.idRol));
  }

  seleccionarRoles(from: string, to: string, rolesToMove?: number[]): void {
    const fromList = document.getElementById(from) as HTMLSelectElement;
    const toList = document.getElementById(to) as HTMLSelectElement; 

    let optionsToMove;
    if(rolesToMove){
      optionsToMove = Array.from(fromList.options).filter(option => 
        rolesToMove?.includes(Number(option.value))
      );
    }
    else{
      optionsToMove = Array.from(fromList.selectedOptions);
    }

    optionsToMove.forEach(option => {
        fromList.removeChild(option);
        toList.appendChild(option);

        const rol = this.listRolesDisponibles.find(r => r.id === Number(option.value));
        if (rol) {
            if (to == 'selected') {
                this.listRolesSeleccionados.push(rol);
            } else {
                this.listRolesSeleccionados = this.listRolesSeleccionados.filter(r => r.id !== Number(option.value));
            }
        }
    });

    // Ordenar las opciones de ambos selectores
    this.sortSelectOptions(fromList);
    this.sortSelectOptions(toList);
  }
  
  // Función para ordenar las opciones de un selector
  private sortSelectOptions(selectList: HTMLSelectElement): void {
      const optionsArray = Array.from(selectList.options);
      optionsArray.sort((a, b) => a.text.localeCompare(b.text));
      selectList.innerHTML = '';
      optionsArray.forEach(option => selectList.appendChild(option));
  }

  seleccionarUsuarioModelo(){
    this.seleccionarRoles('selected', 'available', this.listRolesDisponibles.map(e => e.id));
  }

  // onFileChange(event: any): void {
  //   this.selectedFiles = event.target.files;
  //   console.log("Archivos seleccionados: ", this.selectedFiles);
  // }

  //al arrastrar los archivos
  onFileDropped($event) {
    this.files = $event;
    this.cargarArchivo();
  }

  //al adjuntar los archivos desde el explorador
  fileBrowseHandler(files) {
    this.files = files;
    this.cargarArchivo();
  }

  cargarArchivo(){
    this.listArchivosSustento = [];
    for (const item of this.files) {
      this.listArchivosSustento.push(item.name);
    }
  }

}
