import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from "src/environments/environment";
import { ArrivalPlanning } from './ArrivalPlanning';
import { FreightQuote } from './FreightQuote';
import { objInitFormDataEntry } from './objInitFormDataEntry';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { objInitFormConfigDataEntry } from './objInitFormConfigDataEntry';
import { TurnoverDays } from './TurnoverDays';
import { ProductosFret } from './ProductosFret';
import { ListaConsultaIFD } from './ListaConsultaIFD';
import { BaseBudget } from './BaseBudget';
import { ProjectOfMonth } from './ProjectOfMonth';
import { UnderlyingQuality } from './UnderlyingQuality';
import { FobMarketFret } from './FobMarketFret';
import { Resultados } from './Resultados';
import { FretAdjustment } from './FretAdjustment';
import { DetalleIFDFret } from './DetalleIFDFret';
import { ConsultaIFDsFret } from './ConsultaIFDsFret';
import { objInitTabPosicion } from './objInitTabPosicion';
import { ResultadoPapelesLiquidados } from './ResultadoPapelesLiquidados';
import { cargaCombo } from '../Fisico/cargaCombo';
import { tablaticker } from './tablaticker';
import { tablaValorizacion } from './tablaValorizacion';
import { listaConfirmacionInputs } from './listaConfirmacionInputs';
import { Fret_ConfirmacionInput } from './Fret_ConfirmacionInput';
import { objDatosCRM } from './objDatosCRM';
import { FretSpread } from './FretSpread';
import { objOperacionSimulada } from './objOperacionSimulada';
import { Fret_WheatType } from './Fret_WheatType';

@Injectable({
  providedIn: 'root'
})
export class FretService {
  private apiServerUrl=environment.apiBaseUrl;

  private DataSubectFret: BehaviorSubject<objInitFormDataEntry>;
  public objDatosFret: objInitFormDataEntry;
  public resultadoValorizacion: any;
  
  topic: string = "/topic/datosDataEntryFret";
  stompClient: any;
  subscription: any; // Agregar una propiedad para almacenar la suscripción
  
  constructor(private http: HttpClient) {
    this.DataSubectFret = new BehaviorSubject<objInitFormDataEntry>(this.objDatosFret);
  }

  _connect(fecha: number, opcion: string, sociedad: number) {
    let ws = new SockJS(this.apiServerUrl + '/ws');
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame) {
      // Generar un destino único para la combinación de filtros
      const destination = `${_this.topic}/${fecha}/${opcion}/${sociedad}`;
  
      _this.subscription = _this.stompClient.subscribe(destination, function (sdkEvent) {
        _this.onMessageReceived(sdkEvent);
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  }

  _disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Cancelar la suscripción al destino anterior
    }
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  errorCallBack(error) {
    console.log("Error durante la conexión WebSocket: " + error);
    setTimeout(() => {
      // Reintentar la conexión
      const fecha = 1;
      const opcion = "valor2";
      const sociedad = 1;
      this._connect(fecha, opcion,sociedad);
    }, 5000);
  }
  public obtenerDatosDataEntry(fecha: string, opcion: string,usuarioRegistra: string, sociedad: number):Observable<objInitFormDataEntry>{
    return this.http.get<objInitFormDataEntry>(`${this.apiServerUrl}/Fret/obtenerDatosDataEntry?fecha=${fecha}&opcion=${opcion}&usuarioRegistra=${usuarioRegistra}&sociedad=${sociedad}`);
  }

  public guardarPlanificacion(arrivalPlanning: ArrivalPlanning){
    return this.http.post<ArrivalPlanning>(`${this.apiServerUrl}/Fret/guardarPlanificacion`,arrivalPlanning);
  }

  public guardarTipoTrigo(tipoTrigo: Fret_WheatType){
    return this.http.post<Fret_WheatType>(`${this.apiServerUrl}/Fret/guardarTipoTrigo`,tipoTrigo);
  }

  public guardarFlete(freightQuote: FreightQuote){
    return this.http.post<FreightQuote>(`${this.apiServerUrl}/Fret/guardarFletes`,freightQuote);
  }
  public guardarDiasGiro(turnoverDays: TurnoverDays){
    return this.http.post<TurnoverDays>(`${this.apiServerUrl}/Fret/guardarDiasGiro`,turnoverDays);
  }

  onMessageReceived(message) {
    this.objDatosFret = JSON.parse(message.body);
    this.DataSubectFret.next(this.objDatosFret);
  }

  _send(fecha: number, opcion: string, sociedad: number) {
    const params = []; // Arreglo de valores que deseas enviar como parámetro
    const destination = `/app/datosDataEntryFret/${fecha}/${opcion}/${sociedad}`;
    this.stompClient.send(destination, {}, JSON.stringify(params));
  }

  public obtenerDatos(): Observable<objInitFormDataEntry>{
    return this.DataSubectFret.asObservable();
  }

  public objInitFormConfigDataEntry(fecha: string, opcion: string,usuarioRegistra: string):Observable<objInitFormConfigDataEntry>{
    return this.http.get<objInitFormConfigDataEntry>(`${this.apiServerUrl}/Fret/objInitFormConfigDataEntry?fecha=${fecha}&opcion=${opcion}&usuarioRegistra=${usuarioRegistra}`);
  }

  public obtenerDatosConfigDataEntry(opcion: string,usuarioRegistra: string):Observable<objInitFormConfigDataEntry>{
    return this.http.get<objInitFormConfigDataEntry>(`${this.apiServerUrl}/Fret/obtenerDatosConfigDataEntry?opcion=${opcion}&usuarioRegistra=${usuarioRegistra}`);
  }
  //Datos Iniciales de los productos del Fret

  public guardarConfiguracion(opcion: string, idPortafolio: number,idOpcion: number, flgActive: number):Observable<boolean>{
    return this.http.get<boolean>(`${this.apiServerUrl}/Fret/guardarConfiguracion?opcion=${opcion}&idPortafolio=${idPortafolio}&idOpcion=${idOpcion}&flgActive=${flgActive}`);
  }

  public guardarFretPortafolio_Actualizar(codigoId: number,nombreCommoditie: string, ticker:string, opcion: string):Observable<objInitFormConfigDataEntry>{
    return this.http.get<objInitFormConfigDataEntry>(`${this.apiServerUrl}/Fret/guardarFretPortafolio_Actualizar?codigoId=${codigoId}&nombreCommoditie=${nombreCommoditie}&ticker=${ticker}&opcion=${opcion}`);
  }

  public listarGruposFret():Observable<cargaCombo[]>{
    return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/Fret/listarGruposFret`);
  }
  
  public asignarGrupoFret(idFretPortafolio: number,idGrupoFret: number):Observable<boolean>{
    return this.http.get<boolean>(`${this.apiServerUrl}/Fret/asignarGrupoFret?idFretPortafolio=${idFretPortafolio}&idGrupoFret=${idGrupoFret}`);
  }
  // public listarAsignacionUnderlyingClassification(idPortafolio: number):Observable<listAsignacionUnderlyingClassification[]>{
  //   return this.http.get<listAsignacionUnderlyingClassification[]>(`${this.apiServerUrl}/Fret/listarAsignacionUnderlyingClassification?idPortafolio=${idPortafolio}`);
  // }
  public obtenerProductosFret():Observable<ProductosFret[]>{
    return this.http.get<ProductosFret[]>(`${this.apiServerUrl}/Fret/obtenerProductosFret`);
  }

  public obtenerDatosIFDProducto(opcion: string, fecha: number, sociedad: number):Observable<ListaConsultaIFD[]>{
    return this.http.get<ListaConsultaIFD[]>(`${this.apiServerUrl}/Fret/obtenerDatosIFDProducto?fecha=${fecha}&opcion=${opcion}&sociedad=${sociedad}`);
  }
  public guardarComentarioFO(consultaIFDsFret: ConsultaIFDsFret ){
    return this.http.post<ConsultaIFDsFret>(`${this.apiServerUrl}/Fret/guardarComentarioIFDFret`,consultaIFDsFret);
  }
  public guardarPresupuestoBase(nuevoPresupuesto: BaseBudget){
    return this.http.post<BaseBudget>(`${this.apiServerUrl}/Fret/guardarPresupuestoBase`,nuevoPresupuesto);
  }
  public guardarProyectoMes(projectOfMonth: ProjectOfMonth){
    return this.http.post<ProjectOfMonth>(`${this.apiServerUrl}/Fret/guardarProyectoMes`,projectOfMonth);
  }
  public guardarCalidad(underlyingQuality: UnderlyingQuality){
    return this.http.post<UnderlyingQuality>(`${this.apiServerUrl}/Fret/guardarCalidad`,underlyingQuality);
  }
  public guardarMercadoFob(fobMarketFret: FobMarketFret){
    return this.http.post<FobMarketFret>(`${this.apiServerUrl}/Fret/guardarMercadoFob`,fobMarketFret);
  }

  public guardarAjuste(fretAdjustment: FretAdjustment){
    return this.http.post<FretAdjustment>(`${this.apiServerUrl}/Fret/guardarAjuste`,fretAdjustment);
  }
  

  // public obtenerDatosResultadosProducto(destino: string, tipoSubyacenteTicker: string, tipoPrecio: string, underlying: number):Observable<Resultados>{
  //   return this.http.get<Resultados>(`${this.apiServerUrl}/Fret/obtenerDatosResultadosProducto?destino=${destino}&tipoSubyacenteTicker=${tipoSubyacenteTicker}&tipoPrecio=${tipoPrecio}&underlying=${underlying}`);
  // }
  public getDetalleIFD( group_Options: number, tipoIFD: number):Observable<DetalleIFDFret[]>{
    return this.http.get<DetalleIFDFret[]>(`${this.apiServerUrl}/Fret/getDetalleIFD?group_Options=${group_Options}&tipoIFD=${tipoIFD}`);
  }
  public obtenerDatosResultadosProductoIFDs(opcion: number, fecha: number,sociedad:number):Observable<Resultados>{
    return this.http.get<Resultados>(`${this.apiServerUrl}/Fret/obtenerDatosResultadosProductoIFDs?opcion=${opcion}&fecha=${fecha}&sociedad=${sociedad}`);
  }

  public replicarGrupoTrigo(opcion: string, FechaProceso: number, FretboardPortfolioID: number, sociedad: number, usuarioRegistra: string, tipoTrigo: number){
    return this.http.get<boolean>(`${this.apiServerUrl}/Fret/replicarGrupoTrigo?opcion=${opcion}&FechaProceso=${FechaProceso}&FretboardPortfolioID=${FretboardPortfolioID}&sociedad=${sociedad}&usuarioRegistra=${usuarioRegistra}&tipoTrigo=${tipoTrigo}`);
  }

  public obtenerDatosMercado(opcion: number, fecha: number,sociedad:number):Observable<Resultados>{
    return this.http.get<Resultados>(`${this.apiServerUrl}/Fret/obtenerDatosMercado?opcion=${opcion}&fecha=${fecha}&sociedad=${sociedad}`);
  }

  public obtenerDatosPosicion(FechaProceso: number,ProductoFret: string, Sociedad: number, ProductoFretString: string):Observable<objInitTabPosicion>{
    return this.http.get<objInitTabPosicion>(`${this.apiServerUrl}/Fret/obtenerDatosPosicion?FechaProceso=${FechaProceso}&ProductoFret=${ProductoFret}&Sociedad=${Sociedad}&ProductoFretString=${ProductoFretString}`);
  }
  
  public obtenerDatosFretHistorico(FechaProceso: number,ProductoFret: string, ProductoFretString: string):Observable<objInitTabPosicion>{
    return this.http.get<objInitTabPosicion>(`${this.apiServerUrl}/Fret/obtenerDatosFretHistorico?FechaProceso=${FechaProceso}&ProductoFret=${ProductoFret}&ProductoFretString=${ProductoFretString}`);
  }

  public obtenerDatosComparativo(opcion: number, fecha: number,sociedad:number):Observable<Resultados>{
    return this.http.get<Resultados>(`${this.apiServerUrl}/Fret/obtenerDatosComparativo?opcion=${opcion}&fecha=${fecha}&sociedad=${sociedad}`);
  }
  public obtenerResumenFret(opcion: number, fecha: number,sociedad:number):Observable<Resultados>{
    return this.http.get<Resultados>(`${this.apiServerUrl}/Fret/obtenerResumenFret?opcion=${opcion}&fecha=${fecha}&sociedad=${sociedad}`);
  }
  
  // public obtenerDatosResultadosProducto(FechaProceso: number,ProductoFret: string):Observable<Resultados>{
  //   return this.http.get<Resultados>(`${this.apiServerUrl}/Fret/obtenerDatosResultadosProducto?FechaProceso=${FechaProceso}&ProductoFret=${ProductoFret}`);
  // }

  public obtenerDatosPapelesLiquidados(FechaProceso: number,ProductoFret: string):Observable<ResultadoPapelesLiquidados>{
    return this.http.get<ResultadoPapelesLiquidados>(`${this.apiServerUrl}/Fret/obtenerDatosPapelesLiquidados?FechaProceso=${FechaProceso}&ProductoFret=${ProductoFret}`);
  }

  public obtenerPrecios():Observable<tablaticker[]>{
    return this.http.get<tablaticker[]>(`${this.apiServerUrl}/Fret/obtenerPrecios`);
  }

  public obtenerListaMTM():Observable<tablaValorizacion[]>{
    return this.http.get<tablaValorizacion[]>(`${this.apiServerUrl}/Fret/obtenerListaMTM`);
  }
  
  
  public obtenerPreciosDelta():Observable<tablaticker[]>{
    return this.http.get<tablaticker[]>(`${this.apiServerUrl}/Fret/dataDelta`);
  }

  public obtenerConfirmacionInputs():Observable<listaConfirmacionInputs[]>{
    return this.http.get<listaConfirmacionInputs[]>(`${this.apiServerUrl}/Fret/obtenerConfirmacionInputs`);
  }

  public obtenerConfirmacionInputXOpcion(fechaConsulta: number, opcion: string, sociedad: string):Observable<boolean>{
    return this.http.get<boolean>(`${this.apiServerUrl}/Fret/obtenerConfirmacionInputXOpcion?fechaConsulta=${fechaConsulta}&opcion=${opcion}&sociedad=${sociedad}`);
  }
  
  public registrarConfirmacionInput(objConfirmacion: Fret_ConfirmacionInput){
    return this.http.post<boolean>(`${this.apiServerUrl}/Fret/registrarConfirmacionInput`,objConfirmacion);
  }

  public Fret_Sim_DatosCRM(fecha: number):Observable<objDatosCRM>{
    return this.http.get<objDatosCRM>(`${this.apiServerUrl}/Fret/Fret_Sim_DatosCRM?fecha=${fecha}`);
  }

  public Fret_Sim_Factores(grupoFret: string):Observable<number>{
    return this.http.get<number>(`${this.apiServerUrl}/Fret/Fret_Sim_Factores?grupoFret=${grupoFret}`);
  }

  public obtenerCommodities():Observable<cargaCombo[]>{
    return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/Fret/obtenerCommodities`);
  }

  public obtenerTickerXCommodities(commoditie: number):Observable<cargaCombo[]>{
    return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/Fret/obtenerTickerXCommodities?commoditie=${commoditie}`);
  }

  public obtenerPrecioOperacion_SIM(ticker: string, tipo: string):Observable<number>{
    return this.http.get<number>(`${this.apiServerUrl}/Fret/obtenerPrecioOperacion_SIM?ticker=${ticker}&tipo=${tipo}`);
  }

  public guardarSpread(fretSpread: FretSpread){
    return this.http.post<FretSpread>(`${this.apiServerUrl}/Fret/guardarSpread`,fretSpread);
  }
  
  public registrarOperacionFicticia(objOperacion: objOperacionSimulada){
    return this.http.post<objOperacionSimulada>(`${this.apiServerUrl}/Fret/registrarOperacionFicticia`,objOperacion);
  }

  public obtenerDetalleTipoTrigo(FechaProceso: number,ProductoFret: string):Observable<objInitTabPosicion>{
    return this.http.get<objInitTabPosicion>(`${this.apiServerUrl}/Fret/obtenerDetalleTipoTrigo?FechaProceso=${FechaProceso}&ProductoFret=${ProductoFret}`);
  }
  
}