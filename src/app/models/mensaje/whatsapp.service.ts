import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WhatsappModel } from './whatsapp.model';
  

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  //private apiServerUrl=environment.apiBaseUrl2;
  constructor(private http:HttpClient) { }


  enviarMensaje(mensaje:WhatsappModel){
    
    
    // return this.http.post('http://localhost:3001/lead', mensaje);
    
    //return this.http.post(`${this.apiServerUrl}/lead`, mensaje);
    
  }


}
