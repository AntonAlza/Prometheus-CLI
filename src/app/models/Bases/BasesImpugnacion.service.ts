import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { BasesImpugnar } from "./basesImpugnar";
import { CargarCombo } from "../IFD/cargarCombo";
import { ArchivoImpugnacion } from "./archivoImpugnacion";
import { Impugnacion } from "./impugnacion";
import { AprobacionImpugnacion } from "./aprobacionImpugnacion";
import { BasesImpugnacionPorAprobar } from "./basesImpugnacionPorAprobar";



@Injectable({
    providedIn: 'root'
})

export class BasesImpugnacionService  {

    private apiServerUrl=environment.apiBaseUrl;

    constructor(private http: HttpClient){}
    
    public getListaSubyacenteBases(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/BasesImpugnar/getListaSubyacenteBases`);
    }

    public getListaBasesImpugnar(fecha:number, undenlyingClassification:number): Observable<BasesImpugnar[]>{
        return this.http.get<BasesImpugnar[]>(`${this.apiServerUrl}/BasesImpugnar/listarBasesImpugnar?fecha=${fecha}&undenlyingClassification=${undenlyingClassification}`);
    }

    public getListaOrigenImpugnacion(): Observable<CargarCombo[]>{
        return this.http.get<CargarCombo[]>(`${this.apiServerUrl}/BasesImpugnar/getListaOrigenImpugnacion`);
    }

    public guardarArchivoImpugnacion(archivoImpugnacion: ArchivoImpugnacion){
        return this.http.post<ArchivoImpugnacion>(`${this.apiServerUrl}/BasesImpugnar/guardarArchivoImpugnacion`, archivoImpugnacion);
    }

    public eliminarArchivoImpugnacion(archivoImpugnacion: ArchivoImpugnacion){
        return this.http.post<ArchivoImpugnacion>(`${this.apiServerUrl}/BasesImpugnar/eliminarArchivoImpugnacion`, archivoImpugnacion);
    }

    public getListaArchivosSustento(): Observable<ArchivoImpugnacion[]>{
        return this.http.get<ArchivoImpugnacion[]>(`${this.apiServerUrl}/BasesImpugnar/listarArchivosSustento`);
    }

    public guardarImpugnacion(impugnacion: Impugnacion){
        return this.http.post<Impugnacion>(`${this.apiServerUrl}/BasesImpugnar/guardarImpugnacion`, impugnacion);
    }

    public desactivarImpugnacion(aprobacionImpugnacion: AprobacionImpugnacion){
        return this.http.post<string>(`${this.apiServerUrl}/BasesImpugnar/desactivarImpugnacion`, aprobacionImpugnacion);
    }

    public guardarAprobacionImpugnacion(aprobacionImpugnacion: AprobacionImpugnacion){
        return this.http.post<AprobacionImpugnacion>(`${this.apiServerUrl}/BasesImpugnar/guardarAprobacionImpugnacion`, aprobacionImpugnacion);
    }

    public enviarCorreo(idUnderlaying:number, idModificacion:number, mesesContrato: string, fecha: number): Observable<void>{
        return this.http.get<void>(`${this.apiServerUrl}/BasesImpugnar/enviarCorreo?idUnderlaying=${idUnderlaying}&idModificacion=${idModificacion}&mesesContrato=${mesesContrato}&fecha=${fecha}`);
    }

    public getListaBasesImpugnacionPorAprobar(fechaIni:number, fechaFin:number, estadoAprobacion:number): Observable<BasesImpugnacionPorAprobar[]>{
        return this.http.get<BasesImpugnacionPorAprobar[]>(`${this.apiServerUrl}/BasesImpugnar/listarBasesImpugnarPorAprobar?fechaIni=${fechaIni}&fechaFin=${fechaFin}&estadoAprobacion=${estadoAprobacion}`);
    }
}