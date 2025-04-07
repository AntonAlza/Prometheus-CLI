import { Component, OnInit } from '@angular/core';
import { IReportEmbedConfiguration, models } from 'powerbi-client';
import { from, interval, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TokenpbiService } from 'src/app/shared/services/tokenpbi.service';

@Component({
  selector: 'app-powerbiventasmolienda',
  templateUrl: './powerbiventasmolienda.component.html',
  styleUrls: ['./powerbiventasmolienda.component.scss']
})
export class PowerbiventasmoliendaComponent implements OnInit {

  public tokenBearer:string;
  public tokenreport:string
  public  embedUrl: string;
  public groupId: string='6a717c82-ca85-44c2-b5c4-a5dd1235b56b';
  public reportId: string='3435a203-ae05-4d9e-83a8-e0c2636026f9'; 
  public reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    settings: undefined,
  };

  public tiempoInicio: number;
  public tiempodeexpiracion: number;
  public tokenRenewalInterval = 1000; // Intervalo de verificación en milisegundos
  public tokenRenewalThreshold = 60; // Umbral de renovación en segundos
  public tiempoRestante: number;
  public downloading: boolean = false;
  public progress: number = 0;
  public exportId: string;
  public estatusreport:string;
  public currentProgress:string ;
  public showSpinner: boolean = false;

  constructor(private tokenpbiService: TokenpbiService) { }

  async ngOnInit(): Promise<void> {

    try {
      //Obtengo el token principal
      const { access_token, expires_in } = await this.tokenpbiService.obtenerTokenBearer();
      this.tokenBearer = access_token;
      this.tiempodeexpiracion = expires_in;
      // this.tiempodeexpiracion = 350;
      console.log('Tiempo de expiracion:', this.tiempodeexpiracion);
      this.tokenreport= await this.tokenpbiService.getToken_Report(this.tokenBearer,this.groupId,this.reportId);

    } catch (error) {
      console.error('Error al obtener el token de acceso:', error);
    }
    this.tiempoInicio = Date.now() / 1000;
    this.startTokenRenewal();

    const embedUrl_1 = `https://app.powerbi.com/reportEmbed?reportId=${this.reportId}&groupId=${this.groupId}`;

    this.reportConfig={
      type: 'report',
          id: this.reportId,
          embedUrl: embedUrl_1,
          accessToken:this.tokenreport,
          tokenType: models.TokenType.Embed,
          hostname: "https://app.powerbi.com"
          };
  }

  reportClass = 'report-container';

public startTokenRenewal(): void {
    interval(this.tokenRenewalInterval).pipe(
      switchMap(() => {
        const tiempoTranscurrido = Math.floor(Date.now() / 1000) - this.tiempoInicio;
        this.tiempoRestante = this.tiempodeexpiracion - tiempoTranscurrido;
        console.log('Tiempo restante:', this.tiempoRestante, 'segundos');
        
        if (this.tiempoRestante <= this.tokenRenewalThreshold) {
          return this.renewToken();
        } else if (this.tiempoRestante <= 300) {
          console.log('Comenzando la renovación del token.');
          return from(this.renewToken());
        }else {
          return of(null);
        }
      })
    ).subscribe(
      () => {},
      error => console.error('Error al renovar el token de acceso:', error)
    );
  }

  public async renewToken(): Promise<void> {
    try {
      const { access_token, expires_in } = await this.tokenpbiService.obtenerTokenBearer();
      this.tiempoInicio = Date.now() / 1000; // Actualizar el tiempo de inicio
      this.tiempodeexpiracion = expires_in;
      // this.tiempodeexpiracion = 350;
      console.log('Token Bearer renov:', access_token);
      this.tokenreport= await this.tokenpbiService.getToken_Report(this.tokenBearer,this.groupId,this.reportId);
      console.log('Token de Informe renov:', this.tokenreport);

    } catch (error) {
      console.error('Error al renovar el token de acceso:', error);
    }
  }
  delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }


}
