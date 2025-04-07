import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input, Output} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

import * as _moment from 'moment';
import { Moment} from 'moment';
import { BasesImpugnacionService } from 'src/app/models/Bases/BasesImpugnacion.service';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { BasesImpugnar } from 'src/app/models/Bases/basesImpugnar';
import { Mantenedor } from 'src/app/models/Bases/mantenedor';
import { MantenedorService } from 'src/app/models/Bases/mantenedor.service';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import { ArchivoImpugnacion } from 'src/app/models/Bases/archivoImpugnacion';
import { Impugnacion } from 'src/app/models/Bases/impugnacion';
import { TokenService } from 'src/app/shared/services/token.service';
import { AprobacionImpugnacion } from 'src/app/models/Bases/aprobacionImpugnacion';

const moment =_moment;

@Component({
  selector: 'app-registroImpugnacionBase',
  templateUrl: './registroImpugnacionBase.component.html',
  styleUrls: ['./registroImpugnacionBase.component.scss'] 
})

export class registroImpugnacionBaseComponent implements OnInit {

  selected = new FormControl(0);
  tabtitle:string = '';

  date1 = new FormControl(moment());

  public dialog: MatDialogModule;
  public indice:number;
  suscription: Subscription;
  public keypressed;
  private wasInside = false;
  public usuario: string='';
  public fecha:number;
  public idSubyacente: number;
  date: NgbDateStruct;
  checked: any = [];
  public listaSubyacente:CargarCombo[];
  public listaBaseImpugnar : BasesImpugnar [] = [];
  private auxListaBaseImpugn: BasesImpugnar [] = [];
  public pFecha:string="";
  public estadoRegistrarCampaign:boolean=false;
  public mesesContrato: string = "";
  public ultInsercionImpugn: number = 0;

  public estadoRegistroFO:boolean=false;
  public estadoMOValorizar:boolean=false;
  public estadoMOAprobacion:boolean=false;
  public estadoAdministrador:boolean=false;

  public dateInicio:any;
  chosenYearDate : Date;

  public fechasPermitidas;
  public diaLimiteVigencia: number;

  public listOrigenImpugnacion: CargarCombo[];
  public idOrigenImpugnacion: string;

  public archivosRestantes: number = 0;
  
  @ViewChild(MatSort) sort!: MatSort;  
  
  myModal=false;
  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();

  displayedColumns: string[] = [
     'temp_MonthContract'
     ,'temp_ASK'
     ,'temp_BID'
     ,'temp_MID'
     ,'temp_Impugnar'
     ,'temp_ApprovalStatus'
     ,'temp_OrigenImpugnacion'
     ,'temp_Valor'
    //  ,'temp_FechaTermino'
     ,'temp_UltValor'
     ,'temp_UltFechaTermino'
     ,'temp_SustentosAsociados'
  ];

  dataSource: MatTableDataSource<BasesImpugnar>;
  selection = new SelectionModel<BasesImpugnar>(true, []);
  hidden = false;

  formGroup : FormGroup;

  constructor(private baseImpugnarService: BasesImpugnacionService,
    private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
    private mantenedorService: MantenedorService,
    private blobService: AzureBlobStorageService,
    private tokenService: TokenService) {
  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  closeModal(){
    this.close.emit(false);
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

  contextMenuPosition = { x: '0px', y: '0px'};

  public titulo: string;

  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;

  @HostListener('click') 
  clickInside() { 
    this.wasInside = true;
  } 
  
  @HostListener('document:click') 
  clickout() {
    if (!this.wasInside) { 
      this.closeModal();
    } 
    this.wasInside = false;
    ; 
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.keypressed = event.keyCode;
    if (this.keypressed=27){
      console.log('tecla'+this.keypressed);
      this.closeModal();
    }
  }
  
  setDefaultValue(){
    this.formGroup.patchValue({
      itemCtrl : '1'
    })
  }

  @ViewChild('teamDropdown') teamDropdown: MatSelect;
  ngAfterViewInit() {
    if(this.teamDropdown !=undefined){
      setTimeout(() => {
        this.teamDropdown.options.first.select();
      });
    }
  }

  getformattedDate():number{
    this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    return Number(this.dateToString(this.date));
  }

  ngOnInit(): void {
    this.mantenedorService.getParametroXID(1).subscribe(
      (response: Mantenedor) => {
        this.diaLimiteVigencia = Number(response.t441_Value);
        this.fechasPermitidas = (d: Date | null): boolean => {
          const day = (d || new Date());
          const diaHoy = new Date();
          const sigMartes = new Date();
          sigMartes.setDate(diaHoy.getDate() + ((7 - diaHoy.getDay() + this.diaLimiteVigencia) % 7));
          day.setHours(0,0,0,0);
          diaHoy.setHours(0,0,0,0);
          sigMartes.setHours(0,0,0,0);
          return day >= diaHoy && day <= sigMartes;
        };
      }
    );

    this.fecha=this.getformattedDate();
    this.usuario=this.portafolioMoliendaIFDService.usuario;

    if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1){
      this.estadoAdministrador=true;
    }else if(  this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_IFD") > -1){
      this.estadoMOValorizar=true;
    }else if(this.portafolioMoliendaIFDService.perfiles.indexOf("MO_IFD_Aprobacion") > -1){
      this.estadoMOAprobacion=true;
    }else if (this.portafolioMoliendaIFDService.perfiles.indexOf("FO_IFD_RegistroOperacion") > -1 ){
        this.estadoRegistroFO = true;
    }
    //Registrar Límite
    if (this.estadoMOAprobacion || this.estadoAdministrador){
      this.estadoRegistrarCampaign=true;
    }
    else{this.estadoRegistrarCampaign=false;
    }

    this.visible=true;
    this.getListaSubyacenteBases();
    this.getListaOrigenImpugnacion();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterSQL(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  cerrar() {
    this.closeModal();
  }

  cerrarModal(e){
    this.myModal=false;
  }

  public getListaSubyacenteBases(): void {
    this.baseImpugnarService.getListaSubyacenteBases().subscribe(
      (response: CargarCombo[]) => {
        this.listaSubyacente = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getListaOrigenImpugnacion(): void {
    this.baseImpugnarService.getListaOrigenImpugnacion().subscribe(
      (response: CargarCombo[]) => {
        this.listOrigenImpugnacion = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date1.value;
    ctrlValue(normalizedYear);
    this.date1.setValue(ctrlValue);
    datepicker.close();
  }
  setDateInicio(date:string, e:any) {
    var pDia:string
    var pMes:string
    var pAnho:string
    var posicion:number
    var posicion2:number

    posicion=date.indexOf("/",1)
    posicion2=date.indexOf( "/",posicion+1)

    pMes=date.substring(0,posicion)
    pDia=date.substring(posicion+1, posicion2)
    pAnho=date.substring(posicion2+1)

    if(Number(pDia)<10 && Number(pMes)<10){
      this.pFecha= `${pAnho}/0${pMes}/0${pDia}`.toString(); 
      }else if (Number(pDia)<10 ){
      this.pFecha= `${pAnho}/${pMes}/0${pDia}`.toString(); 
      }else if (Number(pMes)<10){
      this.pFecha= `${pAnho}/0${pMes}/${pDia}`.toString(); 
      }else{
      this.pFecha= `${pAnho}/${pMes}/${pDia}`.toString();
      }
      e.temp_FechaTermino=this.pFecha;
  }

  getListaBasesImpugnar(fecha:number, subyacente:number){
    this.baseImpugnarService.getListaBasesImpugnar(fecha ,subyacente).subscribe(
    (response: BasesImpugnar[]) => {
      this.listaBaseImpugnar = response;
      this.dataSource = new MatTableDataSource(this.listaBaseImpugnar);
      this.selection = new SelectionModel<BasesImpugnar>(true, []);
      this.dataSource.sort = this.sort;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
  }

  selectedTabChange(event:any){
    this.checked = this.listaSubyacente.filter(i => i.s114_Descripcion.toString()==event.tab.textLabel.toString());
    this.idSubyacente = Number(this.checked[0].s114_Codigo);
    this.getListaBasesImpugnar(this.fecha, this.idSubyacente);
  }

  onSelectMID(element:any){
    if (element.temp_Valor!='' && element.temp_Valor!=0){
      element.temp_Impugnar=true;
      if ((element.temp_Valor != element.temp_ASK && element.temp_Valor != element.temp_BID) || element.temp_OrigenImpugnacion == "" || element.temp_OrigenImpugnacion == undefined){
        element.temp_OrigenImpugnacion = "1";
      }
      else if (element.temp_Valor == element.temp_ASK){
        element.temp_OrigenImpugnacion = "2";
      }
      else if (element.temp_Valor == element.temp_BID){
        element.temp_OrigenImpugnacion = "3";
      }
    }
    else{
      element.temp_Impugnar=false;
    }
    this.onChangeImpugnacion(element);
  }

  onChangeImpugnacion(element: any){
    if (element.temp_Impugnar){
      if(element.temp_OrigenImpugnacion == "" || element.temp_OrigenImpugnacion == undefined || (element.temp_Valor != element.temp_ASK && element.temp_Valor != element.temp_BID)){
        element.temp_OrigenImpugnacion = "1";
      }
    } else{
      this.accionEliminarIpugnacion(element);
    }
  }

  onChangeOrigenImpugnacion(element: any){
    switch(element.temp_OrigenImpugnacion){
      case "2":{
        element.temp_Valor = element.temp_ASK;
        element.temp_Impugnar=true;
        break;
      }
      case "3":{
        element.temp_Valor = element.temp_BID;
        element.temp_Impugnar=true;
        break;
      }
    }
  }

  accionEliminarIpugnacion(element: any){
    if((element.temp_Valor > 0 || element.temp_Valor < 0) && element.temp_ID_BaseImpugn){
      Swal.fire({
        icon: 'question',
        title: 'Eliminar impugnación',
        html: '¿Desea elmiminar esta impugnación?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        confirmButtonColor: '#4b822d'
      }).then((result) => {
        if (result.isConfirmed){
          let aprobacionImpugnacion: AprobacionImpugnacion = new AprobacionImpugnacion;
          aprobacionImpugnacion.t440_BasisImpugn = element.temp_ID_BaseImpugn;
          aprobacionImpugnacion.t440_Date = this.fecha;
          aprobacionImpugnacion.t440_User = this.tokenService.getUserName();
          aprobacionImpugnacion.t440_Approval = this.idSubyacente;//4: Cancelado //Se está enviando en este campo el subyacente para el envío de correo
          this.baseImpugnarService.desactivarImpugnacion(aprobacionImpugnacion).subscribe(
            data => {
              if (element.temp_SustentosAsociados){
                for (const archivo of element.temp_SustentosAsociados.split("/")){
                  this.archivosRestantes = 0;
                  this.quitarAsignacionArchivo(archivo, element.temp_ID_BaseImpugn);
                }
              }
              this.getListaBasesImpugnar(this.fecha, this.idSubyacente);

              this.baseImpugnarService.enviarCorreo(this.idSubyacente, 0, element.temp_MonthContract, this.fecha).subscribe(
                (response: void) => {
                }
              );
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        }
        else{
          element.temp_Impugnar=true;
        }
      });
    }
    else{
      element.temp_Valor = '';
      element.temp_FechaTermino = '';
      element.temp_UltValor = '';
      element.temp_UltFechaTermino = '';
      element.temp_SustentosAsociados = '';
      element.temp_OrigenImpugnacion = '';
    }
  }

  quitarAsignacionArchivo(nombreArchivo: string, baseImpugnada: number){
    let archivoImpugnacion: ArchivoImpugnacion = new ArchivoImpugnacion;    
    this.baseImpugnarService.getListaArchivosSustento().subscribe(
      (response: ArchivoImpugnacion[]) => {
        for (const item of response){
          if(item.t442_SupportFile.split("/").includes(nombreArchivo)){
            this.archivosRestantes++;
            if(item.t442_BasisImpugn == baseImpugnada){
              archivoImpugnacion = new ArchivoImpugnacion;
              archivoImpugnacion.t442_ID = 0; //El ID no se inserta, es autoincrmeental
              archivoImpugnacion.t442_BasisImpugn = baseImpugnada;
              archivoImpugnacion.t442_SupportFile = nombreArchivo;
              this.baseImpugnarService.eliminarArchivoImpugnacion(archivoImpugnacion).subscribe(
                (response: ArchivoImpugnacion) => {
                  archivoImpugnacion = response;
                  this.getListaBasesImpugnar(this.fecha, this.idSubyacente);
                }
              );
            }
          }
        }

        if(this.archivosRestantes <= 1){
          this.blobService.deleteFile(nombreArchivo, () => {
            console.log("se elimina el archivo");
            this.getListaBasesImpugnar(this.fecha, this.idSubyacente);
          });
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  eliminarArchivo(archivo: any, element: any){
    Swal.fire({
      icon: 'question',
      title: 'Eliminar archivo',
      html: '¿Desea elmiminar este archivo de sustento?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){
        this.archivosRestantes = 0;
        this.quitarAsignacionArchivo(archivo, element.temp_ID_BaseImpugn);
      }
    });
  }

  async validarSustentoImpugnacionNueva(idImpugnacion: number, auxListaBase: BasesImpugnar[], key: number){

    if(auxListaBase[key].temp_SustentosAsociados){
      for(const archivo of auxListaBase[key].temp_SustentosAsociados.split("/")){
        let archivoImpugnacion: ArchivoImpugnacion = new ArchivoImpugnacion;
        archivoImpugnacion = new ArchivoImpugnacion;
        archivoImpugnacion.t442_ID = 0; //El ID no se inserta, es autoincrmeental
        archivoImpugnacion.t442_BasisImpugn = idImpugnacion;
        archivoImpugnacion.t442_SupportFile = archivo;
        this.baseImpugnarService.guardarArchivoImpugnacion(archivoImpugnacion).subscribe(
          (response: ArchivoImpugnacion) => {
          archivoImpugnacion = response;
          }
        );
      }
    }
  }

  async insertarImpugnacionBD(impugnacion: Impugnacion, key: number){
    await this.baseImpugnarService.guardarImpugnacion(impugnacion).subscribe(
      async (response: Impugnacion) => {
        impugnacion = response;
        let auxListaBase = this.listaBaseImpugnar;
        await this.baseImpugnarService.getListaBasesImpugnar(this.fecha, this.idSubyacente).subscribe(
          (response: BasesImpugnar[]) => {
            this.validarSustentoImpugnacionNueva(response[key].temp_ID_BaseImpugn, auxListaBase, key);
            let aprobacionImpugnacion: AprobacionImpugnacion = new AprobacionImpugnacion;
            aprobacionImpugnacion.t440_BasisImpugn = response[key].temp_ID_BaseImpugn;
            aprobacionImpugnacion.t440_Date = this.fecha;
            aprobacionImpugnacion.t440_User = this.tokenService.getUserName();
            aprobacionImpugnacion.t440_Approval = 3;//Por aprobar
            this.baseImpugnarService.guardarAprobacionImpugnacion(aprobacionImpugnacion).subscribe(
              (response: AprobacionImpugnacion) => {
                aprobacionImpugnacion = response;
                this.getListaBasesImpugnar(this.fecha, this.idSubyacente);
                if(key == this.ultInsercionImpugn){
                  this.enviarCorreoInsercion();
                }
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
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  async desactivarImpugnacionPreviaBD(item: BasesImpugnar, impugnacion: Impugnacion, key: number){
    let aprobacionImpugnacion: AprobacionImpugnacion = new AprobacionImpugnacion;
    aprobacionImpugnacion.t440_BasisImpugn = item.temp_ID_BaseImpugn;
    aprobacionImpugnacion.t440_Date = this.fecha;
    aprobacionImpugnacion.t440_User = this.tokenService.getUserName();
    aprobacionImpugnacion.t440_Approval = 4;//Cancelar
    this.baseImpugnarService.desactivarImpugnacion(aprobacionImpugnacion).subscribe(
      data => {
        this.insertarImpugnacionBD(impugnacion, key);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  async guardarImpugnacion(){
    this.mesesContrato = "";
    let impugnacion: Impugnacion;
    
    this.baseImpugnarService.getListaBasesImpugnar(this.fecha, this.idSubyacente).subscribe(
      async (response: BasesImpugnar[]) => {
        this.auxListaBaseImpugn = response;
        this.ultInsercionImpugn = -1;
        let flgDatosIncompletos: boolean = false;

        for (const [key, item] of this.listaBaseImpugnar.entries()) {
          //cumple las condiciones para ser insertado
          //si ya existe en la BD con los mismos valores, no se inserta
          // if (item.temp_Impugnar && item.temp_Valor != undefined && item.temp_Valor != 0 && item.temp_FechaTermino != undefined
          if (item.temp_Impugnar && item.temp_Valor != undefined && item.temp_Valor != 0
            && (JSON.stringify(item) != JSON.stringify(this.auxListaBaseImpugn[key]))) {
              this.ultInsercionImpugn = key;

              impugnacion = new Impugnacion;
              impugnacion.t439_ID = 0; ////El ID no se inserta, es autoincrmeental
              impugnacion.t439_Date = this.fecha;
              impugnacion.t439_UnderlyingClassification = this.idSubyacente;
              impugnacion.t439_MonthContract = item.temp_ID_MonthContract;
              // impugnacion.t439_EffectiveDate = Number(item.temp_FechaTermino.toString().replace("/", "").replace("/", ""));
              impugnacion.t439_EffectiveDate = this.fecha;
              impugnacion.t439_User = this.tokenService.getUserName();
              impugnacion.t439_Status = true;
              impugnacion.t439_OriginImpugn = Number(item.temp_OrigenImpugnacion);
  
              impugnacion.t439_Before = item.temp_MID;
              impugnacion.t439_Now = item.temp_Valor;
  
              this.mesesContrato = this.mesesContrato + item.temp_MonthContract + "; ";
  
              if (item.temp_ID_BaseImpugn != undefined) {
                await this.desactivarImpugnacionPreviaBD(item, impugnacion, key);
              }
              else {
                await this.insertarImpugnacionBD(impugnacion, key);
              }
          }

          // if (item.temp_Impugnar && (item.temp_Valor != undefined || item.temp_Valor != 0 || item.temp_FechaTermino != undefined)
          if (item.temp_Impugnar && (item.temp_Valor != undefined || item.temp_Valor != 0)
            && (JSON.stringify(item) != JSON.stringify(this.auxListaBaseImpugn[key]))) {
              flgDatosIncompletos = true;
          }
        }

        if(this.ultInsercionImpugn == -1){
          if(flgDatosIncompletos){
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'No se completaron todos los datos',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
            });
          }
          else{
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'No se encontraron datos para registrar.',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
            });
          }
        }

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  async enviarCorreoInsercion(){
    if (this.mesesContrato != "") {
      if (this.mesesContrato.slice(-2) == "; ") {
        this.mesesContrato = this.mesesContrato.slice(0, -2);
      }
      this.baseImpugnarService.enviarCorreo(this.idSubyacente, 1, this.mesesContrato, this.fecha).subscribe(
        (response: void) => {
          this.getListaBasesImpugnar(this.fecha, this.idSubyacente);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'La impugnación fue registrada con éxito.',
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#4b822d'
          });
        }
      );
    }
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
}
