import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AprobacionImpugnacion } from 'src/app/models/Bases/aprobacionImpugnacion';
import { BasesImpugnacionService } from 'src/app/models/Bases/BasesImpugnacion.service';
import { BasesImpugnacionPorAprobar } from 'src/app/models/Bases/basesImpugnacionPorAprobar';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';
import { LoadingService } from 'src/app/components/loading.service';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { ObjInitCargaMTM } from 'src/app/models/Fisico/Consumo Masivo/ObjInitCargaMTM';

@Component({
  selector: 'app-aprobacion-impugnacion-base',
  templateUrl: './aprobacion-impugnacion-base.component.html',
  styleUrls: ['./aprobacion-impugnacion-base.component.scss']
})
export class AprobacionImpugnacionBaseComponent implements OnInit {

  checked: any = [];
  date: NgbDateStruct;
  public flgPorAprobar: boolean = false;
  public flgCancelado: boolean = false;
  public idSubyacente: number;
  public fecha: number;
  public listaSubyacente: CargarCombo[];
  public listaBaseImpugnar: BasesImpugnacionPorAprobar [] = [];
  dataSource: MatTableDataSource<BasesImpugnacionPorAprobar>;
  selection = new SelectionModel<BasesImpugnacionPorAprobar>(true, []);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  selected = new FormControl(0);
  public idEstado:string;
  public pFechaInicio:string="";
  public pFechaFin:string="";
  public dtpFecIni:string="";
  public dtpFecFin:string="";
  public listaEstado:CargarCombo[];
  public nImpugnacionesPorAprobar: number = 0;

  displayedColumns: string[] = [
    'temp_DATE',
    'temp_DESC_UNDERLYINGCLASIFICATION',
    'temp_MonthContract',
    'temp_ASK',
    'temp_BID',
    'temp_MID',
    'temp_OrigenImpugnacion',
    'temp_Valor',
    'temp_FechaTermino',
    'temp_SustentosAsociados',
    'actions'
  ];

  constructor(private baseImpugnarService: BasesImpugnacionService,
    private blobService: AzureBlobStorageService,
    private tokenService: TokenService,
    private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
    private loader:LoadingService,
    private libroFisico: LibroFisicoService) { }

  ngOnInit(): void {
    this.fecha=this.getformattedDate();
    this.getListaEstado();
    this.getListaBasesImpugnar();
  }

  public dateToString = ((date) => {
    if(date.day<10 && date.month<10){
      return `${date.year}0${date.month}0${date.day}`.toString();
    }else if (date.day<10 ){
      return `${date.year}${date.month}0${date.day}`.toString();
    }else if (date.month<10){
      return `${date.year}0${date.month}${date.day}`.toString();
    }else{
      return `${date.year}${date.month}${date.day}`.toString();
    }
  })

  getformattedDate():number{
    this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    return Number(this.dateToString(this.date));
  }

  getListaBasesImpugnar(){

    if (typeof this.idEstado == 'undefined') {
      this.idEstado='3'
    }
    if (typeof this.pFechaInicio == 'undefined' || this.pFechaInicio==='' ) {
      this.pFechaInicio='19000101'
    }
    if (typeof this.pFechaFin == 'undefined'  || this.pFechaFin==='' ) {
      this.pFechaFin='30000101'
    }

    switch(Number(this.idEstado)){
      case 1: case 2:{
        this.flgCancelado = false;
        this.flgPorAprobar = false;
        break;
      }
      case 3:{
        this.flgCancelado = false;
        this.flgPorAprobar = true;
        break;
      }
      case 4:{
        this.flgCancelado = true;
        this.flgPorAprobar = false;
        break;
      }
    }

    this.baseImpugnarService.getListaBasesImpugnacionPorAprobar(Number(this.pFechaInicio),Number(this.pFechaFin),Number(this.idEstado)).subscribe(
      (response: BasesImpugnacionPorAprobar[]) => {
        this.listaBaseImpugnar = response;
        this.dataSource = new MatTableDataSource(this.listaBaseImpugnar);
        this.selection = new SelectionModel<BasesImpugnacionPorAprobar>(true, []);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.listaBaseImpugnar.length > 0 && this.idEstado == '3'){
          this.nImpugnacionesPorAprobar ++;
        }
        if (this.nImpugnacionesPorAprobar > 0 && this.listaBaseImpugnar.length <= 0 && this.idEstado == '3'){
          this.nImpugnacionesPorAprobar = 0;
          Swal.fire({
            icon: 'question',
            title: 'Recalcular MTM',
            html: 'Es necesario recalcular el MTM. ¿Deseas volver a calcularlo ahora?',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            reverseButtons: true,
            confirmButtonColor: '#4b822d'
          }).then((result) => {
            if (result.isConfirmed){
              console.log("se hace");
              this.calcularMTMModal();
            }
          });
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  calcularMTMModal(){
    this.loader.show();
    this.libroFisico.obtenerDatosRecalcularMTM().subscribe(
      (response: ObjInitCargaMTM) => {
        if(!response.flgPortafolioCerrado){
          Swal.fire({
            title: 'Recalculo de MTM',
            html: 'Se encuentra abierto el Open Shipments',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }
        if(!response.flgConsumoCerrado){
          Swal.fire({
            title: 'Recalculo de MTM',
            html: 'El Consumo se encuentra abierto',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }
        if(!response.flgInventarioCerrado){
          Swal.fire({
            title: 'Recalculo de MTM',
            html: 'El Inventario se encuentra abierto',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }

        Swal.fire({
          icon: 'warning',
          title: 'Recalculo de MTM',
          html: '¿Está seguro que desea generar el MtM con bases al '+response.fechaBases+'?',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true,
          confirmButtonColor: '#4b822d'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loader.show();
            this.libroFisico.recalcularMTM(this.portafolioMoliendaIFDService.usuario).subscribe(
              (response: boolean) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Recalculo de MTM',
                  text: 'Se cargo el MtM para todas las MMPP.',
                  confirmButtonColor: '#0162e8'
                });
                this.loader.hide();
              },
              (error: HttpErrorResponse) => {
                this.loader.hide();
                alert(error.message);
              });        
          }
          this.loader.hide();
        })
        
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });  
  }

  acortarNombreArchivo(nombreArchivo: string): string{
    if (nombreArchivo.lastIndexOf(".") > 10)
    {
      return nombreArchivo.substring(0,10) + "..." + nombreArchivo.substring(nombreArchivo.lastIndexOf(".") + 1, nombreArchivo.length);
    }
    else{
      return nombreArchivo;
    }
  }

  descargarArchivo(archivo: any){
    this.blobService.downloadFile(archivo, blob => {
      console.log("se descarga el archivo");
      window.open(blob);
    });
  }

  aprobarImpugnacion(fila: BasesImpugnacionPorAprobar){
    Swal.fire({
      icon: 'question',
      title: 'Aprobar impugnación',
      html: '¿Desea aprobar esta impugnación?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){
        let aprobacionImpugnacion: AprobacionImpugnacion = new AprobacionImpugnacion;
        aprobacionImpugnacion.t440_BasisImpugn = fila.temp_ID_BaseImpugn;
        aprobacionImpugnacion.t440_Date = this.fecha;
        aprobacionImpugnacion.t440_User = this.tokenService.getUserName();
        aprobacionImpugnacion.t440_Approval = 1;//Aprobado
        this.baseImpugnarService.guardarAprobacionImpugnacion(aprobacionImpugnacion).subscribe(
          (response: AprobacionImpugnacion) => {
            aprobacionImpugnacion = response;
            this.getListaBasesImpugnar();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'La impugnación fue aprobada con éxito.',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
            });
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    });
  }

  rechazarImpugnacion(fila: BasesImpugnacionPorAprobar){
    Swal.fire({
      icon: 'question',
      title: 'Rechazar impugnación',
      html: '¿Desea rechazar esta impugnación?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){
        let aprobacionImpugnacion: AprobacionImpugnacion = new AprobacionImpugnacion;
        aprobacionImpugnacion.t440_BasisImpugn = fila.temp_ID_BaseImpugn;
        aprobacionImpugnacion.t440_Date = this.fecha;
        aprobacionImpugnacion.t440_User = this.tokenService.getUserName();
        aprobacionImpugnacion.t440_Approval = 2;//No aprobado
        this.baseImpugnarService.guardarAprobacionImpugnacion(aprobacionImpugnacion).subscribe(
          (response: AprobacionImpugnacion) => {
            aprobacionImpugnacion = response;
            this.getListaBasesImpugnar();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'La impugnación fue rechazada con éxito.',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
            });
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    });
  }

  revertirImpugnacion(fila: BasesImpugnacionPorAprobar){
    Swal.fire({
      icon: 'question',
      title: 'Revertir impugnación',
      html: '¿Desea cambiar el estado de esta impugnación a "Por aprobar"?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){
        let aprobacionImpugnacion: AprobacionImpugnacion = new AprobacionImpugnacion;
        aprobacionImpugnacion.t440_BasisImpugn = fila.temp_ID_BaseImpugn;
        aprobacionImpugnacion.t440_Date = this.fecha;
        aprobacionImpugnacion.t440_User = this.tokenService.getUserName();
        aprobacionImpugnacion.t440_Approval = 3;//Por aprobar
        this.baseImpugnarService.guardarAprobacionImpugnacion(aprobacionImpugnacion).subscribe(
          (response: AprobacionImpugnacion) => {
            aprobacionImpugnacion = response;
            this.getListaBasesImpugnar();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'La reversión fue realizada con éxito.',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
            });
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    });
  }

  public getListaEstado(): void {
    this.portafolioMoliendaIFDService.getListaEstado().subscribe(
      (response: CargarCombo[]) => {
        this.listaEstado = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  setDateInicio(date:string) {
    var pDia:string
    var pMes:string
    var pAnho:string
    var posicion:number
    var posicion2:number

    this.dtpFecIni = date;

    posicion=date.indexOf("/",1)
    posicion2=date.indexOf( "/",posicion+1)

    pMes=date.substring(0,posicion)
    pDia=date.substring(posicion+1, posicion2)
    pAnho=date.substring(posicion2+1)


    if(Number(pDia)<10 && Number(pMes)<10){
      this.pFechaInicio= `${pAnho}0${pMes}0${pDia}`.toString(); 
    }else if (Number(pDia)<10 ){
      this.pFechaInicio= `${pAnho}${pMes}0${pDia}`.toString(); 
    }else if (Number(pMes)<10){
      this.pFechaInicio= `${pAnho}0${pMes}${pDia}`.toString(); 
    }else{
      this.pFechaInicio= `${pAnho}${pMes}${pDia}`.toString();
    }

    if(typeof this.dtpFecFin == 'undefined'  || this.dtpFecFin==='' || this.pFechaInicio > this.pFechaFin){
      this.dtpFecFin = this.dtpFecIni;
    }
  }  

  setDateFin(date: string) {
    var pDia:string
    var pMes:string
    var pAnho:string
    var posicion:number
    var posicion2:number

    this.dtpFecFin = date;

    posicion=date.indexOf("/",1)
    posicion2=date.indexOf( "/",posicion+1)
    pMes=date.substring(0,posicion)
    pDia=date.substring(posicion+1, posicion2)
    pAnho=date.substring(posicion2+1)

    if(Number(pDia)<10 && Number(pMes)<10){
      this.pFechaFin= `${pAnho}0${pMes}0${pDia}`.toString(); 
    }else if (Number(pDia)<10 ){
      this.pFechaFin= `${pAnho}${pMes}0${pDia}`.toString(); 
    }else if (Number(pMes)<10){
      this.pFechaFin= `${pAnho}0${pMes}${pDia}`.toString(); 
    }else{
      this.pFechaFin= `${pAnho}${pMes}${pDia}`.toString();
    }

    if(typeof this.dtpFecIni == 'undefined'  || this.dtpFecIni==='' || this.pFechaInicio > this.pFechaFin){
      this.dtpFecIni = this.dtpFecFin;
    }
  }

}
