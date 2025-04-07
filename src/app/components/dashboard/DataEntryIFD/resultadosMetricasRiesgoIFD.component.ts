import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input, Output, OnChanges, SimpleChanges, ElementRef, Directive } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonModule, DatePipe } from '@angular/common';
import {NgbDateStruct, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import { ViewChildren, QueryList } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { AsociarSQL } from 'src/app/models/IFD/asociarSQL';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { number } from 'echarts';
import { HostListener } from '@angular/core';
import { TypeOperation } from 'src/app/models/IFD/TypeOperation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import { PlanningByCampaign } from 'src/app/models/IFD/planningByCampaign';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

import {MatTooltipModule} from '@angular/material/tooltip';





//import * as moment from 'moment';
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
import { format } from 'date-fns'
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment} from 'moment';
import { Campaign } from 'src/app/models/IFD/campaign';
import { AprobarEstrategia } from 'src/app/models/IFD/aprobarEstrategia';
import { Descripcion } from 'src/app/models/IFD/descripcion';
import { AprobarEstrategia_Estado } from 'src/app/models/IFD/aprobar_estrategia_estado';
import { ResultadoMetricaIFD } from 'src/app/models/IFD/resultadoMetricaRiesgo';



const moment =_moment;


@Component({
  
  selector: 'app-resultadosMetricasRiesgoIFD',
  templateUrl: './resultadosMetricasRiesgoIFD.component.html',
  styleUrls: ['./resultadosMetricasRiesgoIFD.component.scss']

  
})

export class resultadosMetricasRiesgoIFDComponent implements OnInit {

  //positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  //position = new FormControl(this.positionOptions[0]);


  date1 = new FormControl(moment());

  public dialog: MatDialogModule;
  private _refresh$= new Subject<void>();
  public indice:number;
  suscription: Subscription;
  public keypressed;
  private wasInside = false;
  public usuario: string;
  public fecha:number;
  date: NgbDateStruct;
  checked: any = [];  


  public listaEstado:CargarCombo[];
  public idEstado:string;
  public rolUsuario:number;
  public rolesUsuario:CargarCombo[];
  public listaAprobarOperacion: AprobarEstrategia []=[];
  public listaIFDMetricasRiesgo: ResultadoMetricaIFD[]=[];
  public campaign: Campaign;
  public pFechaInicio:string="";
  public pFechaFin:string="";
  public pFechaReporte:string="";
  public pAnho:string="";
  public datePipe: DatePipe;

  chosenYearDate : Date;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  
  
  myModal=false;
  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();

  //public  visible: boolean;

  displayedColumns: string[] = [
    't386_Date'
    ,'t386_Operation'
    ,'t386_Scenary'
    ,'t386_BrokerRef'
    ,'t386_Ticker'
    ,'t386_UnderlyingType'
    ,'t386_DerivativeType'
    ,'t386_DerivativeSpec'
    ,'t386_DerivativeSubSpec'
    ,'t386_Caks'
    ,'t386_PriceStrike'
    ,'t386_PriceBarrier'
    ,'t386_DateSettle'
    ,'t386_DateMaturity'
    ,'t386_DateSimulation'
    ,'t386_PriceAsset'
    ,'t386_Volatility'
    ,'t386_Rate'
    ,'t386_DigitalPayment'
    ,'t386_PremiumPaid'
    ,'t386_PremiumToday'
    ,'t386_Delta'
    ,'t386_Gamma'
    ,'t386_Vega'
    ,'t386_Theta'
    ,'t386_Rho'
    ,'t386_Lambda'
    ,'t386_DeltaCAK'
    ,'t386_GammaCAK'
    ,'t386_CashPaid'
    ,'t386_CashToday'
    ,'t386_CashVI'
    ,'t386_CashNetToday'
    ,'t386_IDStrategy'
    ,'t386_Strategy'
    ,'t386_ByPortfolio'
    ,'t386_ByGroup'
    ,'t386_ByPosition'
    ,'t386_ByAgrupDelta'
    ,'t386_ByTrimestre'
    ,'t386_ByApertura'
    ,'t386_ContabilityType'
    ,'t386_HedgeType'
    ,'t386_Society'
    ,'t386_VolumeNetTM'
    ,'t386_VolumeMaxTM'
    ,'t386_Curva'
  ];


  dataSource: MatTableDataSource<ResultadoMetricaIFD>;
  selection = new SelectionModel<ResultadoMetricaIFD>(true, []);
  hidden = false;

  formGroup : FormGroup;

  constructor(private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    // this.alwaysShowCalendars = true;

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
    //console.log("Emite cerrado");
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
    //console.log('clic dentro de modal'); 
  } 
  
  @HostListener('document:click') 
  clickout() {
    if (!this.wasInside) { 
      //console.log('clic fuera de modal');
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
      //this.close.emit(true);
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
      
      this.usuario=this.portafolioMoliendaIFDService.usuario;
      this.visible=true;
      this.paginator._intl.itemsPerPageLabel="Registros por Página";
      const a = new Date();
      this.date1 = new FormControl(a);
      this.pFechaReporte=this.dateToString( { day: a.getDate(), month: a.getMonth()+1 , year: a.getFullYear()});
      this.getListaIFDMetricaRiesgo();
      
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}


applyFilterSQL(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  //this.dataSourceSQL.filter = filterValue.trim().toLowerCase();
}

  cerrar() {
    //this.modalReference.close();
    this.closeModal();
    this.modalService.dismissAll();
  }


  cerrarModal(e){
    console.log("modal hijo cerrado asociar");
    this.myModal=false;
    //this.getListaCampaign()
    this.getListaIFDMetricaRiesgo()
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
  
public getListaIFDMetricaRiesgo(): void {

    if (typeof this.pFechaReporte == 'undefined' || this.pFechaReporte==='' ) {
      this.pFechaReporte=this.fecha.toString();
    }
    this.portafolioMoliendaIFDService.getListaIFDMetricaRiesgo(Number(this.pFechaReporte)).subscribe(
    (response: ResultadoMetricaIFD[]) => {
      this.listaIFDMetricasRiesgo = response;
      this.dataSource = new MatTableDataSource(this.listaIFDMetricasRiesgo);

      this.selection = new SelectionModel<ResultadoMetricaIFD>(true, []);
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
    );
}

chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
   const ctrlValue = this.date1.value;
  // const fecha=  String(normalizedYear)
  // this.date1.setValue(normalizedYear)
  // fecha.substring(10,14)

  

  
  ctrlValue(normalizedYear);
  
  this.date1.setValue(ctrlValue);
  datepicker.close();
  

}

BuscarReporteMetricaIFD(){
  this.getListaIFDMetricaRiesgo()
  
}

    setDateReporte(date: string) {
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
        this.pFechaReporte= `${pAnho}0${pMes}0${pDia}`.toString(); 
       }else if (Number(pDia)<10 ){
        this.pFechaReporte= `${pAnho}${pMes}0${pDia}`.toString(); 
       }else if (Number(pMes)<10){
        this.pFechaReporte= `${pAnho}0${pMes}${pDia}`.toString(); 
       }else{
        this.pFechaReporte= `${pAnho}${pMes}${pDia}`.toString();
       }
    }  


    descargarPDF(){
      // Opción 1: Si el PDF está en assets
      const pdfUrl = 'assets/archivos/PL - Prices.pdf';
      
      
      // Crear un elemento <a> invisible
      const link = document.createElement('a');
      link.href = pdfUrl;
      
      // Establecer el nombre del archivo que tendrá la descarga
      link.download = 'PL - Prices.pdf';
      
      // Agregar el elemento al DOM
      document.body.appendChild(link);
      
      // Simular click en el enlace para iniciar la descarga
      link.click();
      
      // Eliminar el elemento del DOM
      document.body.removeChild(link);

    }



}




