import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, observable, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LibroFisicoOpenShipments } from "./LibroFisicoOpenShipments";
import { Society } from "../Society";
import { Underlying } from "../underlying";
import { ObjConsultaPortafolio } from "./ObjConsultaPortafolio";
import { objInitGestionOperacion } from "./objInitGestionOperacion";
import { cargaCombo } from "../cargaCombo";
import { objIngresarOperacion } from "./objIngresarOperacion";
import { PhysicalCancelled } from "./PhysicalCancelled";
import { Shipment } from "../Shipment";
import { listaBases } from "./listaBases";
import { objInitBase } from "./objInitBase";
import { ClosingBasis } from "../ClosingBasis";
import { CancellationBase } from "./CancellationBase";
import { objInitListaHijos } from "./objInitListaHijos";
import { objInitPasarTransito } from "./objInitPasarTransito";
import { ObjDescargaBarcoCM } from "./ObjDescargaBarcoCM";
import { PalmGrowersPremium } from "./PalmGrowersPremium";
import { ControlCierresCM } from "./ControlCierresCM";
import { ObjInitCierreCM } from "./ObjInitCierreCM";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Curve } from "../Curve";
import { ReturnPhysicalState } from "./ReturnPhysicalState";
import { listaReversion } from "./listaReversion";
import { Physical } from "../Physical";
import { ObjInitCrearFuturo } from "./ObjInitCrearFuturo";
import { Future } from "../Future";
import { objComprarFuturo } from "./objComprarFuturo";
import { ClosingPrice } from "../ClosingPrice";
import { listarFuturos } from "./listarFuturos";
import { CancellationFuture } from "./CancellationFuture";
import { objVenderFuturo } from "./objVenderFuturos";
import { ObjAsignarFuturo } from "./ObjAsignarFuturo";
import { ObjModificarFuturo } from "./objModificarFuturo";
import { ObjInitCargaMTM } from "./ObjInitCargaMTM";
import { ConsultaPortafolio } from "../ConsultaPortafolio";
import { ObjEliminarFuturo } from "./ObjEliminarFuturo";
import { objGuardarBase } from "./objGuardarBase";

@Injectable({
    providedIn: 'root'
})
export class LibroFisicoService{
    
    private apiServerUrl=environment.apiBaseUrl;

    public contrato: string;
    public subyacente: number;
    public sociedad: number;
    public fisicoID: number;
    public flgIngresoOperacion:boolean;
    public flgIngresoBase:boolean;
    public fobFijado: number;
    public tmTransito: number;
    public flgCierre: boolean;
    public flgIntercompany: boolean;
    public tipoPrecioCM: string;
    public futuroTicker: string;
    public saldoFuturosComprar: number;
    usuarioRegistra: Boolean = false;

    public flgDescargaBarcoTransito:boolean;

    private estadosSubect: BehaviorSubject<string[][]>;

    public estadosPortafolio: string[][];

    constructor(private http: HttpClient){
        this.estadosSubect = new BehaviorSubject<string[][]>(this.estadosPortafolio);
    }

    // public getCompanias(): Observable<Companias[]>{
    //     return this.http.get<Companias[]>(`${this.apiServerUrl}/libroFisico/companias`);
    // }

    public getSociedades(): Observable<Society[]>{
        return this.http.get<Society[]>(`${this.apiServerUrl}/libroFisico/sociedades`);
    }
    public getproductos(compania:number): Observable<Underlying[]>{
        return this.http.get<Underlying[]>(`${this.apiServerUrl}/libroFisico/productosXCompania?compania=${compania}`);
    }
    public getPortafolioLibroFisico(estado:number,subyacente:number,dato:number): Observable<LibroFisicoOpenShipments[]>{
        return this.http.get<LibroFisicoOpenShipments[]>(`${this.apiServerUrl}/libroFisico/listarPortafolioFisico?estado=${estado}&subyacente=${subyacente}&dato=${dato}`);
    }
    public listarPortafolios(estado:number,subyacente:number): Observable<ObjConsultaPortafolio>{
        return this.http.get<ObjConsultaPortafolio>(`${this.apiServerUrl}/libroFisico/listarPortafolios?estado=${estado}&subyacente=${subyacente}`);
    }
    public obtenerobjInitGestionOperacion(subyacente:number): Observable<objInitGestionOperacion>{
        return this.http.get<objInitGestionOperacion>(`${this.apiServerUrl}/libroFisico/obtenerobjInitGestionOperacion?subyacente=${subyacente}`);
    }
    public obtenerContratosxBolsa(bolsa:number,subyacente:number): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/libroFisico/obtenerContratosxBolsa?bolsa=${bolsa}&subyacente=${subyacente}`);
    }
    public guardarNuevaOperacion(operacion: objIngresarOperacion){
        return this.http.post<objIngresarOperacion>(`${this.apiServerUrl}/libroFisico/guardarNuevaOperacion`,operacion);
    }
    public validarCrossCompany(barco:number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/libroFisico/validarCrossCompany?barco=${barco}`);
    }
    public consultarPasajesInventario(FisicoID:number): Observable<number>{
        return this.http.get<number>(`${this.apiServerUrl}/libroFisico/consultarPasajesInventario?FisicoID=${FisicoID}`);
    }
    public cancelarOperacion(fisico: PhysicalCancelled){
        return this.http.post<PhysicalCancelled>(`${this.apiServerUrl}/libroFisico/cancelarOperacion`,fisico);
    }
    public obtenerobjInitModificacionOperacion(fisicoID: number,subyacente:number): Observable<objInitGestionOperacion>{
        return this.http.get<objInitGestionOperacion>(`${this.apiServerUrl}/libroFisico/obtenerobjInitModificacionOperacion?fisicoID=${fisicoID}&subyacente=${subyacente}`);
    } 
    public obtenerCurrency(contrato:number): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/libroFisico/obtenerCurrency?contrato=${contrato}`);
    }
    public guardarModificacionBarco(fisico: objIngresarOperacion){
        return this.http.post<objIngresarOperacion>(`${this.apiServerUrl}/libroFisico/guardarModificacionBarco`,fisico);
    }
    public guardarBarco(barco: Shipment){
        return this.http.post<number>(`${this.apiServerUrl}/libroFisico/guardarBarco`,barco);
    }
    public listarBases(fisico:number): Observable<listaBases[]>{
        return this.http.get<listaBases[]>(`${this.apiServerUrl}/libroFisico/listarBases?fisico=${fisico}`);
    }
    public objetosIngresarBase(subyacente: number, fisico: number): Observable<objInitBase>{
        return this.http.get<objInitBase>(`${this.apiServerUrl}/libroFisico/objetosIngresarBase?subyacente=${subyacente}&fisico=${fisico}`);
    }
    public transformarToneladasxContrato(toneladas: string, contrato: string): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/libroFisico/transformarToneladasxContrato?toneladas=${toneladas}&contrato=${contrato}`);
    }
    public guardarBase(objBase: objGuardarBase){
        return this.http.post<ClosingBasis>(`${this.apiServerUrl}/libroFisico/guardarBase`,objBase);
    }
    public cancelarBase(baseCancelar: CancellationBase){
        return this.http.post<PhysicalCancelled>(`${this.apiServerUrl}/libroFisico/cancelarBase`,baseCancelar);
    }
    public objetosModificarBase(subyacente: number, codFisico: number, codBase: number): Observable<objInitBase>{
        return this.http.get<objInitBase>(`${this.apiServerUrl}/libroFisico/objetosModificarBase?subyacente=${subyacente}&codFisico=${codFisico}&codBase=${codBase}`);
    }
    public modificarBase(objBase: objGuardarBase){
        return this.http.post<ClosingBasis>(`${this.apiServerUrl}/libroFisico/modificarBase`,objBase);
    }
    public dividirOperacion(barco:string,tm:string, usuario: string): Observable<Physical>{
        return this.http.get<Physical>(`${this.apiServerUrl}/libroFisico/dividirOperacion?barco=${barco}&tm=${tm}&usuario=${usuario}`);
    }
    public obtenerListaHijos(barco: number): Observable<objInitListaHijos>{
        return this.http.get<objInitListaHijos>(`${this.apiServerUrl}/libroFisico/obtenerListaHijos?barco=${barco}`);
    }
    public obtenerObjetoPasajeTransito(barco: number): Observable<objInitPasarTransito>{
        return this.http.get<objInitPasarTransito>(`${this.apiServerUrl}/libroFisico/obtenerObjetoPasajeTransito?barco=${barco}`);
    }
    public pasarTransito(objPase: ObjDescargaBarcoCM){
        return this.http.post<ObjDescargaBarcoCM>(`${this.apiServerUrl}/libroFisico/pasarTransito`,objPase);
    }
    public pasarBarcoInventario(objPase: ObjDescargaBarcoCM){
        return this.http.post<ObjDescargaBarcoCM>(`${this.apiServerUrl}/libroFisico/pasarBarcoInventario`,objPase);
    }
    public cargarBenchmarck(bechmark: PalmGrowersPremium[]){
        return this.http.post<PalmGrowersPremium[]>(`${this.apiServerUrl}/libroFisico/cargarBenchmarck`,bechmark);
    }
    // public cargarBenchmarck(bechmark: PalmGrowersPremium){
    //     return this.http.post<PalmGrowersPremium>(`${this.apiServerUrl}/libroFisico/cargarBenchmarck`,bechmark);
    // }

    public obtenerDatosCierreCM(sociedad: number, usuario: string): Observable<ObjInitCierreCM>{
        return this.http.get<ObjInitCierreCM>(`${this.apiServerUrl}/libroFisico/obtenerDatosCierreCM?sociedad=${sociedad}&usuario=${usuario}`);
    }

    public obtenerDatosDeshacerCierreCM(sociedad: number): Observable<ObjInitCierreCM>{
        return this.http.get<ObjInitCierreCM>(`${this.apiServerUrl}/libroFisico/obtenerDatosDeshacerCierreCM?sociedad=${sociedad}`);
    }

    public realizarCierreCM(listaCierre: ControlCierresCM[]){
        return this.http.post<ControlCierresCM[]>(`${this.apiServerUrl}/libroFisico/realizarCierreCM`,listaCierre);
    }

    public deshacerCierreCM(listaCierre: ControlCierresCM[]){
        return this.http.post<ControlCierresCM[]>(`${this.apiServerUrl}/libroFisico/deshacerCierreCM`,listaCierre);
    }

    topic: string = "/topic/estados";
    stompClient: any;

    _connect() {
        let ws = new SockJS(this.apiServerUrl + '/ws');
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
        
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    errorCallBack(error) {
        // console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

     /**
      * Send message to sever via web socket
      * @param {*} message 
      */
    _send() {
        this.stompClient.send("/app/estado", {}, JSON.stringify([2,3]));
    }

    onMessageReceived(message) {
        this.estadosPortafolio = JSON.parse(message.body);
        this.estadosSubect.next(this.estadosPortafolio);
    }

    public obtenerEstados(): Observable<string[][]>{
        return this.estadosSubect.asObservable();
    }

    public cerrarConsumo(usuario: string): Observable<ObjInitCierreCM>{
        return this.http.get<ObjInitCierreCM>(`${this.apiServerUrl}/libroFisico/cerrarConsumo?usuario=${usuario}`);
    }
    public cerrarInventario(usuario: string): Observable<ObjInitCierreCM>{
        return this.http.get<ObjInitCierreCM>(`${this.apiServerUrl}/libroFisico/cerrarInventario?usuario=${usuario}`);
    }

    public deshacerCierreConsumo_Inventario(cierre: number): Observable<ObjInitCierreCM>{
        return this.http.get<ObjInitCierreCM>(`${this.apiServerUrl}/libroFisico/deshacerCierreConsumo_Inventario?cierre=${cierre}`);
    }

    public guardarSolicitudDeCambio(solicitud: ReturnPhysicalState){
        return this.http.post<ReturnPhysicalState>(`${this.apiServerUrl}/libroFisico/guardarSolicitudDeCambio`,solicitud);
    }
    public listarSolicitudesReversionBarco(): Observable<listaReversion[]>{
        return this.http.get<listaReversion[]>(`${this.apiServerUrl}/libroFisico/listarSolicitudesReversionBarco`);
    }
    
    public aceptarReversionaOpen(solicitud: listaReversion){
        return this.http.post<boolean>(`${this.apiServerUrl}/libroFisico/aceptarReversionaOpen`,solicitud);
    }
    public rechazarReversionaOpen(solicitud: listaReversion){
        return this.http.post<boolean>(`${this.apiServerUrl}/libroFisico/rechazarReversionaOpen`,solicitud);
    }
    public guardarPrecioContrato(precio: Curve){
        return this.http.post<Curve>(`${this.apiServerUrl}/libroFisico/guardarPrecioContrato`,precio);
    }

    public revertiSplitCM(BarcoPadre:number,BarcoHijo:number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/libroFisico/revertiSplitCM?BarcoPadre=${BarcoPadre}&BarcoHijo=${BarcoHijo}`);
    }

    public obtenerDatosCrearFuturo(codUnderlying:number): Observable<ObjInitCrearFuturo>{
        return this.http.get<ObjInitCrearFuturo>(`${this.apiServerUrl}/libroFisico/obtenerDatosCrearFuturo?codUnderlying=${codUnderlying}`);
    }

    public obtenerDatosComprarFuturo(codUnderlying:number): Observable<objComprarFuturo>{
        return this.http.get<objComprarFuturo>(`${this.apiServerUrl}/libroFisico/obtenerDatosComprarFuturo?codUnderlying=${codUnderlying}`);
    }

    public crearClosingPriceCompra(closingPrice: objComprarFuturo){
        return this.http.post<ClosingPrice>(`${this.apiServerUrl}/libroFisico/crearClosingPriceCompra`,closingPrice);
    }

    public guardarGrupoFuturo(nuevoFuturo: Future){
        return this.http.post<Future>(`${this.apiServerUrl}/libroFisico/guardarGrupoFuturo`,nuevoFuturo);
    }
    public transformarContratoXTM(volumenContrato:string, codFuturo: string): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/libroFisico/transformarContratoXTM?volumenContrato=${volumenContrato}&codFuturo=${codFuturo}`);
    }

    public obtenerTickerXFuturo(codFuturo: string): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/libroFisico/obtenerTickerXFuturo?codFuturo=${codFuturo}`);
    }

    public obtenerListaFuturosXFisico(codFisico: number): Observable<listarFuturos[]>{
        return this.http.get<listarFuturos[]>(`${this.apiServerUrl}/libroFisico/obtenerListaFuturosXFisico?codFisico=${codFisico}`);
    }
    public validarliminacionPricing(closingPriceID: number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/libroFisico/validarliminacionPricing?closingPriceID=${closingPriceID}`);
    }
    public eliminarPricing(objEliminar: ObjEliminarFuturo){
        return this.http.post<CancellationFuture>(`${this.apiServerUrl}/libroFisico/eliminarPricing`,objEliminar);
    }

    public obtenerDatosVenderFuturo(codUnderlying:number, codFisico:number): Observable<objVenderFuturo>{
        return this.http.get<objVenderFuturo>(`${this.apiServerUrl}/libroFisico/obtenerDatosVenderFuturo?codUnderlying=${codUnderlying}&codFisico=${codFisico}`);
    }
    public obtenerTotalContratosYPrecioCosto(FuturoID:string, FisicoID:number): Observable<number[]>{
        return this.http.get<number[]>(`${this.apiServerUrl}/libroFisico/obtenerTotalContratosYPrecioCosto?FuturoID=${FuturoID}&FisicoID=${FisicoID}`);
    }
    public calcularPNLVentaFuturos(FuturoID:string, FisicoID:number, precioVenta:number, precioCosto:number, TotalContratos:string): Observable<number>{
        return this.http.get<number>(`${this.apiServerUrl}/libroFisico/calcularPNLVentaFuturos?FuturoID=${FuturoID}&FisicoID=${FisicoID}&precioVenta=${precioVenta}&precioCosto=${precioCosto}&TotalContratos=${TotalContratos}`);
    }
    public guardarVentaFuturo(objVenta: objVenderFuturo){
        return this.http.post<ClosingPrice>(`${this.apiServerUrl}/libroFisico/guardarVentaFuturo`,objVenta);
    }
    public obtenerDatosAsignarFuturo(FisicoID:number): Observable<ObjAsignarFuturo>{
        return this.http.get<ObjAsignarFuturo>(`${this.apiServerUrl}/libroFisico/obtenerDatosAsignarFuturo?FisicoID=${FisicoID}`);
    }
    public guardarAsignacionFuturos(objetoGuardar: ObjAsignarFuturo){
        return this.http.post<ObjAsignarFuturo>(`${this.apiServerUrl}/libroFisico/guardarAsignacionFuturos`,objetoGuardar);
    }

    public obtenerDatosModificarFuturo(ClosingPriceID:number,FuturoID:number): Observable<ObjModificarFuturo>{
        return this.http.get<ObjModificarFuturo>(`${this.apiServerUrl}/libroFisico/obtenerDatosModificarFuturo?ClosingPriceID=${ClosingPriceID}&FuturoID=${FuturoID}`);
    }

    public modificarFuturo(objModificarFuturo: ObjModificarFuturo){
        // public modificarFuturo(closingPrice: ClosingPrice, UnderlyingID: number){
        return this.http.post<ClosingPrice>(`${this.apiServerUrl}/libroFisico/modificarFuturo`,objModificarFuturo);
    }
    public validarDisminucionPrice(FuturoID:number,Saldo:number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/libroFisico/validarDisminucionPrice?FuturoID=${FuturoID}&Saldo=${Saldo}`);
    }
    public obtenerDatosRecalcularMTM(): Observable<ObjInitCargaMTM>{
        return this.http.get<ObjInitCargaMTM>(`${this.apiServerUrl}/libroFisico/obtenerDatosRecalcularMTM`);
    }
    public recalcularMTM(Usuario:string): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/libroFisico/recalcularMTM?Usuario=${Usuario}`);
    }
    public getPortafolioFisico(desde:number, hasta:number, concepto:number): Observable<ConsultaPortafolio>{
        return this.http.get<ConsultaPortafolio>(`${this.apiServerUrl}/libroFisico/consultaPortafolioFisico?Desde=${desde}&Hasta=${hasta}&Concepto=${concepto}`);
    }
}