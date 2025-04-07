import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService } from 'src/app/components/loading.service';
import { Broker } from 'src/app/models/IFD/broker';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { SellBuy } from 'src/app/models/IFD/sellbuy';
import { HttpErrorResponse } from '@angular/common/http';
import { Sociedad } from 'src/app/models/IFD/sociedad';
import { MesExpiracion } from 'src/app/models/IFD/mesExpiracion';
import { Contrato } from 'src/app/models/IFD/Contrato';
import { Bolsa } from 'src/app/models/IFD/bolsa';
import { TipoContrato } from 'src/app/models/IFD/tipoContrato';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { objInitPoBo } from 'src/app/models/IFD/objInitPoBo';
import { PoBo_Paper } from 'src/app/models/IFD/PoBo_Paper';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingresar-papel-po-bo',
  templateUrl: './ingresar-papel-po-bo.component.html',
  styleUrls: ['./ingresar-papel-po-bo.component.scss']
})
export class IngresarPapelPoBoComponent implements OnInit {

  public idBroker: string;
  public descdBrokerReference: string;
  public nuevoPapelPobo: PoBo_Paper = new PoBo_Paper();
  public idBrokerReference: string;
  public factorUnitMeasure:number;
  public contractInMetricTons:number;
  public listaBroker: Broker[];
  public loading$= this.loader.loading$
  public listaSellBuy: SellBuy[];
  public idSellBuy: string;
  public listaSociedad: Sociedad[];
  public idSociedad: string;
  public pNuevaFechaVcto:string="";
  public listaMesExpiracion: MesExpiracion[];
  public idContrato: string;
  public listaContratos: Contrato[];
  public idTicker: string;
  public idBolsa: string;
  public ticker: string;
  public idTipoContrato: string;
  public listaBolsa: Bolsa[];
  public listaTipoContrato: TipoContrato[];
  public fecha:number;
  public idUnderlying: string;
  public idSQL:number;
  @Input() objInitPaperPoboHijo: objInitPoBo;
  myModal=false;
  public descUnitMeasureUSD:string = '';
  public descUnitMeasureCent:string = '';

  @Output () closePapel: EventEmitter<boolean>= new EventEmitter();
  
  constructor(private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private loader:LoadingService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    // this.getContrato();
    // this.getMesExpiracion();
    this.nuevoPapelPobo = this.objInitPaperPoboHijo.poBoPaper

    this.listaTipoContrato = this.objInitPaperPoboHijo.listaTipoContrato;
    this.listaSociedad = this.objInitPaperPoboHijo.listaSociedad;
    this.listaSellBuy = this.objInitPaperPoboHijo.listaSellBuy;
    this.idTipoContrato = this.objInitPaperPoboHijo.tipoContrato_SQL.temp_descripcion

    this.listaBolsa =this.objInitPaperPoboHijo.comboBolsa
    this.idTipoContrato = this.objInitPaperPoboHijo.tipoContrato_SQL.temp_descripcion
    this.idSellBuy=this.objInitPaperPoboHijo.poBoPaper.t522_SellBuy.toString();
    this.idBolsa=this.objInitPaperPoboHijo.bolsa_SQL.temp_descripcion.toString();
    this.listaBroker = this.objInitPaperPoboHijo.comboBroker;
    this.listaContratos = this.objInitPaperPoboHijo.comboContrato;
    this.ticker = this.objInitPaperPoboHijo.ticker_Contrato.temp_descripcion;
    this.factorUnitMeasure = this.objInitPaperPoboHijo.factorUnitMeasure;

    this.contractInMetricTons = this.objInitPaperPoboHijo.contractInMetricTons;
    this.listaMesExpiracion = this.objInitPaperPoboHijo.comboMesExpiracion;

    this.idUnderlying = this.portafolioMoliendaIFDService.idUnderlying.toString();

    // this.idContrato=this.nuevoPapelPobo.t522_Contract.toString();

    if (this.listaContratos.length>0){
      for (let index = 0; index < this.listaContratos.length; index++) {
          if ( this.listaContratos[index].t004_Nomenclature ===this.ticker) {
              this.idTicker=this.listaContratos[index].t004_ID.toString();
              break;
            
          }
        }
      if (this.ticker===""){
        this.ticker=this.listaContratos[0].t004_Nomenclature;
        // this.idTicker=this.listaContratos[0].t004_ID.toString();
      }
    } 

    switch (this.objInitPaperPoboHijo.descUnidadMedida.temp_descripcion.substring(0,1)){
      case '¢':
                  this.descUnitMeasureUSD ='$'  +this.objInitPaperPoboHijo.descUnidadMedida.temp_descripcion.substring(1,50);
                  this.descUnitMeasureCent = this.objInitPaperPoboHijo.descUnidadMedida.temp_descripcion;
                  break
      case '$':
                  this.descUnitMeasureCent ='¢'  +this.objInitPaperPoboHijo.descUnidadMedida.temp_descripcion.substring(1,50);
                  this.descUnitMeasureUSD = this.objInitPaperPoboHijo.descUnidadMedida.temp_descripcion;
                  break
      
    }
    

    this.idSociedad = "2"
    this.idBroker = "4"
    // this.obtenerDatosIniciales();

  }


  onSelectBroker(idBroker:string):void{
   
    if (typeof idBroker !== 'undefined') {
      this.idBroker=idBroker;
      if (this.portafolioMoliendaIFDService.operacionSQL.s208_IdBroker.toString()===this.idBroker){
        this.descdBrokerReference=this.portafolioMoliendaIFDService.operacionSQL.s208_CodigoBroker.toString();
        // this.nuevoPapelPobo.t005_BrokerReference=Number(this.idBrokerReference)
      }
      else{
          this.descdBrokerReference=""
          // this.operacionSQL.t005_BrokerReference=0
      }
    }
  }

  onSelectCantidad(){
    
    this.nuevoPapelPobo.t522_VolumeUnitMeasure=this.nuevoPapelPobo.t522_VolumeContract*this.factorUnitMeasure;
    this.nuevoPapelPobo.t522_VolumeTons=this.nuevoPapelPobo.t522_VolumeContract*this.contractInMetricTons;
    // this.nuevoPapelPobo.usd=this.operacionSQL.t005_VolumeUnitMeasure*(this.operacionSQL.t005_PremiumUSD+this.operacionSQL.t005_CostUSD)
  }

  calcularCantidad(tm:any){
    this.nuevoPapelPobo.t522_VolumeTons = Number(tm)
    // this.nuevoPapelPobo.t522_VolumeUnitMeasure=this.nuevoPapelPobo.t522_VolumeContract*this.factorUnitMeasure;
    this.nuevoPapelPobo.t522_VolumeContract = this.nuevoPapelPobo.t522_VolumeTons / this.contractInMetricTons
    this.nuevoPapelPobo.t522_VolumeUnitMeasure = this.nuevoPapelPobo.t522_VolumeContract*this.factorUnitMeasure;
  }

  agregarPapel(){
    // this.nuevoPapelPobo.t522_TradeDate = Number(this.idContrato)
    this.nuevoPapelPobo.t522_Contract = Number(this.idContrato)
    this.nuevoPapelPobo.t522_SellBuy = Number(this.idSellBuy)
    this.nuevoPapelPobo.t522_Society = Number(this.idSociedad)
    // this.nuevoPapelPobo.t522_GroupOfOptions = Number(this.)

    this.portafolioMoliendaIFDService.guardarPoBoPaper(this.nuevoPapelPobo).subscribe(data=>{
      this.nuevoPapelPobo = data;
      
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se guardó el papel '+ this.nuevoPapelPobo.t522_ID.toString() +' de manera ',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
        container: 'my-swal',

        }
      });
      this.closeModal()
      },
      (error: HttpErrorResponse) => {
          alert(error.message);
      });


  }

  onSelectSellBuy(id){
    if (typeof id !== 'undefined') {
     this.nuevoPapelPobo.t522_SellBuy  =Number(id);
  
   }
  }


  getMesExpiracion(exchange:number, typeContract:number, ticker:string  ): void {
    this.portafolioMoliendaIFDService.getMesExpiracion( exchange, typeContract,ticker).subscribe(
      (response: MesExpiracion[]) => {
        this.listaMesExpiracion = response;
        if (this.idContrato===""){
          this.idContrato=this.listaMesExpiracion[0].t004_ID.toString()}
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  getContrato(underlying:number,fecha:number, exchange:number, typeContract:number  ): void {
    //CAMBIAR FECHA
    this.portafolioMoliendaIFDService.getContrato(underlying,fecha, exchange, typeContract).subscribe(
      (response: Contrato[]) => {
        this.listaContratos = response;
    if (this.listaContratos.length>0){
        for (let index = 0; index < this.listaContratos.length; index++) {
            if ( this.listaContratos[index].t004_Nomenclature ===this.ticker) {
                this.idTicker=this.listaContratos[index].t004_ID.toString();
                break;
            }
          }
        if (this.ticker===""){
          this.ticker=this.listaContratos[0].t004_Nomenclature;
          this.idTicker=this.listaContratos[0].t004_ID.toString();
          this.getMesExpiracion(Number(this.idBolsa),Number(this.idTipoContrato),this.ticker)
        }
    }   
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onSelectTicker(idTicker:string):void{
   
    if (typeof idTicker !== 'undefined') {
      this.idTicker=idTicker;
      this.idContrato="";
      this.listaMesExpiracion=[];
      for (let index = 0; index < this.listaContratos.length; index++) {
          if ( this.listaContratos[index].t004_ID.toString() ===this.idTicker) {
              this.ticker =this.listaContratos[index].t004_Nomenclature;
              break;
          }
        }
        this.getMesExpiracion(Number(this.idBolsa),Number(this.idTipoContrato),this.ticker)
        if (this.listaMesExpiracion.length>0){
          this.idContrato=this.listaMesExpiracion[0].t004_ID.toString();
        }
    }
  }

  onSelectPrecioUSD(){
    this.nuevoPapelPobo.t522_StrikePriceCent=this.nuevoPapelPobo.t522_StrikePriceUSD*100
  
   }
   onSelectPrecioCent(){
    this.nuevoPapelPobo.t522_StrikePriceUSD=this.nuevoPapelPobo.t522_StrikePriceCent/100
  
   }


  onSelectTipoContrato(id:string){
    if (typeof id !== 'undefined') {
     this.idTipoContrato=id.toString();
     this.ticker=""
     this.idContrato=""
     //CargarComboTicker
     this.getContrato(Number(this.idUnderlying), this.fecha, Number(this.idBolsa), Number(this.idTipoContrato) )
   }
  }

  closeModal(){
    this.closePapel.emit(false);
  }


}
