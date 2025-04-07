
import { Component, OnInit,ViewChild, Input, Output, OnChanges, SimpleChanges, ElementRef, Directive } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonModule, DatePipe } from '@angular/common';
import {NgbDateStruct, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';



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
import { DatabricksService } from 'src/app/shared/services/DatabricksService';


//  import { DBSQLClient } from '@databricks/sql';
//  import IDBSQLSession from '@databricks/sql/dist/contracts/IDBSQLSession';
//  import IOperation from '@databricks/sql/dist/contracts/IOperation';

const moment =_moment;


@Component({
  
  selector: 'app-portafolioIFDTiempoReal',
  templateUrl: './portafolioIFDTiempoReal.component.html',
  styleUrls: ['./portafolioIFDTiempoReal.component.scss']

  
})

export class portafolioIFDTiempoRealComponent implements OnInit {

  //positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  //position = new FormControl(this.positionOptions[0]);

  queryResult: any;
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
  public obtenerEstado:any;


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
    //,'t386_Scenary'
    ,'t386_BrokerRef'
    ,'t386_Ticker'
    ,'t386_UnderlyingType'
    ,'t386_DerivativeType'
    ,'t386_DerivativeSpec'
    //,'t386_DerivativeSubSpec'
    ,'t386_Caks'
    ,'t386_PriceStrike'
    // ,'t386_PriceBarrier'
    ,'t386_DateSettle'
    ,'t386_DateMaturity'
    //,'t386_DateSimulation'
    ,'t386_PriceAsset'
    ,'t386_Volatility'
    ,'t386_Rate'
    // ,'t386_DigitalPayment'
    // ,'t386_PremiumPaid'
    // ,'t386_PremiumToday'
    // ,'t386_Delta'
    // ,'t386_Gamma'
    // ,'t386_Vega'
    // ,'t386_Theta'
    // ,'t386_Rho'
    // ,'t386_Lambda'
    // ,'t386_DeltaCAK'
    // ,'t386_GammaCAK'
    // ,'t386_CashPaid'
    // ,'t386_CashToday'
    // ,'t386_CashVI'
    // ,'t386_CashNetToday'
    // ,'t386_IDStrategy'
    // ,'t386_Strategy'
    // ,'t386_ByPortfolio'
    // ,'t386_ByGroup'
    // ,'t386_ByPosition'
    // ,'t386_ByAgrupDelta'
    // ,'t386_ByTrimestre'
    // ,'t386_ByApertura'
    ,'t386_ContabilityType'
    ,'t386_HedgeType'
    ,'t386_Society'
    ,'t386_VolumeNetTM'
    //,'t386_VolumeMaxTM'
    //,'t386_Curva'
  ];


  dataSource: MatTableDataSource<ResultadoMetricaIFD>;
  selection = new SelectionModel<ResultadoMetricaIFD>(true, []);
  hidden = false;

  formGroup : FormGroup;
  selectedFile: any;
  message: string;
  public tableName: string;
  public tableData: any;
  token: string='dapi492bfcf262b376249cb041e3e87e96c3-3'
  http: HttpClient

  constructor(private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private databricksService: DatabricksService,
    ) {
    // this.alwaysShowCalendars = true;

  }
  public onFileSelected(event): void {
    this.selectedFile = event.target.files[0];
  }

  public upload(): void {
    this.databricksService.uploadFile(this.selectedFile).subscribe(
      () => this.message = 'File uploaded successfully',
      () => this.message = 'Error uploading file'
    );
  }

  public DataBricksExecuteSqlQuery(): void {

    var token           = "dapi4269b3ccefbf75b8213167633da920c7-3";
    var server_hostname = "adb-225310297235191.11.azuredatabricks.net";
    var http_path       = "/sql/1.0/warehouses/377759ae8dc269a1";

    const sqlQuery = 'SELECT * FROM tablafinalportafolio';
    this.databricksService.executeSqlQuery(sqlQuery).subscribe(
      
    async (response) => {
              console.log('Archivo descargado correctamente:', response);
              this.queryResult = response.result.data_array//JSON.stringify(response, null, 2);
              console.log('Archivo JSON:', this.queryResult);
              
        },
        (error) => {
              console.error('Error al descargar el archivo:', error);
              // Puedes manejar los errores aquí
            }
      );




      // const { DBSQLClient } = require('@databricks/sql');
      //  const client: DBSQLClient = new DBSQLClient();
     

// client.connect(
//   {
//     host:  server_hostname,
//     path:  http_path,
//     token: token
//   }).then(
//     async client => {
//       const session: IDBSQLSession = await client.openSession();

//       const queryOperation: IOperation = await session.executeStatement(
//         'SELECT * FROM default.diamonds LIMIT 2',
//         {
//           runAsync: true,
//           maxRows: 10000 // This option enables the direct results feature.
//         }
//       );

//       const result = await queryOperation.fetchAll({
//         progress: false,
//         callback: () => {},
//       });

//       await queryOperation.close();

//       console.table(result);

//       await session.close();
//       client.close();
// }).catch((error) => {
//   console.log(error);
// });

    // this.tableName="/FileStore/tables/ej2.json"
    // this.databricksService.getTable(this.tableName).subscribe(
    //   async (response) => {
    //        console.log('Archivo descargado correctamente:', response);
    //        //const fileData = new Uint8Array(response);
    //        const fileData=JSON.parse(atob(response.data))
    //        console.log('Archivo descifrado:', JSON.parse(fileData));
    //   },
    //   // (data) => 
    //   //   this.tableData = data,
    //   // () => 
    //   // this.tableData = 'Error getting table information'
    //   (error) => {
    //         console.error('Error al descargar el archivo:', error);
    //         // Puedes manejar los errores aquí
    //       }
    // );

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Authorization': 'Bearer dapi5b5288f9499f5172d04b03eec8b2224b-3', // Reemplaza <TOKEN_DE_ACCESO> con tu token de acceso a Databricks
    //     'Content-Type': 'application/octet-stream'
    //   }),
    //   responseType: 'arraybuffser'
    // };
    // // Define la URL del archivo de datos Parquet que deseas descargar
    // const fileUrl = 'https://adb-225310297235191.11.azuredatabricks.net/api/2.0/dbfs/read?path=file:/dbfs/tmp/delta_demo/parquet_file/input.parquet'; // Reemplaza <DOMINIO_DE_DATABRICKS> con la URL de la API de Databricks y <RUTA_DEL_ARCHIVO_PARQUET> con la ruta del archivo Parquet en Databricks

    // // Realiza la petición HTTP para descargar el archivo de datos Parquet desde Databricks
    // this.http.get(fileUrl,{headers:{
    //   'Authorization': 'Bearer dapi5b5288f9499f5172d04b03eec8b2224b-3', // Reemplaza <TOKEN_DE_ACCESO> con tu token de acceso a Databricks
    //   'Content-Type': 'application/octet-stream'
    // }})
    //   .subscribe(
    //     async (response) => {
    //       console.log('Archivo descargado correctamente:', response);

          // Crea un objeto de lectura de Parquet a partir del archivo descargado
          //const fileData = new Uint8Array(response);
          //const parquetReader = ParquetReader.openFile(fileData.buffer);
          //const cursor = parquetReader.getCursor();
          //let record = null;
          //while (record = await cursor.next()) {
            // Aquí puedes procesar cada registro del archivo de datos Parquet según tus necesidades
          //}
      //   },
      //   (error) => {
      //     console.error('Error al descargar el archivo:', error);
      //     // Puedes manejar los errores aquí
      //   }
      // );
    
    // axios.get('https://adb-225310297235191.11.azuredatabricks.net/api/2.0/dbfs/read?path=file:/dbfs/tmp/delta_demo/parquet_file/input.parquet', {
    //   headers: {
    //     'Authorization': 'Bearer ' + this.token,
    //     'Access-Control-Allow-Origin': '*',
    //     // 'Access-Control-Allow-Origin': 'http://127.0.0.1:8080'
        
    //   }
    // }).then(response => {
    //   console.log(response.data);
    // }).catch(error => {
    //   console.error('Error: '+error);
    // });

    // axios.get('https://adb-225310297235191.11.azuredatabricks.net/api/2.0/dbfs/read?path=/FileStore/tables/ej2.json', {
    //   headers: {
    //     'Authorization': 'Bearer ' + this.token,
    //     //'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Origin': 'http://localhost:4200'
        
    //   }
    // }).then(response => {
    //   console.log(response.data);
    // }).catch(error => {
    //   console.error('Error: '+error);
    // });

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
      //  this.obtenerEstado = setInterval(()=> { 
      //   this.getListaIFDMetricaRiesgo(),
      //  console.log("Ejecutado") }, 5 * 100); //8 min: 8x60 =480 -- se mide en segundo
    



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
      for (let i = 0; i <  this.listaIFDMetricasRiesgo.length; i++) {  

        if (this.listaIFDMetricasRiesgo[i].t386_Volatility!=0){
          this.listaIFDMetricasRiesgo[i].t386_Rate=((this.listaIFDMetricasRiesgo[i].t386_Volatility/this.listaIFDMetricasRiesgo[i].t386_PriceAsset)-1)*100
        }
      }

      
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
  //this.getListaIFDMetricaRiesgo()
  this.DataBricksExecuteSqlQuery();
  
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



}




