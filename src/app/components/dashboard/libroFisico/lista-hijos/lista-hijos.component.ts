import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { caracteristicasSplitsCM } from 'src/app/models/Fisico/Consumo Masivo/caracteristicasSplitsCM';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { listaHijosCM } from 'src/app/models/Fisico/Consumo Masivo/listaHijosCM';
import { objInitListaHijos } from 'src/app/models/Fisico/Consumo Masivo/objInitListaHijos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-hijos',
  templateUrl: './lista-hijos.component.html',
  styleUrls: ['./lista-hijos.component.scss']
})
export class ListaHijosComponent implements OnInit {

  @Input() objInitListaSplit: objInitListaHijos;
  @Output () closeListaHijos: EventEmitter<boolean>= new EventEmitter();

  // public detallePadre: number[][];
  // public listaHijos: string[][];
  public contrato: number = this.libroFisico.fisicoID
  public listaHijos: listaHijosCM[];
  public detallePadre: caracteristicasSplitsCM;

  constructor(private libroFisico: LibroFisicoService) {
  }

  ngOnInit(): void {
    this.listaHijos = this.objInitListaSplit.listaHijosCMList;
    this.detallePadre = this.objInitListaSplit.caracteristicaSplitsCM;
  }

  deshacerSplit(id: number, padre: number, flgDeshacerHijo: number, flgDeshacerPadre: number){

    if(!this.validarpermisos("Usted no cuenta con permisos para deshacer splits")){
      return;
    }

    if(flgDeshacerHijo > 0 || flgDeshacerPadre > 0){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No se puede deshacer un barco con descargas.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });

      return;
    }

    if(padre != 0){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No se puede deshacer un barco padre',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });

      return;
    }

    if(this.libroFisico.flgIntercompany){
      Swal.fire({
        title: 'Aviso',
        html: 'No es posible deshacer Operaciones provenientes de Ventas Molienda',
        icon: 'warning',
        confirmButtonColor: '#4b822d'
      })
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: 'Revertir Split',
      html: 'No se considerarán las modificaciones del hijo posteriores al split. ¿Seguro que desea revertir el barco <b>' + id + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.libroFisico.revertiSplitCM(this.contrato,id).subscribe(
          (response: boolean) => {
            Swal.fire({
              icon: 'success',
              title: 'Revertir Split',
              text: 'Se deshizo el split correctamente.',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            });
            this.libroFisico.obtenerListaHijos(this.contrato).subscribe(
              (response: objInitListaHijos) => {
                this.listaHijos = response.listaHijosCMList;
                this.detallePadre = response.caracteristicaSplitsCM;
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });                         
      }
    })
  }

  cerrarListaHijos() {
    this.closeModalFactura();
  }
  closeModalFactura(){
    this.closeListaHijos.emit(false); 
  }

  validarpermisos(comentario: string): boolean{
    if(!this.libroFisico.usuarioRegistra){
      Swal.fire({
        icon: 'error',
        title: 'Permiso denegado',
        text: comentario,
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return false;
    }else{
      return true;
    }
  }

}
