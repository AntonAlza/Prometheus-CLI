import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenpbiService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public async obtenerTokenBearer(): Promise<{ expires_in: number, access_token: string }> {
    const response = await this.http.get<any>(`${this.apiServerUrl}/PowerBi/ObtenerBearertoken`).toPromise();
    return {
      expires_in: response.expires_in,
      access_token: response.access_token
    };
}

  public async getToken_Report(TokenBearer: string, groupId: string, reportId: string): Promise<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${TokenBearer}`,
      'Content-Type': 'application/json'
    });
  
    const body = {
      
    };
  
    const response=await this.http.post<any>(`https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`, body, { headers: headers }).toPromise();
     return response.token  
  }

  public async getAccessToken(): Promise<{ expires_in: number, access_token: string }> {
    try {
      const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/token';
      const clientId = 'e79795d5-d51e-4884-a371-df5a4518fc37';
      const client_secret='kb~8Q~Cxj~9aj6S~QjmEMPmr~gwRk1a1vNq1mbjy'
      const resource = 'https://analysis.windows.net/powerbi/api';
      const scope = 'https://analysis.windows.net/powerbi/api/.default';
      const username='prometheus@mathrisksolution.com';
      const password='Prueba123';
  
      const body = `grant_type=password&client_id=${clientId}&username=${username}&password=${password}&resource=${resource}&client_secret=${client_secret}`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  
      const response = await this.http.post<any>(tokenUrl, body, { headers: headers }).toPromise();
      return {
        expires_in: response.expires_in,
        access_token: response.access_token
      };
    } catch (error) {
      throw new Error('Error al obtener el token de acceso: ' + error);
    }
  }

  
  public async ExportToFileInGroup(groupId: string, reportId: string, TokenBearer: string) {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/ExportTo`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TokenBearer}`
    });

    const response =await this.http.post<any>(url,{ format: 'PPTX' }, {headers: headers}).toPromise();
    return response.id
  }

  public async GetExportTofileStatusInGroup(groupId: string, reportId: string,exportId:string, TokenBearer: string) {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/exports/${exportId}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TokenBearer}`
    });

    const response =await this.http.get<any>(url, {headers: headers}).toPromise();
    return response.status
  }

  public GetFileOfExportTofileInGroup(groupId: string, reportId: string ,exportId:string,TokenBearer: string): Observable<Blob> {

    const exportUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/exports/${exportId}/file`;

    
     const headers= new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TokenBearer
      });
   
    return this.http.get(exportUrl, {
      headers: headers,
      responseType: 'blob' // Specify the response type as blob
    });

  }

}
