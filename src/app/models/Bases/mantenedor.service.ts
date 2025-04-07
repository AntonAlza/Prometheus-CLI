import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Mantenedor } from "./mantenedor";

@Injectable({
    providedIn: 'root'
})

export class MantenedorService{
    private apiServerUrl=environment.apiBaseUrl;
    constructor(private http: HttpClient){}
    
    public getParametroXID(id: number): Observable<Mantenedor>{
        return this.http.get<Mantenedor>(`${this.apiServerUrl}/Mantenedor/obtenerParametroXID?id=${id}`)
    }
}