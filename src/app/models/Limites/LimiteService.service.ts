import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { LimiteConsumo } from "./limiteConsumo";
import { DetalleLimite } from "../IFD/detalleLimite";
import { DetalleLimiteCM } from "./detalleLimite";
import { LimiteGeneral } from "./limiteGeneral";


@Injectable({
    providedIn: 'root'
})

export class LimiteService  implements OnDestroy {

    private apiServerUrl=environment.apiBaseUrl;
    
    
    private _refresh$= new Subject<void>();
    private _refreshPrincipal$= new Subject<void>();
    private _refreshModificar$= new Subject<void>();
    

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
    
    public getConsumoMensual(): Observable<LimiteConsumo[]>{
        return this.http.get<LimiteConsumo[]>(`${this.apiServerUrl}/Limite/getConsumoMensual`);
    }
    public getDetalleLimite(empresa:number): Observable<DetalleLimiteCM[]>{
      return this.http.get<DetalleLimiteCM[]>(`${this.apiServerUrl}/Limite/getDetalleLimite?empresa=${empresa}`);
  }
  public validarCierre(empresa:number, fecha:number): Observable<String>{
    return this.http.get(`${this.apiServerUrl}/Limite/getValidarCierre?empresa=${empresa}&fecha=${fecha}`,{responseType:'text'});
}


public ejecutarCierre(datos:string[]){
  return this.http
  .post<Boolean>(`${this.apiServerUrl}/Limite/ejecutarCierre`,datos)
  .pipe(tap(() =>{
    
      this._refresh$.next();
    } )  
  )
}
public guardarLimites(datos: LimiteGeneral  ){
  return this.http
  .post<Boolean>(`${this.apiServerUrl}/Limite/guardarLimites`,datos)
  .pipe(tap(() =>{
    
      this._refresh$.next();
    } )  
  )
}

}