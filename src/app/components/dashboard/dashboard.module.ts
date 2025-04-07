import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ventasMoliendaComponent } from './ventasMolienda/ventasMolienda.component';
import { libroFisicoComponent } from './libroFisico/libroFisico.component';
import { detallePreciosComponent } from './dashboard05/detallePrecios.component';
import { IFDMoliendaComponent } from './DataEntryIFD/DataEntryIFD.component';

import { registrosOperacionesBrokerComponent } from './DataEntryIFD/registrosOperacionesBroker.component';
import { asociarOperLiqSQLComponent } from './DataEntryIFD/asociarOperLiqSQL.component';
import { asociarSQL_BrokerComponent } from './DataEntryIFD/asociarSQL_Broker.component';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgSelectModule } from '@ng-select/ng-select';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatMenuModule } from '@angular/material/menu';
// Import angular-fusioncharts
import { FusionChartsModule } from 'angular-fusioncharts';

// Import FusionCharts library and chart modules
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';

import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

// For Powercharts , Widgets, and Maps
import * as PowerCharts from 'fusioncharts/fusioncharts.vml';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as Maps from 'fusioncharts/fusioncharts.maps';

import * as TimeSeries from 'fusioncharts/fusioncharts.timeseries';
import * as m from 'fusioncharts/fusioncharts.charts'
// Import timeseries
// Pass the fusioncharts library and chart modules
import * as world from 'fusioncharts/maps/fusioncharts.world';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgApexchartsModule } from 'ng-apexcharts';

import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper'
import { DragDropModule } from '@angular/cdk/drag-drop';


import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { MtMMoliendaComponent } from './mt-m-molienda/mt-m-molienda.component';
import { modificarIFDComponent } from './DataEntryIFD/modificarIFD.component';
import { liquidarIFDComponent } from './DataEntryIFD/liquidarIFD.component';
import { limiteCampanhaComponent } from './DataEntryIFD/limiteCampanha.component'
import { campanhaComponent } from './DataEntryIFD/campanha.component'
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RiesgoDeTesoreriaComponent } from './riesgo-de-tesoreria/riesgo-de-tesoreria.component';
import { registrolimitecampanhaComponent } from './DataEntryIFD/registrolimitecampanha.component';
import { registroCampanhaComponent } from './DataEntryIFD/registroCampanha.component'
import { registroPricingComponent } from './DataEntryIFD/registroPricing.component'
import { registroEstrategiaComponent } from './DataEntryIFD/registroEstrategia.component'
import { aprobarEstrategiaComponent } from './DataEntryIFD/aprobarEstrategia.component';
import { cierrePortafolioComponent } from './DataEntryIFD/cierrePortafolio.component';

import { resultadosMetricasRiesgoIFDComponent } from './DataEntryIFD/resultadosMetricasRiesgoIFD.component';
import { aprobarOperacionComponent } from './DataEntryIFD/aprobarOperacion.component';
import { MatTableExporterModule } from "mat-table-exporter";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
// import {
//   MAT_MOMENT_DATE_ADAPTER_OPTIONS,
//   MomentDateAdapter,
// } from  '@angular/material-moment-adapter';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { paginaInicioComponent } from './paginaInicio/paginaInicio.component';
import { InterceptorService } from '../interceptor.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { DosificadasComponent } from './dosificadas/dosificadas.component';
import { cambiarEstadoIFDComponent } from './DataEntryIFD/cambiarEstadoIFD.component';
import { IngresarFacturaComponent } from './dosificadas/ingresar-factura/ingresar-factura.component';
import { registrosOperacionesBrokerSinCuentaComponent } from './DataEntryIFD/registrosOperacionesBrokerSinCuenta.component';

import { registroCuentaBrokerCampanhaComponent } from './DataEntryIFD/registroCuentaBrokerCampanha.component';
import { editarCtaBrokerAsociadaComponent } from './DataEntryIFD/editarCtaBrokerAsociada.component';
import { GestionOperacionesComponent } from './libroFisico/gestion-operaciones/gestion-operaciones.component';
import { operacionesxVencerComponent } from './DataEntryIFD/operacionesxVencer.component';
import { registroEstrategiaCMComponent } from './DataEntryIFD/registroEstrategiaCM.component';
import { IngresarBasesComponent } from './libroFisico/bases/ingresar-bases/ingresar-bases.component';
import { ListaBasesComponent } from './libroFisico/bases/lista-bases/lista-bases.component';
import { ListaHijosComponent } from './libroFisico/lista-hijos/lista-hijos.component';
import { PasarTransitoComponent } from './libroFisico/pasar-transito/pasar-transito.component';
import {  DialogOverviewExampleDialog } from './DataEntryIFD/dialog-overview-example';
import { JpDraggableDialogDirective } from './DataEntryIFD/JpDraggableDialogDirective';
import { elegirEmbarqueComponent } from './DataEntryIFD/elegirEmbarque.component';
import { elegirInventarioComponent } from './DataEntryIFD/elegirInventario.component';
import { elegirConsumoComponent } from './DataEntryIFD/elegirConsumo.component';
import { IFDLiquidadosComponent } from './DataEntryIFD/IFDLiquidados.component';
import { modificarMesCoberturaComponent } from './DataEntryIFD/modificarMesCobertura.component';
import { CierreFisicoComponent } from './libroFisico/cierre-fisico/cierre-fisico.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ListaRevertirEstadiosComponent } from './libroFisico/lista-revertir-estadios/lista-revertir-estadios.component';
import { ToastrModule,ToastrService } from 'ngx-toastr';
import { DropzoneConfigInterface, DropzoneModule, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DetalleBasesComponent } from './libroFisico/cierre-fisico/detalle-bases/detalle-bases.component';
import { DetallePreciosComponent } from './libroFisico/cierre-fisico/detalle-precios/detalle-precios.component';

import {CdkTableModule} from '@angular/cdk/table';
import { CrearFuturoComponent } from './libroFisico/futuros/crear-futuro/crear-futuro.component';
import { AsignarFuturoComponent } from './libroFisico/futuros/asignar-futuro/asignar-futuro.component';
import { ListarFuturoComponent } from './libroFisico/futuros/listar-futuro/listar-futuro.component';
import { ComprarFuturoComponent } from './libroFisico/futuros/comprar-futuro/comprar-futuro.component';
import { VenderFuturoComponent } from './libroFisico/futuros/vender-futuro/vender-futuro.component';

import { DndDirective } from 'src/app/models/Bases/dnd.directive';
import { ProgressComponent } from './BasesImpugnacion/progress/progress.component';
import { Upload2Component } from './BasesImpugnacion/upload2.component';
import { ModificarFuturoCMComponent } from './libroFisico/futuros/modificar-futuro-cm/modificar-futuro-cm.component';
import { DetalleConsumoComponent } from './libroFisico/cierre-fisico/detalle-consumo/detalle-consumo.component';
import { DetalleInventarioComponent } from './libroFisico/cierre-fisico/detalle-inventario/detalle-inventario.component';
import { MatTreeModule } from '@angular/material/tree';
import { AprobacionImpugnacionBaseComponent } from './BasesImpugnacion/aprobacion-impugnacion-base/aprobacion-impugnacion-base.component';
import { RegistroOperacionesRTDComponent } from './tesoreria/registro-operaciones-rtd/registro-operaciones-rtd.component';
import { AsociarFacturasRTDComponent } from './tesoreria/asociar-facturas-rtd/asociar-facturas-rtd.component';
import { registroImpugnacionBaseComponent } from './BasesImpugnacion/registroImpugnacionBase.component';
import { registroLimitesComponent } from './Limites/registroLimites.component';
import { portafolioIFDTiempoRealComponent } from './DataEntryIFD/portafolioIFDTiempoReal.component';
import { BasesTrigoComponent } from './CargaBases/bases-trigo/bases-trigo.component';
import { MostravaluehistoricComponent } from './CargaBases/mostravaluehistoric/mostravaluehistoric.component';
import { MostrarimagenComponent } from './CargaBases/mostrarimagen/mostrarimagen.component';
import { CargamanualComponent } from './CargaBases/cargamanual/cargamanual.component';
import { ConsultaBenchmarkComponent } from './CargaBases/consulta-benchmark/consulta-benchmark.component';
import { CargaInventarioComponent } from './carga-inventario/carga-inventario.component';
import { RegistroinventarioComponent } from './carga-inventario/registroinventario/registroinventario.component';
import { ConsulinventarioComponent } from './carga-inventario/consultainventario/consulinventario/consulinventario.component';
import { BasetrigospreadComponent } from './CargaBases/basetrigospread/basetrigospread.component';

import { MantenedorSubsidiariaComponent } from './tesoreria/mantenedor-subsidiaria/mantenedor-subsidiaria.component';
import { MantenedorMonedaComponent } from './tesoreria/mantenedor-moneda/mantenedor-moneda.component';
import { ValorizacionDerivadosComponent } from './tesoreria/valorizacion-derivados/valorizacion-derivados.component';
import { PagoFacturasComponent } from './tesoreria/pago-facturas/pago-facturas.component';
import { CoberturaPorFacturaComponent } from './tesoreria/cobertura-por-factura/cobertura-por-factura.component';
import { RegistroIntercompaniesComponent } from './tesoreria/registro-intercompanies/registro-intercompanies.component';
import { RegistroIntercompaniesCuponeraComponent } from './tesoreria/registro-intercompanies-cuponera/registro-intercompanies-cuponera.component';
import { RegistroOpcionesComponent } from './tesoreria/registro-opciones/registro-opciones.component';
import { ReprocesoMtmComponent } from './tesoreria/reproceso-mtm/reproceso-mtm.component';
import { FretSimuladoComponent } from './Fret/Simulador/fret-simulado/fret-simulado.component';
import { DetalleFretComponent } from './Fret/detalle-fret/detalle-fret.component';
import { FretRealTimeComponent } from './Fret/fret-real-time/fret-real-time.component';
import { DataEntryFretComponent } from './Fret/data-entry-fret/data-entry-fret.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConfiguracionDataEntryComponent } from './Fret/data-entry-fret/configuracion-data-entry/configuracion-data-entry.component';
import { PrecioCommodityComponent } from './Fret/precio-commodity/precio-commodity.component';
import { ReporteContabilidadIfdComponent } from './reporte-contabilidad-ifd/reporte-contabilidad-ifd.component';
import { PowerbipapelesComponent } from './ventasMolienda/powerbipapeles/powerbipapeles.component';
import { PowerbiventasmoliendaComponent } from './ventasMolienda/powerbiventasmolienda/powerbiventasmolienda.component';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { KPISBIComponent } from './tesoreria/ReportesPBI/kpis-bi/kpis-bi.component';
import { PreExportBIComponent } from './tesoreria/ReportesPBI/pre-export-bi/pre-export-bi.component';
import { PosicionMEBIComponent } from './tesoreria/ReportesPBI/posicion-me-bi/posicion-me-bi.component';
import { MTMVigenteVencidoBIComponent } from './tesoreria/ReportesPBI/mtmvigente-vencido-bi/mtmvigente-vencido-bi.component';
import { CAJABIComponent } from './tesoreria/ReportesPBI/caja-bi/caja-bi.component';
import { PROXVENCIIFDBIComponent } from './tesoreria/ReportesPBI/proxvenciifd-bi/proxvenciifd-bi.component';
import { OPERACIONESIFDBIComponent } from './tesoreria/ReportesPBI/operacionesifd-bi/operacionesifd-bi.component';
import { HedgestrategicComponent } from './Fret/fret-real-time/hedgestrategic/hedgestrategic.component';
import { CandleStickPriceComponent } from './Tributario/candle-stick-price/candle-stick-price.component';
import { TributarioComponent } from './Tributario/tributario/tributario.component';
import { IngresarPapelPoBoComponent } from './DataEntryIFD/ingresar-papel-po-bo/ingresar-papel-po-bo.component';
import { ResumentesoComponent } from './tesoreria/ReportesPBI/resumenteso/resumenteso.component';
import { GestionPapelesComponent } from './Papeles/gestion-papeles/gestion-papeles.component';
import { ListaLiquidacionesComponent } from './Papeles/lista-liquidaciones/lista-liquidaciones.component';
import { LiquidarPapelesComponent } from './Papeles/liquidar-papeles/liquidar-papeles.component';
import { IngresarPapelesComponent } from './Papeles/ingresar-papeles/ingresar-papeles.component';
import { TableroLimitesComponent } from './ReportesIFD/ReportesPBI/tablero-limites/tablero-limites.component';
import { PosicionFisicaComponent } from './libroFisico/ReportesPBI/posicion-fisica/posicion-fisica.component';
import { DetalleTipoTrigoComponent } from './Fret/detalle-tipo-trigo/detalle-tipo-trigo.component';
import { VariacionMTMComponent } from './ReportesIFD/ReportesPBI/variacion-mtm/variacion-mtm.component';
import { CargaconsumoComponent } from './cargaconsumo/cargaconsumo.component';
import { ConsultaconsumoComponent } from './cargaconsumo/consultaconsumo/consultaconsumo.component';
import { RegistroconsumoComponent } from './cargaconsumo/registroconsumo/registroconsumo.component';
import { CostplusComponent } from './costplus/costplus.component';
import { MantenedorcostComponent } from './costplus/mantenedorcost/mantenedorcost.component';
import { DeltahedgeComponent } from './deltahedge/deltahedge.component';


FusionChartsModule.fcRoot(FusionCharts, Maps, PowerCharts, world);

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: 'https://httpbin.org/post',
   maxFilesize: 50,
   acceptedFiles: 'image/*'
 };

@NgModule({
  declarations: [
    ventasMoliendaComponent,
    libroFisicoComponent,
    detallePreciosComponent,
    IFDMoliendaComponent,
    registrosOperacionesBrokerComponent,
    asociarOperLiqSQLComponent,
    asociarSQL_BrokerComponent,
    MtMMoliendaComponent,
    MtMMoliendaComponent,
    modificarIFDComponent,
    liquidarIFDComponent,
    limiteCampanhaComponent,
    campanhaComponent,
    registrolimitecampanhaComponent,
    registroCampanhaComponent,
    registroPricingComponent,
    registroEstrategiaComponent,
    RiesgoDeTesoreriaComponent,
    aprobarEstrategiaComponent,
    aprobarOperacionComponent,
    cierrePortafolioComponent,
    resultadosMetricasRiesgoIFDComponent,
    paginaInicioComponent,
    DosificadasComponent,
    cambiarEstadoIFDComponent,
    IngresarFacturaComponent,
    registrosOperacionesBrokerSinCuentaComponent,

    registroCuentaBrokerCampanhaComponent,
    editarCtaBrokerAsociadaComponent,

    GestionOperacionesComponent,
      operacionesxVencerComponent,
      registroEstrategiaCMComponent,
      PasarTransitoComponent,
      IngresarBasesComponent,
      ListaBasesComponent,
      ListaHijosComponent,
      DialogOverviewExampleDialog,
      JpDraggableDialogDirective,
      elegirEmbarqueComponent,
      elegirInventarioComponent,
      elegirConsumoComponent,
      IFDLiquidadosComponent,
      modificarMesCoberturaComponent,
      CierreFisicoComponent,
      ListaRevertirEstadiosComponent,
      DetalleBasesComponent,
      DetallePreciosComponent,
      CrearFuturoComponent,
      AsignarFuturoComponent,
      ListarFuturoComponent,
      ComprarFuturoComponent,
      VenderFuturoComponent,
    //AppComponent,
    registroImpugnacionBaseComponent,
    registroLimitesComponent,    
    DndDirective,
    ProgressComponent,
    Upload2Component,
    AprobacionImpugnacionBaseComponent,
    RegistroOperacionesRTDComponent,
    AsociarFacturasRTDComponent,
    BasesTrigoComponent,



        ModificarFuturoCMComponent,
              DetalleConsumoComponent,
              DetalleInventarioComponent,
              registroLimitesComponent,
              portafolioIFDTiempoRealComponent,
              MantenedorSubsidiariaComponent,
              MantenedorMonedaComponent,
              ValorizacionDerivadosComponent,
              PagoFacturasComponent,
              CoberturaPorFacturaComponent,
              RegistroIntercompaniesComponent,
              RegistroIntercompaniesCuponeraComponent,
              RegistroOpcionesComponent,
              ReprocesoMtmComponent,

              BasesTrigoComponent,
              MostravaluehistoricComponent,
              MostrarimagenComponent,
              CargamanualComponent,
              ConsultaBenchmarkComponent,
              CargaInventarioComponent,
              RegistroinventarioComponent,
              ConsulinventarioComponent,
              BasetrigospreadComponent,
              FretSimuladoComponent,
              DetalleFretComponent,
              FretRealTimeComponent,
              DataEntryFretComponent,
              ConfiguracionDataEntryComponent,
              PrecioCommodityComponent,
              ReporteContabilidadIfdComponent,
              PowerbipapelesComponent,
              PowerbiventasmoliendaComponent,
              KPISBIComponent,
              PreExportBIComponent,
              PosicionMEBIComponent,
              MTMVigenteVencidoBIComponent,
              CAJABIComponent,
              PROXVENCIIFDBIComponent,
              OPERACIONESIFDBIComponent,
              HedgestrategicComponent,
              CandleStickPriceComponent,
              TributarioComponent,
              IngresarPapelPoBoComponent,
              ResumentesoComponent,
              GestionPapelesComponent,
              ListaLiquidacionesComponent,
              LiquidarPapelesComponent,
              IngresarPapelesComponent,
              TableroLimitesComponent,
              PosicionFisicaComponent,
              DetalleTipoTrigoComponent,
              VariacionMTMComponent,
              CargaconsumoComponent,
              ConsultaconsumoComponent,
              RegistroconsumoComponent,
              CostplusComponent,
              MantenedorcostComponent,
              DeltahedgeComponent
              
              


              
              
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    NgApexchartsModule,
    NgCircleProgressModule.forRoot(),
    FusionChartsModule,
    ChartsModule,
    MatSelectModule,
    MatProgressBarModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    CarouselModule,
    
    MatTreeModule,
    MatExpansionModule,
    MatMenuModule,
    MatStepperModule,
    DragDropModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatBadgeModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    //BrowserModule,
    //NoopAnimationsModule,
    //BrowserAnimationsModule,
    //AppRoutingModule,
    NgxSpinnerModule,
    MatTableExporterModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    DragDropModule,
    CdkTableModule,
    MatTooltipModule,
    ToastrModule.forRoot(),
    MatTabsModule,
    PowerBIEmbedModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule

  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatBadgeModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    NgxSpinnerModule,
    MatTableExporterModule,
    DragDropModule,

    

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en' },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ToastrService,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
  ],
  bootstrap: [AppComponent],
})
export class DashboardModule { }
