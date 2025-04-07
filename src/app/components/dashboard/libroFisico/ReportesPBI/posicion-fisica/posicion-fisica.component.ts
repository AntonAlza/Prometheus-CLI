import { Component, OnInit } from '@angular/core';
import { IReportEmbedConfiguration, models } from 'powerbi-client';
import { interval, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TokenpbiService } from 'src/app/shared/services/tokenpbi.service';

@Component({
  selector: 'app-posicion-fisica',
  templateUrl: './posicion-fisica.component.html',
  styleUrls: ['./posicion-fisica.component.scss']
})
export class PosicionFisicaComponent implements OnInit {

  public tokenBearer:string;
  public tokenreport:string
  public  embedUrl: string;
  public groupId: string='6a717c82-ca85-44c2-b5c4-a5dd1235b56b';
  public reportId: string='fc9d0e21-b408-4561-980a-0d9fc0b28f75'; 
  reportConfig: IReportEmbedConfiguration = {
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
  private unsubscribe$ = new Subject<void>(); // Para desuscribir el observable

  constructor(private tokenpbiService: TokenpbiService) { }

  async ngOnInit(): Promise<void> {

    try {
      const { access_token, expires_in } = await this.tokenpbiService.obtenerTokenBearer();
      this.tokenBearer = access_token;
      this.tiempodeexpiracion = expires_in;
      // this.tiempodeexpiracion = 100;
      // console.log('Tiempo de expiracion:', this.tiempodeexpiracion);
      // console.log('Token Bearer:', this.tokenBearer);
      this.tokenreport= await this.tokenpbiService.getToken_Report(this.tokenBearer,this.groupId,this.reportId);
      // console.log('Token de Informe:', this.tokenreport);
    } catch (error) {
      console.error('Error al obtener el token de acceso:', error);
    }
    this.tiempoInicio = Date.now() / 1000;
   
    this.startTokenRenewal()

    const embedUrl_1 = `https://app.powerbi.com/reportEmbed?reportId=${this.reportId}&groupId=${this.groupId}`;

    this.reportConfig={
      type: 'report',
          id: this.reportId,
          embedUrl: embedUrl_1,
          accessToken:this.tokenreport,
          tokenType: models.TokenType.Embed,
          hostname: "https://app.powerbi.com",
          permissions:models.Permissions.All,
          // viewMode: models.ViewMode.Edit,
          settings: {
            layoutType: models.LayoutType.MobilePortrait,
            panes: {filters: {visible: false },pageNavigation: {visible: true}},
            bars: {statusBar: {visible: true}}}
          }
  }

  ngOnDestroy(): void {
  // Emite un valor para cancelar el observable
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
  }

  reportClass = 'report-container';

public startTokenRenewal(): void {
  interval(this.tokenRenewalInterval).pipe(
    takeUntil(this.unsubscribe$), // Detener cuando se emite un valor en unsubscribe$
    switchMap(() => {
      const tiempoTranscurrido = Math.floor(Date.now() / 1000) - this.tiempoInicio;
      this.tiempoRestante = this.tiempodeexpiracion - tiempoTranscurrido;
      // console.log('Tiempo restante:', this.tiempoRestante, 'segundos');
      
      if (this.tiempoRestante <= this.tokenRenewalThreshold) {
        return this.renewToken();
      } else {
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
      // this.tiempodeexpiracion = 100;
      // console.log('Token Bearer renov:', access_token);
      this.tokenreport= await this.tokenpbiService.getToken_Report(this.tokenBearer,this.groupId,this.reportId);
      // console.log('Token de Informe renov:', this.tokenreport);

    } catch (error) {
      console.error('Error al renovar el token de acceso:', error);
    }
  }
public async exportPPTX() {
    this.currentProgress = "0s";
    this.showSpinner = true;
    const startTime = Date.now(); // Tiempo de inicio del bucle
    let elapsedTime = 0; 
    const totalDurationInSeconds: number = 10; // Por ejemplo, 10 segundos

    this.exportId = await this.tokenpbiService.ExportToFileInGroup(this.groupId, this.reportId, this.tokenBearer);
    // console.log('ID obtenido:', this.exportId);
    
    do {
      await this.delay(1000); // Espera 1 segundos
      const currentTime = Date.now();
      elapsedTime = (currentTime - startTime) / 1000; // Tiempo transcurrido en segundos
      this.currentProgress = `${parseInt(this.currentProgress) + 1}s`;
      this.estatusreport = await this.tokenpbiService.GetExportTofileStatusInGroup(this.groupId, this.reportId, this.exportId, this.tokenBearer);
      console.log('Estatus actual:', this.estatusreport);
    } while (this.estatusreport !== 'Succeeded');
    this.showSpinner = false;

    if(this.estatusreport == 'Succeeded'){
    this.downloading = true; // Comenzar la descarga
    this.progress = 0; // Reiniciar el progreso
    const fileName = 'Atenea_PowerBI.pptx'; // Nombre predeterminado del archivo
    this.tokenpbiService.GetFileOfExportTofileInGroup(this.groupId,this.reportId,this.exportId,this.tokenBearer).subscribe(
      (data: Blob) => {
        this.downloading = false; // Finalizar la descarga
        this.progress = 100; // Establecer el progreso al 100% cuando la descarga esté completa
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error => {
        console.error('Error al exportar el archivo desde Power BI:', error);
        this.downloading = false; // Manejar errores y finalizar la descarga
      }
    );
  }

  }
  delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }
}
