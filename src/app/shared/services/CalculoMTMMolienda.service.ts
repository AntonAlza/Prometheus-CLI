import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { campaniaSubyacenteModelo } from "src/app/models/Fisico/campaniaSubyacneteModelo";
import { cargaCombo } from "src/app/models/Fisico/cargaCombo";
import { GrindingBaseMtmModelo } from "src/app/models/Fisico/GrindingBaseMtmModelo";
import { Meses } from "src/app/models/Fisico/Meses";
import { MTMMolienda } from "src/app/models/Fisico/MtMMolienda";
import { MTMMoliendaDetalle } from "src/app/models/Fisico/MTMMoliendaDetalle";
import { MtmMoliendaListaDuplicadosModelo } from "src/app/models/Fisico/mtmMoliendaListaDuplicadosModelo";
import { MtmMoliendaModelo } from "src/app/models/Fisico/MtmMoliendaModelo";
import { MTMMoliendaTotales } from "src/app/models/Fisico/MTMMoliendaTotales";
import { ReporteMTM } from "src/app/models/Fisico/ReporteMTM";
import { Underlying } from "src/app/models/Fisico/underlying";

import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class CalculoMTMMolienda {

    private apiServerUrl = environment.apiBaseUrl;
    // private _refreshPrincipal$ = new Subject<void>();

    constructor(private http: HttpClient) { }

    ngOnDestroy(): void {
        // this._refreshPrincipal$.closed;
    }
    // get refreshPrincipal$() {
    //     return this._refreshPrincipal$
    // }
    public listaMeses(): Observable<Meses[]> {
        return this.http.get<Meses[]>(`${this.apiServerUrl}/CalculoMTMMolienda/listaMeses`);
    }
    public listarMTMMolienda(Underlying: number, Campaign: number, fecha: string): Observable<MTMMoliendaDetalle[]> {
        return this.http.get<MTMMoliendaDetalle[]>(`${this.apiServerUrl}/CalculoMTMMolienda/listarMTMMolienda?Underlying=${Underlying}&Campaign=${Campaign}&fecha=${fecha}`);
    }
    public listarMTMMoliendaAnterior(Underlying: number, Campaign: number, fecha: string): Observable<MTMMoliendaDetalle[]> {
        return this.http.get<MTMMoliendaDetalle[]>(`${this.apiServerUrl}/CalculoMTMMolienda/listarMTMMoliendaAnterior?Underlying=${Underlying}&Campaign=${Campaign}&fecha=${fecha}`);
    }
    public guardarMTMMolienda(mtmMolienda: MTMMoliendaDetalle) {
        return this.http.post<string>(`${this.apiServerUrl}/CalculoMTMMolienda/guardarMTMMolienda`, mtmMolienda);
    }
    public agregarMTMMoliendaTotales(mtmMolienda: MTMMoliendaTotales) {
        return this.http.post<MTMMoliendaTotales>(`${this.apiServerUrl}/CalculoMTMMolienda/agregarMTMMoliendaTotales`, mtmMolienda);
    }
    public buscarMTMTotales(Underlying: number, Campaign: number, fecha: string): Observable<MTMMoliendaTotales> {
        return this.http.get<MTMMoliendaTotales>(`${this.apiServerUrl}/CalculoMTMMolienda/buscarMTMTotales?Underlying=${Underlying}&Campaign=${Campaign}&fecha=${fecha}`);
    }
    public obtenerBaseMID(Underlying: number, Fecha: string, MonthContract: string): Observable<number> {
        return this.http.get<number>(`${this.apiServerUrl}/CalculoMTMMolienda/obtenerBaseMID?Underlying=${Underlying}&Fecha=${Fecha}&MonthContract=${MonthContract}`);
    }
    public obtenerFactor(Underlying: number): Observable<number> {
        return this.http.get<number>(`${this.apiServerUrl}/CalculoMTMMolienda/obtenerFactor?Underlying=${Underlying}`);
    }
    public listarMTMXFecha(fecha: string): Observable<ReporteMTM[]> {
        return this.http.get<ReporteMTM[]>(`${this.apiServerUrl}/CalculoMTMMolienda/listarMTMXFecha?fecha=${fecha}`);
    }
    public replicarMTMAnterior(Underlying: number, Campaign: number, Fecha: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiServerUrl}/CalculoMTMMolienda/replicarMTMAnterior?Underlying=${Underlying}&Campaign=${Campaign}&Fecha=${Fecha}`);
    }

    public ObtenerDetalleXID(ID: number): Observable<MTMMoliendaDetalle> {
        return this.http.get<MTMMoliendaDetalle>(`${this.apiServerUrl}/CalculoMTMMolienda/ObtenerDetalleXID?ID=${ID}`);
    }
    public eliminadoLogicoDetalle(id: number) {
        return this.http.post<string>(`${this.apiServerUrl}/CalculoMTMMolienda/eliminadoLogicoDetalle`, id);
    }

    public getMtmMoliendaTotalesVigente(): Observable<campaniaSubyacenteModelo[]> {
        return this.http.get<campaniaSubyacenteModelo[]>(`${this.apiServerUrl}/CalculoMTMMolienda/listarCampaniaSubyacenteVigente`);
        // return this.http.get<campaniaSubyacenteModelo[]>(`${this.apiServerUrl}/CalculoMTMMolienda/listarCampaniaSubyacenteVigente?fecha=${fecha}`);
    }

    public getMtmCampaniaSubyacente(): Observable<campaniaSubyacenteModelo[]> {
        return this.http.get<campaniaSubyacenteModelo[]>(`${this.apiServerUrl}/CalculoMTMMolienda/listaCampaniaSubyacenteMTM`);
    }

    public getMtmDetalleCampaniaSubyacente(fecha: number): Observable<MtmMoliendaModelo[]> {
        return this.http.get<MtmMoliendaModelo[]>(`${this.apiServerUrl}/CalculoMTMMolienda/listaMTMDetalleXCampaniaYSubyacente?Fecha=${fecha}`);
    }

    public getDatosDuplicadosMTM(fecha: number): Observable<MtmMoliendaListaDuplicadosModelo[]> {
        return this.http.get<MtmMoliendaListaDuplicadosModelo[]>(`${this.apiServerUrl}/CalculoMTMMolienda/getDatosDuplicadosMTM?fecha=${fecha}`);
    }

    public actualizarToneladasTotales(mtmMoliendaListaDuplicadosModelo: MtmMoliendaListaDuplicadosModelo) {
        return this.http.post<string>(`${this.apiServerUrl}/CalculoMTMMolienda/actualizarToneladasTotales`, mtmMoliendaListaDuplicadosModelo);
    }

    public getproductosMoliendaMtm(fecha: number): Observable<Underlying[]> {
        return this.http.get<Underlying[]>(`${this.apiServerUrl}/VentasMolienda/productosMolienda?fecha=${fecha}`);
    }

    //campañaVigente comboXCodigoFechaVigente
    public getComboXCodigoFechaVigente(opcion: string): Observable<cargaCombo[]> {
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/VentasMolienda/comboXCodigoFechaVigente?opcion=${opcion}`);
    }
    public getMtmMoliendaTotalesXFecha(fecha: number): Observable<MtmMoliendaListaDuplicadosModelo[]> {
        return this.http.get<MtmMoliendaListaDuplicadosModelo[]>(`${this.apiServerUrl}/CalculoMTMMolienda/getMtmMoliendaTotalesXFecha?fecha=${fecha}`)
    }
    public getProductosMoliendaXCampania(idCampania: number): Observable<Underlying[]> {
        return this.http.get<Underlying[]>(`${this.apiServerUrl}/VentasMolienda/productosMoliendaXCampania?IdCampania=${idCampania}`);
    }
    public getEliminarDetallePorMtmTotales(id: number) {
        return this.http.post<string>(`${this.apiServerUrl}/CalculoMTMMolienda/eliminarDetallePorMtmTotales`, id);
    }
    public getEliminarMTMMoliendaTotales(id: number) {
        return this.http.post<string>(`${this.apiServerUrl}/CalculoMTMMolienda/eliminarMTMMoliendaTotales`, id);
    }

    public getBaseMarketMtm(Underliying: number, MesContrato: number, fechaConsulta:number): Observable<number> {
        return this.http.get<number>(`${this.apiServerUrl}/CalculoMTMMolienda/baseMarketMtm?Underliying=${Underliying}&MesContrato=${MesContrato}&fechaConsulta=${fechaConsulta}`);
    }
    public actualizarShockSensibilidad(valor: number, underlying:number, fecha:number, campanha:number) {
        return this.http.get<string>(`${this.apiServerUrl}/CalculoMTMMolienda/actualizarShockSensibilidad?valor=${valor}&underlying=${underlying}&fecha=${fecha}&campanha=${campanha}`);
    }
      public guardarRefrescarPagina(mtmMolienda:  MtmMoliendaModelo[]) {
        return this.http.post<MTMMoliendaTotales>(`${this.apiServerUrl}/CalculoMTMMolienda/guardarRefrescarPagina`, mtmMolienda);
    }
    public actualizarMtMSensibilidadShock(valor: number, underlying:number, fecha:number, campanha:number,id:number) {
        return this.http.get<string>(`${this.apiServerUrl}/CalculoMTMMolienda/actualizarMtMSensibilidadShock?valor=${valor}&underlying=${underlying}&fecha=${fecha}&campanha=${campanha}&id=${id}`);
    }
}