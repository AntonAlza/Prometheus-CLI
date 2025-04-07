import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { listaReversion } from 'src/app/models/Fisico/Consumo Masivo/listaReversion';
import { ReturnPhysicalState } from 'src/app/models/Fisico/Consumo Masivo/ReturnPhysicalState';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-revertir-estadios',
  templateUrl: './lista-revertir-estadios.component.html',
  styleUrls: ['./lista-revertir-estadios.component.scss']
})
export class ListaRevertirEstadiosComponent implements OnInit {

  public listaReversion: listaReversion[]; //LibroFisicoOpenShipments
  public listaReversionDS: MatTableDataSource<listaReversion>; //LibroFisicoOpenShipments
  
  @ViewChild(MatPaginator, { static: true }) paginadoPortafolio!: MatPaginator;
  @ViewChild(MatSort) sortPortafolio!: MatSort;
  
  comulnasLista: string[] = [
    'barco',
    'estadioInicial',
    'estadioFinal',
    'usuarioRegistra',
    'fechaSolicitud',
    'acciones'];

  constructor(private libroFisico: LibroFisicoService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) { }

  ngOnInit(): void {
    this.listarSolcititudes();
  }

  listarSolcititudes(){
    this.libroFisico.listarSolicitudesReversionBarco().subscribe(
      (response: listaReversion[]) => {
        this.listaReversion = response;
        this.listaReversionDS = new MatTableDataSource(this.listaReversion);
        this.listaReversionDS.paginator = this.paginadoPortafolio;
        this.listaReversionDS.sort = this.sortPortafolio;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  aprobar(idSolicitud: number){

    let solicitud: listaReversion = new listaReversion();

    solicitud.idSolicitud = idSolicitud;
    solicitud.usuarioAprovador = this.portafolioMoliendaIFDService.usuario;

    this.libroFisico.aceptarReversionaOpen(solicitud).subscribe(
      data=>{
        this.listarSolcititudes();
          Swal.fire({
            icon: 'success',
            title: 'Aprobar ',
            text: 'Se aprobó la reversión.',
            confirmButtonColor: '#0162e8'
          });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  rechazar(idSolicitud: number){
    let solicitud: listaReversion = new listaReversion();

    solicitud.idSolicitud = idSolicitud;
    solicitud.usuarioAprovador = this.portafolioMoliendaIFDService.usuario;

    this.libroFisico.rechazarReversionaOpen(solicitud).subscribe(
      data=>{
        this.listarSolcititudes();
          Swal.fire({
            icon: 'success',
            title: 'Aprobar ',
            text: 'Se rechazó la reversión.',
            confirmButtonColor: '#0162e8'
          });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  filtroLista(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaReversionDS.filter = filterValue.trim().toLowerCase();
  }

}
