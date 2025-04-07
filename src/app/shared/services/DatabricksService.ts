import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  export class DatabricksService {

    
    private apiUrlDataBricks = environment.apiUrlDataBricks;
  // Realiza la petición HTTP para descargar el archivo de datos Parquet desde Databricks
    

    constructor(private http: HttpClient) {}
  
    public uploadFile(file: File): Observable<any> {
      const formData = new FormData();
      formData.append('file', file);
  
      return this.http.post(`${this.apiUrlDataBricks}/create`, formData);
    }

    // public getTable(table: string): Observable<any> {



  }