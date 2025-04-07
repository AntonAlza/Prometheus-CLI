import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CalculoImagenTrigo } from './calculoImagenTrigo';
import { BaseTrigoValor } from './basetrigovalor';
import { ImagenBaseTrigo } from './imagenbasetrigo';
import { ListaConsultaBench } from './consultabenchmark';
import { listaregistrobenchmark } from './registrobenchmark';
import { tap } from 'rxjs/operators';
import { ListaInvetarioBruto } from './inventariobruto';
import { UnderlyingClasiall } from '../Fisico/underlyingclasifiall';
import { listaregistroStocktacking } from './registroStocktacking';
import { Listainventariofisico } from './inventarioconfisico';
import { ListasaldoInventario } from './saldoinventario';
import { ListaPortafolioInvetario } from './portafolioinventario';
import { ListaConsultaInv } from './consultainventario';
import { ListaDataGraf } from './data_graf_Stock';
import { ListaPrecioCont } from './preciocontinuo';
import { ListaMescontrato } from './mescontratovalor';
import { ListaProteina } from './nivelproteina';
import { ListaPuertos } from './loadingport';
import { ListaMercados } from './mercado';
import { ListaDataGrafdiario } from './data_graf_stock_diario';
import { ListaStickPrice } from './stickprice';
import { ListaConsultaConsumo } from './consultaconsumo';
import { objConsumobruto } from './consumobruto';
import { ObjConsumo } from './objconsumo';
import { objdeltahedge } from './deltahedge';
import { objdeltahedgelinea } from './deltahedgelinea';
import { objdeltahedgePDF } from './deltahedgepdf';

@Injectable({
  providedIn: 'root'
})
export class CargabasetrigoService {
  private _refresh$= new Subject<void>();
  private apiServerUrl=environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

 public registroValueTrigo(fechareporte:string,newfilename:string,usuarioname:string,fecharegistro:string,horaregistro:string):Observable<any>{
         
    return this.http.get<any>(`${this.apiServerUrl}/CargaBasesTrigo/blobValueTrigo?fechareporte=${fechareporte}&newfilename=${newfilename}&usuarioname=${usuarioname}&fecharegistro=${fecharegistro}&horaregistro=${horaregistro}`);
      }
 public registroImagenTrigo(fechareporte:string,newfilename:string,usuarioname:string,fecharegistro:string,horaregistro:string):Observable<any>{
         
        return this.http.get<any>(`${this.apiServerUrl}/CargaBasesTrigo/blobImagenOCRTrigo?fechareporte=${fechareporte}&newfilename=${newfilename}&usuarioname=${usuarioname}&fecharegistro=${fecharegistro}&horaregistro=${horaregistro}`);
      }
 public listaCalculoImagenTrigo(fechareporte:string):Observable<CalculoImagenTrigo[]>{
        return this.http.get<CalculoImagenTrigo[]>(`${this.apiServerUrl}/CargaBasesTrigo/CalcularImagenTrigo?fechareporte=${fechareporte}`);
      }
 public obtenerrespuesta(fechareporte:string):Observable<string>{
        return this.http.get(`${this.apiServerUrl}/CargaBasesTrigo/TranformacionTrigo?fechareporte=${fechareporte}`, { responseType: 'text' });
      }
 public listabasestrigo(fechareporte:string): Observable<BaseTrigoValor[]>{
        return this.http.get<BaseTrigoValor[]>(`${this.apiServerUrl}/CargaBasesTrigo/trigo?fechareporte=${fechareporte}`);
          }
 public listaImagenTrigo(fechareporte:string):Observable<ImagenBaseTrigo[]>{
            return this.http.get<ImagenBaseTrigo[]>(`${this.apiServerUrl}/CargaBasesTrigo/ImagenTrigo?fechareporte=${fechareporte}`);
          }
 public obtenerconsultabenchmark(fechareporte:string,comoditie:string):Observable<ListaConsultaBench[]>{
            return this.http.get<ListaConsultaBench[]>(`${this.apiServerUrl}/CargaBasesTrigo/ConsultaBenchmark?fechareporte=${fechareporte}&comoditie=${comoditie}`);
          }
 public registrarbenchmark(arregloBenchmark:listaregistrobenchmark[]){
            return this.http.post<string>(`${this.apiServerUrl}/CargaBasesTrigo/GuardarBasebenchmark`,arregloBenchmark).pipe(tap(() =>{
          
              this._refresh$.next();
            } )  
          )
 }
 public registrarbenchmarksin_UPDATE(arregloBenchmark:listaregistrobenchmark[]){
  return this.http.post<string>(`${this.apiServerUrl}/CargaBasesTrigo/GuardarBasebenchmark_sinupdate`,arregloBenchmark).pipe(tap(() =>{

    this._refresh$.next();
  } )  
)
}
 public registroInventarioBruto(fechareporte:string,newfilename:string,usuarioname:string,fecharegistro:string,horaregistro:string):Observable<any>{
         
  return this.http.get<any>(`${this.apiServerUrl}/CargaBasesTrigo/ppinventariobruto?fechareporte=${fechareporte}&newfilename=${newfilename}&usuarioname=${usuarioname}&fecharegistro=${fecharegistro}&horaregistro=${horaregistro}`);
    }

 public obtenerlistainventario(fechareporte:string):Observable<ListaInvetarioBruto[]>{
      return this.http.get<ListaInvetarioBruto[]>(`${this.apiServerUrl}/CargaBasesTrigo/StockTakingBruto?fechareporte=${fechareporte}`);
    }

    public obtenerUnderlyingClassiall(): Observable<UnderlyingClasiall[]>{
      return this.http.get<UnderlyingClasiall[]>(`${this.apiServerUrl}/CargaBasesTrigo/obtenerUnderlyingClassiall`);
  }

  public registrarStockTacking(arregloStocktacking:listaregistroStocktacking[],fechareporte:number){
    return this.http.post<string>(`${this.apiServerUrl}/CargaBasesTrigo/GuardarStocktacking?fechareporte=${fechareporte}`,arregloStocktacking).pipe(tap(() =>{
  
      this._refresh$.next();
    } )  
  )
}
public obtenerinventarioconfisico(empresa:number):Observable<Listainventariofisico[]>{
  return this.http.get<Listainventariofisico[]>(`${this.apiServerUrl}/CargaBasesTrigo/InventarioConFisico?empresa=${empresa}`);
}

public obtenerSaldoInventario(empresa:number):Observable<ListasaldoInventario[]>{
  return this.http.get<ListasaldoInventario[]>(`${this.apiServerUrl}/CargaBasesTrigo/SaldoInventario?empresa=${empresa}`);
}

public obtenerPortafolioInventario(): Observable<ListaPortafolioInvetario[]>{
  return this.http.get<ListaPortafolioInvetario[]>(`${this.apiServerUrl}/CargaBasesTrigo/obtenerPortafolioInventario`);
}
public obtenerrespuestaRelacionInventarioFisico(empresa:number,portafolio:number,fechareporte:number,usuario:string):Observable<string>{
  return this.http.get(`${this.apiServerUrl}/CargaBasesTrigo/RelacionInventarioFisico?empresa=${empresa}&portafolio=${portafolio}&fechareporte=${fechareporte}&usuario=${usuario}`, { responseType: 'text' });
}

public obtenerconsultaInventario(fechareporte_1:number,fechareporte_2:number):Observable<ListaConsultaInv[]>{
  return this.http.get<ListaConsultaInv[]>(`${this.apiServerUrl}/CargaBasesTrigo/ConsultaStockTacking?fechareporte_1=${fechareporte_1}&fechareporte_2=${fechareporte_2}`);
}

public obtener_data_graf_inv():Observable<ListaDataGraf[]>{
  return this.http.get<ListaDataGraf[]>(`${this.apiServerUrl}/CargaBasesTrigo/ObtenerlistaGrafStock`);
}
public obtener_data_Precio_Continuo():Observable<ListaPrecioCont[]>{
  return this.http.get<ListaPrecioCont[]>(`${this.apiServerUrl}/CargaBasesTrigo/ObtenerlistaPrecioContinuo`);
}
public obt_COnsulta_mescontrato_valor(underlying:number,proteina:number,puerto:number,
  tipobase:number,mercado:number,fechareporte:number):Observable<ListaMescontrato[]>{
  return this.http.get<ListaMescontrato[]>(`${this.apiServerUrl}/CargaBasesTrigo/Obtenermesesvalor?underlying=${underlying}&proteina=${proteina}&puerto=${puerto}&tipobase=${tipobase}&mercado=${mercado}&fechareporte=${fechareporte}`);
}
public obtenerNivelProteina(): Observable<ListaProteina[]>{
  return this.http.get<ListaProteina[]>(`${this.apiServerUrl}/CargaBasesTrigo/obtenerNivelProteina`);
}
public obtenerLoadingPort(): Observable<ListaPuertos[]>{
  return this.http.get<ListaPuertos[]>(`${this.apiServerUrl}/CargaBasesTrigo/obtenerPuertos`);
}
public obtenerMercados(): Observable<ListaMercados[]>{
  return this.http.get<ListaMercados[]>(`${this.apiServerUrl}/CargaBasesTrigo/obtenerMercados`);
}
public obtenerconsultaInventariodiario(fechareporte_1:number,fechareporte_2:number):Observable<ListaDataGrafdiario[]>{
  return this.http.get<ListaDataGrafdiario[]>(`${this.apiServerUrl}/CargaBasesTrigo/ObtenerlistaGrafStockdiario?fechareporte_1=${fechareporte_1}&fechareporte_2=${fechareporte_2}`);
}
public obtenerPreciosVariables(fechareporte_1:number,fechareporte_2:number):Observable<ListaStickPrice[]>{
  return this.http.get<ListaStickPrice[]>(`${this.apiServerUrl}/CargaBasesTrigo/Obtenerpreciosvariables?fechareporte_1=${fechareporte_1}&fechareporte_2=${fechareporte_2}`);
}

public grafPreciosVariables():Observable<ListaStickPrice[]>{
  return this.http.get<ListaStickPrice[]>(`${this.apiServerUrl}/CargaBasesTrigo/Grafpreciosvariables`);
}
public registroConsumoBruto(fechareporte: string, newfilename: string, usuarioname: string, fecharegistro: string, horaregistro: string): Observable<any> {
  return this.http.get<any>(`${this.apiServerUrl}/CargaBasesTrigo/ppconsumobruto?fechareporte=${fechareporte}&newfilename=${newfilename}&usuarioname=${usuarioname}&fecharegistro=${fecharegistro}&horaregistro=${horaregistro}`);
}

public obtenerconsultaConsumo(fechareportes: number[]): Observable<ListaConsultaConsumo[]> {
  const fechasParam = fechareportes.join(',');  // Convertir el arreglo a una cadena de fechas separadas por comas
  return this.http.get<ListaConsultaConsumo[]>(`${this.apiServerUrl}/CargaBasesTrigo/ConsultaConsumo?fechareportes=${fechasParam}`);
}

public obtenerconsumobruto(fechareporte:number):Observable<objConsumobruto[]>{
  return this.http.get<objConsumobruto[]>(`${this.apiServerUrl}/CargaBasesTrigo/ListaConsumoBruto?fechareporte=${fechareporte}`);
} 
public insertarConsumo(fechareporte:number,listaconsumo:ObjConsumo[]):Observable<any>{
  return this.http.post<ObjConsumo[]>(`${this.apiServerUrl}/CargaBasesTrigo/ppguardarconsumo?fechareporte=${fechareporte}`,listaconsumo).pipe(tap(() =>{
    this._refresh$.next();
  } )  
)
}
public obtenerfechaconsumo():Observable<number[]>{
  return this.http.get<number[]>(`${this.apiServerUrl}/CargaBasesTrigo/obtenerFechasConsumo`);
} 

public obtenerTickerConsumo():Observable<string[]>{
  return this.http.get<string[]>(`${this.apiServerUrl}/CargaBasesTrigo/obtenerTickerConsumo`);
} 

public obtenerdeltahedgebarras(fechareporte:number):Observable<objdeltahedge[]>{
  return this.http.get<objdeltahedge[]>(`${this.apiServerUrl}/CargaBasesTrigo/ConsultaHedgeReport?fechareporte=${fechareporte}`);
} 

public obtenerdeltahedgelineas(fechareporte:number):Observable<objdeltahedgelinea[]>{
  return this.http.get<objdeltahedgelinea[]>(`${this.apiServerUrl}/CargaBasesTrigo/ConsultaHedgeLinea?fechareporte=${fechareporte}`);
} 
public obtenerdeltahedgePDF(fechareporte:number):Observable<objdeltahedgePDF[]>{
  return this.http.get<objdeltahedgePDF[]>(`${this.apiServerUrl}/CargaBasesTrigo/ConsultaHedgePDF?fechareporte=${fechareporte}`);
} 

}

