import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { Future } from 'src/app/models/Fisico/Future';
import { cargaCombo } from "src/app/models/Fisico/cargaCombo";
import { ConsultaIFDsFret } from 'src/app/models/Fret/ConsultaIFDsFret';
import { ListaConsultaIFD } from 'src/app/models/Fret/ListaConsultaIFD';
import { ProductosFret } from 'src/app/models/Fret/ProductosFret';
import { estrategiasXComponente } from 'src/app/models/Fret/estrategiasXComponente';
import { listaCalculoCapsFloors } from 'src/app/models/Fret/listaCalculoCapsFloors';
import { listaTickerPrecioTiempoReal } from 'src/app/models/Fret/listaTickerPrecioTiempoReal';
import { objTablas } from 'src/app/models/Fret/objTablas';
import { take } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { DetalleIFDFret } from 'src/app/models/Fret/DetalleIFDFret';

@Injectable({
    providedIn: 'root'
  })
  export class FretRealTimeService implements OnDestroy{
    public flgReconeccionAutomatica = true
    
    private apiPython =environment.apiPythonURLTE;
    private urlSocketPython =environment.socketPythonURLTE;
    private apiJava =environment.apiBaseUrl;
  // Realiza la petición HTTP para descargar el archivo de datos Parquet desde Databricks
    private socket: WebSocket;
    // private messageSubject: Subject<string> = new Subject<string>();
    private messageSubject: ReplaySubject<string> = new ReplaySubject<string>(1);
    resultadoValorizacion: any;
    timeoutId: any;

    // INCIO Objetos Simulacion
    columnasResultados_SIM: Object [] = [];
    arrListaResultados_SIM:Object[]=[];
    arrListaResultadosComparativo_SIM:Object[]=[];
    arrListaMercado_SIM:Object[]=[];
    columnasPosicion_SIM: Object[] = [];
    listaTablasPosicion_SIM: objTablas[] = [];
    listaTablasResultados_SIM: objTablas[] = [];
    arrListaConsultaIFD_SIM:ListaConsultaIFD[]=[];
    columnasPapelesLiquidados_SIM: Object [] = [];
    arrListaConsultaPapelesLiquid_SIM:Object[]=[];

    listaProductosFret_SIM:ProductosFret[]=[];
    tabSeleccionado_SIM: string; 
    selectedOptions_SIM: string[];
    factorContractInMetricTons_SIM: number;
    listaTrigoXMes_SIM: string[][] = []
    unidadMedida_SIM:string
    // FIN Objetos Simulacion

    flgSimulacion: boolean;
    flgHistorico: boolean = false;
    flgEstadoSocket: boolean;
    constructor(private http: HttpClient) {
      // this.initWebSocket();
    }

    initWebSocket(): void {
      // Reemplaza la URL con la dirección de tu servidor WebSocket
      // this.socket = new WebSocket('ws://127.0.0.1:8000');
      this.socket = new WebSocket(this.urlSocketPython);
  
      this.socket.onopen = () => {
        this.flgEstadoSocket = true;
        console.log('Conexión establecida');
      };
  
      this.socket.onmessage = (event) => {
        // console.log('Mensaje recibido:', event.data);
        this.messageSubject.next(event.data);
      };
  
      this.socket.onerror = (error) => {
        console.error('Error en la conexión:', error);
      };
      
      this.socket.onclose = () => {
        this.flgEstadoSocket = false;
        if(this.flgReconeccionAutomatica){
          console.log('Conexión cerrada');
          // Intentar reconectar si se cierra la conexión
          this.timeoutId = setTimeout(() => {if(!this.flgHistorico){this.initWebSocket()}}, 3000);
        }
      };
  
    }
  
    executePxLive() {
      return this.http.get<any>(`${this.apiPython}/data`);
    }

    executePxLiveDelta() {
      return this.http.get<any>(`${this.apiPython}/dataDelta`);
    }

    executeMtMLive() {
      return this.http.get<any>(`${this.apiPython}/dataValorizacion`);
    }

    valorizacionDemanda(){
      return this.http.get<any>(`${this.apiPython}/valorizacionDemanda`);
    }

    valorizacion_SIM(grupoMercado: any){

      const objGrupoMercado = JSON.stringify(grupoMercado);

      return this.http.get<any>(`${this.apiPython}/valorizacion_SIM?objGrupoMercado=${encodeURIComponent(objGrupoMercado)}`);
    }

    calculoCFR(grupoMercado: any, grupoPosicion: any, grupoResultado: any, grupoColumnas: any, grupoFret: string, trigoXMes: any){
      const objGrupoMercado = JSON.stringify(grupoMercado);
      const objGrupoPosicion = JSON.stringify(grupoPosicion);
      const objGrupoResultado = JSON.stringify(grupoResultado);
      const objColumnas = JSON.stringify(grupoColumnas);
      const objTrigos = JSON.stringify(trigoXMes);

      // Generar la URL con los parámetros de consulta
      const url = `${this.apiPython}//calculoCFR?objGrupoMercado=${encodeURIComponent(objGrupoMercado)}&objGrupoPosicion=${encodeURIComponent(objGrupoPosicion)}
        &objGrupoResultado=${encodeURIComponent(objGrupoResultado)}&objColumnas=${encodeURIComponent(objColumnas)}&grupoFret=${encodeURIComponent(grupoFret)}
        &objTrigos=${encodeURIComponent(objTrigos)}`;

      return this.http.get<any>(url);
      
    }

    calculoCFR_Stress(grupoMercado: any, grupoPosicion: any, grupoResultado: any, grupoColumnas: any, grupoFret: string, trigoXMes: any){
      const objGrupoMercado = JSON.stringify(grupoMercado);
      const objGrupoPosicion = JSON.stringify(grupoPosicion);
      const objGrupoResultado = JSON.stringify(grupoResultado);
      const objColumnas = JSON.stringify(grupoColumnas);
      const objTrigos = JSON.stringify(trigoXMes);
      
      const url = `${this.apiPython}//calculoCFR_Stress?objGrupoMercado=${encodeURIComponent(objGrupoMercado)}&objGrupoPosicion=${encodeURIComponent(objGrupoPosicion)}&objGrupoResultado=${encodeURIComponent(objGrupoResultado)}&objColumnas=${encodeURIComponent(objColumnas)}&grupoFret=${encodeURIComponent(grupoFret)}
      &objTrigos=${encodeURIComponent(objTrigos)}`;

      return this.http.get<any>(url);
    }

    obtenerPreciosPalma(){
      const url = `${this.apiPython}/obtenerPrecioPalma`;
      return this.http.get<any>(url);
    }

    obtenerUltimosPrecios_Hedge(){
      const url = `${this.apiPython}/obtenerPrecioInitHedge`;
      return this.http.get<any>(url);
    }
    

    obtenerUltimosPrecios(){
      const url = `${this.apiPython}/obtenerPrecioInit`;
      return this.http.get<any>(url);
    }

    public portafoliPrecioTiempoReal(idUnderlying: number): Observable<listaTickerPrecioTiempoReal[]>{
      return this.http.get<listaTickerPrecioTiempoReal[]>(`${this.apiJava}/Fret/portafoliPrecioTiempoReal?idUnderlying=${idUnderlying}`);
    }

    public obtenerProductos(): Observable<cargaCombo[]>{
      return this.http.get<cargaCombo[]>(`${this.apiJava}/Fret/obtenerProductos`);
    }

    public getMessages(): Observable<string> {
      return this.messageSubject.asObservable();
    }
      
    closeConnection(): void {
      if (this.socket) {
        this.socket.close();
      }
    }

    ngOnDestroy() {
      this.closeConnection();
    }

    calculoPosicionPricing(operaciones: ConsultaIFDsFret[], factor: number): any{

      const resultado = operaciones.reduce((acc, item) => {
        if (!acc[item.s303_Cobertura]) {
          acc[item.s303_Cobertura] = { tm: 0, precioTotalPonderado: 0, sumaPesos: 0 };
        }
        acc[item.s303_Cobertura].tm += item.s303_NumeroContratos * factor;
        acc[item.s303_Cobertura].precioTotalPonderado += item.s303_Strike * item.s303_NumeroContratos;
        acc[item.s303_Cobertura].sumaPesos += item.s303_NumeroContratos;
        return acc;
      }, {} as { [key: string]: { tm: number, precioTotalPonderado: number, sumaPesos: number } });
      

      // Convertir el objeto en una lista de objetos con el precio promedio ponderado
      const listaResultado = Object.entries(resultado).map(([mesCobertura, valores]) => ({
        mesCobertura,
        tm: valores.tm,
        precioPromedioPonderado: valores.precioTotalPonderado / valores.sumaPesos,
      }));
      
      return listaResultado;
    }

    calculoDeltasCaps(operaciones: ConsultaIFDsFret[], factor: number): any{

      // let dicDeltasxMes = []
      let dicDeltasxMes: listaCalculoCapsFloors[] = []

      let strike: number;
      let primaPagada: number;
      let delta: number;
      let tm: number;
      let precio: number;

      operaciones.forEach(dataIFD => {
        if(["Long Call","Long Binary Call","Binary Call Spread","Long Contingent Daily Call","Long Daily Call","Long Asian Call","Call Spread","Long Collar","Long Three-Way"].includes(dataIFD["s303_Estrategia"])){
          
          const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

          const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);

          if(!exists){
            primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
            delta = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_Delta"]) || 0), 0);
            // delta = listaComponentes.filter(obj => obj["s303_Ifd"].substr(0,1) == '+')[0]["s303_Delta"];
            strike = listaComponentes.filter(obj => obj["s303_Ifd"].substr(0,1) == '+')[0]["s303_Strike"];
            
            if(delta == 0){
              tm = 0
              precio = 0
            }else{
              tm = delta * factor
              precio = primaPagada + strike
            }
            

            dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                ficha: dataIFD["s303_Ficha"], 
                                strike: strike, 
                                prima: primaPagada, 
                                delta: delta, 
                                tipo: 'variable',
                                tm: tm,
                                precio: precio})
          }
        }else if(["Converting Call","Synthetic Call Spread","Long Synthetic Call","Long Synthetic Collar","Call Spread Sintético", "Synthetic Call","Long Converting Collar","Converting Call Spread"
                  ,"Long Modified Average with Range","Long Modified Average with Range & Participation","Long Modified Average with barrier"].includes(dataIFD["s303_Estrategia"])){

          const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());


          const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);
       

          if(!exists){
            primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
            delta = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_Delta"]) || 0), 0);
            strike = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"))[0]["s303_Strike"]; // ------------------------------?
            tm = delta * factor
            precio = primaPagada + strike

            dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                ficha: dataIFD["s303_Ficha"], 
                                strike: strike, 
                                prima: primaPagada, 
                                delta: delta, 
                                tipo: 'variable',
                                tm: tm,
                                precio: precio})
          }
        }else if(["Long Protected Fixed Accumulating Trigger Double Daily", "Long Protected Fixed Accumulating Trigger Double Expirity",
                  "Long Digital Range Accrual Double Daily","Long Digital Range Accrual Double Expirity","Long Modified Average"].includes(dataIFD["s303_Estrategia"])){

          const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

          const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);

          if(!exists){
            primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
            delta = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_Delta"]) || 0), 0);
            let listaDetalle = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"));

            if(listaDetalle.length == 0){
              strike = dataIFD["s303_NivelAcum"]
            }else{
              strike = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"))[0]["s303_Strike"];
            }
                                     
            tm = delta * factor
            precio = primaPagada + strike

            dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                ficha: dataIFD["s303_Ficha"], 
                                strike: strike, 
                                prima: primaPagada, 
                                delta: delta, 
                                tipo: 'variable',
                                tm: tm,
                                precio: precio})
          }
        }
        // else if(["Long Protected Fixed Accumulating Trigger Double Daily","Long Protected Fixed Accumulating Trigger Double Expirity",
        //           "Long Digital Range Accrual Double Daily", "Long Digital Range Accrual Double Expirity"].includes(dataIFD["s303_Estrategia"])){

        //   const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

        //   const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);

        //   if(!exists){
        //     primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
        //     delta = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_Delta"]) || 0), 0);
        //     strike = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"))[0]["s303_Strike"];
              
        //     tm = delta * factor
        //     precio = primaPagada + strike

        //     dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
        //                         ficha: dataIFD["s303_Ficha"], 
        //                         strike: strike, 
        //                         prima: primaPagada, 
        //                         delta: delta, 
        //                         tipo: 'fijo',
        //                         tm: tm,
        //                         precio: precio})
        //   }
        // }
      })

      let dicFinalDeltasxMes: listaCalculoCapsFloors[] = []

      dicDeltasxMes.forEach(dataXMes => {

        const exists = dicFinalDeltasxMes.some((d) => d.mes === dataXMes.mes);

        if(!exists){
          const listaMeses = dicDeltasxMes.filter(obj => obj.mes === dataXMes.mes);

          if(listaMeses.length > 1){
            tm = listaMeses.reduce((acum, obj) => acum + (Number(obj.tm) || 0), 0);
            delta = listaMeses.reduce((acum, obj) => acum + (Number(obj.delta) || 0), 0);
            precio = listaMeses.reduce((acum, obj) => acum + (obj.precio * obj.delta || 0), 0);

            precio = precio/delta

            dataXMes.precio = Math.round(precio)
            dataXMes.tm = Math.round(tm)

            dicFinalDeltasxMes.push(dataXMes);
          }else{
            dataXMes.precio = Math.round(dataXMes.precio)
            dataXMes.tm = Math.round(dataXMes.tm)
            dicFinalDeltasxMes.push(dataXMes);
          }
        }
      });
      return dicFinalDeltasxMes;
    }

    calculoDeltasFloors(operaciones: any, factor: number): any{
      // let dicDeltasxMes = []
      let dicDeltasxMes: listaCalculoCapsFloors[] = []

      let strike: number;
      let primaPagada: number;
      let delta: number;
      let tm: number;
      let precio: number;

      operaciones.forEach(dataIFD => {
        if(["Long Put","Long Daily Put","Long Put Binary","Binary Put Spread","Long Contingent Daily Put","Long Asian Put","Put Spread","Short Collar","Short Three-Way"].includes(dataIFD["s303_Estrategia"])){
          
          const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

          const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);

          if(!exists){
            primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
            delta = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_Delta"]) || 0), 0);
            strike = listaComponentes.filter(obj => obj["s303_Ifd"].substr(0,1) == '+')[0]["s303_Strike"];
              
            tm = delta * factor
            precio = strike - primaPagada 

            dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                ficha: dataIFD["s303_Ficha"], 
                                strike: strike, 
                                prima: primaPagada, 
                                delta: delta, 
                                tipo: 'variable',
                                tm: tm,
                                precio: precio})
          }
        }else if(["Converting Put","Long Synthetic Put","Synthetic Put Spread","Short Converting Collar","Short Synthetic Collar","Converting Put Spread",
                  "Short Modified Average", "Short Modified Average with Range","Short Modified Average with Range & Participation","Short Modified Average with barrier"].includes(dataIFD["s303_Estrategia"])){
            
            const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

            const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);
          
            if(!exists){
              primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
              delta = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_Delta"]) || 0), 0);
              strike = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"))[0]["s303_Strike"];
                        
              tm = delta * factor
              precio = strike - primaPagada 
          
              dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                  ficha: dataIFD["s303_Ficha"], 
                                  strike: strike, 
                                  prima: primaPagada, 
                                  delta: delta, 
                                  tipo: 'variable',
                                  tm: tm,
                                  precio: precio})
            }
                  
        }else if(["Short Swap","Long Swap","Short Future","Long Future"].includes(dataIFD["s303_Estrategia"])){


            const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

            const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);

            if(!exists){
              // primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
              delta = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_NumeroContratos"]) || 0), 0);
              strike = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_Strike"]) || 0), 0); 
                        
              tm = delta * factor
              precio = strike 

              dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                  ficha: dataIFD["s303_Ficha"], 
                                  strike: strike, 
                                  prima: primaPagada, 
                                  delta: delta, 
                                  tipo: 'fijo',
                                  tm: tm,
                                  precio: precio})
            }
                  
          }
      })

      let dicFinalDeltasxMes: listaCalculoCapsFloors[] = []

      dicDeltasxMes.forEach(dataXMes => {

        const exists = dicFinalDeltasxMes.some((d) => d.mes === dataXMes.mes && d.tipo === dataXMes.tipo);

        if(!exists){
          const listaMeses = dicDeltasxMes.filter(obj => obj.mes === dataXMes.mes && obj.tipo === dataXMes.tipo);

          if(listaMeses.length > 1){
            tm = listaMeses.reduce((acum, obj) => acum + (Number(obj.tm) || 0), 0);
            delta = listaMeses.reduce((acum, obj) => acum + (Number(obj.delta) || 0), 0);
            precio = listaMeses.reduce((acum, obj) => acum + (obj.precio * obj.delta || 0), 0);

            precio = precio/delta

            dataXMes.precio = Math.round(precio)
            dataXMes.tm = Math.round(tm)

            dicFinalDeltasxMes.push(dataXMes);
          }else{
            dataXMes.precio = Math.round(dataXMes.precio)
            dataXMes.tm = Math.round(dataXMes.tm)
            dicFinalDeltasxMes.push(dataXMes);
          }
        }
      });

      return dicFinalDeltasxMes;
    }


    recalculoDeltaExpiracionCaps(operaciones: ConsultaIFDsFret[]): string [][]{
      
      let fichasProcesadasxDelta: string [][] = []
      let futuro: ConsultaIFDsFret[] = []
      let shortCall: ConsultaIFDsFret[] = []
      let longCall: ConsultaIFDsFret[] = []
      let shortPut: ConsultaIFDsFret[] = []
      let longPut: ConsultaIFDsFret[] = []
      let deltaEstrategia: number = 0;
      let strike: number = 0;
      // dataIFD["s303_Delta"]
      operaciones.forEach(dataIFD => {

        const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

        futuro = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"));
        shortCall = listaComponentes.filter(obj => obj["s303_Ifd"].includes("- Call"));
        longCall = listaComponentes.filter(obj => obj["s303_Ifd"].includes("+ Call"));
        shortPut = listaComponentes.filter(obj => obj["s303_Ifd"].includes("- Put"));
        longPut = listaComponentes.filter(obj => obj["s303_Ifd"].includes("+ Put"));

        const exists = fichasProcesadasxDelta.some((d) => d[0] === dataIFD["s303_Ficha"]);

        if(!exists){
          if(estrategiasXComponente.includes(dataIFD["s303_Estrategia"])){
            // if(longCall.length > 0){
            if(dataIFD["s303_Ifd"].includes("+ Call")){ // longCall
              if( dataIFD["s303_Strike"] < dataIFD["precioActual"]){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
                strike = dataIFD["s303_Strike"]

                fichasProcesadasxDelta.push([dataIFD["s303_Operacion"].toString(),deltaEstrategia.toString(), strike.toString(),'operacion'])
                deltaEstrategia = 0
                strike = 0
                return;
              }
            }
            // if(shortPut.length > 0){
            if(dataIFD["s303_Ifd"].includes("- Put")){ // shortPut
              if(dataIFD["s303_Strike"] > dataIFD["precioActual"]){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
                strike = dataIFD["s303_Strike"]

                fichasProcesadasxDelta.push([dataIFD["s303_Operacion"].toString(),deltaEstrategia.toString(), strike.toString(),'operacion'])
                deltaEstrategia = 0
                strike = 0
                return;
              }
            }

            if(dataIFD["s303_Ifd"].includes("- Call")){ // shortCall
            // if(shortCall.length > 0){
              if(dataIFD["s303_Strike"] < dataIFD["precioActual"]){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 + deltaEstrategia
                strike = dataIFD["s303_Strike"]

                fichasProcesadasxDelta.push([dataIFD["s303_Operacion"].toString(),deltaEstrategia.toString(), strike.toString(),'operacion'])
                deltaEstrategia = 0
                strike = 0
                return;
              }
            }
            if(dataIFD["s303_Ifd"].includes("+ Put")){ // futuro
            // if(longPut.length > 0){
              if(dataIFD["s303_Strike"] > dataIFD["precioActual"]){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 + deltaEstrategia
                strike = dataIFD["s303_Strike"]

                fichasProcesadasxDelta.push([dataIFD["s303_Operacion"].toString(),deltaEstrategia.toString(), strike.toString(),'operacion'])
                deltaEstrategia = 0
                strike = 0
                return;
              }
            }

            // if(futuro.length > 0){
            if(dataIFD["s303_Ifd"].includes("Swap")){ // shortCall
              deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
              strike = futuro[0]["s303_Strike"]
            }

            fichasProcesadasxDelta.push([dataIFD["s303_Operacion"].toString(),deltaEstrategia.toString(), strike.toString(),'operacion'])
            deltaEstrategia = 0
            strike = 0
            return;
          }

          if(futuro.length > 0){
            deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
            strike = futuro[0]["s303_Strike"]
          }
          
          // else if(dataIFD["s303_Estrategia"] == 'Converting Call' && (dataIFD["s303_Strike"] < dataIFD["precioActual"])){
          //   deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"])
          //   strike = dataIFD["s303_Strike"]
          // }
          // else if(dataIFD["s303_Estrategia"] == 'Long Synthetic Call' && (dataIFD["s303_Strike"] < dataIFD["precioActual"])){
          //   deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"])
          //   strike = dataIFD["s303_Strike"]
          // }
          else if(dataIFD["s303_Estrategia"] == 'Long Modified Average'){
            deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"])
            if(futuro.length > 0){
              strike = futuro[0]["s303_Strike"]
            }
          }else if(dataIFD["s303_Estrategia"] == 'Long Modified Average with Range'){
            deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"])
            if(futuro.length > 0){
              strike = futuro[0]["s303_Strike"]
            }
          }
          
          // if(dataIFD["s303_Estrategia"] == 'Synthetic Call Spread'){
          //   if(futuro.length > 0 && shortCall.length > 0){
          //     if(dataIFD["precioActual"] > futuro[0]["s303_Strike"] && dataIFD["precioActual"] < shortCall[0]["s303_Strike"]){
          //       deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
          //       strike = futuro[0]["s303_Strike"]
          //     }
          //     if(dataIFD["precioActual"] > futuro[0]["s303_Strike"] && dataIFD["precioActual"] > shortCall[0]["s303_Strike"]){
          //       deltaEstrategia = 0 + deltaEstrategia
          //       strike = 0
          //     }
          //   }
          // }

          // if(dataIFD["s303_Estrategia"] == 'Long Synthetic Call'){
          //   if(futuro.length > 0){
          //     if(futuro[0]["s303_Strike"] < dataIFD["precioActual"]){
          //       deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"])
          //       strike = futuro[0]["s303_Strike"]
          //     }
          //   }
          // }
  
          // if(dataIFD["s303_Estrategia"] == 'Long Converting Collar'){

          //   if(longCall.length > 0){
          //     if(dataIFD["precioActual"] > longCall[0]["s303_Strike"]){
          //       deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
          //       strike = longCall[0]["s303_Strike"]
          //     }
          //   }

          //   if(longCall.length > 0 && shortPut.length > 0){
          //     if(dataIFD["precioActual"] <  longCall[0]["s303_Strike"] &&  dataIFD["precioActual"] > shortPut[0]["s303_Strike"]){
          //       deltaEstrategia = 0 + deltaEstrategia
          //       strike = 0
          //     }
          //   }

          //   if(shortPut.length > 0){
          //     if(dataIFD["precioActual"] < shortPut[0]["s303_Strike"]){
          //       deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
          //       strike = shortPut[0]["s303_Strike"]
          //     }
          //   }
          // }

          // if(dataIFD["s303_Estrategia"] == 'Long Synthetic Collar'){
          //   if(futuro.length > 0){
          //     if(futuro[0]["s303_Strike"] < dataIFD["precioActual"]){
          //       deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"])
          //       strike = futuro[0]["s303_Strike"]
          //     }
          //   }
          //   if(futuro.length > 0 && shortPut.length > 0){
          //     if(dataIFD["precioActual"] < futuro[0]["s303_Strike"] && dataIFD["precioActual"] > shortPut[0]["s303_Strike"]){
          //       deltaEstrategia = 0
          //       strike = 0
          //     }
          //   }
          //   if(shortPut.length > 0){
          //     if(dataIFD["precioActual"] < shortPut[0]["s303_Strike"]){
          //       deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"])
          //       strike = shortPut[0]["s303_Strike"]
          //     }
          //   }
          // }
           
          // if(dataIFD["s303_Estrategia"] == 'Converting Call Spread'){
          //   if(longCall.length > 0 && shortCall.length > 0){
          //     if(dataIFD["precioActual"] > longCall[0]["s303_Strike"] && dataIFD["precioActual"] < shortCall[0]["s303_Strike"]){
          //       deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
          //     }
          //     if(dataIFD["precioActual"] > longCall[0]["s303_Strike"] && dataIFD["precioActual"] > shortCall[0]["s303_Strike"]){
          //       deltaEstrategia = 0 + deltaEstrategia
          //     }
          //   }
          // }
  
          if(dataIFD["s303_Estrategia"] == 'Long Modified Average with Range & Participation'){
            if(shortCall.length > 0 && futuro.length > 0){
              if(dataIFD["precioActual"] < shortCall[0]["s303_Strike"]){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
                strike = futuro[0]["s303_Strike"]
              }
            }
            if(shortCall.length > 0){
              if(dataIFD["precioActual"] > shortCall[0]["s303_Strike"]){
                deltaEstrategia = 0 + deltaEstrategia
                strike = 0
              }
            }
          }

          if(dataIFD["s303_Estrategia"] == 'Long Modified Average with barrier'){
            if(shortCall.length > 0 && futuro.length > 0){
              deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
              strike = futuro[0]["s303_Strike"]
            }
          }
          // if(shortCall.length > 0){
          //   if(dataIFD["s303_Estrategia"] == 'Long Modified Average with Range & Participation' && (dataIFD["precioActual"] > shortCall[0]["s303_Strike"])){
          //     deltaEstrategia = 0
          //   }
          // }

          if(deltaEstrategia == 0){
            strike = 0
          }

          fichasProcesadasxDelta.push([dataIFD["s303_Ficha"],deltaEstrategia.toString(), strike.toString(), 'estrategia'])

          deltaEstrategia = 0
          strike = 0

        }
      })

      return fichasProcesadasxDelta;
    }

    recalculoDeltaExpiracionFloors(operaciones: ConsultaIFDsFret[]): string [][]{
      let fichasProcesadasxDelta: string [][] = []

      let futuro: ConsultaIFDsFret[] = []
      let shortCall: ConsultaIFDsFret[] = []
      let longCall: ConsultaIFDsFret[] = []
      let shortPut: ConsultaIFDsFret[] = []
      let longPut: ConsultaIFDsFret[] = []
      let deltaEstrategia: number = 0;
      let strike: number = 0;

      operaciones.forEach(dataIFD => {

        const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

        futuro = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"));
        shortCall = listaComponentes.filter(obj => obj["s303_Ifd"].includes("- Call"));
        longCall = listaComponentes.filter(obj => obj["s303_Ifd"].includes("+ Call"));
        shortPut = listaComponentes.filter(obj => obj["s303_Ifd"].includes("- Put"));
        longPut = listaComponentes.filter(obj => obj["s303_Ifd"].includes("+ Put"));

        const exists = fichasProcesadasxDelta.some((d) => d[0] === dataIFD["s303_Ficha"]);

        if(!exists){
          if(["Long Put","Long Daily Put","Long Put Binary","Binary Put Spread","Long Contingent Daily Put","Long Asian Put","Put Spread","Short Collar","Short Three-Way"].includes(dataIFD["s303_Estrategia"])){

            if(longCall.length > 0){
              if( longCall[0]["s303_Strike"] < dataIFD["precioActual"]){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
                strike = longCall[0]["s303_Strike"]
              }
            }
            if(shortPut.length > 0){
              if(shortPut[0]["s303_Strike"] > dataIFD["precioActual"]){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) + deltaEstrategia
                strike = shortPut[0]["s303_Strike"]
              }
            }
            if(shortCall.length > 0){
              if(shortCall[0]["s303_Strike"] < dataIFD["precioActual"]){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 + deltaEstrategia
                strike = shortCall[0]["s303_Strike"]
              }
            }
            if(longPut.length > 0){
              if(longPut[0]["s303_Strike"] > dataIFD["precioActual"]){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 + deltaEstrategia
                strike = longPut[0]["s303_Strike"]
              }
            } 
          }else if(dataIFD["s303_Estrategia"] == 'Converting Put'){
            if(dataIFD["s303_Strike"] > dataIFD["precioActual"] ){
              deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 + deltaEstrategia
              strike = dataIFD[0]["s303_Strike"]
            }
          }

          if(futuro.length > 0){
            if(dataIFD["s303_Estrategia"] == 'Long Synthetic Put' && (futuro[0]["s303_Strike"] > dataIFD["precioActual"])){
              deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 + deltaEstrategia
              strike = dataIFD[0]["s303_Strike"]
            }
          }

          if(futuro.length > 0  && shortPut.length > 0){
            if(dataIFD["s303_Estrategia"] == 'Put Spread Sintético' && (dataIFD["precioActual"] < futuro[0]["s303_Strike"]) && (dataIFD["precioActual"] < shortPut[0]["s303_Strike"])){
              deltaEstrategia = 0 + deltaEstrategia
            }
            if(dataIFD["s303_Estrategia"] == 'Put Spread Sintético' && (dataIFD["precioActual"] < futuro[0]["s303_Strike"]) && (dataIFD["precioActual"] > shortPut[0]["s303_Strike"])){
              deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 + deltaEstrategia
            }
          }

          if(dataIFD["s303_Estrategia"] == 'Short Converting Collar'){
            if(longPut.length > 0 && shortCall.length > 0){
              if((dataIFD["precioActual"] > longPut[0]["s303_Strike"]) && (dataIFD["precioActual"] < shortCall[0]["s303_Strike"])){
                deltaEstrategia = 0 + deltaEstrategia
              }
            }
            if(longPut.length > 0){
              if((dataIFD["precioActual"] < longPut[0]["s303_Strike"])){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 + deltaEstrategia
              }
            }
            if(shortCall.length > 0){
              if((dataIFD["precioActual"] > shortCall[0]["s303_Strike"])){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 + deltaEstrategia
              }
            }
          }

          if(dataIFD["s303_Estrategia"] == 'Converting Put Spread'){
            if(longPut.length > 0 && shortPut.length > 0){
              if((dataIFD["precioActual"] < longPut[0]["s303_Strike"]) && (dataIFD["precioActual"] < shortPut[0]["s303_Strike"])){
                deltaEstrategia = 0 + deltaEstrategia
              }
              if((dataIFD["precioActual"] < longPut[0]["s303_Strike"]) && (dataIFD["precioActual"] > shortPut[0]["s303_Strike"])){
                deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 + deltaEstrategia
              }
            }
          }

          if(dataIFD["s303_Estrategia"] == 'Short Modified Average with Range & Participation'){
            deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1 

            if(shortPut.length > 0){
              if(dataIFD["precioActual"] < shortPut[0]["s303_Strike"]){
                deltaEstrategia = 0
              }
            }
          }

          
          if(dataIFD["s303_Estrategia"] == 'Short Modified Average'){
            deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1
          }else if(dataIFD["s303_Estrategia"] == 'Short Modified Average with Range'){
            deltaEstrategia = Math.abs(dataIFD["s303_NumeroContratos"]) * -1
          }

          fichasProcesadasxDelta.push([dataIFD["s303_Ficha"],deltaEstrategia.toString(), strike.toString()])

          deltaEstrategia = 0
          strike = 0
        }
          
      })

      return fichasProcesadasxDelta;
    }

    calculoDeltasCaps_Expiracion(operaciones: ConsultaIFDsFret[], factor: number): any{

      // let dicDeltasxMes = []
      let dicDeltasxMes: listaCalculoCapsFloors[] = []

      let strike: number;
      let primaPagada: number;
      let delta: number;
      let tm: number;
      let precio: number;

      operaciones.forEach(dataIFD => {

        if(estrategiasXComponente.includes(dataIFD["s303_Estrategia"])){
          const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

          const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);

          if(!exists){
            primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
            delta = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_Delta"]) || 0), 0);
            try{
              strike = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_Strike"]) || 0) * (Number(obj["s303_Delta"]) || 0), 0);
            } catch (error) {
              strike = 0
            }
            
            
            if(delta == 0){
              tm = 0
              precio = 0
            }else{
              tm = delta * factor
              // precio = primaPagada + strike
              precio = strike 
            }
            

            dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                ficha: dataIFD["s303_Ficha"], 
                                strike: strike, 
                                prima: primaPagada, 
                                delta: delta, 
                                tipo: 'fijo',
                                tm: tm,
                                precio: precio})
          }
        }
        // if(["Long Call","Long Binary Call","Long Contingent Daily Call","Long Daily Call","Long Asian Call","Call Spread","Long Collar","Long Three-Way"].includes(dataIFD["s303_Estrategia"])){
          
        //   const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

        //   const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);

        //   if(!exists){
        //     primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
        //     delta = listaComponentes.filter(obj => obj["s303_Ifd"].substr(0,1) == '+')[0]["s303_Delta"];
        //     strike = listaComponentes.filter(obj => obj["s303_Ifd"].substr(0,1) == '+')[0]["s303_Strike"];
            
        //     if(delta == 0){
        //       tm = 0
        //       precio = 0
        //     }else{
        //       tm = delta * factor
        //       // precio = primaPagada + strike
        //       precio = strike
        //     }
            

        //     dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
        //                         ficha: dataIFD["s303_Ficha"], 
        //                         strike: strike, 
        //                         prima: primaPagada, 
        //                         delta: delta, 
        //                         tipo: 'fijo',
        //                         tm: tm,
        //                         precio: precio})
        //   }
        // }
        else if(["Converting Call","Long Synthetic Call","Long Synthetic Collar","Call Spread Sintético", "Synthetic Call","Long Converting Collar","Converting Call Spread"
                  ,"Long Modified Average with Range","Long Modified Average with Range & Participation"].includes(dataIFD["s303_Estrategia"])){

          const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());
          const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);
          if(!exists){
            primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
            delta = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"))[0]["s303_Delta"];
            try{
              strike = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"))[0]["s303_Strike"] * delta; // ------------------------------?
            } catch (error) {
              strike = 0  
            }

            if(delta == 0){
              tm = 0
              precio = 0
            }else{
              tm = delta * factor
              // precio = primaPagada + strike
              precio = strike
            }

            dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                ficha: dataIFD["s303_Ficha"], 
                                strike: strike, 
                                prima: primaPagada, 
                                delta: delta, 
                                tipo: 'fijo',
                                tm: tm,
                                precio: precio})
          }
        }else if(["Long Protected Fixed Accumulating Trigger Double Daily", "Long Protected Fixed Accumulating Trigger Double Expirity","Long Modified Average",
                  "Long Digital Range Accrual Double Daily","Long Digital Range Accrual Double Expirity"].includes(dataIFD["s303_Estrategia"])){

          const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

          const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);

          if(!exists){
            primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
            let listaDetalle = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"));

            if(listaDetalle.length == 0){
              strike = dataIFD["s303_NivelAcum"]
            }else{
              strike = listaDetalle[0]["s303_Strike"]
            }
            // delta = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"))[0]["s303_Delta"];
            let listaDelta = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"));
            if(listaDetalle.length == 0){
              delta = dataIFD["s303_DeltaSwap"];
            }else{
              delta = listaDelta[0]["s303_Delta"];
            }
            
            try{
              
              strike = strike * delta;
              // strike = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"))[0]["s303_Strike"] * delta;
              // strike = 649
            } catch (error) {
              strike = 0
            }

            if(delta == 0){
              tm = 0
              precio = 0
            }else{
              tm = delta * factor
              // precio = primaPagada + strike
              precio = strike
            }

            dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                ficha: dataIFD["s303_Ficha"], 
                                strike: strike, 
                                prima: primaPagada, 
                                delta: delta, 
                                tipo: 'fijo',
                                tm: tm,
                                precio: precio})
          }
        }
      })

      let dicFinalDeltasxMes: listaCalculoCapsFloors[] = []

      dicDeltasxMes.forEach(dataXMes => {

        const exists = dicFinalDeltasxMes.some((d) => d.mes === dataXMes.mes);

        if(!exists){
          const listaMeses = dicDeltasxMes.filter(obj => obj.mes === dataXMes.mes);

          if(listaMeses.length > 1){
            tm = listaMeses.reduce((acum, obj) => acum + (Number(obj.tm) || 0), 0);
            delta = listaMeses.reduce((acum, obj) => acum + (Number(obj.delta) || 0), 0);
            precio = listaMeses.reduce((acum, obj) => acum + (obj.precio || 0), 0);

            precio = precio/delta

            dataXMes.precio = precio
            dataXMes.tm = Math.round(tm)

            dicFinalDeltasxMes.push(dataXMes);
          }else{
            dataXMes.precio = dataXMes.precio
            dataXMes.tm = Math.round(dataXMes.tm)

            dicFinalDeltasxMes.push(dataXMes);
          }
        }
      });
      return dicFinalDeltasxMes;
    }

    calculoDeltasFloors_Expiracion(operaciones: any, factor: number): any{
      // let dicDeltasxMes = []
      let dicDeltasxMes: listaCalculoCapsFloors[] = []

      let strike: number;
      let primaPagada: number;
      let delta: number;
      let tm: number;
      let precio: number;

      operaciones.forEach(dataIFD => {
        if(["Long Put","Long Daily Put","Long Put Binary","Binary Put Spread","Long Contingent Daily Put","Long Asian Put","Put Spread","Short Collar","Short Three-Way"].includes(dataIFD["s303_Estrategia"])){
          
          const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

          const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);

          if(!exists){
            primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
            delta = listaComponentes.filter(obj => obj["s303_Ifd"].substr(0,1) == '+')[0]["s303_Delta"];
            try{
              strike = listaComponentes.filter(obj => obj["s303_Ifd"].substr(0,1) == '+')[0]["s303_Strike"];
            } catch (error) {
              strike = 0
            }
            
            if(delta == 0){
              tm = 0
              precio = 0
            }else{
              tm = delta * factor
              // precio = strike - primaPagada 
              precio = strike 
            }

            dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                ficha: dataIFD["s303_Ficha"], 
                                strike: strike, 
                                prima: primaPagada, 
                                delta: delta, 
                                tipo: 'fijo',
                                tm: tm,
                                precio: precio})
          }
        }else if(["Converting Put","Long Synthetic Put","Put Spread Sintético","Short Converting Collar","Converting Put Spread",
                  "Short Modified Average", "Short Modified Average with Range","Short Modified Average with Range & Participation"].includes(dataIFD["s303_Estrategia"])){
            
            const listaComponentes = operaciones.filter(obj => obj["s303_Ficha"].toString() === dataIFD["s303_Ficha"].toString());

            const exists = dicDeltasxMes.some((d) => d.ficha === dataIFD["s303_Ficha"]);
          
            if(!exists){
              primaPagada = listaComponentes.reduce((acum, obj) => acum + (Number(obj["s303_PrimaPagada"]) || 0), 0);
              delta = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"))[0]["s303_Delta"];
              try{
                strike = listaComponentes.filter(obj => obj["s303_Ifd"].includes("Swap"))[0]["s303_Strike"];
              } catch (error) {
                strike = 0
              }
                                      
              if(delta == 0){
                tm = 0
                precio = 0
              }else{
                tm = delta * factor
                // precio = strike - primaPagada 
                precio = strike 
              }
          
              dicDeltasxMes.push({mes: dataIFD["s303_Cobertura"], 
                                  ficha: dataIFD["s303_Ficha"], 
                                  strike: strike, 
                                  prima: primaPagada, 
                                  delta: delta, 
                                  tipo: 'fijo',
                                  tm: tm,
                                  precio: precio})
            }
                  
        }
      })

      let dicFinalDeltasxMes: listaCalculoCapsFloors[] = []

      dicDeltasxMes.forEach(dataXMes => {

        const exists = dicFinalDeltasxMes.some((d) => d.mes === dataXMes.mes);

        if(!exists){
          const listaMeses = dicDeltasxMes.filter(obj => obj.mes === dataXMes.mes);

          if(listaMeses.length > 1){
            tm = listaMeses.reduce((acum, obj) => acum + (Number(obj.tm) || 0), 0);
            delta = listaMeses.reduce((acum, obj) => acum + (Number(obj.delta) || 0), 0);
            precio = listaMeses.reduce((acum, obj) => acum + (obj.precio * obj.delta || 0), 0);

            precio = precio/delta

            dataXMes.precio = Math.round(precio)
            dataXMes.tm = Math.round(tm)

            dicFinalDeltasxMes.push(dataXMes);
          }else{
            dataXMes.precio = Math.round(dataXMes.precio)
            dataXMes.tm = Math.round(dataXMes.tm)
            dicFinalDeltasxMes.push(dataXMes);
          }
        }
      });

      return dicFinalDeltasxMes;
    }

  }
