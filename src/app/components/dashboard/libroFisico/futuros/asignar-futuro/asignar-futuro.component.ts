import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { listaAsignarFuturo } from 'src/app/models/Fisico/Consumo Masivo/listaAsignarFuturo';
import { ObjAsignarFuturo } from 'src/app/models/Fisico/Consumo Masivo/ObjAsignarFuturo';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-futuro',
  templateUrl: './asignar-futuro.component.html',
  styleUrls: ['./asignar-futuro.component.scss']
})
export class AsignarFuturoComponent implements OnInit {
  
  @Output () closeAsignarFuturo: EventEmitter<boolean>= new EventEmitter();
  flgBoton: boolean = true;
  listaFuturos: listaAsignarFuturo[];
  totalAsignado: number;
  listaFuturosDS: MatTableDataSource<listaAsignarFuturo>;
  @Input() objetoInitAsignarFuturo: ObjAsignarFuturo;
  @Input() saldoContratosFuturos: Number;

  displayedColumns: string[] = [
     'opcion'
    ,'s069_CodigoFuturo'
    ,'s069_Futuro'
    ,'s069_CaksTotal'
    ,'s069_CaksDisponibles'
    ,'s069_CaksAsignados'
    ,'s069_Motivo'
  ];

  constructor(private libroFisico: LibroFisicoService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) { }

  ngOnInit(): void {
    this.listaFuturos = this.objetoInitAsignarFuturo.listaFuturos;
    if(this.objetoInitAsignarFuturo.futuroAsignado != null){
      this.listaFuturos = this.listaFuturos.filter(x => x.s069_CodigoFuturo == this.objetoInitAsignarFuturo.futuroAsignado)
    }
    this.listaFuturosDS = new MatTableDataSource(this.listaFuturos);
    
    this.totalAsignado = this.listaFuturos.reduce((accumulator, object) => {return accumulator + object.s069_CaksAsignados;}, 0);
    // this.listaFuturos.
  }


  cerrarAsignarFuturo() {
    this.closeModalAsignarFuturo();
  }

  closeModalAsignarFuturo(){
    this.closeAsignarFuturo.emit(false); 
  }

  // guardarAsignacionFuturo(){

  // }

  asignarFuturo(codFuturo:number,caksDisponibles:number,caksAsignados:number){

    (async () => {
          const {} = await Swal.fire({
          icon: 'question',
          title: 'Asignar Futuro',
          html: 'Indique la cantidad de CAKS que desea asignar del futuro' + codFuturo,
          input: 'number',
          inputPlaceholder: 'Asignar CAKS (+/-)',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#4b822d',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true,
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if(value.length == 0){
                resolve("Por favor ingresar la cantidad de CAKS.");
                return;
              }else if((Number(value) < 0 && caksAsignados < Math.abs(Number(value))) || (Number(value) > 0 && caksDisponibles < Number(value))){
                if(Number(value) < 0){
                  resolve("La cantidad de CAKS que se desea Desasignar, supera lo Asignado.");
                }else{
                  resolve("La cantidad de CAKS que se desea Asignar, supera la disponibilidad del Futuro.");
                }
              }else if(Number(value) > Number(this.saldoContratosFuturos)){
                resolve("Es necesario primero actualizar las TM del barco.");
              }else{
                for(var i = 0; i < this.listaFuturos.length; i++){
                  if(Number(this.listaFuturos[i].s069_CodigoFuturo) == codFuturo){
                    this.listaFuturos[i].s069_CaksDisponibles = this.listaFuturos[i].s069_CaksDisponibles - Number(value)
                    this.listaFuturos[i].s069_CaksAsignados = this.listaFuturos[i].s069_CaksAsignados + Number(value)
                  }
                }
                let objetoGuardar: ObjAsignarFuturo = new ObjAsignarFuturo();
                objetoGuardar.listaFuturos = this.listaFuturos;
                objetoGuardar.futuroSeleccionado = codFuturo;
                objetoGuardar.codFisico = this.libroFisico.fisicoID;
                objetoGuardar.usuario = this.portafolioMoliendaIFDService.usuario;
                this.libroFisico.guardarAsignacionFuturos(objetoGuardar).subscribe(
                  data=>{
                      this.cerrarAsignarFuturo();
                      Swal.fire({
                        icon: 'success',
                        title: 'Asignación de Futuro',
                        text: 'Se asignó el futuro correctamente.' ,
                        confirmButtonColor: '#0162e8'
                      });
                  },
                  (error: HttpErrorResponse) => {
                    if(error.error.message.includes('ConstraintViolationException')){
                      Swal.fire({
                        icon: 'warning',
                        title: 'Aviso',
                        text: 'Error de Concurrencia, por favor volver a guardar.',
                        confirmButtonColor: '#0162e8',
                        customClass: {
                          container: 'my-swal'
                        }
                      });
                    }else{
                      alert(error.message);
                    }
                  });

                  this.listaFuturosDS = new MatTableDataSource(this.listaFuturos);
              }
            })
          }
        })   
      })() 
  }

}
