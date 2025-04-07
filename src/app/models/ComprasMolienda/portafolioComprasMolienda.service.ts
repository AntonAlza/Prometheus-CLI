import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { ComprasMoliendaComponent } from "src/app/components/dashboard/compras-molienda/compras-molienda.component";
import { environment } from "src/environments/environment";
import { AcreedorModelo } from "./acreedorModelo";
import { BasesModelo } from "./basesModelo";
import { CargaBeansModelo } from "./cargaBeansModelo";
import { CargaMasivaComprasMolienda } from "./cargaMasivaComprasMolienda";
import { ClasificacionBeansModelo } from "./clasificacionBeansModelo";
import { Nombre } from "./nombre";
import { OperacionModelo } from "./operacionModelo";
import { ReporteCargaMasivaFinalModelo } from "./reporteCargaMasivaFinalModelo";

const base_url = environment.apiBaseUrl;

@Injectable({
    providedIn: 'root'
})
export class PortafolioComprasMoliendaService implements OnDestroy {

    public acreedorModelo: AcreedorModelo;

    public operacionModelo: OperacionModelo;
    public perfiles: string[];

    private apiServerUrl = environment.apiBaseUrl;
    private _refresh$ = new Subject<void>();
    private _refreshPrincipal$ = new Subject<void>();

    //
    constructor(private http: HttpClient) {
        console.log('portafolioComprasMoliendaService');
    }

    ngOnDestroy(): void {
        this._refresh$.closed;
        throw new Error("Method not implemented.");
    }

    get refresh$() {
        return this._refresh$
    }

    // GUARDAR CARGA MASIVA SAP
    public guardarCargaMasiva_SQL(listaCargaMasivaComprasMolienda: CargaMasivaComprasMolienda[]) {
        return this.http
            .post<string>(`${this.apiServerUrl}/compras-molienda/guardarCargaMasivaSQL`, listaCargaMasivaComprasMolienda)
            .pipe(tap(() => {
                this._refreshPrincipal$.next();
            }))
    }
    // FIN GUARDAR CARGA MASIVA SAP

    //GUARDAR OPERACION CARGA MASIVA
    public guardarOperacion_SQL(operacionModelo: OperacionModelo) {
        return this.http
            .post<string>(`${this.apiServerUrl}/compras-molienda/guardarOperaciones`, operacionModelo)
            .pipe(tap(() => {
                this._refresh$.next();
            }))
    }
    //FIN OPERACION CARGA MASIVA

    //LISTAR OPERACIONES
    // public getOperacion_SQL(): Observable<OperacionModelo[]> {
    //     return this.http.get<OperacionModelo[]>(`${this.apiServerUrl}/compras-molienda/listarOperaciones`);
    // }
    //FIN LISTAR OPERACIONES

    public getOperacion_SQL(): Observable<string[][]> {
        return this.http.get<string[][]>(`${this.apiServerUrl}/compras-molienda/listarOperaciones`);
    }

    //GUARDAR CLASIFICACION BEANS 
    public guardarClasificacionBeans_SQL(clasificacionBeansModelo: ClasificacionBeansModelo) {
        return this.http
            .post<string>(`${this.apiServerUrl}/compras-molienda/guardarClasificacionBeans`, clasificacionBeansModelo)
            .pipe(tap(() => {
                this._refresh$.next();
            }))
    }
    //FIN CLASIFICACION BEANS

    //LISTAR CLASIFICACION BEANS
    public getClasificacionBeans_SQL(): Observable<ClasificacionBeansModelo[]> {
        return this.http.get<ClasificacionBeansModelo[]>(`${this.apiServerUrl}/compras-molienda/listarClasificacionBeans`);
    }
    //FIN LISTAR CLASIFICACION BEANS

    //GUARDAR CARGA BEANS
    public guardarCargaBeans_SQL(cargaBeansModelo: CargaBeansModelo) {
        return this.http.post<string>(`${this.apiServerUrl}/compras-molienda/guardarCargaBeans`, cargaBeansModelo);
    }
    //FIN GUARDAR CARGA BEANS

    //LISTA DATOS CARGA MASIVA
    public getCargaReporteSAP(): Observable<CargaMasivaComprasMolienda[]> {
        return this.http.get<CargaMasivaComprasMolienda[]>(`${this.apiServerUrl}/compras-molienda/listaCargaMasiva`)
    }
    //FIN OBTENER DATOS CARGA MASIVA

    public getCargaReporteSapFinal(): Observable<ReporteCargaMasivaFinalModelo[]> {
        return this.http.get<ReporteCargaMasivaFinalModelo[]>(`${this.apiServerUrl}/compras-molienda/listareporteCargaMasivaModelo`);
    }

    //GUARDAR CARGA MASIVA ACREEDORES
    public guardarAcreedores_SQL(acreedorModelo: AcreedorModelo[]) {
        return this.http
            .post<string>(`${this.apiServerUrl}/compras-molienda/guardarAcreedores`, acreedorModelo)
            .pipe(tap(() => {
                this._refresh$.next();
            }))
    }
    //FIN GUARDAR MASIVA ACREEDORES

    //GUARDAR ACREEDORES 
    public guardarAcreedor_SQL(acreedorModelo: AcreedorModelo) {
        return this.http
            .post<string>(`${this.apiServerUrl}/compras-molienda/guardarAcreedor`, acreedorModelo)
            .pipe(tap(() => {
                this._refresh$.next();
            }))
    }
    //FIN GUARDAR ACREEDORES 

    //LISTAR ACREEDORES
    public getAcreedores(): Observable<AcreedorModelo[]> {
        return this.http.get<AcreedorModelo[]>(`${this.apiServerUrl}/compras-molienda/listarAcreedores`);
    }
    //FIN LISTAR ACREEDORES

    // LISTA DE REGISTROS LIBERADOS - POR MODIFICAR
    public getRegistrosLiberados(): Observable<ReporteCargaMasivaFinalModelo[]> {
        return this.http.get<ReporteCargaMasivaFinalModelo[]>(`${this.apiServerUrl}/compras-molienda/registrosLiberados`);
    }
    // FIN LISTA DE REGISTROS LIBERADOS - POR MODIFICAR

    // LISTA DE OPERACIONES

    public getOperacion(): Observable<OperacionModelo[]> {
        return this.http.get<OperacionModelo[]>(`${this.apiServerUrl}/compras-molienda/listarOperacion`);
    }
    // FIN LISTA DE OPERACIONES

    //LISTAR BEANS
    public getBeans(): Observable<CargaBeansModelo[]> {
        return this.http.get<CargaBeansModelo[]>(`${this.apiServerUrl}/compras-molienda/listarCargaBeans`);
    }
    //FIN LISTAR BEANS

    //GUARDAR BASES
    public guardarBases_SQL(basesModelo: BasesModelo) {
        return this.http
            .post<string>(`${this.apiServerUrl}/compras-molienda/guardarBases`, basesModelo)
            .pipe(tap(() => {
                this._refresh$.next();
            }))
    }
    //FIN GUARDAR BASES

    //LISTAR BASES
    public getBases(): Observable<BasesModelo[]> {
        return this.http.get<BasesModelo[]>(`${this.apiServerUrl}/compras-molienda/listarBases`);
    }
    //FIN LISTAR BASES
}