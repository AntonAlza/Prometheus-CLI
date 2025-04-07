import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { Observable } from 'rxjs';
import { ReportePapelesTipo } from 'src/app/models/Papeles/reportepaper';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { ClosingControl } from 'src/app/models/Fisico/closingControl';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { ObjClosingControlPapel } from 'src/app/models/Papeles/ClosingControlPapel';
import { objControCierresPapeles } from 'src/app/models/Papeles/ControlCierresPapeles';
import { objDailyPaperClosure } from 'src/app/models/Papeles/DailyPaperClosure';
import { PortafolioPapelesAbiertos } from 'src/app/models/Papeles/PortafolioPapelesAbiertos';
import { ObjDeshacerClosingControlPapel } from 'src/app/models/Papeles/deshacerClosingControlpapel';
import { objDeshacerDailyPaper } from 'src/app/models/Papeles/deshacerDailyPaper';
import { listaLiquidaciones } from 'src/app/models/Papeles/listaLiquidaciones';
import { objCancelarPapel } from 'src/app/models/Papeles/objCancelarPapel';
import { objInitGestionOPapel } from 'src/app/models/Papeles/objInitGestionOPapel';
import { objLiquidarPapel } from 'src/app/models/Papeles/objLiquidarPapel';
import { objPortafolioPapel } from 'src/app/models/Papeles/objPortafolioPapel';

import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs'; 
import * as FileSaver from 'file-saver';
import { gestionPapelesService } from 'src/app/shared/services/gestion-papeles.service';

@Component({
  selector: 'app-gestion-papeles',
  templateUrl: './gestion-papeles.component.html',
  styleUrls: ['./gestion-papeles.component.scss']
})
export class GestionPapelesComponent implements OnInit {

  public estadoPortafolio: ClosingControl  [] = [];
  public sociedades: cargaCombo[] = [];
  public subyacentes: cargaCombo[] = [];
  public sociedadSelected: number;
  public subyacenteSelected: number;
  public listaPapelesAbiertos: PortafolioPapelesAbiertos[];
  public listaPapelesAbiertosDS: MatTableDataSource<PortafolioPapelesAbiertos>;
  public objDatosForm: objInitGestionOPapel = new objInitGestionOPapel();
  public m2m: number;
  public chartOption: any;
  public seleccionaIndiceTab: number = 0;
  public listaReportePaper: ReportePapelesTipo[]=[];
  public listaReportePaperDS: MatTableDataSource<ReportePapelesTipo>;
  public listacampania: cargaCombo[]=[];
  public campaniaSelected: number|null ;
  public ConsultaSociedadselected: number|null;
  public pFechaReporte:string="";
  date: NgbDateStruct;
  isSecondTable: boolean = false;
  flgBontongenerico: Boolean = true;
  public seleccionarTodo:boolean = false;
  public flgDeshacerCierre: boolean = false;
  public listaCierrePapeles:objControCierresPapeles[];
  public listaestadosCierresXSociedad: ObjClosingControlPapel  [] = [];
  @ViewChild('cierreMolienda') cierreMolienda: any;
  private modalRef: any;
  public combosociedades:cargaCombo[]=[];
  public fechInicio: NgbDateStruct|null ;
  public fechFin: NgbDateStruct|null ;
 

  objLiquidarPadre: objLiquidarPapel
  liquidacionesPadre: listaLiquidaciones[]

  objDatosPortafolio$!: Observable<objPortafolioPapel>
  columnsPapelesAbiertos: string[] = [
    's133_Codigo'
    ,'s133_Fecha'
    ,'s133_CompraVenta'
    ,'s133_Contraparte'
    ,'s133_ContratoExterno'
    ,'s133_Origen'
    ,'s133_Desde'
    ,'s133_Hasta'
    ,'s133_TM'
    ,'s133_Saldo'
    ,'s133_Incoterm'
    ,'s133_Precio'
    ,'s133_ContratoFuturo'
    ,'s133_Indice'
    ,'s133_Campagna'
    ,'s133_Observaciones'
    ,'s133_Benchmark'
    ,'s133_M2M'
    ,'s133_Cobertura'
    ,'s133_Hedge'
  ];
  columnsReportePapeles: string[]=[
    's138_Codigo',
    's138_Fecha',
    's138_CompraVenta',
    's138_Sociedad',
    's138_Subyacente',
    's138_Contraparte',
    's138_ContratoExterno',
    's138_Estado',
    's138_Origen',
    's138_Desde',
    's138_Hasta',
    's138_TM',
    's138_Saldo',
    's138_Incoterm',
    's138_Precio',
    's138_ContratoFuturo',
    's138_Campagna',
    's138_Hedge',
    's138_Observaciones',
    's138_CodigoLiquidacion',
    's138_CompraVentaLiquidacion',
    's138_ContratoExternoLiquidacion',
    's138_FechaLiquidacion',
    's138_TMLiquidacion',
    's138_PrecioLiquidacion',
    's138_PnL',
    's138_Comentarios'
  ]
  public codigoOptions: { label: number; value: number; }[]=[];
  codigoselected:ReportePapelesTipo[];
  tooltipText: string;
  SociedadString: string;
  public listaPapelesAbiertosTotales: PortafolioPapelesAbiertos[]=[];

  constructor(private gestionPapelesservicio: gestionPapelesService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private portafolioMoliendaService: PortafolioMoliendaService,
              private cdr: ChangeDetectorRef
            ) {}  
  @ViewChild(MatMenuTrigger)
  contextMenuOpen!: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  

  onContextMenu(event: MouseEvent,varscondtable: boolean, item: Item) {       
    event.preventDefault();
    this.isSecondTable = varscondtable;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenuOpen.menuData = { 'item': item };
    this.contextMenuOpen.menu.focusFirstItem('mouse');
    this.contextMenuOpen.openMenu();}

  ngOnInit(): void {
    this.getSociedades();
    this.activatedRoute.queryParams.subscribe(params => {      
      this.sociedadSelected = params['sociedad'];
      if(this.sociedadSelected !== undefined){this.getSubyacentes(this.sociedadSelected);}      
      this.subyacenteSelected = params['subyacente'];
      if(this.sociedadSelected !== undefined && this.subyacenteSelected !== undefined){this.obtenerPortafolio();this.getEstado(this.sociedadSelected,this.subyacenteSelected)}
    });

    this.portafolioMoliendaService.getCombo('consultaCampagna').subscribe(
      (response: cargaCombo[]) => {
        this.listacampania = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

public getSociedades(): void {
    this.gestionPapelesservicio.listarSociedadPapeles().subscribe((response: cargaCombo[]) => {this.sociedades = response;},
      (error: HttpErrorResponse) => {alert(error.message);});}

public getSubyacentes(id: number): void {this.gestionPapelesservicio.listarSubyacentesPapeles(id).subscribe((response: cargaCombo[]) => {
        this.subyacentes = response;},(error: HttpErrorResponse) => { alert(error.message);});}

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();  
    }
  }
public obtenerPortafolio(): void{  
    this.gestionPapelesservicio.listarPortafolioPapeles(this.sociedadSelected,this.subyacenteSelected).subscribe(
      (response: objPortafolioPapel) => {this.listaPapelesAbiertos = response.portafolioPapelesAbiertos;
        this.listaPapelesAbiertosDS = new MatTableDataSource(this.listaPapelesAbiertos);
        this.m2m = response.m2m;
        ;},
      (error: HttpErrorResponse) => {alert(error.message);});}

onSelectSociedad(idSociedad: number){
  if (idSociedad != null) {

    if (this.sociedadSelected !== idSociedad) {this.subyacenteSelected = 0;}
    this.sociedadSelected = idSociedad;
    this.getSubyacentes(idSociedad);
  } else {
    this.listaPapelesAbiertos = [];
    this.listaPapelesAbiertosDS = new MatTableDataSource(this.listaPapelesAbiertos);}
  this.aplicarFiltro();
  }

aplicarFiltro() {
  const subyacente = this.subyacenteSelected !== 0 ? this.subyacenteSelected : null;

  const filtro = {
      sociedad: this.sociedadSelected,
      subyacente: subyacente
  };
  this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: filtro,
      queryParamsHandling: 'merge',
      skipLocationChange: false
  });
  if (this.sociedadSelected != null && subyacente != null) {
      this.obtenerPortafolio();
      this.getEstado(this.sociedadSelected, subyacente);
  } else {
      this.listaPapelesAbiertos = [];
      this.listaPapelesAbiertosDS = new MatTableDataSource(this.listaPapelesAbiertos);
  }
  }

public  modalIngresarPapel(modificarOperacionForm: any){
  if (
    (this.sociedadSelected == null || typeof this.sociedadSelected == 'undefined' || this.sociedadSelected == 0) || 
    (this.subyacenteSelected == null || typeof this.subyacenteSelected == 'undefined' || this.subyacenteSelected == 0)
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Es necesario seleccionar una Sociedad y Subyacente',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    });
    return;
  }
  if(this.estadoPortafolio.length>0)  {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso', 
      text: 'Portafolio Cerrado',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })
    return;
  }

    this.gestionPapelesservicio.obtenerDatosGestionPapeles(this.sociedadSelected, this.subyacenteSelected).subscribe(
      (response: objInitGestionOPapel) => {
        this.objDatosForm = response;console.log(this.objDatosForm.papelGestionado);
        this.objDatosForm.flgIngresarPapel = true;
        this.modalService.open(modificarOperacionForm,{windowClass : "modalIngresarPapel",centered: true,backdrop : 'static',keyboard : false})},
      (error: HttpErrorResponse) => {alert(error.message)});
  }

public  modalModificarPapel(modificarOperacionForm: any){
  if(this.estadoPortafolio.length>0)  {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso', 
      text: 'Portafolio Cerrado',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })
    return;
  }
    this.gestionPapelesservicio.obtenerObjModificarPapel(this.sociedadSelected, this.subyacenteSelected, this.contextMenuOpen.menuData.item).subscribe(
      (response: objInitGestionOPapel) => {
        this.objDatosForm = response;
        this.objDatosForm.flgIngresarPapel = false;
        this.modalService.open(modificarOperacionForm,{windowClass : "modalIngresarPapel",centered: true,backdrop : 'static',keyboard : false});

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

public  modalLiquidarPapel(liqudiarPapelForm: any){
  if(this.estadoPortafolio.length>0)  {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso', 
      text: 'Portafolio Cerrado',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })
    return;
  }
    this.gestionPapelesservicio.obtenerObjLiquidarPapel(this.contextMenuOpen.menuData.item ).subscribe(
      (response: objLiquidarPapel) => {
        this.objLiquidarPadre = response;
        this.objLiquidarPadre.sociedad = this.sociedadSelected;
        this.objLiquidarPadre.subyacente = this.subyacenteSelected;
        this.modalService.open(liqudiarPapelForm,{windowClass : "modalLiquidarPapel",centered: true,backdrop : 'static',keyboard : false});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }); 
  }

public  modalListaLiquidacion(listaLiquidacionForm: any){
  if(this.estadoPortafolio.length>0)  {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso', 
      text: 'Portafolio Cerrado',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })
    return;
  }
    this.gestionPapelesservicio.obtenerLiquidaciones(this.contextMenuOpen.menuData.item ).subscribe(
      (response: listaLiquidaciones[]) => {
        this.liquidacionesPadre = response;
        this.modalService.open(listaLiquidacionForm,{windowClass : "modalListarLiquidaciones",centered: true,backdrop : 'static',keyboard : false});

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }); 
  }
  public getEstado(sociedad:number,producto:number): void{
    this.gestionPapelesservicio.getEstado(sociedad,producto).subscribe(
      (response: ClosingControl[]) => {
        this.estadoPortafolio = response;
        console.log(this.estadoPortafolio.length);      
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }
  seleccionarTodoCierre(){
    if(this.seleccionarTodo){
      for (let itemCierre of this.listaCierrePapeles
      ){
        if(!this.flgDeshacerCierre){
          if(itemCierre.flgEstado){
            itemCierre.flgCerrar = true;
          }
        }else{
          if(!itemCierre.flgEstado){
            itemCierre.flgCerrar = true;
          }
        }
      }
    }else{
      for (let itemCierre of this.listaCierrePapeles){
        itemCierre.flgCerrar = false;
      }
    }
  }

public  cerrarPortafolioModal(modalCierres: any){
  if(this.sociedadSelected == null || typeof this.sociedadSelected == 'undefined' || this.sociedadSelected == 0)  {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso', 
      text: 'Es necesario seleccionar una Sociedad',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })
    return;
  }
  this.flgBontongenerico = true;
  this.seleccionarTodo = false; 
  this.flgDeshacerCierre = false;
  this.SociedadString=this.sociedades.filter(item=>item.s204_ID==this.sociedadSelected.toString())[0].s204_Description
  this.gestionPapelesservicio.getEstadoPortafolioXSociedad(this.sociedadSelected).subscribe(
    (response:ObjClosingControlPapel[])=>{this.listaestadosCierresXSociedad=response;console.log(this.listaestadosCierresXSociedad);
      this.listaCierrePapeles=this.subyacentes.map((subyacente)=>{
        const datalistaestado=this.listaestadosCierresXSociedad.find(item=>item.t165_Underlying===parseInt(subyacente.s204_ID));
        const horacierre=datalistaestado?.t165_Hour??""
        const fechacierre=datalistaestado?.t165_Date??""
        const flagestado=datalistaestado?.t165_Hour?false:true
        return{
        idSociedad:this.sociedadSelected,
        idSubyacente:parseInt(subyacente.s204_ID),
        desc_Subyacente:subyacente.s204_Description,
        flgCerrar:false,
        flgEstado:flagestado,
        horacierreString:(fechacierre && horacierre) 
        ? fechacierre.toString().substring(6,8) + '/' + fechacierre.toString().substring(4,6) + '/' + fechacierre.toString().substring(0,4) + '  '
          + horacierre.substring(0,2) + ':' + horacierre.substring(2,4) + ':' + horacierre.substring(4,6)
        : '',
        horacierreDate:new Date(),
        usuarioRegistra:this.portafolioMoliendaIFDService.usuario}});
      console.log(this.listaCierrePapeles);
      this.modalRef=this.modalService.open(modalCierres,{windowClass : "claseCierre",centered: true,backdrop : 'static',keyboard : false})
    }
  ) 

  }
public cerrarPortafolio(){
      const a = new Date();
    this.pFechaReporte=this.dateToString( { day: a.getDate(), month: a.getMonth()+1 , year: a.getFullYear()});
    const horas = `${a.getHours().toString().padStart(2, '0')}${a.getMinutes().toString().padStart(2, '0')}${a.getSeconds().toString().padStart(2, '0')}`;
this.listaPapelesAbiertosTotales=[]
this.listaCierrePapeles.map((item1)=>{
  if(item1.flgCerrar){
  this.gestionPapelesservicio.listarPortafolioPapeles(item1.idSociedad,item1.idSubyacente).subscribe(
    (response:objPortafolioPapel)=>{this.listaPapelesAbiertosTotales=response.portafolioPapelesAbiertos;
      const listaDailyPaperClosure:objDailyPaperClosure[]=this.listaPapelesAbiertosTotales.map(item=>{
        const t279_Paper=Number(item.s133_Codigo);
        const t279_Date=parseInt(this.pFechaReporte);
        const t279_Underlying=Number(item1.idSubyacente);
        const t279_Society=Number(this.sociedadSelected);
        const t279_RegisteredBy=this.portafolioMoliendaIFDService.usuario;
        const t279_BalanceInMetricTons=item.s133_Saldo;
        const t279_Price=item.s133_Precio;
        const t279_MarketPrice=parseFloat(item.s133_Benchmark);
        const t279_MarkToMarket=parseFloat(item.s133_M2M);
        const t279_Status=1;
        const t279_SellBuy = item.s133_CompraVenta.toString() === 'Compra' ? 1 : 2;
        const t279_Campaign=parseInt(this.listacampania.filter(otroitem =>otroitem.s204_Description==item.s133_Campagna)[0].s204_ID);
        return{
          t279_Paper:t279_Paper||0,
          t279_Date:t279_Date||0,
          t279_Underlying:t279_Underlying||0,
          t279_Society:t279_Society||0,
          t279_RegisteredBy:t279_RegisteredBy||'',
          t279_BalanceInMetricTons:t279_BalanceInMetricTons||0,
          t279_Price:t279_Price||0,
          t279_MarketPrice:t279_MarketPrice||0,
          t279_MarkToMarket:t279_MarkToMarket||0,
          t279_Status:t279_Status||0,
          t279_SellBuy:t279_SellBuy||0,
          t279_Campaign:t279_Campaign||0
        }
      });
      console.log(listaDailyPaperClosure);
      this.gestionPapelesservicio.guardarCierrepapeles(listaDailyPaperClosure).subscribe(data => {console.log("Se registro PaperClosure")})

    })
}
})

const datoClosingControl :ObjClosingControlPapel[]=[];

this.listaCierrePapeles.forEach(item => {
  if (item.flgCerrar) {
    const t165_Underlying = Number(item.idSubyacente);
    const t165_Society = Number(item.idSociedad);
    const t165_Date = parseInt(this.pFechaReporte);
    const t165_ClosingConcept = 8;
    const t165_Hour = horas;
    const t165_User = this.portafolioMoliendaIFDService.usuario;
    const t165_Status = 1;

    datoClosingControl.push({
      t165_Underlying: t165_Underlying || 0,
      t165_Society: t165_Society || 0,
      t165_Date: t165_Date || 0,
      t165_ClosingConcept: t165_ClosingConcept || 0,
      t165_Hour: t165_Hour || '',
      t165_User: t165_User || '',
      t165_Status: t165_Status || 0
    });
  } 
});
console.log(datoClosingControl);
if (datoClosingControl.length > 0) {
  this.gestionPapelesservicio.guardarPapelClosing(datoClosingControl).subscribe(
    data => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cierre de Portafolio Papeles',
        showConfirmButton: false,
        timer: 1500,
        customClass: { container: 'my-swal' }
      });
      if (this.subyacenteSelected) { 
        this.getEstado(this.sociedadSelected, this.subyacenteSelected);
      } else {
        console.log('Subyacente no seleccionado, no se ejecuta getEstado.');
      };this.closeModal();
    }
  );
} else {
  Swal.fire({
    position: 'center',
    icon: 'warning',
    title: 'No existen elementos para cerrar',
    showConfirmButton: true,
    customClass: { container: 'my-swal' }
  }).then((ok)=>{if(ok.isConfirmed){this.closeModal()}});
}


}


  public deshacerCierrePortafolioModal(modalCierres: any){
    if(this.sociedadSelected == null || typeof this.sociedadSelected == 'undefined' || this.sociedadSelected == 0)  {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso', 
        text: 'Es necesario seleccionar una Sociedad',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }
    this.flgBontongenerico = true;
    this.seleccionarTodo = false; 
    this.flgDeshacerCierre = true;
    const a = new Date();
    this.pFechaReporte=this.dateToString( { day: a.getDate(), month: a.getMonth()+1 , year: a.getFullYear()});
    this.SociedadString=this.sociedades.filter(item=>item.s204_ID==this.sociedadSelected.toString())[0].s204_Description;
  this.gestionPapelesservicio.getEstadoPortafolioXSociedad(this.sociedadSelected).subscribe(
    (response:ObjClosingControlPapel[])=>{this.listaestadosCierresXSociedad=response;console.log(this.listaestadosCierresXSociedad);
      this.listaCierrePapeles=this.subyacentes.map((subyacente)=>{
        const datalistaestado=this.listaestadosCierresXSociedad.find(item=>item.t165_Underlying===parseInt(subyacente.s204_ID));
        const horacierre=datalistaestado?.t165_Hour??""
        const fechacierre=datalistaestado?.t165_Date??""
        const flagestado=datalistaestado?.t165_Hour?false:true
        return{
        idSociedad:this.sociedadSelected,
        idSubyacente:parseInt(subyacente.s204_ID),
        desc_Subyacente:subyacente.s204_Description,
        flgCerrar:false,
        flgEstado:flagestado,
        horacierreString:(fechacierre && horacierre) 
        ? fechacierre.toString().substring(6,8) + '/' + fechacierre.toString().substring(4,6) + '/' + fechacierre.toString().substring(0,4) + '  '
          + horacierre.substring(0,2) + ':' + horacierre.substring(2,4) + ':' + horacierre.substring(4,6)
        : '',
        horacierreDate:new Date(),
        usuarioRegistra:this.portafolioMoliendaIFDService.usuario}});
      console.log(this.listaCierrePapeles);
      this.modalRef=this.modalService.open(modalCierres,{windowClass : "claseCierre",centered: true,backdrop : 'static',keyboard : false})
    }
  ) ;

   
}

deshacerPortafolio(){

  const a = new Date();
  this.pFechaReporte=this.dateToString( { day: a.getDate(), month: a.getMonth()+1 , year: a.getFullYear()});
  const horas = `${a.getHours().toString().padStart(2, '0')}${a.getMinutes().toString().padStart(2, '0')}${a.getSeconds().toString().padStart(2, '0')}`;

const datodeshacerClosingControl:ObjDeshacerClosingControlPapel[]=[];
this.listaCierrePapeles.forEach(item => {
  if (item.flgCerrar) {
    const t165_Underlying = Number(item.idSubyacente);
    const t165_Society = Number(item.idSociedad);
    const t165_Date = parseInt(this.pFechaReporte);
    const t165_ClosingConcept = 8;
    datodeshacerClosingControl.push({
      t165_Underlying: t165_Underlying || 0,
      t165_Society: t165_Society || 0,
      t165_Date: t165_Date || 0,
      t165_ClosingConcept: t165_ClosingConcept || 0,});
  } 
});
console.log(datodeshacerClosingControl);


const listaeleliminarDailyPaper:objDeshacerDailyPaper[]=[];
this.listaCierrePapeles.forEach(item => {
  if (item.flgCerrar) {
    const t279_Society = Number(item.idSociedad);
    const t279_Underlying = Number(item.idSubyacente);
    const t279_Date = parseInt(this.pFechaReporte);
    listaeleliminarDailyPaper.push({
      t279_Society: t279_Society || 0,
      t279_Underlying: t279_Underlying || 0,
      t279_Date: t279_Date || 0});
  } 
});

console.log(listaeleliminarDailyPaper)

if(datodeshacerClosingControl.length>0){
  this.gestionPapelesservicio.eliminarDailyPaper(listaeleliminarDailyPaper).subscribe(
    data=>{console.log("Se Elimino PaperClosure")});
this.gestionPapelesservicio.eliminarPapelClosing(datodeshacerClosingControl).subscribe(
  data=>{ 
    this.obtenerPortafolio();
           Swal.fire({
            position:'center',
            icon:'success',
            title:'Se deshizo el cierre ',
            showConfirmButton: false,
            timer: 1500,
            customClass: {container: 'my-swal',}});
            if (this.subyacenteSelected) { 
              this.getEstado(this.sociedadSelected, this.subyacenteSelected);
            } else {
              console.log('Subyacente no seleccionado, no se ejecuta getEstado.');
            }
           this.closeModal()});}
           else{Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'No existen elementos para deshacer',
            showConfirmButton: true,
            customClass: { container: 'my-swal' }
          }).then((ok)=>{if(ok.isConfirmed){this.closeModal()}}); }
}
  
  getformattedDate():number{
    this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    return Number(this.dateToString(this.date));
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

  cerrarModalPapel(modal: any){
    modal.close();
  }

  cancelarPapel(){ 
    if(this.estadoPortafolio.length>0)  {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso', 
        text: 'Portafolio Cerrado',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }
    let objCancelar: objCancelarPapel = new objCancelarPapel(); 
    objCancelar.idPapel = this.contextMenuOpen.menuData.item;
    objCancelar.usuarioCancela = this.portafolioMoliendaIFDService.usuario;

    Swal.fire({
      icon: 'question',
      title: 'Cancelar Papel',
      html: '¿Está seguro que desea cancelar el papel '+ objCancelar.idPapel.toString() +'?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){
        this.gestionPapelesservicio.cancelarPapel(objCancelar).subscribe(
          data=>{             
            this.obtenerPortafolio();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se canceló correctamente el papel ' + data.idPapel.toString() ,
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                container: 'my-swal',
              }
            });
          });
      }
    });
  }

 public modalgenerarReporte(consultaHistorica:any){
  
  this.gestionPapelesservicio.listarSociedadPapeles().subscribe(
    (respuesta:cargaCombo[])=>{this.combosociedades=respuesta;console.log(this.combosociedades)}
  )

  this.modalService.open(consultaHistorica,{windowClass : "claseConsulta",centered: true,backdrop : 'static',keyboard : false});
        
  }
  fechainicio:number|null
  fechafin:number|null
  public generarReporte(mitabindice){
    if (this.campaniaSelected === undefined) { this.campaniaSelected = null; }
    console.log(this.campaniaSelected);
    if (this.ConsultaSociedadselected === undefined) { this.ConsultaSociedadselected = null; }
    console.log(this.ConsultaSociedadselected);
    if (this.fechInicio === undefined || this.fechInicio === null) { this.fechainicio = null; } else { const fechainicioStr = `${this.fechInicio.year}${String(this.fechInicio.month).padStart(2, '0')}${String(this.fechInicio.day).padStart(2, '0')}`; this.fechainicio = Number(fechainicioStr); }
    console.log(this.fechainicio);
    if (this.fechFin === undefined || this.fechFin === null) { this.fechafin = null; } else { const fechafinStr = `${this.fechFin.year}${String(this.fechFin.month).padStart(2, '0')}${String(this.fechFin.day).padStart(2, '0')}`; this.fechafin = Number(fechafinStr); }
    console.log(this.fechafin);
     this.seleccionaIndiceTab=mitabindice;
       this.gestionPapelesservicio.obtenerdatareporte(this.campaniaSelected,this.ConsultaSociedadselected,this.fechainicio,this.fechafin).subscribe(
      (response:ReportePapelesTipo[])=>{this.listaReportePaper=response; this.spans = [];
        this.cacheSpan('s138_Codigo',d=>d.s138_Codigo);
        this.cacheSpan('s138_Fecha',d=>d.s138_Codigo+d.s138_Fecha);
        this.cacheSpan('s138_CompraVenta',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta);
        this.cacheSpan('s138_Sociedad',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad);
        this.cacheSpan('s138_Subyacente',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente);
        this.cacheSpan('s138_Contraparte',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+d.s138_Contraparte);
        this.cacheSpan('s138_ContratoExterno',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno);
        this.cacheSpan('s138_Estado',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado);
        this.cacheSpan('s138_Origen',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen);
        this.cacheSpan('s138_Desde',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen+d.s138_Desde);
        this.cacheSpan('s138_Hasta',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen+d.s138_Desde+d.s138_Hasta);
        this.cacheSpan('s138_TM',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen+d.s138_Desde+d.s138_Hasta+d.s138_TM);
        this.cacheSpan('s138_Saldo',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen+d.s138_Desde+d.s138_Hasta+d.s138_TM+d.s138_Saldo);
        this.cacheSpan('s138_Incoterm',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen+d.s138_Desde+d.s138_Hasta+d.s138_TM+d.s138_Saldo+d.s138_Incoterm); 
        this.cacheSpan('s138_Precio',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen+d.s138_Desde+d.s138_Hasta+d.s138_TM+d.s138_Saldo+d.s138_Incoterm+d.s138_Precio);
        this.cacheSpan('s138_ContratoFuturo',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen+d.s138_Desde+d.s138_Hasta+d.s138_TM+d.s138_Saldo+d.s138_Incoterm+d.s138_Precio+d.s138_ContratoFuturo);
        this.cacheSpan('s138_Campagna',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen+d.s138_Desde+d.s138_Hasta+d.s138_TM+d.s138_Saldo+d.s138_Incoterm+d.s138_Precio+d.s138_ContratoFuturo+d.s138_Campagna);
        this.cacheSpan('s138_Hedge',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
          d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen+d.s138_Desde+d.s138_Hasta+d.s138_TM+d.s138_Saldo+d.s138_Incoterm+d.s138_Precio+d.s138_ContratoFuturo+d.s138_Campagna+d.s138_Hedge);
        this.cacheSpan('s138_Observaciones',d=>d.s138_Codigo+d.s138_Fecha+d.s138_CompraVenta+d.s138_Sociedad+d.s138_Subyacente+
        d.s138_Contraparte+d.s138_ContratoExterno+d.s138_Estado+d.s138_Origen+d.s138_Desde+d.s138_Hasta+d.s138_TM+d.s138_Saldo+d.s138_Incoterm+d.s138_Precio+d.s138_ContratoFuturo+d.s138_Campagna+d.s138_Hedge+d.s138_Observaciones);                   
        this.listaReportePaperDS=new MatTableDataSource(this.listaReportePaper); this.cdr.detectChanges();this.exportToExcel()},
        (error: HttpErrorResponse) => {alert(error.message);})    
  


  }


  selectedPapel: ReportePapelesTipo ;


  viewProduct(papel: ReportePapelesTipo) {
    console.log(papel.s138_Codigo)
}
  //ESTA SECCION ES PARA GENERAR LA DIVISION DE FILAS DE LA TABLA
 public spans: Span[] = [];
 public cacheSpan(key: string, accessor: (arg0: ReportePapelesTipo) => any) {
    for (let i = 0; i < this.listaReportePaper.length;) {
      let currentValue = accessor(this.listaReportePaper[i]);
      let count = 1;
      for (let j = i + 1; j < this.listaReportePaper.length; j++) {        
        if (currentValue != accessor(this.listaReportePaper[j])) {
          break;} count++;
      } 

      if (!this.spans[i]) {this.spans[i] = {};}
      this.spans[i][key] = count;
      i += count;
    }
  }
  public getRowSpan(col: string, index: number) {
    return this.spans[index] && this.spans[index][col];
  }

  selectionSum: number = 0;
  selectionCount: number = 0;
  isSelecting: boolean = false;
  selectedCells: Set<string> = new Set(); 
  empezarseleccion(event: MouseEvent, rowIndex: number, column: string) {
    event.preventDefault();
    this.isSelecting = true;
    if(event.ctrlKey){this.adicionar_a_seleccion(event, rowIndex, column);}
    else{this.selectedCells.clear();this.adicionar_a_seleccion(event, rowIndex, column);}
    this.updateSumListadataHedge();
  }
  adicionar_a_seleccion(event: MouseEvent, rowIndex: number, column: string) {
    if (this.isSelecting && column) {
      if (rowIndex !== undefined) {this.selectedCells.add(`${rowIndex}|${column}`);}
      this.updateSumListadataHedge();
    }
  }
  finalizarSeleccion() {
    this.isSelecting = false;
  }
  limpiarseleccion(event: MouseEvent) {
    if (!event.ctrlKey) {
      this.selectedCells.clear();
      this.updateSumListadataHedge();
    }
  }
    
  updateSumListadataHedge() {
    console.log("Selected Cells:", Array.from(this.selectedCells));
  
    let numericSum = 0;   // Para almacenar la suma de los campos numéricos
    let totalCount = 0;    // Para contar todas las celdas seleccionadas
  
    this.selectionSum = Array.from(this.selectedCells).reduce((sum, cellKey) => {
      const [rowIndex, column] = cellKey.split('|');
      const index = parseInt(rowIndex, 10);
      const element = this.listaReportePaper[index];  
  
      if (element) {
        const value = element[column as keyof ReportePapelesTipo];
        totalCount++;  // Contar todas las celdas, sin importar si son numéricas o no
        if (typeof value === 'number') {
          numericSum += value;  // Solo sumar si es numérico
        }
      }
      return sum;
    }, 0);
  
    this.selectionSum = numericSum;  // Guardar la suma de los numéricos
    this.selectionCount = totalCount;  // Guardar el total de celdas seleccionadas
  
    console.log("Selection Sum:", this.selectionSum);
    console.log("Total Count:", this.selectionCount);
    this.tooltipText=`Sum: ${this.selectionSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nCount: ${this.selectionCount}`
    console.log(this.tooltipText)
  }
  esCeldaSeleccionada(rowIndex: number, column: string): boolean {
    return this.selectedCells.has(`${rowIndex}|${column}`);
  }


  ModalduplicarContrato(){
    if(this.estadoPortafolio.length>0)  {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso', 
        text: 'Portafolio Cerrado',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }
    this.duplicarContrato()
  }
  duplicarContrato(){

    Swal.fire({
      icon: 'question',
      title: 'Duplicación de Papel',
      html: '¿Esta seguro que desea duplicar el Papel <b>' + this.contextMenuOpen.menuData.item.toString() + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gestionPapelesservicio.realizarDuplicadoPapel(this.contextMenuOpen.menuData.item,this.portafolioMoliendaIFDService.usuario).subscribe(
          (response: string) => {
            // this.gestionPapeles._send(this.sociedadSelected,this.subyacenteSelected);   
            this.obtenerPortafolio();         
            Swal.fire({
              title: 'Duplicación de Contrato!',
              html: 'Se realizó la duplicación del Papel. Nuevo Papel <b>' + response + '</b>',
              icon: 'success',
              confirmButtonColor: '#4b822d'
            })
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }
    })
  }
  columnLabels: { [key: string]: string } = { 
    's138_Codigo': 'Papel', 
    's138_Fecha': 'Fecha', 
    's138_CompraVenta': 'Compra/Venta',
    's138_Sociedad': 'Sociedad', 
    's138_Subyacente': 'Subyacente', 
    's138_Contraparte': 'Contraparte', 
    's138_ContratoExterno': 'Contrato Externo', 
    's138_Estado': 'Estado', 
    's138_Origen': 'Origen', 
    's138_Desde': 'Desde', 
    's138_Hasta': 'Hasta', 
    's138_TM': 'TM', 
    's138_Saldo': 'Saldo', 
    's138_Incoterm': 'Incoterm', 
    's138_Precio': 'Precio', 
    's138_ContratoFuturo': 'Contrato Futuro', 
    's138_Campagna': 'Campaña', 
    's138_Hedge': 'Cobertura Estratégica', 
    's138_Observaciones': 'Observaciones', 
    's138_CodigoLiquidacion': 'Codigo', 
    's138_CompraVentaLiquidacion': 'Compra/Venta', 
    's138_ContratoExternoLiquidacion': 'Contrato Externo', 
    's138_FechaLiquidacion': 'Fecha', 
    's138_TMLiquidacion': 'TM', 
    's138_PrecioLiquidacion': 'Precio', 
    's138_PnL': 'P&L USD', 
    's138_Comentarios': 'Comentarios' };

  exportToExcel(){
    const workbook = new ExcelJS.Workbook(); 
    const worksheet = workbook.addWorksheet('Reporte Papeles');
    const headerLabels = this.columnsReportePapeles.map(col => this.columnLabels[col] || col); 
    const header = worksheet.addRow(headerLabels);
    header.eachCell((cell, number) => { 
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; 
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: number <= 19 ? { argb: 'C80F1E' } : { argb: '4444A9' } }; 
      cell.alignment = { vertical: 'middle', horizontal: 'center' }; });

    this.listaReportePaperDS.data.forEach(element => { 
      const rowData = this.columnsReportePapeles.map(column => element[column]); worksheet.addRow(rowData); });

      worksheet.columns.forEach(column => { if (column.eachCell) {
         let maxLength = 0; column.eachCell({ includeEmpty: true },
           (cell) => { const columnLength = cell.value ? cell.value.toString().length : 10; 
            if (columnLength > maxLength) { maxLength = columnLength; } }); column.width = maxLength < 10 ? 10 : maxLength; } });
      const fechaActual = new Date().toISOString().slice(0, 10);

    workbook.xlsx.writeBuffer().then((buffer) => { 
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       FileSaver.saveAs(blob, `ReportePapeles_${fechaActual}.xlsx`); }); }


  


}
interface Span {
  [key: string]: any;
}