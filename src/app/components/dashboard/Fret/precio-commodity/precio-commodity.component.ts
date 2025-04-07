import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { listaTickerPrecioTiempoReal } from 'src/app/models/Fret/listaTickerPrecioTiempoReal';
import { FretRealTimeService } from 'src/app/shared/services/FretRealTimeService';
import { simulacionPreciosService } from './simulacionPreciosService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-precio-commodity',
  templateUrl: './precio-commodity.component.html',
  styleUrls: ['./precio-commodity.component.scss']
})
export class PrecioCommodityComponent implements OnInit, OnDestroy {

  queryResult: any[];
  messages: string[] = [];
  public subyacenteSelected: number;
  private subscription: Subscription;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sortPortafolio!: MatSort;  

  
  public productos: cargaCombo [] = [];
  listaPortafolio: listaTickerPrecioTiempoReal[]

  displayedColumns: string[] = [
    'underlying'
    ,'exchange' 
    ,'monthcontract' 
    ,'ticker'
    ,'precioActual' 
  ];
  
  dataSource: MatTableDataSource<listaTickerPrecioTiempoReal>;
  
  constructor(private fretRealTimeService: FretRealTimeService,
              private servicioSim: simulacionPreciosService
  ) {
  }
  
  obtenerPortafolio(){
    this.fretRealTimeService.portafoliPrecioTiempoReal(this.subyacenteSelected).subscribe(
      async (response) => {
        this.listaPortafolio = response;      
        this.dataSource = new MatTableDataSource(this.listaPortafolio);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sortPortafolio;    
        this.inicializarUltimoPrecio();      
                  
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }



  ngOnInit(): void {

    //   this.fretRealTimeService.getMessages().subscribe(message => {
    //     // console.log('Mensaje recibido en el componente:', message);
    //     message = "{" + message + "}"
    //     const data = JSON.parse(message);

    //     if (data.ticker.startsWith("MW")) {
    //       // Reemplazar "MW" con "MWE"
    //       data.ticker = "MWE" + data.ticker.substring(2);
    //   } 
    //   if(this.listaPortafolio != undefined){
    //     this.listaPortafolio.forEach(objDestino => {

    //       if (objDestino["ticker"] == data.ticker.replace(/\s/g, '')) {
    //           objDestino.PrecioAnterior = objDestino.precioActual;
    //           objDestino.precioActual = data.precio * objDestino["factor_metric_tons"];
    //       }
    //   });
    //   this.dataSource = new MatTableDataSource(this.listaPortafolio);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sortPortafolio;   

    //   }
    // });

    this.subscription = this.servicioSim.getMessages().subscribe(message => {
      // Convertir el mensaje a objeto JSON
      
      message = "{" + message + "}";
      console.log(message)
      const data = JSON.parse(message);

      // Aplicar la regla de reemplazo de MW por MWE
      if (data.ticker.startsWith("MW")) {
        // Reemplazar "MW" con "MWE"
        data.ticker = "MWE" + data.ticker.substring(2);
      }
      
      // Actualizar los precios en el portafolio si el ticker coincide
      if (this.listaPortafolio != undefined) {
        this.listaPortafolio.forEach(objDestino => {
          if (objDestino["ticker"] == data.ticker.replace(/\s/g, '')) {
            objDestino.PrecioAnterior = objDestino.precioActual;
            objDestino.precioActual = data.precio * objDestino["factor_metric_tons"];
            console.log(`Precio actualizado para ${objDestino.ticker}: ${objDestino.precioActual}`);
          }
        });
        
        // Actualizar la tabla
        this.dataSource = new MatTableDataSource(this.listaPortafolio);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sortPortafolio;
      }
    });
  

      
    this.dataSource = new MatTableDataSource(this.listaPortafolio);
    this.paginator._intl.itemsPerPageLabel="Registros por Página";

    this.fretRealTimeService.obtenerProductos().subscribe(
    (response: cargaCombo[]) => {
        this.productos = response;
    },
    (error: HttpErrorResponse) => {
        alert(error.message);
    });
      
  }

  getColor(valor1:any , valor2:any):any {
    if (Number(valor1) > Number(valor2)) {
      //return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
      return { backgroundColor: 'rgba(0, 100, 0, 0.8)', color: 'white', transition: 'background-color 1s' }; // Cambia el color a verde si valor1 es mayor que valor2
  
    } else if (Number(valor1) < Number(valor2)) {
      //return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
      return { backgroundColor: ' rgb(200, 0, 30,0.8)', color: 'white', transition: 'background-color 1s' }; // Cambia el color a verde si valor1 es mayor que valor2
  
    }else {
        return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
    }
  }

  ngOnDestroy(): void {
    this.fretRealTimeService.closeConnection();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }


  inicializarUltimoPrecio(){

    this.fretRealTimeService.obtenerUltimosPrecios().subscribe(
      (response) => {  
        let precioActual :number;
        if(this.listaPortafolio != undefined && this.listaPortafolio.length > 0){
          this.listaPortafolio.forEach(objDestino => {
            const filtrado = response.filter(item => item.Ticker === objDestino.ticker)

            if (filtrado.length > 0) {
              precioActual = filtrado[0].PrecioActual * objDestino["factor_metric_tons"];;
            } else {
              precioActual = 0;
            }
            
            objDestino.precioActual = precioActual
          });
        }
        
      },
      (error) => {
        console.error('Error: ', error);
      }
    );    
  }

}
