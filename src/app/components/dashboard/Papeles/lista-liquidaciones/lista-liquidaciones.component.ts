import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { LoadingService } from 'src/app/components/loading.service';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { listaLiquidaciones } from 'src/app/models/Papeles/listaLiquidaciones';
import { objCancelarPapel } from 'src/app/models/Papeles/objCancelarPapel';
import { PaperClearance } from 'src/app/models/Papeles/PaperClearance';
import { gestionPapelesService } from 'src/app/shared/services/gestion-papeles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-liquidaciones',
  templateUrl: './lista-liquidaciones.component.html',
  styleUrls: ['./lista-liquidaciones.component.scss']
})
export class ListaLiquidacionesComponent implements OnInit {

  @Output () closeListaLiquidaciones: EventEmitter<boolean>= new EventEmitter();
  @Output () closemodificarliquidacion: EventEmitter<boolean>= new EventEmitter();
  public loading$= this.loader.loading$
  @Input() listaLquidacionesHijo: listaLiquidaciones[];
  public listaLiquidacionesDS: MatTableDataSource<listaLiquidaciones>;
  public objmodificarliquipapel:PaperClearance=new PaperClearance();
  private modalRef: NgbModalRef;
  @Input() subyacenteSelected: number;
  @Input() sociedadSelected: number;
  @Output() papelGuardado: EventEmitter<void> = new EventEmitter<void>(); 

  columnsLista: string[] = [
    'opciones',
    's136_Papel'
    ,'s136_FechaPapel'
    ,'s136_OperacionPapel'
    ,'s136_ContrapartePapel'
    ,'s136_ContratoExternoPapel'
    ,'s136_OrigenPapel'
    ,'s136_DesdePapel'
    ,'s136_HastaPapel'
    ,'s136_PrecioPapel'
    ,'s136_ContratoFuturoPapel'
    ,'s136_Campagna'
    ,'s136_Codigo'
    ,'s136_CompraVenta'
    ,'s136_ContratoExterno'
    ,'s136_Fecha'
    ,'s136_TM'
    ,'s136_Precio'
    ,'s136_PnL'
    ,'s136_Comentarios'
  ];

  constructor(private modalService: NgbModal,
              private loader:LoadingService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private gestionPapelesservicio: gestionPapelesService,) { }

  ngOnInit(): void {
    this.listaLiquidacionesDS = new MatTableDataSource(this.listaLquidacionesHijo);
  }

  cerrarListaLiquidaciones(){
    this.closeListaLiquidaciones.emit(false); 
  }
  cerrarMOdificarLiquidarPapel(){
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
  
  @ViewChild(MatMenuTrigger)
  contextmenu!: MatMenuTrigger;
  
  onContextMenu(event: MouseEvent, item: Item) {
    event.preventDefault();
    this.contextmenu.menuData = { 'item': item };
    this.contextmenu.menu.focusFirstItem('mouse');
  }

  cancelarLiquidacion(){
    let objCancelar: objCancelarPapel = new objCancelarPapel(); 
    objCancelar.idPapel = this.contextmenu.menuData.item;
    console.log(objCancelar.idPapel)
    objCancelar.usuarioCancela = this.portafolioMoliendaIFDService.usuario;
    const unicoPapel = Number(this.listaLquidacionesHijo[0].s136_Papel)
    console.log(unicoPapel)
    Swal.fire({
      icon: 'question',
      title: 'Cancelar Liquidación',
      html: '¿Está seguro que desea cancelar Liquidación '+ objCancelar.idPapel.toString() +'?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){
        this.gestionPapelesservicio.cancelarLiquidacionPapel(objCancelar).subscribe(
          data=>{       
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se canceló correctamente la Liquidación ' + objCancelar.idPapel.toString() ,
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                container: 'my-swal',
              }
            });
            // this.gestionPapeles._send(this.sociedadSelected,this.subyacenteSelected) ;
            this.papelGuardado.emit();
            this.gestionPapelesservicio.obtenerLiquidaciones(unicoPapel).subscribe((response:listaLiquidaciones[])=>{this.listaLquidacionesHijo=response;this.listaLiquidacionesDS = new MatTableDataSource(this.listaLquidacionesHijo);})
          });
      }
    });


  }
  codigomod: number;
  papelmod: number;
  fechamodliqui: NgbDateStruct;
  operacionmod: string;
  contratoextmod: string;
  toneladamod: number;
  preciomod: number;
  profitmod: number;
  comenmod: string;
  costomod:number;
  sellbuymod:number;
  modificarLiquidacion(modificarLiquidacionForm: any){
    const codigopapelliquidado =this.contextmenu.menuData.item;
    const objetofiltrado=this.listaLquidacionesHijo.filter((item)=>{return item.s136_Codigo===codigopapelliquidado})
    this.codigomod = objetofiltrado[0].s136_Codigo;
    this.papelmod = objetofiltrado[0].s136_Papel;
    this.fechamodliqui =this.convertirAFechaStruct(objetofiltrado[0].s136_Fecha);
    this.operacionmod = objetofiltrado[0].s136_CompraVenta;
    this.contratoextmod = objetofiltrado[0].s136_ContratoExterno;
    this.toneladamod = objetofiltrado[0].s136_TM;
    this.preciomod = objetofiltrado[0].s136_Precio;
    this.profitmod = objetofiltrado[0].s136_PnL;
    this.comenmod = objetofiltrado[0].s136_Comentarios;
    this.costomod = objetofiltrado[0].s136_PrecioPapel;
    if(objetofiltrado[0].s136_CompraVenta=="Compra"){this.sellbuymod=1}else{this.sellbuymod=2}


    this.modalRef=this.modalService.open(modificarLiquidacionForm,{windowClass : "modificarLiquidacion",centered: true,backdrop : 'static',keyboard : false});
  }
  convertirAFechaStruct(fecha: string): NgbDateStruct {
    const date = new Date(fecha);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // Los meses en JavaScript son 0-based
      day: date.getDate()
    };
  }
  convertirFechaAFormatoYYYYMMDD(fecha: NgbDateStruct): string {
    const year = fecha.year.toString();
    const month = ('0' + fecha.month).slice(-2); // Añade un 0 si el mes tiene solo un dígito
    const day = ('0' + fecha.day).slice(-2); // Añade un 0 si el día tiene solo un dígito
    return `${year}${month}${day}`;
  }
  registrarmodificacionliquidarPapel(){
    const fechaActual = new Date();
    const fechaFormateada = convertirFecha(fechaActual);
    this.objmodificarliquipapel.t275_ID=this.codigomod
    this.objmodificarliquipapel.t275_Paper=this.papelmod
    this.objmodificarliquipapel.t275_SellBuy=this.sellbuymod
    this.objmodificarliquipapel.t275_Date=parseInt(this.convertirFechaAFormatoYYYYMMDD(this.fechamodliqui))
    this.objmodificarliquipapel.t275_RegisteredBy=this.portafolioMoliendaIFDService.usuario
    this.objmodificarliquipapel.t275_ExternalContract=this.contratoextmod
    this.objmodificarliquipapel.t275_MetricTons=this.toneladamod
    this.objmodificarliquipapel.t275_CostPrice=this.costomod
    this.objmodificarliquipapel.t275_Value=this.preciomod
    this.objmodificarliquipapel.t275_ProfitOrLoss=this.profitmod
    this.objmodificarliquipapel.t275_Status=1
    this.objmodificarliquipapel.t275_RegistrationDate=parseInt(fechaFormateada)
    this.objmodificarliquipapel.t275_Comments=this.comenmod

    // Aquí puedes hacer una llamada al backend o lo que necesites hacer con los valores.
    console.log( this.objmodificarliquipapel);
    this.gestionPapelesservicio.modificarLiquiPapel(this.objmodificarliquipapel).subscribe((data)=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se modificó la liquidación ' + this.codigomod ,
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'my-swal',
        }
      });
      // this.gestionPapeles._send(this.sociedadSelected,this.subyacenteSelected);
      this.papelGuardado.emit();
      this.gestionPapelesservicio.obtenerLiquidaciones(this.papelmod).subscribe((response:listaLiquidaciones[])=>{this.listaLquidacionesHijo=response;this.listaLiquidacionesDS = new MatTableDataSource(this.listaLquidacionesHijo);})
    })
  }

  applyFilterListaLiquidaciones(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaLiquidacionesDS.filter = filterValue.trim().toLowerCase();
  }

  modalLiquidarPapel(modificarLiquidacionForm: any){

    this.modalService.open(modificarLiquidacionForm,{windowClass : "modalLiquidarPapel",centered: true,backdrop : 'static',keyboard : false});
  }

}
function convertirFecha(fecha: Date): string {
  const year = fecha.getFullYear().toString();
  const month = ('0' + (fecha.getMonth() + 1)).slice(-2); // getMonth() es 0-based
  const day = ('0' + fecha.getDate()).slice(-2); // Añade un 0 si el día tiene solo un dígito
  return `${year}${month}${day}`;
}
