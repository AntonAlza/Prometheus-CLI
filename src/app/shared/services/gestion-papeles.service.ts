import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { cargaCombo } from "src/app/models/Fisico/cargaCombo";
import { environment } from "src/environments/environment";
import { objPortafolioPapel } from "src/app/models/Papeles/objPortafolioPapel";
import { objLiquidarPapel } from "src/app/models/Papeles/objLiquidarPapel";
import { PaperClearance } from "src/app/models/Papeles/PaperClearance";
import { objInitGestionOPapel } from "src/app/models/Papeles/objInitGestionOPapel";
import { objCancelarPapel } from "src/app/models/Papeles/objCancelarPapel";
import { Paper } from "src/app/models/Papeles/Paper";
import { listaLiquidaciones } from "src/app/models/Papeles/listaLiquidaciones";
import { ReportePapelesTipo } from "src/app/models/Papeles/reportepaper";
import { ClosingControl } from "src/app/models/Fisico/closingControl";
import { objDailyPaperClosure } from "src/app/models/Papeles/DailyPaperClosure";
import { ObjClosingControlPapel } from "src/app/models/Papeles/ClosingControlPapel";
import { ObjDeshacerClosingControlPapel } from "src/app/models/Papeles/deshacerClosingControlpapel";
import { objDeshacerDailyPaper } from "src/app/models/Papeles/deshacerDailyPaper";
import { objFactorPapel } from "src/app/models/Papeles/FactorPapel";
import { objHedgePapel } from "src/app/models/Papeles/HedgePapel";

@Injectable({
    providedIn: 'root'
})


export class gestionPapelesService{

    private apiServerUrl=environment.apiBaseUrl;

    private DataSubectFret: BehaviorSubject<objPortafolioPapel>;

    public objDatosPortafolio: objPortafolioPapel;
    public flgEstadoPortafolio: boolean;

    constructor(private http: HttpClient){
        this.DataSubectFret = new BehaviorSubject<objPortafolioPapel>(this.objDatosPortafolio);
    }

    public listarSociedadPapeles(): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/gestionPapeles/listarSociedadPapeles`); 
    }

    public listarSubyacentesPapeles(idSociedad: number): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/gestionPapeles/listarSubyacentesPapeles?idSociedad=${idSociedad}`);
    }

    public listarPortafolioPapeles(sociedad: number, subyacente: number): Observable<objPortafolioPapel>{
        return this.http.get<objPortafolioPapel>(`${this.apiServerUrl}/gestionPapeles/listarPortafolioPapeles?sociedad=${sociedad}&subyacente=${subyacente}`);
    }

    public obtenerDatosGestionPapeles(idSociedad: number, idSubyacente: number): Observable<objInitGestionOPapel>{
        return this.http.get<objInitGestionOPapel>(`${this.apiServerUrl}/gestionPapeles/obtenerDatosGestionPapeles?idSociedad=${idSociedad}&idSubyacente=${idSubyacente}`);
    }

    public obtenerListaContratos(idSubyacente: number, bolsaSelected: number): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/gestionPapeles/obtenerListaContratos?idSubyacente=${idSubyacente}&bolsaSelected=${bolsaSelected}`);
    }

    public guardarPapel(nuevoPapel: Paper){
        return this.http.post<Paper>(`${this.apiServerUrl}/gestionPapeles/guardarPapel`,nuevoPapel);
    }

    public obtenerPortafolio(): Observable<objPortafolioPapel>{
        return this.DataSubectFret.asObservable();
    }

    public cancelarPapel(objCancelar: objCancelarPapel){
        return this.http.post<objCancelarPapel>(`${this.apiServerUrl}/gestionPapeles/cancelarPapel`,objCancelar);
    }
    public cancelarLiquidacionPapel(objCancelar: objCancelarPapel){
        return this.http.post<objCancelarPapel>(`${this.apiServerUrl}/gestionPapeles/cancelarLiquidacionPapel`,objCancelar);
    }
    
    public obtenerObjModificarPapel(idSociedad: number, idSubyacente: number, idPapel: number): Observable<objInitGestionOPapel>{
        return this.http.get<objInitGestionOPapel>(`${this.apiServerUrl}/gestionPapeles/obtenerObjModificarPapel?idSociedad=${idSociedad}&idSubyacente=${idSubyacente}&idPapel=${idPapel}`);
    }
    
    public modificarPapel(papelModificar: Paper){
        return this.http.post<Paper>(`${this.apiServerUrl}/gestionPapeles/modificarPapel`,papelModificar);
    }
    
    public obtenerObjLiquidarPapel(idPapel: number): Observable<objLiquidarPapel>{
        return this.http.get<objLiquidarPapel>(`${this.apiServerUrl}/gestionPapeles/obtenerObjLiquidarPapel?idPapel=${idPapel}`);
    }

    public guardarLiquidacion(papelLiquidar: PaperClearance){
        return this.http.post<PaperClearance>(`${this.apiServerUrl}/gestionPapeles/guardarLiquidacion`,papelLiquidar);
    }

    public obtenerLiquidaciones(idPapel: number){
        return this.http.get<listaLiquidaciones[]>(`${this.apiServerUrl}/gestionPapeles/obtenerLiquidaciones?idPapel=${idPapel}`);
    }

    public obtenerdatareporte(idcampana:number|null,idsociedad:number|null,fechainicio:number|null,fechafin:number|null){
        return this.http.get<ReportePapelesTipo[]>(`${this.apiServerUrl}/gestionPapeles/obtenerReportePapeles?idcampana=${idcampana}&idsociedad=${idsociedad}&fechainicio=${fechainicio}&fechafin=${fechafin}`);
    }
    public getEstado(sociedad:number,subyacente:number): Observable<ClosingControl[]>{
        return this.http.get<ClosingControl[]>(`${this.apiServerUrl}/gestionPapeles/estadoPortafolioPapel?sociedad=${sociedad}&subyacente=${subyacente}`);
    }
    public guardarCierrepapeles(dailyPaperClosure: objDailyPaperClosure[]){
        return this.http.post<objDailyPaperClosure[]>(`${this.apiServerUrl}/gestionPapeles/guardarCierre`,dailyPaperClosure);
    }
    public guardarPapelClosing(closingControlpapel: ObjClosingControlPapel[]){
        return this.http.post<ObjClosingControlPapel[]>(`${this.apiServerUrl}/gestionPapeles/guardarClosingControl`,closingControlpapel);
    }
    public eliminarPapelClosing(deshacerclosingControlpapel: ObjDeshacerClosingControlPapel[]){
        return this.http.post<ObjDeshacerClosingControlPapel[]>(`${this.apiServerUrl}/gestionPapeles/eliminarClosingControl`,deshacerclosingControlpapel);
    }

    public eliminarDailyPaper(deshacerDailyPaper: objDeshacerDailyPaper[]){
        return this.http.post<objDeshacerDailyPaper[]>(`${this.apiServerUrl}/gestionPapeles/eliminarCierre`,deshacerDailyPaper);
    }
    public obtenerdatoFactor(idsubyacente:number){
        return this.http.get<objFactorPapel>(`${this.apiServerUrl}/gestionPapeles/obtenerFactorPapeles?idsubyacente=${idsubyacente}`);
    }
    public modificarLiquiPapel(papelModificarliqui: PaperClearance){
        return this.http.post<PaperClearance>(`${this.apiServerUrl}/gestionPapeles/modificarliquiPapel`,papelModificarliqui);
    }
    public getEstadoPortafolioXSociedad(sociedad:number): Observable<ObjClosingControlPapel[]>{
        return this.http.get<ObjClosingControlPapel[]>(`${this.apiServerUrl}/gestionPapeles/estadoPortafolioXSociedadPaper?sociedad=${sociedad}`);
    }
    public realizarDuplicadoPapel(papel:string,usuario:string): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/gestionPapeles/realizarDuplicadoPapel?papel=${papel}&usuario=${usuario}`);
    }
    public guardarHedgePapel(papelhedge: objHedgePapel){
        return this.http.post<Paper>(`${this.apiServerUrl}/gestionPapeles/guardarHedgePapel`,papelhedge);
    }
    public obtenerflagHedgepapel(idpapel:number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/gestionPapeles/obtenerHedgePapel?idpapel=${idpapel}`);
    }
}