import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { Companias } from "./companias";
import { PortafolioIFDMolienda } from "./portafolioIFDMolienda";
import { Underlying } from "./underlying";
import {ClosingControl} from "./closingControl";
import { ListaoperacionesBroker_IDSQL } from "./listaoperacionesBroker_IDSQL";
import { tap } from "rxjs/operators";
import { listaoperacionesBroker_SQL } from "./listaOperacionesBroker_SQL";
import { AsociarSQL } from "./asociarSQL";
import { TypeOperation } from "./TypeOperation";
import { ListaoperacionesBroker_Liquidar } from "./listaOperacionesBrokerLiquidar";
import { CargaMasivaIFD } from "./cargaMasivaIFD";
import { OperacionesSQL } from "./operacionSQL";
import { TipoContrato } from "./tipoContrato";
import { Bolsa } from "./bolsa";
import { Contrato } from "./Contrato";
import { MesExpiracion } from "./mesExpiracion";
import { Benchmark } from "./benchmark";
import { Broker } from "./broker";
import { SellBuy } from "./sellbuy";
import { TipoLiquidacion } from "./tipoLiquidacion";
import { Sociedad } from "./sociedad";
import { Descripcion } from "./descripcion";
import { CargarCombo } from "./cargarCombo";
import { SubordinateAccount } from "./subordinateAccount";
import { OperacionSQL_Broker } from "./operacionSQL_Broker";
import { OperacionLiquidar } from "./operacionLiquidar";
import { PlanningByCampaign } from "./planningByCampaign";
import { Campaign } from "./campaign";
import { Pricing } from "./pricing";
import { IFDSinEstrategia } from "./ifdSinEstrategia";
import { Estrategia } from "./estrategia";
import { DetalleLimite } from "./detalleLimite";
import { AlertLimit } from "./alertLimit";
import { ModificarEstrategia } from "./modificarEstrategia";
import { AprobarEstrategia } from "./aprobarEstrategia";
import { AprobarEstrategia_Estado } from "./aprobar_estrategia_estado";

import { BehaviorSubject } from 'rxjs';
import { EstadoCierreIFD } from "./estadoCierrePortafolio";
import { ResultadoMetricaIFD } from "./resultadoMetricaRiesgo";
import { PortafolioIFDMoliendaLiquidar } from "./portafolioIFDMoliendaLiquidar";
import { IFDPortafolioxFecha } from "./ifdPortafolioxFecha";
import { IFDReprocesarxFecha } from "./ifdReprocesarxFecha";
import { listaoperacionesbrokers } from "./listaoperacionesbrokers";
import { CantOperBroker } from "./cantOperBroker";
import { CargaCtaBrokerAsociada } from "./cargaCtaBrokerAsociada";
import { AccountBrokerCampign } from "./accountBrokerCampign";
import { ListaOperacionesxVencer } from "./listaOperacionesxVencer";
import { EmbarquePricingACubrir } from "./EmbarquePricingACubrir";
import { EstrategiaCM } from "./estrategiaCM";
import { InventarioTransitoACubrir } from "./InventarioTransitoACubrir";
import { ConsumoACubrir } from "./ConsumoCubrir";
import { AprobarOperacion_Estado } from "./aprobar_operation_estado";
import { AprobarOperacion } from "./aprobarOperacion";
import { OperacionLiquidada } from "./operacionLiquidada";
import { ObjInitIFDModificar } from "./objInitIFDModificar";
import { DatosMesCoberturaEstrategia } from "./datosMesCoberturaEstrategia";
import { NuevoMesCobertura } from "./nuevoMesCobertura";
import { TipoPromedio } from "./TipoPromedio";
import { ReporteContabilidad } from "./reporteContabilidad";
import { EstrategiaHEDGE } from "./estrategiaHEDGERBD";
import { ListaHedge } from "./datoshedge";
import { ListaHedgeAbierto } from "./datoshedgeabierto";
import { objInitPoBo } from "./objInitPoBo";
import { PoBo_Paper } from "./PoBo_Paper";
import { objLiquidarPoBo } from "./objLiquidarPoBo";


@Injectable({
    providedIn: 'root'
})

export class PortafolioIFDMoliendaService  implements OnDestroy {

    private apiServerUrl=environment.apiBaseUrl;
    
    public showSpinner = new BehaviorSubject(false);
    
    public codigoEmpresa: number;
    public codPortafolio:number;
    public tipo: string;
    private _refresh$= new Subject<void>();
    private _refreshPrincipal$= new Subject<void>();
    private _refreshModificar$= new Subject<void>();
    public listaOperacionesBrokerLiquidar: listaoperacionesbrokers[] = [];
    public listaOperacionesBrokerAsociar: listaoperacionesbrokers[] = [];
    public producto: number;
    public esSoyCrush: number;
    public fecha: number;
    public tipoCurva:number;
    public operacionSQL:PortafolioIFDMolienda=new PortafolioIFDMolienda;
    public planningByCampaign: PlanningByCampaign;
    public campaign: Campaign;
    public cuentaBrokerAsociada:CargaCtaBrokerAsociada;
    public pricing: Pricing;
    public nombreFormulario:string;
    public idEstrategia:string;
    public idUnderlying:number;
    public idSQL:number;
    public flagCierre:boolean;
    public estadoCierre:boolean;
    public estadoFechaExpiracion:boolean=false;
    public usuario:string;
    public broker:string;
    public brokerSinCuenta:string;
    public perfiles:string[];
    public tmEstrategia:number;
    public embarquePricingACubrir :EmbarquePricingACubrir[]
    public inventarioTransitoACubrir :InventarioTransitoACubrir[]
    public consumoCubrir :ConsumoACubrir[]
    public tipoContrato: number;
    public bolsa: number;
    public flgPoBo: boolean = false;

    constructor(private http: HttpClient){}

    ngOnDestroy(): void {
        this._refresh$.closed;
        this._refreshPrincipal$.closed;
        this._refreshModificar$.closed;
        
        
    }

    get refresh$(){
        return  this._refresh$
      }

      
    get refreshPrincipal$(){
        return  this._refreshPrincipal$
      }

      
    get refreshModificar$(){
        return  this._refreshModificar$
      }
    
    public getPortaIFDfolioMolienda(subyacente:number, empresa:number, fecha:number): Observable<PortafolioIFDMolienda[]>{
        return this.http.get<PortafolioIFDMolienda[]>(`${this.apiServerUrl}/DataEntryIFD/all?subyacente=${subyacente}&empresa=${empresa}&fecha=${fecha}`);
    }
    public getCompanias(): Observable<Companias[]>{
        return this.http.get<Companias[]>(`${this.apiServerUrl}/DataEntryIFD/companias`);
    }
     public getproductos(empresa:number): Observable<Underlying[]>{
        return this.http.get<Underlying[]>(`${this.apiServerUrl}/DataEntryIFD/subyacente?empresa=${empresa}`);
    }
    public getPortafolioMoliendaCierre(empresa:number): Observable<PortafolioIFDMolienda[]>{
        return this.http.get<PortafolioIFDMolienda[]>(`${this.apiServerUrl}/DataEntryIFD/allcierre?empresa=${empresa}&estado=2`);
    }
    public getEstado(empresa:number,subyacente:number,fecha:number): Observable<ClosingControl[]>{
        return this.http.get<ClosingControl[]>(`${this.apiServerUrl}/DataEntryIFD/estadoPortafolio?empresa=${empresa}&subyacente=${subyacente}&fecha=${fecha}`);
    }
    public getListaBrokerOperaciones(empresa:number,subyacente:number,fecha:number,broker:number): Observable<listaoperacionesbrokers[]>{
        return this.http
        .get<listaoperacionesbrokers[]>(`${this.apiServerUrl}/DataEntryIFD/OperacionesBroker?sociedad=${empresa}&subyacente=${subyacente}&fecha=${fecha}&broker=${broker}`)
        

    }
    public getCodigoPreRegistroSQL(): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/nuevoCodigoPreSQL`);
        
    }
    public getCantRegistroBroker(empresa:number,subyacente:number, fecha:number): Observable<CantOperBroker>{
        return this.http
            .get<CantOperBroker>(`${this.apiServerUrl}/DataEntryIFD/cantRegistroBroker?empresa=${empresa}&subyacente=${subyacente}&fecha=${fecha}`);
        

    }
    public getCantRegistroBrokerSinCuenta(empresa:number,subyacente:number, fecha:number): Observable<CantOperBroker>{
        return this.http
            .get<CantOperBroker>(`${this.apiServerUrl}/DataEntryIFD/cantRegistroBrokerSinCuenta?empresa=${empresa}&subyacente=${subyacente}&fecha=${fecha}`);
        

    }
    public guardarPreregistroSQL(operacionBroker_IDSQL: ListaoperacionesBroker_IDSQL[]){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/guardarRegistroBroker_SQL`,operacionBroker_IDSQL)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public getListaBroker_SQL_Operaciones(empresa:number,fecha:number): Observable<listaoperacionesBroker_SQL[]>{
        return this.http
        .get<listaoperacionesBroker_SQL[]>(`${this.apiServerUrl}/DataEntryIFD/OperacionesBroker_SQL?sociedad=${empresa}&fecha=${fecha}`)
        

    }   
    
    // public getListaAsociarOperacionesSQL(fecha:number): Observable<AsociarSQL[]>{
    //     return this.http
    //     .get<AsociarSQL[]>(`${this.apiServerUrl}/DataEntryIFD/asociarSQL?fecha=${fecha}`)
    // }   

    public getListaAsociarOperacionesSQL(ticker:string,idInstrument:number,tipoOperacion:string, tipoSoyCrush:number, fecha:number, caks:number,strike:number): Observable<AsociarSQL[]>{
        return this.http
        .get<AsociarSQL[]>(`${this.apiServerUrl}/DataEntryIFD/asociarSQL?ticker=${ticker}&idInstrument=${idInstrument}&tipoOperacion=${tipoOperacion}&tipoSoyCrush=${tipoSoyCrush}&fecha=${fecha}&caks=${caks}&strike=${strike}`)
        

    }


    public actualizarPreregistroSQL(idOperacionBroker:number,idOperacionSQL:number, casks:number, fecha:number ){
        return this.http
        .get<string>(`${this.apiServerUrl}/DataEntryIFD/OperacionesBroker_SQL?codBroker=${idOperacionBroker}&codSQL=${idOperacionSQL}&caks=${casks}&fecha=${fecha}`)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }

    public guardarOperacion_SQL(operacionBroker_SQL: listaoperacionesBroker_SQL[]){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/guardarRegistroSQL`,operacionBroker_SQL)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public revertirOperacion_SQL(operacionBroker_SQL: listaoperacionesBroker_SQL[]){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/revertirRegistroSQL`,operacionBroker_SQL)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public getPortaIFDLiquidarfolioMolienda(ticker:string,tipopcion:string,tipoOperacion:string, caksLiquidar:number, 
        subyacente:number, empresa:number): Observable<PortafolioIFDMoliendaLiquidar[]>{
        return this.http.get<PortafolioIFDMoliendaLiquidar[]>(`${this.apiServerUrl}/DataEntryIFD/ifdliquidar?ticker=${ticker}&tipopcion=${tipopcion}&tipoOperacion=${tipoOperacion}&caksLiquidar=${caksLiquidar}&subyacente=${subyacente}&empresa=${empresa}`);
    }
    public getLista_TipoOperation(): Observable<TypeOperation[]>{
        return this.http.get<TypeOperation[]>(`${this.apiServerUrl}/DataEntryIFD/tipooperacion`);
        
    }
    public getPortafolioLiquidarSoyCrush(operacionBroker: ListaoperacionesBroker_Liquidar[]){
        return this.http
        .post<PortafolioIFDMoliendaLiquidar[]>(`${this.apiServerUrl}/DataEntryIFD/ifdliquidarSoyCrush`,operacionBroker)
     
    }
    public guardarCargaMasiva_SQL(listacargaMasivaIFD: CargaMasivaIFD[]){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/guardarCargaMasivaSQL`,listacargaMasivaIFD)
         .pipe(tap(() =>{
          
             this._refreshPrincipal$.next();
           } )  
         )
    }
    public getOperacion_SQL(idSQL:number): Observable<OperacionesSQL>{
        return this.http.get<OperacionesSQL>(`${this.apiServerUrl}/DataEntryIFD/findOperacionSQL?idSQL=${idSQL}`);
    }

    public getSubordinateAccount_SQL(idSQL:number): Observable<Descripcion>{
        return this.http.get<Descripcion>(`${this.apiServerUrl}/DataEntryIFD/subordinateAccount?idSQL=${idSQL}`)
        .pipe(tap(() =>{
          
            this._refreshModificar$.next();
          } )  
        )
        
    }
    public getTipoContrato_SQL(idSQL:number): Observable<Descripcion>{
        return this.http.get<Descripcion>(`${this.apiServerUrl}/DataEntryIFD/tipoContrato?idSQL=${idSQL}`)
        .pipe(tap(() =>{
          
            this._refreshModificar$.next();
          } )  
        )
        
    }
 
    public getBolsa_SQL(idSQL:number): Observable<Descripcion>{
        return this.http.get<Descripcion>(`${this.apiServerUrl}/DataEntryIFD/bolsa?idSQL=${idSQL}`)
        .pipe(tap(() =>{
          
            this._refreshModificar$.next();
          } )  
        )
    }
    public getTicker_Contrato(idContrato:number): Observable<Descripcion>{
        return this.http.get<Descripcion>(`${this.apiServerUrl}/DataEntryIFD/tickerContrato?idContrato=${idContrato}`);
    }

    public getTipoContrato(): Observable<TipoContrato[]>{
        return this.http.get<TipoContrato[]>(`${this.apiServerUrl}/DataEntryIFD/getListaTipoContrato`);
    }
 
    public getBolsa(): Observable<Bolsa[]>{
        return this.http.get<Bolsa[]>(`${this.apiServerUrl}/DataEntryIFD/getListaBolsa`);
    }

    public getContrato(underlying:number,fecha:number, exchange:number, typeContract:number): Observable<Contrato[]>{
        return this.http.get<Contrato[]>(`${this.apiServerUrl}/DataEntryIFD/getListaContrato?underlying=${underlying}&fecha=${fecha}&exchange=${exchange}&typeContract=${typeContract}`);
    }
    public getMesExpiracion( exchange:number, typeContract:number, ticker:String): Observable<MesExpiracion[]>{
        return this.http.get<MesExpiracion[]>(`${this.apiServerUrl}/DataEntryIFD/getListaMesExpiracion?exchange=${exchange}&typeContract=${typeContract}&ticker=${ticker}`);
    }

    public getSubordinateAccount( idSociedad:number, idBroker:number): Observable<SubordinateAccount[]>{
        return this.http.get<SubordinateAccount[]>(`${this.apiServerUrl}/DataEntryIFD/getListaSubordinateAccount?idSociedad=${idSociedad}&idBroker=${idBroker}`);
    }


    public getTipoLiquidacion(): Observable<TipoLiquidacion[]>{
        return this.http.get<TipoLiquidacion[]>(`${this.apiServerUrl}/DataEntryIFD/getListaTipoLiquidacion`);
    }

    public getSellBuy(): Observable<SellBuy[]>{
        return this.http.get<SellBuy[]>(`${this.apiServerUrl}/DataEntryIFD/getListaSellBuy`);
    }

    public getBroker(): Observable<Broker[]>{
        return this.http.get<Broker[]>(`${this.apiServerUrl}/DataEntryIFD/getListaBroker`);
    }
    
    public getInstrumento(tabla:string): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaInstrumento?tabla=${tabla}`);
    }
    public getSociedad(): Observable<Sociedad[]>{
        return this.http.get<Sociedad[]>(`${this.apiServerUrl}/DataEntryIFD/getListaSociedad`);
    }

    public getBenchmark(): Observable<Benchmark[]>{
        return this.http.get<Benchmark[]>(`${this.apiServerUrl}/DataEntryIFD/getListaBenchmark`);
    }
   
    public getContractInMetricTons(contrato:number, bolsa:number): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/contratoinMetricTons?contrato=${contrato}&bolsa=${bolsa}`)
        .pipe(tap(() =>{
          
            this._refreshModificar$.next();
          } )  
        )
    }
    public getfactorUnitMeasure(contrato:number, bolsa:number): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/factorContratoUnitMed?contrato=${contrato}&bolsa=${bolsa}`)
        .pipe(tap(() =>{
          
            this._refreshModificar$.next();
          } )  
        )
    }
    // public actualizarOperacion_SQL(operacionSQL_Broker: OperacionSQL_Broker){
    //     return this.http
    //     .post<string>(`${this.apiServerUrl}/DataEntryIFD/actualizarRegistroSQL`,operacionSQL_Broker)
    //     .pipe(tap(() =>{
          
    //         this._refresh$.next();
    //       } )  
    //     )
    // }
    public actualizarOperacion_SQL(operacionSQL_Broker: OperacionSQL_Broker): Observable<Boolean>{
        return this.http
        .post<Boolean>(`${this.apiServerUrl}/DataEntryIFD/actualizarRegistroSQL`,operacionSQL_Broker)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public cancelarIFD(idSQL: number, fecha:number, usuario:string){
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/cancelarIFD?idSQL=${idSQL}&fecha=${fecha}&usuario=${usuario}`);
        
    }

    public cancelarIFD_PoBo(idSQL: number, fecha:number, usuario:string){
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/cancelarIFD_PoBo?idSQL=${idSQL}&fecha=${fecha}&usuario=${usuario}`);
    }


    public getLista_SettlementReason(tabla:string): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getMotivoLiquidacion?tabla=${tabla}`);
    }
    public getDescUnidadMedida(contrato:number, bolsa:number): Observable<Descripcion>{
        return this.http.get<Descripcion>(`${this.apiServerUrl}/DataEntryIFD/descUnidadMedida?contrato=${contrato}&bolsa=${bolsa}`)
        .pipe(tap(() =>{
            this._refreshModificar$.next();
          } )  
        )
 
    }
    public getLiquidarOperacionSQL(operacionLiquidar: OperacionLiquidar){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/liquidarOperacionSQL`,operacionLiquidar)
     
    }
    public getListaSeason(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaSeason`);
    }
    
    public getListaOptionClass(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaOptionClass`);
    }
    public getListaSpecificLimit(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaSpecificLimit`);
    }
    public getListaPlanningCampaign(): Observable<PlanningByCampaign[]>{
        return this.http
        .get<PlanningByCampaign []>(`${this.apiServerUrl}/DataEntryIFD/getListaPlanningCampaign`)
     }
     public getListaSubyacente(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaSubyacente`);
    }
    public guardarLimiteEspecifico(limiteCampanha: PlanningByCampaign){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/guardarLimiteEspecifico`,limiteCampanha)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public getEliminarLimiteEspecifico(limiteCampanha: PlanningByCampaign){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/eliminarLimiteEspecifico`,limiteCampanha)
     
    }
    public getActualizarLimiteEspecifico(limiteCampanha: PlanningByCampaign){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/actualizarLimiteEspecifico`,limiteCampanha)
     
    }
    public getListaCampaign(): Observable<Campaign[]>{
        return this.http
        .get<Campaign []>(`${this.apiServerUrl}/DataEntryIFD/getListaCampaign`)
     }
     public guardarCampanha(campanha: Campaign){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/guardarCampanha`,campanha)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public getEliminarCampanha(campanha: Campaign){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/eliminarCampanha`,campanha)
     
    }
    public getActualizarCampanha(campanha: Campaign){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/actualizarCampanha`,campanha)
     
    }
    public getListaMes( fecha:number): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaMes?fecha=${fecha}`);
    }
    
    public getListaTipoProducto(subyacente:number): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaTipoProducto?subyacente=${subyacente}`);
    }
    
    public getListaDestino(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaDestino`);
    }
    public getOperacionPricing(idSQL:number): Observable<Pricing>{
        return this.http.get<Pricing>(`${this.apiServerUrl}/DataEntryIFD/getOperacionPricing?idSQL=${idSQL}`);
    }
    public getListaTipoEstrategia(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaTipoEstrategia`);
    }
    public getListaPortafolio(empresa:number): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaPortafolio?empresa=${empresa}`);
    }
    public getListaFicha(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaFicha`);
    }  
    public getListaProteccion(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaProteccion`);
    }  

    public getListaIFDSinEstrategia(empresa:number): Observable<IFDSinEstrategia[]>{
        
        
        this.showSpinner.next(true);
        
        return this.http
        .get<IFDSinEstrategia[]>(`${this.apiServerUrl}/DataEntryIFD/getListaIFDSinEstrategia?empresa=${empresa}`)
        .pipe(
            tap(response => this.showSpinner.next(false), (error: any) => this.showSpinner.next(false))
          );
        
    }
    public getNuevoCodigoEstrategia(): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/nuevoCodigoEstrategia`);
        
    }
    public guardarEstrategia(estrategia: Estrategia){
        return this.http
        .post<Boolean>(`${this.apiServerUrl}/DataEntryIFD/guardarEstrategia`,estrategia)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public getTMTotalLimite(idCampaign:number,idOptionClass:number,idSpecificLimit:number): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/tmTotalLimite?idCampaign=${idCampaign}&idOptionClass=${idOptionClass}&idSpecificLimit=${idSpecificLimit}`);
        
    }
    public getTMUtilizado(idOptionClass:number,idCampaign:number): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/tmUtilizado?idOptionClass=${idOptionClass}&idCampaign=${idCampaign}`);
        
    }
    public getListaLimiteGeneral(fecha:number,empresa:number): Observable<DetalleLimite>{
        return this.http
        .get<DetalleLimite>(`${this.apiServerUrl}/DataEntryIFD/getListaLimiteGeneral?fecha=${fecha}&empresa=${empresa}`)
     }
     public getAlertLimit(): Observable<AlertLimit[]>{
        return this.http
        .get<AlertLimit[]>(`${this.apiServerUrl}/DataEntryIFD/getListaAlertaLimite`)
     }
     public getValoresEstrategia(estrategia:number): Observable<ModificarEstrategia>{
        return this.http
        .get<ModificarEstrategia>(`${this.apiServerUrl}/DataEntryIFD/getValoresEstrategia?estrategia=${estrategia}`)
    }
    public getListaIFDConEstrategia(estrategia:number): Observable<IFDSinEstrategia[]>{
        return this.http
        .get<IFDSinEstrategia[]>(`${this.apiServerUrl}/DataEntryIFD/getListaIFDConEstrategia?estrategia=${estrategia}`)
    }
    public actualizarEstrategia(estrategia: Estrategia){
        return this.http
        .post<String>(`${this.apiServerUrl}/DataEntryIFD/actualizarEstrategia`,estrategia)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public getListaEstrategiaAprobar(approval:number, fechainicio:number, fechafin:number): Observable<AprobarEstrategia[]>{
        return this.http
        .get<AprobarEstrategia []>(`${this.apiServerUrl}/DataEntryIFD/getListaEstrategiaporAprobar?approval=${approval}&fechainicio=${fechainicio}&fechafin=${fechafin}`)
     }
     public getListaEstado(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaEstado`);
    }
    public getRolUsuario(usuario:string): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getRolUsuario?usuario=${usuario}`)
        .pipe(tap(() =>{
          
            this._refreshModificar$.next();
          } )  
        )
        
    }
    public getActualizarEstrategia(estrategia_estado: AprobarEstrategia_Estado){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/getActualizarEstrategia`,estrategia_estado)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }   
    public getEstrategiaCaksIguales(idEstrategia:number): Observable<Descripcion>{
        return this.http
        .get<Descripcion>(`${this.apiServerUrl}/DataEntryIFD/getEstrategiaCaksIguales?idEstrategia=${idEstrategia}`)
    }
    public enviarSolicitudCambioFecha(fechaVcto:string, idContrato:string,idSQL:number, usuario:string ){
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/enviarSolicitudCambioFecha?fechaVcto=${fechaVcto}&idContrato=${idContrato}&idSQL=${idSQL}&usuario=${usuario}`);
    }   
    public getListaOperacionesAprobar(approval:number, fechainicio:number, fechafin:number): Observable<AprobarOperacion[]>{
        return this.http
        .get<AprobarOperacion []>(`${this.apiServerUrl}/DataEntryIFD/getListaOperacionesporAprobar?approval=${approval}&fechainicio=${fechainicio}&fechafin=${fechafin}`)
     }
     public getActualizarOperacion(operacion: AprobarOperacion_Estado){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/getActualizarOperacion`,operacion)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public getListaCierrePortafolio(fechaInicio:number,fechaFin:number, empresa:number, tipoVol:number): Observable<EstadoCierreIFD[]>{
        return this.http
        .get<EstadoCierreIFD []>(`${this.apiServerUrl}/DataEntryIFD/getEstadoCierrePortafolio?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&empresa=${empresa}&tipoVol=${tipoVol}`)
     }
     public getListaDeshacerCierrePortafolio(fechaInicio:number,fechaFin:number, empresa:number,tipoVol:number): Observable<EstadoCierreIFD[]>{
        return this.http
        .get<EstadoCierreIFD []>(`${this.apiServerUrl}/DataEntryIFD/getEstadoDeshacerCierrePortafolio?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&empresa=${empresa}&tipoVol=${tipoVol}`)
     }
     public getCierreCurva(fecha:number, empresa:number): Observable<number>{
        return this.http
        .get<number>(`${this.apiServerUrl}/DataEntryIFD/getCierreCurva?fecha=${fecha}&empresa=${empresa}`)
     }
     public getCierrePortafolioMatlab(fecha:number[], empresa:number,totalSubyacente:number,subyacente:number[], opcion:number, usuario:string): Observable<number>{
        this.showSpinner.next(true);
        
        return this.http
        .get<number>(`${this.apiServerUrl}/DataEntryIFD/getCierrePortafolioMatlab?fecha=${fecha}&empresa=${empresa}&totalSubyacente=${totalSubyacente}&subyacente=${subyacente}&opcion=${opcion}&usuario=${usuario}`)
        .pipe(
            tap(response => this.showSpinner.next(false), (error: any) => this.showSpinner.next(false))
          );
    }
    public getDeshacerCierrePortafolioMatlab(fecha:number[], empresa:number,totalSubyacente:number,subyacente:number[], opcion:number, usuario:string): Observable<number>{
        // return this.http
        // .get<number>(`${this.apiServerUrl}/DataEntryIFD/getCierrePortafolioMatlab?fecha=${fecha}&empresa=${empresa}&opcion=${opcion}`)

        this.showSpinner.next(true);
        
        return this.http
        .get<number>(`${this.apiServerUrl}/DataEntryIFD/getDeshacerCierrePortafolioMatlab?fecha=${fecha}&empresa=${empresa}&totalSubyacente=${totalSubyacente}&subyacente=${subyacente}&opcion=${opcion}&usuario=${usuario}`)
        .pipe(
            tap(response => this.showSpinner.next(false), (error: any) => this.showSpinner.next(false))
          );
    }

    public getListaIFDMetricaRiesgo(fechaReporte:number): Observable<ResultadoMetricaIFD[]>{
        return this.http
        .get<ResultadoMetricaIFD []>(`${this.apiServerUrl}/DataEntryIFD/getListaIFDMetricaRiesgo?fechaReporte=${fechaReporte}`)
     }
     public guardarLogUsuario(idEvento:number,  usuario:string): Observable<number>{
        this.showSpinner.next(true);
        return this.http
        .get<number>(`${this.apiServerUrl}/DataEntryIFD/guardarLogUsuario?idEvento=${idEvento}&usuario=${usuario}`)
        .pipe(
            tap(response => this.showSpinner.next(false), (error: any) => this.showSpinner.next(false))
          );
    }
    public getReprocesoPortafolioMatlab(fecha:number[], empresa:number,totalSubyacente:number,subyacente:number[], opcion:number, usuario:string): Observable<number>{
        this.showSpinner.next(true);
        
        return this.http
        .get<number>(`${this.apiServerUrl}/DataEntryIFD/getReprocesoPortafolioMatlab?fecha=${fecha}&empresa=${empresa}&totalSubyacente=${totalSubyacente}&subyacente=${subyacente}&opcion=${opcion}&usuario=${usuario}`)
        .pipe(
            tap(response => this.showSpinner.next(false), (error: any) => this.showSpinner.next(false))
          );
    }
    public getDeshacerReprocesoPortafolioMatlab(fecha:number[], empresa:number,totalSubyacente:number,subyacente:number[], opcion:number, usuario:string): Observable<number>{
        this.showSpinner.next(true);
        
        return this.http
        .get<number>(`${this.apiServerUrl}/DataEntryIFD/getDeshacerReprocesoPortafolioMatlab?fecha=${fecha}&empresa=${empresa}&totalSubyacente=${totalSubyacente}&subyacente=${subyacente}&opcion=${opcion}&usuario=${usuario}`)
        .pipe(
            tap(response => this.showSpinner.next(false), (error: any) => this.showSpinner.next(false))
          );
    }
    public getActualizarListaIFDs(idSQL:number, idEstadoIFD:number, fechaInicio:number,fechaFin:number,idEmpresa:number): Observable<IFDPortafolioxFecha[]>{
        return this.http.get<IFDPortafolioxFecha[]>(`${this.apiServerUrl}/DataEntryIFD/getActualizarListaIFDs?idSQL=${idSQL}&idEstadoIFD=${idEstadoIFD}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idEmpresa=${idEmpresa}`);
    }
    public reprocesarOperacion_SQL(operacionReprocesar: IFDReprocesarxFecha[]){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/reprocesarOperacionSQL`,operacionReprocesar)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    
    public getBrokerDataOperaciones(dataBroker:number): Observable<Broker[]>{
        return this.http.get<Broker[]>(`${this.apiServerUrl}/DataEntryIFD/getListaBrokerDataOperaciones?dataBroker=${dataBroker}`);
    }

    public guardarPricing(pricing: Pricing){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/guardarPricing`,pricing)
     
    }
    public getEliminarPricing(idSQL:number): Observable<number>{
        return this.http
        .get<number>(`${this.apiServerUrl}/DataEntryIFD/getEliminarPricing?idSQL=${idSQL}`)
     }
     public getListaBrokerOperacionesSinCuenta(empresa:number,subyacente:number,fecha:number,broker:number): Observable<listaoperacionesbrokers[]>{
        return this.http
        .get<listaoperacionesbrokers[]>(`${this.apiServerUrl}/DataEntryIFD/OperacionesBrokerSinCuenta?sociedad=${empresa}&subyacente=${subyacente}&fecha=${fecha}&broker=${broker}`)
        

    }   
    public getListaSociedadAdministradora(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaSociedadAdministradora`);
    }
       
    public getListaCuentaBroker(idSociedadAdministradora:number): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaCuentaBroker?idSociedadAdministradora=${idSociedadAdministradora}`);
    }
    public getListaSociedadAdministrada(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaSociedadAdministrada`);
    }
    public getListaCampanha(idSociedadAdministrada:number): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaCampanha?idSociedadAdministrada=${idSociedadAdministrada}`);
    }
    public getListaProducto(idCampanha:number): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaProducto?idCampanha=${idCampanha}`);
    }
    
    public getListaContratoMarco(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaContratoMarco`);
    }
    public getListaCuentaBrokerProductoCampanha(): Observable<CargaCtaBrokerAsociada[]>{
        return this.http
        .get<CargaCtaBrokerAsociada[]>(`${this.apiServerUrl}/DataEntryIFD/getListaCuentaBrokerProductoCampanha`)
     }
     public getEliminarCuentaBrokerAsociada(cuentaBrokerAsociada: AccountBrokerCampign){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/eliminarCuentaBrokerAsociada`,cuentaBrokerAsociada)
     
    }
    public guardarCuentaBrokerAsociada(cuentaBrokerAsociada: AccountBrokerCampign){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/guardarCuentaBrokerAsociada`,cuentaBrokerAsociada)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public getListaOperacionesxVencer(fecha:number): Observable<ListaOperacionesxVencer[]>{
        return this.http
        .get<ListaOperacionesxVencer[]>(`${this.apiServerUrl}/DataEntryIFD/getListaOperacionesxVencer?fecha=${fecha}`)
        

    }
    public getListaSubyacenteDerivado(empresa:number): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaSubyacenteDerivado?empresa=${empresa}`);
    }
    public getListaEstadio(tabla:string): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaEstadio?tabla=${tabla}`);
    }
    public realizarSplit(idSQL:number,TM:number): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/realizarSplit?idSQL=${idSQL}&TM=${TM}`);
    }
    public getListaIFDSinEstrategiaCM(empresa:number, producto:number): Observable<IFDSinEstrategia[]>{
        
        
        this.showSpinner.next(true);
        
        return this.http
        .get<IFDSinEstrategia[]>(`${this.apiServerUrl}/DataEntryIFD/getListaIFDSinEstrategiaCM?empresa=${empresa}&producto=${producto}`)
        .pipe(
            tap(response => this.showSpinner.next(false), (error: any) => this.showSpinner.next(false))
          );
        
    }
    public getListaEmbarquePricing( idEmpresa:number, idPortafolio:number,idEstrategia:number): Observable<EmbarquePricingACubrir[]>{
        return this.http
        .get<EmbarquePricingACubrir[]>(`${this.apiServerUrl}/DataEntryIFD/listaEmbarquePricing?empresa=${idEmpresa}&idPortafolio=${idPortafolio}&idEstrategia=${idEstrategia}`)
        

    }
    public guardarEstrategiaCM(estrategia: EstrategiaCM){
        return this.http
        .post<Boolean>(`${this.apiServerUrl}/DataEntryIFD/guardarEstrategiaCM`,estrategia)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }

    public actualizarVistaFret(pCodEstrategia: number, usuario:string){
        return this.http.get<boolean>(`${this.apiServerUrl}/DataEntryIFD/actualizarVistaFret?pCodEstrategia=${pCodEstrategia}&usuario=${usuario}`);
    }
    
    public actualizarEstrategiaCM(estrategia: EstrategiaCM){
        return this.http
        .post<String>(`${this.apiServerUrl}/DataEntryIFD/actualizarEstrategiaCM`,estrategia)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public getListaInventarioTransito( idEmpresa:number, idPortafolio:number,idEstrategia:number): Observable<InventarioTransitoACubrir[]>{
        return this.http
        .get<InventarioTransitoACubrir[]>(`${this.apiServerUrl}/DataEntryIFD/listaInventarioTransito?empresa=${idEmpresa}&idPortafolio=${idPortafolio}&idEstrategia=${idEstrategia}`)
        

    }
    public getListaConsumo( idEmpresa:number, idPortafolio:number,idEstrategia:number): Observable<ConsumoACubrir[]>{
        return this.http
        .get<ConsumoACubrir[]>(`${this.apiServerUrl}/DataEntryIFD/listaConsumo?empresa=${idEmpresa}&idPortafolio=${idPortafolio}&idEstrategia=${idEstrategia}`)
    }
    public getListaProteccionMolienda(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaProteccionMolienda`);
    }  
    public getListaOperacionesLiquidadas(idCompania:number,idSubyacente:number, fechainicio:number, fechafin:number): Observable<OperacionLiquidada[]>{
        return this.http
        .get<OperacionLiquidada []>(`${this.apiServerUrl}/DataEntryIFD/getListaOperacionesLiquidadas?idCompania=${idCompania}&idSubyacente=${idSubyacente}&fechainicio=${fechainicio}&fechafin=${fechafin}`)
     }   
     public abrirOperacion_SQL(operacionLiquidada: OperacionLiquidada): Observable<Boolean>{
        return this.http
        .post<Boolean>(`${this.apiServerUrl}/DataEntryIFD/abrirOperacionSQL`,operacionLiquidada)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public getFechaLiquidacion(idSQL:number): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/fechaLiquidacion?idSQL=${idSQL}`)
        .pipe(tap(() =>{
          
            this._refreshModificar$.next();
          } )  
        )
    }
    public getInitIFDModificar(idSQL:number, contrato:number ,bolsa:number, idSociedad:number, idBroker:number, idUnderlying:number, fecha:number, idTipoContrato:number): Observable<ObjInitIFDModificar>{
        return this.http.get<ObjInitIFDModificar>(`${this.apiServerUrl}/DataEntryIFD/getInitIFDModificar?idSQL=${idSQL}&contrato=${contrato}&bolsa=${bolsa}&idSociedad=${idSociedad}&idBroker=${idBroker}&idUnderlying=${idUnderlying}&fecha=${fecha}&idTipoContrato=${idTipoContrato}`)
        .pipe(tap(() =>{
          
            this._refreshModificar$.next();
          } )  
        )
        
    }
    public cargarValoresEstrategiaMesCobertura(IDSQL:number): Observable<DatosMesCoberturaEstrategia>{
        return this.http
        .get<DatosMesCoberturaEstrategia>(`${this.apiServerUrl}/DataEntryIFD/getCargarValoresEstrategiaMesCobertura?IDSQL=${IDSQL}`)
    }
    public getListaEstadioxGrupo(tabla:string, idEstadio:number): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getListaEstadioxGrupo?tabla=${tabla}&idEstadio=${idEstadio}`);
    }
    public getCargarMesCobertura( idEstadio:number, idEstrategia:number,TM:number,sociedad:number,underliyingCla:number ): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/DataEntryIFD/getCargarMesCobertura?idEstadio=${idEstadio}&idEstrategia=${idEstrategia}&TM=${TM}&sociedad=${sociedad}&underliyingCla=${underliyingCla}`);
    }
    public abrirOperacion_SQLLiquidaT(operacionLiquidada: OperacionLiquidada): Observable<Boolean>{
        return this.http
        .post<Boolean>(`${this.apiServerUrl}/DataEntryIFD/abrirOperacionSQLLiquidadaT`,operacionLiquidada)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
    public cambiarMesCobertura(nuevoMesCobertura: NuevoMesCobertura): Observable<Boolean>{
        return this.http
        .post<Boolean>(`${this.apiServerUrl}/DataEntryIFD/cambiarMesCobertura`,nuevoMesCobertura)
        .pipe(tap(() =>{
          
            this._refresh$.next();
          } )  
        )
    }
  
    public getFechaOperacionLiquidada(idSQL:number): Observable<number>{
        
        return this.http.get<number>(`${this.apiServerUrl}/DataEntryIFD/findFechaOperacionLiquidada?idSQL=${idSQL}`);
        
    }
    public enviarSolicitudCancelarIFD(idSQL: number, fecha:number, usuario:string){
        return this.http.get<string>(`${this.apiServerUrl}/DataEntryIFD/enviarSolicitudCancelarIFD?idSQL=${idSQL}&fecha=${fecha}&usuario=${usuario}`);
        
    }
    public getInhabilitarCampania(campania: Campaign){
        return this.http.post<string>(`${this.apiServerUrl}/DataEntryIFD/inhabilitarCampania`, campania)
    }
    public getHabilitarCampania(campania: Campaign){
        return this.http.post<string>(`${this.apiServerUrl}/DataEntryIFD/habilitarCampania`, campania)
    }
    public getTipoPromedio(): Observable<TipoPromedio[]>{
        return this.http.get<TipoPromedio[]>(`${this.apiServerUrl}/DataEntryIFD/getListaTipoPromedio`);
    }
    public getReportesContabilidad(fecProceso: number, underlying:number): Observable<Array<Array<ReporteContabilidad>>>{
        return this.http.get<Array<Array<ReporteContabilidad>>>(`${this.apiServerUrl}/DataEntryIFD/getReportesContabilidad?fecProceso=${fecProceso}&underlying=${underlying}`);
    }
    public guardarEstrategiaHEDGE(estrategia: EstrategiaHEDGE){
        return this.http.post<Boolean>(`${this.apiServerUrl}/DataEntryIFD/guardarHedgeRBD`,estrategia).
        pipe(tap(() =>{this._refresh$.next(); } )  )
    }
    public getlistahedge(fechafret:number): Observable<ListaHedge[]>{
        return this.http.get<ListaHedge[]>(`${this.apiServerUrl}/Fret/obtenerdataHedge?fechafret=${fechafret}`);
    }
    public getlistahedgeabierto(fechafret:number): Observable<ListaHedgeAbierto[]>{
        return this.http.get<ListaHedgeAbierto[]>(`${this.apiServerUrl}/Fret/obtenerdataHedgeAbierto?fechafret=${fechafret}`);
    }
    public getIFDHedgeEstrategicioRBD(estrategia:number): Observable<EstrategiaHEDGE[]>{
        return this.http
        .get<EstrategiaHEDGE[]>(`${this.apiServerUrl}/DataEntryIFD/getListaEstrategiaHEDGE?estrategia=${estrategia}`)
    }

    public obtener_DatosPoBo(id :number,groupOption: number): Observable<objInitPoBo>{
        return this.http.get<objInitPoBo>(`${this.apiServerUrl}/DataEntryIFD/obtener_DatosPoBo?id=${id}&groupOption=${groupOption}&underlying=${this.idUnderlying}&bolsa=${this.bolsa}&tipoContrato=${this.tipoContrato}`);
    }

    public guardarPoBoPaper(paperPobo: PoBo_Paper){
        return this.http.post<PoBo_Paper>(`${this.apiServerUrl}/DataEntryIFD/guardarPoBoPaper`, paperPobo)
    }

    public getPoBo_Paper(codigo:number): Observable<PoBo_Paper>{
        return this.http.get<PoBo_Paper>(`${this.apiServerUrl}/DataEntryIFD/getPoBo_Paper?codigo=${codigo}`);
    }

    public liquidarPapelPoBo(papelLiquidar: objLiquidarPoBo){
        return this.http
        .post<string>(`${this.apiServerUrl}/DataEntryIFD/liquidarPapelPoBo`,papelLiquidar)
     
    }

    public obtenerObjLiquidarPoBo(idSQL:number, contrato:number,bolsa:number): Observable<objLiquidarPoBo>{
        return this.http.get<objLiquidarPoBo>(`${this.apiServerUrl}/DataEntryIFD/obtenerObjLiquidarPoBo?idSQL=${idSQL}&contrato=${contrato}&bolsa=${bolsa}`);
    }

    // public getLiquidarOperacionSQL(operacionLiquidar: OperacionLiquidar){
    //     return this.http
    //     .post<string>(`${this.apiServerUrl}/DataEntryIFD/liquidarOperacionSQL`,operacionLiquidar)
     
    // }

}