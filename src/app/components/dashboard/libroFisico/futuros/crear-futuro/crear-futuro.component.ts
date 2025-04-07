import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService } from 'src/app/components/loading.service';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { ObjInitCrearFuturo } from 'src/app/models/Fisico/Consumo Masivo/ObjInitCrearFuturo';
import { Future } from 'src/app/models/Fisico/Future';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-futuro',
  templateUrl: './crear-futuro.component.html',
  styleUrls: ['./crear-futuro.component.scss']
})
export class CrearFuturoComponent implements OnInit {

  @Output () closecreacionFuturo: EventEmitter<boolean>= new EventEmitter();

  nuevoFuturo: Future;
  bolsa?: string;
  flgBoton: boolean = true;
  @Input() objetoInitCrearFuturo:ObjInitCrearFuturo;

  constructor(private libroFisico: LibroFisicoService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private loader:LoadingService) { }

  ngOnInit(): void {
    this.nuevoFuturo = new Future();
    this.nuevoFuturo.t146_ID = this.objetoInitCrearFuturo.nuevoID;
  }

  cerrarcreacionFuturo() {
    this.closeModalCreacionFuturo();
  }

  closeModalCreacionFuturo(){
    this.closecreacionFuturo.emit(false); 
  }

  obtenerContratos(){
    if(this.bolsa == undefined || this.bolsa == ""){
      return;
    }

    this.libroFisico.obtenerContratosxBolsa(Number(this.bolsa),this.libroFisico.subyacente).subscribe(
      (response: cargaCombo[]) => {
        this.objetoInitCrearFuturo.comboContratos = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  guardarFuturo(){
    this.flgBoton = false;
    if(this.bolsa == undefined || this.bolsa == "" || this.nuevoFuturo.t146_Contract == undefined || this.nuevoFuturo.t146_Contract == "" ||
       this.nuevoFuturo.t146_MemoryAid == undefined || this.nuevoFuturo.t146_MemoryAid == "" ){
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario ingresar los datos.',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });
        this.flgBoton = true;
        return;
    }

    this.loader.show();
    
    this.nuevoFuturo.t146_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.libroFisico.guardarGrupoFuturo(this.nuevoFuturo).subscribe(
      data=>{
          Swal.fire({
            icon: 'success',
            title: 'Crear Futuro',
            text: 'Se creó el Futuro '+ data.t146_ID +' correctamente.',
            confirmButtonColor: '#0162e8'
          });
          this.flgBoton = true;
          this.loader.hide();
          this.cerrarcreacionFuturo()
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }

}
