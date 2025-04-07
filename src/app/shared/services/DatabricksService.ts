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

    //   const fileUrl = 'https://adb-225310297235191.11.azuredatabricks.net/api/2.0/dbfs/read?path=/FileStore/tables/salida.parquet'; // Reemplaza <DOMINIO_DE_DATABRICKS> con la URL de la API de Databricks y <RUTA_DEL_ARCHIVO_PARQUET> con la ruta del archivo Parquet en Databricks
    //   return this.http.get(fileUrl,{headers:{
    //   //return this.http.get(`${this.apiUrlDataBricks}/read?path=${table}`,{headers:{
    //     'Authorization': 'Bearer dapi5b5288f9499f5172d04b03eec8b2224b-3', // Reemplaza <TOKEN_DE_ACCESO> con tu token de acceso a Databricks
    //     'Access-Control-Allow-Origin': '*',
    //     //'Content-Type': 'application/octet-stream',
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    //   }});
    // }

    executeSqlQuery(sqlQuery: string): Observable<any> {
      const token = 'dapi5b5288f9499f5172d04b03eec8b2224b-3';
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        

        
      };
    
      const requestBody = {
        'language': 'sql',
        'warehouse_id': '377759ae8dc269a1',
        'catalog': "hive_metastore", 
        'schema': "deltaifd_db",
        'statement': sqlQuery 
      };

      // const apiUrlDataBricks = 'https://adb-225310297235191.11.azuredatabricks.net/api/2.0/sql/statements/';
      // const apiUrlDataBricks = 'https://adb-225310297235191.11.azuredatabricks.net/api/2.0/sql/warehouses/';
      
     
      return this.http.post<any>(this.apiUrlDataBricks, requestBody, { headers });
      

    }

  }