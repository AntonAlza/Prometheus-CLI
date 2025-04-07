import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class FretOpcionesService {
    private socket: WebSocket;
    private urlSocket: string = environment.socketPythonURLTE;
    
    private messageSubject: Subject<string> = new Subject<string>();
    
    constructor(private http: HttpClient) {
        this.initWebSocket();
    }

    initWebSocket(): void {
        // Reemplaza la URL con la dirección de tu servidor WebSocket
        // this.socket = new WebSocket('ws://127.0.0.1:8000');
        this.socket = new WebSocket(this.urlSocket);
    
        this.socket.onopen = () => {
          console.log('Conexión establecida');
        };
    
        this.socket.onmessage = (event) => {
          console.log('Mensaje recibido:', event.data);
          this.messageSubject.next(event.data);
        };
    
        this.socket.onerror = (error) => {
          console.error('Error en la conexión:', error);
        };
        
        this.socket.onclose = () => {
            console.log('Conexión cerrada');
            setTimeout(() => this.initWebSocket(), 3000);
        };
    
    }

    public getMessages(): Observable<string> {
        return this.messageSubject.asObservable();
    }

    closeConnection(): void {
        if (this.socket) {
          this.socket.close();
        }
    }


  }