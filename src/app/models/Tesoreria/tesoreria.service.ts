import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Provider } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { OpcionesCombo } from "./opcionesCombo";
import { FacturaCompleto } from "./facturaCompleto";
import { Subsidiaria } from "./subsidiaria";
import { Moneda } from "./moneda";
import { Pais } from "./pais";
import { InstrumentoPorCoberturar } from "./instrumentoPorCoberturar";
import { ObjetoCobertura } from "./objetoCobertura";
import { Cobertura } from "./cobertura";
import { Factor } from "./factor";
import { INPUT_IC } from "./INPUT_IC";
import { MTMInstrumentoHistorico } from "./mtmInstrumentoHistorico";
import { TipoCobertura } from "./tipoCobertura";
import { TipoInstrumento } from "./tipoInstrumento";
import { FacturaAPagar } from "./facturaAPagar";
import { UsuarioPorRol } from "./usuarioPorRol";
import { CoberturaVigente } from "./coberturaVigente";
import { Holiday } from "./holiday";
import { Acreedor } from "./acreedor";
import { Cuponera } from "./cuponera";
import { TipoOC } from "./tipoOC";
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Opcion } from "./opcion";
import { HistoricoModificacion } from "./historicoModificacion";

@Injectable({
    providedIn: 'root'
})
export class TesoreriaService {
    private socket: WebSocket;
    private apiServerUrl=environment.apiBaseUrl;

    public instrumentos: InstrumentoPorCoberturar[];
    public messages$: WebSocketSubject<string>;

    constructor(private http: HttpClient){
        try{
            this.messages$ = webSocket('ws://127.0.0.1:8765');
        }
        catch(e){
            console.log("Error conexión WS: " + e);
        }
    }

    public getListaCombo(codigo: number):Observable<OpcionesCombo[]>{
        return this.http.get<OpcionesCombo[]>(`${this.apiServerUrl}/Tesoreria/getListaCombo?codigo=${codigo}`);
    }

    public postGuardarSubsidiaria(listSubsidiaria: Subsidiaria[]){
        return this.http.post<Subsidiaria[]>(`${this.apiServerUrl}/Tesoreria/postGuardarSubsidiaria`, listSubsidiaria);
    }

    public getListaSubsidiarias(): Observable<Subsidiaria[]>{
        return this.http.get<Subsidiaria[]>(`${this.apiServerUrl}/Tesoreria/getListaSubsidiarias`);
    }

    public getListaMonedas(): Observable<Moneda[]>{
        return this.http.get<Moneda[]>(`${this.apiServerUrl}/Tesoreria/getListaMonedas`);
    }

    public getListaPaises(): Observable<Pais[]>{
        return this.http.get<Pais[]>(`${this.apiServerUrl}/Tesoreria/getListaPaises`);
    }

    public getListaPaisesConSubsidiaria(): Observable<Pais[]>{
        return this.http.get<Pais[]>(`${this.apiServerUrl}/Tesoreria/getListaPaisesConSubsidiaria`);
    }

    public postGuardarMoneda(listMoneda: Moneda[]){
        return this.http.post<Moneda[]>(`${this.apiServerUrl}/Tesoreria/postGuardarMoneda`, listMoneda);
    }

    public postGuardarControlCambios(listModificationHistory: HistoricoModificacion[]){
        return this.http.post<Moneda[]>(`${this.apiServerUrl}/Tesoreria/postGuardarControlCambios`, listModificationHistory);
    }

    public getListaInstrumentosPorCoberturar(): Observable<InstrumentoPorCoberturar[]>{
        return this.http.get<InstrumentoPorCoberturar[]>(`${this.apiServerUrl}/Tesoreria/getListaInstrumentosPorCoberturar`);
    }

    public getListaObjetosCobertura(list_id_ic: number[]): Observable<ObjetoCobertura[]>{
        return this.http.post<ObjetoCobertura[]>(`${this.apiServerUrl}/Tesoreria/getListaObjetosCobertura?list_id_ic`, list_id_ic);
    }

    public postGuardarCobertura(listCobertura: Cobertura[]){
        return this.http.post<Cobertura[]>(`${this.apiServerUrl}/Tesoreria/postGuardarCobertura`, listCobertura);
    }

    public postDeshacerCobertura(listInstrumentos: InstrumentoPorCoberturar[]){
        return this.http.post<InstrumentoPorCoberturar[]>(`${this.apiServerUrl}/Tesoreria/postDeshacerCobertura`, listInstrumentos);
    }    

    public getListFactores(listFechasIniICs: string[]): Observable<Factor[]>{
        return this.http.post<Factor[]>(`${this.apiServerUrl}/Tesoreria/getListaFactores`, listFechasIniICs);
    }

    public getListMtmInstrumentoHistorico(fec_ini): Observable<MTMInstrumentoHistorico[]>{
        return this.http.get<MTMInstrumentoHistorico[]>(`${this.apiServerUrl}/Tesoreria/getListaMTMInstrumentoHistorico?fec_ini=${fec_ini}`);
    }

    public getListaTipoCobertura(): Observable<TipoCobertura[]>{
        return this.http.get<TipoCobertura[]>(`${this.apiServerUrl}/Tesoreria/getListaTipoCobertura`);
    }

    public getListaTipoInstrumento(): Observable<TipoInstrumento[]>{
        return this.http.get<TipoInstrumento[]>(`${this.apiServerUrl}/Tesoreria/getListaTipoInstrumento`);
    }

    public getListaFacturasAPagar(fechaPago: number): Observable<FacturaAPagar[]>{
        return this.http.get<FacturaAPagar[]>(`${this.apiServerUrl}/Tesoreria/getListaFacturasAPagar?fechaPago=${fechaPago}`);
    }

    public getListaCoberturasVigentes(fechaPago: number): Observable<CoberturaVigente[]>{
        return this.http.get<CoberturaVigente[]>(`${this.apiServerUrl}/Tesoreria/getListaCoberturasVigentes?fechaPago=${fechaPago}`);
    }

    public postPagarFactura(listFactura: FacturaAPagar[]){
        return this.http.post<UsuarioPorRol[]>(`${this.apiServerUrl}/Tesoreria/postPagarFactura`, listFactura);
    }

    public postAnularPagoFactura(listFactura: FacturaAPagar[]){
        return this.http.post<any>(`${this.apiServerUrl}/Tesoreria/postAnularPagoFactura`, listFactura);
    }

    public postGuardarCO_Cuponera(objCO: FacturaCompleto, listCuponCO: Cuponera[]){
        const body = {objCO: objCO, listCupon: listCuponCO}
        return this.http.post<any[]>(`${this.apiServerUrl}/Tesoreria/postGuardarCO_Cuponera`, body);
    }

    public getListaFeriados(): Observable<Holiday[]>{
        return this.http.get<Holiday[]>(`${this.apiServerUrl}/Tesoreria/getListaFeriados`);
    }

    public getListaAcreedor(): Observable<Array<Array<Acreedor>>>{
        return this.http.get<Array<Array<Acreedor>>>(`${this.apiServerUrl}/Tesoreria/getListaAcreedor`);
    }

    public getListaTipoOC(): Observable<TipoOC[]>{
        return this.http.get<TipoOC[]>(`${this.apiServerUrl}/Tesoreria/getListaTipoOC`);
    }

    public getHelloFromJava(){
        return this.http.get<any>(`${this.apiServerUrl}/Tesoreria/invoke-flask`);
    }

    public getTestEfectividadJava(INPUTS){
        return this.http.post<INPUT_IC[]>(`${this.apiServerUrl}/Tesoreria/invoke-flask-TE`, INPUTS);
    }

    public postEnvioCorreoJava(INPUTS){
        return this.http.post(`${this.apiServerUrl}/Tesoreria/invoke-flask-envio-correo`, INPUTS, {responseType:'text'});
    }

    public postReprocesoValLiq(INPUTS){
        return this.http.post(`${this.apiServerUrl}/Tesoreria/invoke-flask-reproceso`, INPUTS, {responseType:'text'});
    }

    public getListaOpciones(): Observable<Opcion[]>{
        return this.http.get<Opcion[]>(`${this.apiServerUrl}/Tesoreria/getListaOpciones`);
    }
}
