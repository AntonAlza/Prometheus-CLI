import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { Item } from 'angular2-multiselect-dropdown';
import { DetalleIFDFret } from 'src/app/models/Fret/DetalleIFDFret';
import { FretService } from 'src/app/models/Fret/fret.service';
import { FretRealTimeService } from 'src/app/shared/services/FretRealTimeService';
import { Subject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConsultaIFDsFret } from 'src/app/models/Fret/ConsultaIFDsFret';

@Component({
  selector: 'app-detalle-fret',
  templateUrl: './detalle-fret.component.html',
  styleUrls: ['./detalle-fret.component.scss']
})
export class DetalleFretComponent implements OnInit, OnDestroy {

  public dialog: MatDialogModule;
  public listaDetalleIFD: DetalleIFDFret[] = [];
  

  date: NgbDateStruct;

  private _refresh$= new Subject<void>();
  suscription: Subscription;


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('MatPaginatorSQL', { static: true }) MatPaginatorSQL!: MatPaginator;
  @ViewChild('MatSortSQLFinal') MatSortSQLFinal!: MatSort;

  myModal=false;  
  

  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();
  
  //public  visible: boolean;

  displayedColumnsAsociarSQL: string[] =[]
  checked: any = [];

 
  flgResponsePrecioDetalle: boolean = true;
  flgResponseMTMDetalle: boolean = true;
 

    @ViewChildren('checkBox') checkBox: QueryList<any>;
    
  
    dataSourceSQLFinal: MatTableDataSource<DetalleIFDFret>;
    selectionSQLFinal = new SelectionModel<DetalleIFDFret>(true, []);
    hiddenSQLFinal = false;


  constructor(private modalService: NgbModal, private fretService: FretService, 
    public dialogRef: MatDialogRef<DetalleFretComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fretRealTimeService: FretRealTimeService) {
    // this.alwaysShowCalendars = true;

  }

  ngOnDestroy(): void {
    this.fretRealTimeService.flgReconeccionAutomatica = false;
    clearInterval(this.obtenerPrecioDetalle);
    clearInterval(this.obtenerValorMTM);
    this.fretRealTimeService.closeConnection();
  }

  get item(): ConsultaIFDsFret {
    return this.data.dato1;
  }
  
  get tipoIFD(): string {
    return this.data.dato2;
  }


  isAllSelectedSQLFinal() {
    const numSelected = this.selectionSQLFinal.selected.length;
    const numRows = this.dataSourceSQLFinal.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleSQLFinal() {
    this.isAllSelectedSQLFinal() ?
        this.selectionSQLFinal.clear() :
        this.dataSourceSQLFinal.data.forEach(row => this.selectionSQLFinal.select(row));
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
  public obtenerValorMTM:any;
  public obtenerPrecioDetalle:any;

  opciones(event: MouseEvent, item: Item) {

    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    // this.modalService.open(this.contextMenu ,{ scrollable: true,size: 'lg'});
    this.contextMenu.openMenu();
  }

  

 getformattedDate():number{
  this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
  return Number(this.dateToString(this.date));
}
  
  // ngOnDestroy() {
    //   clearInterval(this.obtenerEstado);
    // }
  
  ngOnInit(): void {
    
       this.getDetalleIFD(); 

      //  this.fretRealTimeService.initWebSocket();

       this.fretRealTimeService.getMessages().subscribe(message => {
        console.log('Mensaje recibido en el componente Hijoooo:', message);
        message = "{" + message + "}"
        const data = JSON.parse(message);

        if(this.listaDetalleIFD != undefined ){
              // if(){
                console.log(this.listaDetalleIFD);
                this.listaDetalleIFD.forEach(objDestino => {
                  if (objDestino["v001_Contrato"] == data.ticker.replace(/\s/g, '')) {
                    objDestino["precioAnterior"] = objDestino["v001_PrecioProveedor"];
                    objDestino["v001_PrecioProveedor"] = data.precio;  
                }
              }); 
              
              this.dataSourceSQLFinal = new MatTableDataSource(this.listaDetalleIFD);
              this.dataSourceSQLFinal.paginator = this.MatPaginatorSQL;
              this.dataSourceSQLFinal.sort = this.sort;
          }
      });
    //   this.obtenerPrecioDetalle = setInterval(()=> { 
    //     if(this.flgResponsePrecioDetalle){
    //       this.flgResponsePrecioDetalle = false;
    //       this.ExecuteSqlQueryDatabricks()
    //     }
    // }, 2 * 1000);
       
    //    this.obtenerValorMTM = setInterval(()=> { 
    //     if(this.flgResponseMTMDetalle){
    //       this.flgResponseMTMDetalle = false;
    //       this.ExecuteSqlQueryDatabricks_MTM()
    //     }
        
    //    }, 5 * 1000);
  }

  public ExecuteSqlQueryDatabricks(): void {

    // this.fretRealTimeService.executePxLive().subscribe(
    // async (response) => {
    //           //arrListaConsultaIFD
    //           if(this.listaDetalleIFD != undefined){
    //             this.listaDetalleIFD.forEach(objDestino => {
    //               const objOrigen = response.find(obj => obj["Ticker"] === objDestino["v001_Contrato"].toString());
    //               if (objOrigen) {
    //                   objDestino["v001_PrecioProveedor"] = objOrigen["PrecioActual"];
    //                   objDestino["precioAnterior"] = objOrigen["PrecioAnterior"];
    //               }
    //             });

    //             this.dataSourceSQLFinal = new MatTableDataSource(this.listaDetalleIFD);
    //             this.dataSourceSQLFinal.paginator = this.MatPaginatorSQL;
    //             this.dataSourceSQLFinal.sort = this.sort;


    //           }
    //           this.flgResponsePrecioDetalle = true;                
    //       },
    //       (error) => {
    //             console.error('Error al descargar el archivo:', error);
    //             this.flgResponsePrecioDetalle = true;
    //       }
    //     );

    this.fretService.obtenerPrecios().subscribe(
          (response) => {
            if(this.listaDetalleIFD != undefined ){
              // if(){
                console.log(this.listaDetalleIFD);
                this.listaDetalleIFD.forEach(objDestino => {
                  const objOrigen = response.find(obj => obj.ticker === objDestino["v001_Contrato"]);
                  if (objOrigen) {
                    objDestino["v001_PrecioProveedor"] = objOrigen["precioActual"].toString();
                    objDestino["precioAnterior"] = objOrigen["precioAnterior"].toString();
                }
              }); 
              
              this.dataSourceSQLFinal = new MatTableDataSource(this.listaDetalleIFD);
              this.dataSourceSQLFinal.paginator = this.MatPaginatorSQL;
              this.dataSourceSQLFinal.sort = this.sort;
            }
            this.flgResponsePrecioDetalle = true;            
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
            this.flgResponsePrecioDetalle = true; 
          });
  }


  public ExecuteSqlQueryDatabricks_MTM(): void {

    this.fretService.obtenerListaMTM().subscribe(
      (response) => {
        if(this.listaDetalleIFD != undefined ){
          // if(){
            console.log(this.listaDetalleIFD);
            this.listaDetalleIFD.forEach(objDestino => {
              const objOrigen = response.find(obj => obj["idsql"].toString() === objDestino["v001_Operacion"].toString());
                  if (objOrigen) {
                      objDestino["v001_M2M"] = objOrigen["cashnettoday"].toString();
                  }
          }); 
          
          this.dataSourceSQLFinal = new MatTableDataSource(this.listaDetalleIFD);
          this.dataSourceSQLFinal.paginator = this.MatPaginatorSQL;
          this.dataSourceSQLFinal.sort = this.sort;
        }
        this.flgResponseMTMDetalle = true;            
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.flgResponseMTMDetalle = true; 
      });

  }


applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceSQLFinal.filter = filterValue.trim().toLowerCase();
}


private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }

  }
  
  JoinAndClose() {
    this.modalReference.close();
  }
   
  open(content: any, options?: NgbModalOptions) {
    
    this.modalReference = this.modalService.open(content);
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    
    
      
  }

  cerrar() {
    console.log("modal cerrado asociar");
    this.dialogRef.close();
    this.close.emit(false);  

  }
  
  getColor(valor1:any , valor2:any):any {
    if (Number(valor1) > Number(valor2)) {
      //return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
      return { backgroundColor: 'rgba(0, 100, 0, 0.8)', color: 'white', transition: 'background-color 1s' }; // Cambia el color a verde si valor1 es mayor que valor2

    } else if (Number(valor1) < Number(valor2)) {
      //return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
      return { backgroundColor: ' rgb(200, 0, 30,0.8)', color: 'white', transition: 'background-color 1s' }; // Cambia el color a verde si valor1 es mayor que valor2

    }else {
      return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
    }
  }
  

  public getDetalleIFD(): void {

    let codTipoIFD:number
    //Liquidado
    if (this.tipoIFD=='Liquidadas'){
      codTipoIFD=0
      this.displayedColumnsAsociarSQL= [
        'v001_Fecha'
        ,'v001_BrokerReferencia'
        ,'v001_Operacion'
        //,'v001_CodEstrategia'
        ,'v001_Ficha'
        ,'v001_Sociedad'
        ,'v001_Contrato'
        ,'v001_FechaExpiracion'
        ,'v001_Cobertura'
        ,'v001_NumeroContratos'
        //,'v001_Delta'
        ,'v001_Strike'
        ,'v001_Ifd'
        ,'v001_Estrategia'
        ,'v001_PrimaPagada'
        ,'v001_PrecioProveedor'
        ,'v001_M2M'
        //,'v001_Comentarios'
      ]
    }
    //Abierto
    else{
      codTipoIFD=1
      
      this.displayedColumnsAsociarSQL= [
        'v001_Fecha'
        ,'v001_BrokerReferencia'
        ,'v001_Operacion'
        //,'v001_CodEstrategia'
        ,'v001_Ficha'
        ,'v001_Sociedad'
        ,'v001_Contrato'
        ,'v001_FechaExpiracion'
        ,'v001_Cobertura'
        ,'v001_NumeroContratos'
        ,'v001_Delta'
        ,'v001_Strike'
        ,'v001_Ifd'
        ,'v001_Estrategia'
        ,'v001_PrimaPagada'
        
        ,'v001_PrecioProveedor'
        ,'v001_M2M'
        //,'v001_Comentarios'
      ]
    }
   
    this.fretService.getDetalleIFD(this.item.s303_GroupOptions, codTipoIFD).subscribe(
      (response: DetalleIFDFret[]) => {
        this.listaDetalleIFD = response
        let data
        if(this.fretRealTimeService.resultadoValorizacion != undefined){
          data = JSON.parse(this.fretRealTimeService.resultadoValorizacion);
        }
        

        if(this.listaDetalleIFD != undefined ){
          // if(){
            console.log(this.listaDetalleIFD);
            this.listaDetalleIFD.forEach(objDestino => {

              if(this.item["precioActual"] != undefined){
                objDestino["v001_PrecioProveedor"] = this.item["precioActual"].toString();  
              }
              

              if(this.fretRealTimeService.resultadoValorizacion != undefined){
                const objOrigen = data.find(obj => obj["idsql"].toString() === objDestino["v001_Operacion"].toString());

                if (objOrigen) {
                    objDestino["v001_M2M"] = objOrigen["cashnettoday"].toString();
                    objDestino["v001_Delta"] = objOrigen["deltacak"].toString();
                }
              }
              
          }); 
          
          this.dataSourceSQLFinal = new MatTableDataSource(this.listaDetalleIFD);
          this.dataSourceSQLFinal.paginator = this.MatPaginatorSQL;
          this.dataSourceSQLFinal.sort = this.sort;
        }

        this.dataSourceSQLFinal = new MatTableDataSource(this.listaDetalleIFD);
        this.dataSourceSQLFinal.paginator = this.MatPaginatorSQL;
        this.dataSourceSQLFinal.sort = this.sort;

        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

  }


}
