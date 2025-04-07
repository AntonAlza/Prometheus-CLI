import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ventasMoliendaComponent } from './ventasMolienda/ventasMolienda.component';
import { libroFisicoComponent } from './libroFisico/libroFisico.component';
import { detallePreciosComponent } from './dashboard05/detallePrecios.component';
import { IFDMoliendaComponent } from './DataEntryIFD/DataEntryIFD.component';
import { MtMMoliendaComponent } from './mt-m-molienda/mt-m-molienda.component'
import { RiesgoDeTesoreriaComponent } from './riesgo-de-tesoreria/riesgo-de-tesoreria.component'

import { registrosOperacionesBrokerComponent } from './DataEntryIFD/registrosOperacionesBroker.component';
import { asociarOperLiqSQLComponent } from './DataEntryIFD/asociarOperLiqSQL.component';
import { asociarSQL_BrokerComponent } from './DataEntryIFD/asociarSQL_Broker.component';
import { modificarIFDComponent } from './DataEntryIFD/modificarIFD.component';
import { liquidarIFDComponent } from './DataEntryIFD/liquidarIFD.component';
import { ProdGuardService as guard } from 'src/app/guards/prod-guard.service';


import { limiteCampanhaComponent } from './DataEntryIFD/limiteCampanha.component';
import { campanhaComponent } from './DataEntryIFD/campanha.component';
import { registrolimitecampanhaComponent } from './DataEntryIFD/registrolimitecampanha.component'
import { registroCampanhaComponent } from './DataEntryIFD/registroCampanha.component';
import { registroPricingComponent } from './DataEntryIFD/registroPricing.component';
import { registroEstrategiaComponent } from './DataEntryIFD/registroEstrategia.component';
import { aprobarEstrategiaComponent } from './DataEntryIFD/aprobarEstrategia.component';

import { cierrePortafolioComponent } from './DataEntryIFD/cierrePortafolio.component';
import { resultadosMetricasRiesgoIFDComponent } from './DataEntryIFD/resultadosMetricasRiesgoIFD.component';
import { paginaInicioComponent } from './paginaInicio/paginaInicio.component';
import { cambiarEstadoIFDComponent } from './DataEntryIFD/cambiarEstadoIFD.component';
import { registrosOperacionesBrokerSinCuentaComponent } from './DataEntryIFD/registrosOperacionesBrokerSinCuenta.component';
import { registroCuentaBrokerCampanhaComponent } from './DataEntryIFD/registroCuentaBrokerCampanha.component';
import { editarCtaBrokerAsociadaComponent } from './DataEntryIFD/editarCtaBrokerAsociada.component';

import { operacionesxVencerComponent } from './DataEntryIFD/operacionesxVencer.component';
import { registroEstrategiaCMComponent } from './DataEntryIFD/registroEstrategiaCM.component';
import { aprobarOperacionComponent } from './DataEntryIFD/aprobarOperacion.component';
import { IFDLiquidadosComponent } from './DataEntryIFD/IFDLiquidados.component';
import { ListaRevertirEstadiosComponent } from './libroFisico/lista-revertir-estadios/lista-revertir-estadios.component';

import { registroImpugnacionBaseComponent } from './BasesImpugnacion/registroImpugnacionBase.component';
import { AprobacionImpugnacionBaseComponent } from './BasesImpugnacion/aprobacion-impugnacion-base/aprobacion-impugnacion-base.component';
import { RegistroOperacionesRTDComponent } from './tesoreria/registro-operaciones-rtd/registro-operaciones-rtd.component';
import { registroLimitesComponent } from './Limites/registroLimites.component';
import { portafolioIFDTiempoRealComponent } from './DataEntryIFD/portafolioIFDTiempoReal.component';
import { BasesTrigoComponent } from './CargaBases/bases-trigo/bases-trigo.component';
import { CargaInventarioComponent } from './carga-inventario/carga-inventario.component';
import { MantenedorSubsidiariaComponent } from './tesoreria/mantenedor-subsidiaria/mantenedor-subsidiaria.component';
import { MantenedorMonedaComponent } from './tesoreria/mantenedor-moneda/mantenedor-moneda.component';
import { ValorizacionDerivadosComponent } from './tesoreria/valorizacion-derivados/valorizacion-derivados.component';
import { PagoFacturasComponent } from './tesoreria/pago-facturas/pago-facturas.component';
import { RegistroIntercompaniesComponent } from './tesoreria/registro-intercompanies/registro-intercompanies.component';
import { RegistroOpcionesComponent } from './tesoreria/registro-opciones/registro-opciones.component';
import { ReprocesoMtmComponent } from './tesoreria/reproceso-mtm/reproceso-mtm.component';
import { FretRealTimeComponent } from './Fret/fret-real-time/fret-real-time.component';
import { FretSimuladoComponent } from './Fret/Simulador/fret-simulado/fret-simulado.component';
import { DataEntryFretComponent } from './Fret/data-entry-fret/data-entry-fret.component';
import { ConfiguracionDataEntryComponent } from './Fret/data-entry-fret/configuracion-data-entry/configuracion-data-entry.component';
import { PrecioCommodityComponent } from './Fret/precio-commodity/precio-commodity.component';
import { ReporteContabilidadIfdComponent } from './reporte-contabilidad-ifd/reporte-contabilidad-ifd.component';
import { PowerbiventasmoliendaComponent } from './ventasMolienda/powerbiventasmolienda/powerbiventasmolienda.component';
import { PowerbipapelesComponent } from './ventasMolienda/powerbipapeles/powerbipapeles.component';
import { PreExportBIComponent } from './tesoreria/ReportesPBI/pre-export-bi/pre-export-bi.component';
import { PosicionMEBIComponent } from './tesoreria/ReportesPBI/posicion-me-bi/posicion-me-bi.component';
import { MTMVigenteVencidoBIComponent } from './tesoreria/ReportesPBI/mtmvigente-vencido-bi/mtmvigente-vencido-bi.component';
import { KPISBIComponent } from './tesoreria/ReportesPBI/kpis-bi/kpis-bi.component';
import { CAJABIComponent } from './tesoreria/ReportesPBI/caja-bi/caja-bi.component';
import { PROXVENCIIFDBIComponent } from './tesoreria/ReportesPBI/proxvenciifd-bi/proxvenciifd-bi.component';
import { OPERACIONESIFDBIComponent } from './tesoreria/ReportesPBI/operacionesifd-bi/operacionesifd-bi.component';
import { TributarioComponent } from './Tributario/tributario/tributario.component';
import { CandleStickPriceComponent } from './Tributario/candle-stick-price/candle-stick-price.component';
import { ResumentesoComponent } from './tesoreria/ReportesPBI/resumenteso/resumenteso.component';
import { GestionPapelesComponent } from './Papeles/gestion-papeles/gestion-papeles.component';
import { PosicionFisicaComponent } from './libroFisico/ReportesPBI/posicion-fisica/posicion-fisica.component';
import { TableroLimitesComponent } from './ReportesIFD/ReportesPBI/tablero-limites/tablero-limites.component';
import { VariacionMTMComponent } from './ReportesIFD/ReportesPBI/variacion-mtm/variacion-mtm.component';
import { CargaconsumoComponent } from './cargaconsumo/cargaconsumo.component';
import { CostplusComponent } from './costplus/costplus.component';
import { DeltahedgeComponent } from './deltahedge/deltahedge.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ventasMolienda',
        component: ventasMoliendaComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','MO_Fisico_Aprobacion','FO_Fisico_Aprobacion','FO_Fisico_RegistroOperacion','Fisico_Consultas','Administrador'] }
      },
      {
        path: 'costplus',
        component: CostplusComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','MO_Fisico_Aprobacion','FO_Fisico_Aprobacion','FO_Fisico_RegistroOperacion','Fisico_Consultas','Administrador'] }
      },
      {
        path: 'BiventasMolienda',
        component: PowerbiventasmoliendaComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','MO_Fisico_Aprobacion','FO_Fisico_Aprobacion','FO_Fisico_RegistroOperacion','Fisico_Consultas','Administrador'] }
      },
      {
        path: 'Bipapeles',
        component: PowerbipapelesComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','MO_Fisico_Aprobacion','FO_Fisico_Aprobacion','FO_Fisico_RegistroOperacion','Fisico_Consultas','Administrador'] }
      },

      {
        path: 'calculoMtM', 
        component: MtMMoliendaComponent, canActivate: [guard], data: { expectedRol: ['FO_Fisico_RegistroMTM','MO_Fisico_Controller','Administrador'] }
      },
      {
        path: 'RDT',
        component: RiesgoDeTesoreriaComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','Administrador'] }
      },
      {
        path: 'RevertirBarco',
        component: ListaRevertirEstadiosComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_Aprobacion','MO_Fisico_Controller','Administrador'] }
      },
      {
        path: 'libroFisico',
        component: libroFisicoComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','MO_Fisico_Aprobacion','FO_Fisico_Aprobacion','FO_Fisico_RegistroOperacion','Fisico_Consultas','Administrador'] }
      },
      {
        path: 'Posicionfisica',
        component: PosicionFisicaComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','MO_Fisico_Aprobacion','FO_Fisico_Aprobacion','FO_Fisico_RegistroOperacion','Fisico_Consultas','Administrador'] }
      },
      {
        path: 'detallePrecios',
        component: detallePreciosComponent
      },
      {
        path: 'PortafolioDerivado', 
        component: IFDMoliendaComponent
      },
      {
        path: 'registrosOperacionesBroker',
        component: registrosOperacionesBrokerComponent
      },
      {
        path: 'RegistroOperLiqSQL',
        component: asociarOperLiqSQLComponent
      },
      {
        path: 'RegistroOperAsociarSQL',
        component: asociarSQL_BrokerComponent
      },
      {
        path: 'ModificarOperSQL',
        component: modificarIFDComponent
      },
      {
        path: 'LiquidarOperSQL',
        component: liquidarIFDComponent
      },
      {
        path: 'LimiteCampaña',
        component: limiteCampanhaComponent
      },
      {
        path: 'Campaña',
        component: campanhaComponent

      },

      {
        path: 'RegistroLímiteCampaña',
        component: registrolimitecampanhaComponent
      },

      {
        path: 'RegistroCampaña',
        component: registroCampanhaComponent
      },
      {
        path: 'RegistroPricing',
        component: registroPricingComponent
      },
      {
        path: 'RegistroEstrategia',
        component: registroEstrategiaComponent
      },

      {
        path: 'AprobarEstrategia',
        component: aprobarEstrategiaComponent
      },
      {
        path: 'AprobarOperacion',
        component: aprobarOperacionComponent
      },
      {
        path: 'CierrePortafolio',
        component: cierrePortafolioComponent
      },
      {
        path: 'ResultadoMetricaRiesgo',
        component: resultadosMetricasRiesgoIFDComponent
      },
      {
        path: 'paginaInicio',
        component: paginaInicioComponent
      },
      {
        path: 'cambiarEstadoIFD',
        component: cambiarEstadoIFDComponent
      },
      {
        path: 'registrosOperacionesBrokerSinCuenta',
        component: registrosOperacionesBrokerSinCuentaComponent
      },
      {
        path: 'RegistroBrokerCampanha',
        component: registroCuentaBrokerCampanhaComponent

      },
      {
        path: 'editarCuentaBrokerAsociada',
        component: editarCtaBrokerAsociadaComponent

      },
      {
        path: 'operacionesxVencer',
        component: operacionesxVencerComponent
      },
      {
        path: 'registroEstrategiaCM',
        component: registroEstrategiaCMComponent
      },
      {
        path: 'IFDLiquidados',
        component: IFDLiquidadosComponent

      },
      
      {
        path: 'RegistroBaseTrigo',
        component: BasesTrigoComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','Administrador'] }

      },
      {
        path: 'RegistroInventario', 
        component: CargaInventarioComponent,canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','Administrador'] }

      },
      {
        path: 'gestionPapeles',
        component: GestionPapelesComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','MO_Fisico_Aprobacion','FO_Fisico_Aprobacion','FO_Fisico_RegistroOperacion','Fisico_Consultas','Administrador'] }
      },
      {
        path: 'RegistroImpugnacion',
        component: registroImpugnacionBaseComponent, canActivate: [guard], data: { expectedRol: ['FO_Fisico_RegistroImpugnacion','Administrador'] }
      }
      ,
      {
        path: 'AprobacionImpugnacion',
        component: AprobacionImpugnacionBaseComponent, canActivate: [guard], data: { expectedRol: ['MO_Fisico_AprobacionImpugnacion','Administrador'] }
      },
      {
        path: 'RegistroOperacionesRDT',
        component: RegistroOperacionesRTDComponent, canActivate: [guard], data: { expectedRol: ['RDT_Registro','Administrador'] }
      },
      {
        path: 'ValorizacionDerivados',
        component: ValorizacionDerivadosComponent, canActivate: [guard], data: { expectedRol: ['RDT_Registro','Administrador'] }
      },
      {
        path: 'RegistroLimite',
        component: registroLimitesComponent
      },
      {
        path: 'MantenedorSubsidiaria',
        component: MantenedorSubsidiariaComponent, canActivate: [guard], data: { expectedRol: ['RDT_Registro','Administrador'] }
      },
      {
        path: 'MantenedorMoneda',
        component: MantenedorMonedaComponent, canActivate: [guard], data: { expectedRol: ['RDT_Registro','Administrador'] }
      }
      ,
      {
        path: 'PortafolioIFDTiempoReal',
        component: portafolioIFDTiempoRealComponent
      },
      {
        path: 'PagoFacturas',
        component: PagoFacturasComponent, canActivate: [guard], data: { expectedRol: ['RDT_Registro','Administrador'] }
      },
      {
        path: 'RegistroIntercompanies',
        component: RegistroIntercompaniesComponent, canActivate: [guard], data: { expectedRol: ['RDT_Registro','Administrador'] }
      },
      {
        path: 'ConsultaOpciones',
        component: RegistroOpcionesComponent, canActivate: [guard], data: { expectedRol: ['RDT_Registro','Administrador'] }
      },
      {
        path: 'PreExportVF',
        component: PreExportBIComponent, canActivate: [guard], data: { expectedRol: ['RDT_ConsultaReportes','Administrador'] }
      },
      {
        path: 'PosiciónMEv2',
        component: PosicionMEBIComponent, canActivate: [guard], data: { expectedRol: ['RDT_ConsultaReportes','Administrador'] }
      },
      {
        path: 'MarktoMarket_6',
        component: MTMVigenteVencidoBIComponent, canActivate: [guard], data: { expectedRol: ['RDT_ConsultaReportes','Administrador'] }
      },
      {
        path: 'KPIsv3',
        component: KPISBIComponent, canActivate: [guard], data: { expectedRol: ['RDT_ConsultaReportes','Administrador'] }
      },
      {
        path: 'Dashboard_Caja_2',
        component: CAJABIComponent, canActivate: [guard], data: { expectedRol: ['RDT_ConsultaReportes','Administrador'] }
      },
      {
        path: 'ProximosVencimientosv2',
        component: PROXVENCIIFDBIComponent, canActivate: [guard], data: { expectedRol: ['RDT_ConsultaReportes','Administrador'] }
      },
      {
        path: 'resumenTeso',
        component: ResumentesoComponent, canActivate: [guard], data: { expectedRol: ['RDT_ConsultaReportes','Administrador'] }
      },
      {
        path: 'OpercionesIFD',
        component: OPERACIONESIFDBIComponent, canActivate: [guard], data: { expectedRol: ['RDT_ConsultaReportes','Administrador'] }
      },
      {
        path: 'ReporteTributario',
        component: TributarioComponent, canActivate: [guard], data: { expectedRol: ['Fisico_Consultas','IFD_Consultas','RDT_ConsultaReportes','Administrador'] }
      },
      {
        path: 'CandleStickPrice',
        component: CandleStickPriceComponent, canActivate: [guard], data: { expectedRol: ['Fisico_Consultas','IFD_Consultas','RDT_ConsultaReportes','Administrador'] }
      },
      {
        path: 'Reproceso',
        component: ReprocesoMtmComponent, canActivate: [guard], data: { expectedRol: ['RDT_Reprocesos','Administrador'] }
      },
      {
        path: 'FretCMIFD',
        component: FretRealTimeComponent, canActivate: [guard], data: { expectedRol: ['MO_Admin_Fret','Administrador','FO_Consulta_Fret'] }
      },
      {
        path: 'FretCMIFD-SIM',
        component: FretSimuladoComponent, canActivate: [guard], data: { expectedRol: ['MO_Admin_Fret','Administrador','FO_Consulta_Fret'] }
      },
      {
        path: 'DataEntry-Fret',
        component: DataEntryFretComponent, canActivate: [guard], data: { expectedRol: ['MO_Admin_Fret','Administrador','FO_RegistroData_Fret'] }
      },
      {
        path: 'Config-DataEntry-Fret',
        component: ConfiguracionDataEntryComponent, canActivate: [guard], data: { expectedRol: ['MO_Admin_Fret','Administrador'] }
      },
      {
        path: 'PrecioTiempoReal',
        component: PrecioCommodityComponent, canActivate: [guard], data: { expectedRol: ['Administrador','MO_Consultar_Precios'] }
      },
      {
        path: 'ReporteContabilidad',
        component: ReporteContabilidadIfdComponent, canActivate: [guard], data: { expectedRol: ['IFD_Reporte_Contabilidad','Administrador'] }
      },
      {
        path: 'TableroLimites',
        component: TableroLimitesComponent, canActivate: [guard], data: { expectedRol: ['Administrador','MO_Consultar_Precios'] }
      },
      {
        path: 'TableroVariacionMTM',
        component: VariacionMTMComponent, canActivate: [guard], data: { expectedRol: ['Administrador','MO_Consultar_Precios'] }
      },
      {
        path: 'RegistroConsumo',
        component: CargaconsumoComponent,canActivate: [guard], data: { expectedRol: ['MO_Fisico_Controller','Administrador'] }

      }, 
      {
        path: 'deltaeHedge',
        component: DeltahedgeComponent
      },
      
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }