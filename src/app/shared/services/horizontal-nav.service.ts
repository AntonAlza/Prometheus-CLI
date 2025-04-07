import { Injectable, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

//MenuBar
export interface HorizontalMenu {
  headTitle?: string;
  title?: string;
  path?: string;
  icon?: string;
  type?: string;
  badgeClass?: string;
  badgeValue?: string;
  active?: boolean;
  children?: HorizontalMenu[];
}

//MenuBar
export interface HorizontalMegaMenu {
  headTitle?: string;
  title?: string;
  path?: string;
  icon?: string;
  type?: string;
  badgeClass?: string;
  badgeValue?: string;
  active?: boolean;
  children?: HorizontalMegaMenu[];
}

@Injectable({
  providedIn: 'root'
})
export class HorizontalNavService {

  showDelay = new FormControl(1000);
  hideDelay = new FormControl(2000);


  constructor() { }


  MENUITEMS: HorizontalMenu[] = [
    {title: 'Fisicos', icon: 'truck', type: 'sub', badgeValue: '11', active: false,
    children: [
      // { path: '/costplus', title: 'Cost Plus', type: 'link' },
      // {
      //   title: 'Molienda', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
      //   children: [
      //     { path: '/ventasMolienda', title: 'Ventas Molienda', type: 'link' },
      //     { path: '/calculoMtM', title: 'Calculo de MtM', type: 'link' }, 
      //   ]
      // },
      { title: 'Consumo Masivo', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
        children: [{ path: '/libroFisico', title: 'Gestión del Físico', type: 'link' },
        { path: '/RegistroBaseTrigo', title: 'Carga de Bases Trigo', type: 'link' },
        { path: '/RegistroInventario', title: 'Carga de Inventario', type: 'link' },
        { path: '/RegistroConsumo', title: 'Carga de Consumo', type: 'link' }
                  ]  },
                  // {
                  //   title: 'Papeles', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
                  //   children: [
                  //     { path: '/gestionPapeles', title: 'Gestion de Papeles', type: 'link' }
                  //   ]
                  // },
        { title: 'Reportes', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
        children: [
          // { path: '/BiventasMolienda', title: 'Ventas Molienda', type: 'link' }, 
           { path: '/Bipapeles', title: 'Papeles', type: 'link' },
           
        ]},  

   ]

  },

  {
    title: 'IFD', icon: 'trending-up', type: 'sub', badgeValue: '6', active: false,
    children: [
      { path: '/PortafolioDerivado', title: 'Valorización de Portafolio', type: 'link' },
      { path: '/ResultadoMetricaRiesgo', title: 'Resultado Métrica IFD', type: 'link' },
      { path: '/IFDLiquidados', title: 'IFD Liquidados', type: 'link' },
      { path: '/ReporteContabilidad', title: 'Reporte Contabilidad', type: 'link' },
      { path: '/CandleStickPrice', title: 'Precios Históricos', type: 'link' },
      { path: '/deltaeHedge', title: 'Delta Hedge', type: 'link' }

      
    ]
  },
  // {title: 'RDT', icon: 'edit', type: 'sub', badgeValue: '6', active: false,
  //   children: 
  //   [
  //     { title: 'Registros', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
  //       children: [
  //                     { path: '/RegistroOperacionesRDT', title: 'Operaciones IFD', type: 'link' },
  //                     { path: '/PagoFacturas', title: 'Pago de Facturas', type: 'link' },
  //                     { path: '/RegistroIntercompanies', title: 'Carga Individual OC', type: 'link' }
  //                 ]
  //     },
  //     { title: 'Reportes', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
  //       children: [   { path: '/resumenTeso', title: 'Resumen Ejecutivo', type: 'link' },
  //                     { path: '/PreExportVF', title: 'Pre Exports', type: 'link' },
  //                     { path: '/PosiciónMEv2', title: 'Posición en ME', type: 'link' },
  //                     { path: '/MarktoMarket_6', title: 'MTM Vigentes y Vencidos', type: 'link' },
  //                     { path: '/KPIsv3', title: 'Seguimiento de KPIs', type: 'link' },
  //                     { path: '/Dashboard_Caja_2', title: 'Caja', type: 'link' },
  //                     { path: '/ProximosVencimientosv2', title: 'Próx. Venc. IFDs', type: 'link' }, 
  //                     { path: '/OpercionesIFD', title: 'Operaciones IFDs', type: 'link' },
  //                     { path: '/ReporteTributario', title: 'Relación de Coberturas', type: 'link' }
  //                 ]
  //     },
  //     { title: 'Gestión de Procesos', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
  //       children: [
  //                     { path: '/Reproceso', title: 'Reprocesos', type: 'link' },
  //                     { title: 'Mantenedor', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
  //                       children: [
  //                         { path: '/MantenedorSubsidiaria', title: 'Subsidiaria', type: 'link' },
  //                         { path: '/MantenedorMoneda', title: 'Moneda', type: 'link' }
  //                       ]
  //                     },
  //                     { path: '/ConsultaOpciones', title: 'Consulta de Opciones', type: 'link' },
  //                     { path: '/ValorizacionDerivados', title: 'Valorización de Derivados', type: 'link' },
              
  //                 ]
  //     },
  //   ]
  // },
  {
    title: 'Límites', icon: 'alert-triangle', type: 'sub', badgeValue: '11', active: false,
    children: [
          { path: '/Posicionfisica', title: 'Posición Físico', type: 'link' },     
          { path: '/TableroLimites', title: 'Tablero Límites', type: 'link' }, 
          { path: '/TableroVariacionMTM', title: 'Posición IFDs', type: 'link' } 

    ]
  },
  {
    title: 'Mantenedor', icon: 'edit', type: 'sub', badgeValue: '11', active: false,
    children: [

      // { path: '/Campaña', title: 'Registro Campaña', type: 'link' },
      // { path: '/RegistroBrokerCampanha', title: 'Registro Broker - Campaña', type: 'link' },
      { path: '/RegistroImpugnacion', title: 'Impugnación de Bases', type: 'link' },
      // { title: 'Molienda', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
      //       children: [ { path: '/LimiteCampaña', title: 'Límite Especifico', type: 'link' }]},
      { path: '/RegistroLimite', title: 'Registro de Límites', type: 'link' },        
        
      
    ]
  },
  {
    title: 'Administrador', icon: 'settings', type: 'sub', badgeValue: '12', active: false,
    children: [

      { path: '/AprobarEstrategia', title: 'Aprobación Estrategia', type: 'link' },
      { path: '/AprobarOperacion', title: 'Aprobación Operación', type: 'link' },
      { path: '/RevertirBarco', title: 'Aprobar Reversión de Barco', type: 'link' },
      { path: '/AprobacionImpugnacion', title: 'Aprobación Impugnación', type: 'link'},
    ]
  },
  {
    title: 'Fret', icon: 'dollar-sign', type: 'sub', badgeValue: '11', active: false,
    children: [
      { path: '/FretCMIFD', title: 'Calculo', type: 'link' }, 
      {
        title: 'Data Entry', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
        children: [
          { path: '/DataEntry-Fret', title: 'Ingreso', type: 'link' },
          { path: '/Config-DataEntry-Fret', title: 'Configuración', type: 'link' },
        ]
      },   
      { path: '/PrecioTiempoReal', title: 'Precio tiempo real', type: 'link' },
    ]
  },
  ];


  MENUITEMSCONSULTA: HorizontalMenu[] = [
    {
      title: 'Fisicos', icon: 'droplet', type: 'sub', badgeValue: '11', active: false,
      children: [
        { path: '/costplus', title: 'Cost Plus', type: 'link' },
        {
          title: 'Molienda', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [
            { path: '/ventasMolienda', title: 'Ventas Molienda', type: 'link' },
           
 
            // { path: '/comprasMolienda', title: 'Compras Moliendas', type: 'link' },
            // { path: '/', title: 'Papeles', type: 'link' },
            { path: '/calculoMtM', title: 'Calculo de MtM', type: 'link' },
          ]
        },
        { title: 'Consumo Masivo', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
        children: [{ path: '/libroFisico', title: 'Gestión del Físico', type: 'link' }
        // { path: '/RegistroInventario', title: 'Carga de Inventario', type: 'link' }
        ,{ path: '/RegistroBaseTrigo', title: 'Carga de Bases Trigo', type: 'link' },
                  ]  },  
 
        // { path: '/calculoMtM', title: 'Calculo de MtM', type: 'link' }
      ]
      // { path: '/forms/form-wizard', title: 'Form Wizard', type: 'link' },
      // { path: '/forms/form-edit', title: 'Form Editor', type: 'link' },
      // { path: '/forms/form-element-sizes', title: 'Form Element Sizes', type: 'link' },
      // { path: '/forms/form-treeview', title: 'Form Treeview', type: 'link' },
 
    },
    {
      title: 'IFD', icon: 'edit', type: 'sub', badgeValue: '6', active: false,
      children: [
        { path: '/PortafolioDerivado', title: 'Valorización de Portafolio', type: 'link' },
        { path: '/ResultadoMetricaRiesgo', title: 'Resultado Métrica IFD', type: 'link' },
        { path: '/IFDLiquidados', title: 'IFD Liquidados', type: 'link' },
        { path: '/ReporteContabilidad', title: 'Reporte Contabilidad', type: 'link' },
        { path: '/CandleStickPrice', title: 'Precios Históricos', type: 'link' }
      ]
    },
    {
      title: 'RDT', icon: 'edit', type: 'sub', badgeValue: '6', active: false,
      children: [
        { path: '/RegistroOperacionesRDT', title: 'Registro de Operaciones', type: 'link' },
        { path: '/PagoFacturas', title: 'Pago de Facturas', type: 'link' },
        { path: '/ValorizacionDerivados', title: 'Valorización de Derivados', type: 'link' },
        { title: 'Mantenedor', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [
            { path: '/MantenedorSubsidiaria', title: 'Subsidiaria', type: 'link' },
            { path: '/MantenedorMoneda', title: 'Moneda', type: 'link' }
          ]
        },
        { path: '/RegistroIntercompanies', title: 'Carga Individual OC', type: 'link' },
        { path: '/ConsultaOpciones', title: 'Consulta de Opciones', type: 'link' },
        { path: '/Reproceso', title: 'Reprocesos', type: 'link' }
      ]
    },
    {
      title: 'Límites', icon: 'droplet', type: 'sub', badgeValue: '11', active: false,
      children: [
            { path: '/Posicionfisica', title: 'Posición Físico', type: 'link' },     
            { path: '/TableroLimites', title: 'Tablero Límites', type: 'link' },
            { path: '/TableroVariacionMTM', title: 'Posición IFDs', type: 'link' }   
      ]
    },
    {
      title: 'Mantenedor', icon: 'droplet', type: 'sub', badgeValue: '11', active: false,
      children: [
        { path: '/Campaña', title: 'Registro Campaña', type: 'link' },
        { path: '/RegistroBrokerCampanha', title: 'Registro Broker - Campaña', type: 'link' },
        { path: '/RegistroImpugnacion', title: 'Impugnación de Bases', type: 'link' },
        { title: 'Molienda', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [ { path: '/LimiteCampaña', title: 'Límite Especifico', type: 'link' }]},
        { path: '/RegistroLimite', title: 'Registro de Límites', type: 'link' }, 
      ]
    },
    {
      title: 'Administrador', icon: 'droplet', type: 'sub', badgeValue: '12', active: false,
      children: [
        { path: '/AprobarEstrategia', title: 'Aprobación Estrategia', type: 'link' },
        { path: '/AprobarOperacion', title: 'Aprobación Operación', type: 'link' },
        { path: '/RevertirBarco', title: 'Aprobar Reversión de Barco', type: 'link' },
        { path: '/AprobacionImpugnacion', title: 'Aprobación Impugnación', type: 'link'},
      ]
    },
  ];
  

  MENUITEMS_FRET: HorizontalMenu[] = [
    {title: 'Fisicos', icon: 'droplet', type: 'sub', badgeValue: '11', active: false,
      children: [
        { path: '/costplus', title: 'Cost Plus', type: 'link' },
        {
          title: 'Molienda', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [
            { path: '/ventasMolienda', title: 'Ventas Molienda', type: 'link' },
            
            

            // { path: '/comprasMolienda', title: 'Compras Moliendas', type: 'link' },
            // { path: '/', title: 'Papeles', type: 'link' },
            { path: '/calculoMtM', title: 'Calculo de MtM', type: 'link' }, 
          ]
        },
        { title: 'Consumo Masivo', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [{ path: '/libroFisico', title: 'Gestión del Físico', type: 'link' },
          { path: '/RegistroBaseTrigo', title: 'Carga de Bases Trigo', type: 'link' },
          { path: '/RegistroInventario', title: 'Carga de Inventario', type: 'link' }, 
          { path: '/RegistroConsumo', title: 'Carga de Consumo', type: 'link' }
                    ]  },
                    {
                      title: 'Papeles', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
                      children: [
                        { path: '/gestionPapeles', title: 'Gestion de Papeles', type: 'link' }
                      ]
                    },         
          { title: 'Reportes', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [
            { path: '/BiventasMolienda', title: 'Ventas Molienda', type: 'link' }, 
             { path: '/Bipapeles', title: 'Papeles', type: 'link' },
             
          ]},  

     ]

    },

    {
      title: 'IFD', icon: 'edit', type: 'sub', badgeValue: '6', active: false,
      children: [
        { path: '/PortafolioDerivado', title: 'Valorización de Portafolio', type: 'link' },
        { path: '/ResultadoMetricaRiesgo', title: 'Resultado Métrica IFD', type: 'link' },
        { path: '/IFDLiquidados', title: 'IFD Liquidados', type: 'link' },
        { path: '/ReporteContabilidad', title: 'Reporte Contabilidad', type: 'link' },
        { path: '/CandleStickPrice', title: 'Precios Históricos', type: 'link' }
      ]
    },
    {title: 'RDT', icon: 'edit', type: 'sub', badgeValue: '6', active: false,
      children: 
      [
        { title: 'Registros', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [
                        { path: '/RegistroOperacionesRDT', title: 'Operaciones IFD', type: 'link' },
                        { path: '/PagoFacturas', title: 'Pago de Facturas', type: 'link' },
                        { path: '/RegistroIntercompanies', title: 'Carga Individual OC', type: 'link' }
                    ]
        },
        { title: 'Reportes', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [   { path: '/resumenTeso', title: 'Resumen Ejecutivo', type: 'link' },
                        { path: '/PreExportVF', title: 'Pre Exports', type: 'link' },
                        { path: '/PosiciónMEv2', title: 'Posición en ME', type: 'link' },
                        { path: '/MarktoMarket_6', title: 'MTM Vigentes y Vencidos', type: 'link' },
                        { path: '/KPIsv3', title: 'Seguimiento de KPIs', type: 'link' },
                        { path: '/Dashboard_Caja_2', title: 'Caja', type: 'link' },
                        { path: '/ProximosVencimientosv2', title: 'Próx. Venc. IFDs', type: 'link' }, 
                        { path: '/OpercionesIFD', title: 'Operaciones IFDs', type: 'link' },
                        { path: '/ReporteTributario', title: 'Relación de Coberturas', type: 'link' }
                    ]
        },
        { title: 'Gestión de Procesos', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [
                        { path: '/Reproceso', title: 'Reprocesos', type: 'link' },
                        { title: 'Mantenedor', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
                          children: [
                            { path: '/MantenedorSubsidiaria', title: 'Subsidiaria', type: 'link' },
                            { path: '/MantenedorMoneda', title: 'Moneda', type: 'link' }
                          ]
                        },
                        { path: '/ConsultaOpciones', title: 'Consulta de Opciones', type: 'link' },
                        { path: '/ValorizacionDerivados', title: 'Valorización de Derivados', type: 'link' },
                
                    ]
        },
      ]
    },
    {
      title: 'Límites', icon: 'droplet', type: 'sub', badgeValue: '11', active: false,
      children: [
            { path: '/Posicionfisica', title: 'Posición Físico', type: 'link' },     
            { path: '/TableroLimites', title: 'Tablero Límites', type: 'link' },
            { path: '/TableroVariacionMTM', title: 'Posición IFDs', type: 'link' }    
      ]
    },
    {
      title: 'Mantenedor', icon: 'droplet', type: 'sub', badgeValue: '11', active: false,
      children: [

        { path: '/Campaña', title: 'Registro Campaña', type: 'link' },
        { path: '/RegistroBrokerCampanha', title: 'Registro Broker - Campaña', type: 'link' },
        { path: '/RegistroImpugnacion', title: 'Impugnación de Bases', type: 'link' },
        { title: 'Molienda', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [ { path: '/LimiteCampaña', title: 'Límite Especifico', type: 'link' }]},
        { path: '/RegistroLimite', title: 'Registro de Límites', type: 'link' }, 
      ]
    },
    {
      title: 'Administrador', icon: 'droplet', type: 'sub', badgeValue: '12', active: false,
      children: [

        { path: '/AprobarEstrategia', title: 'Aprobación Estrategia', type: 'link' },
        { path: '/AprobarOperacion', title: 'Aprobación Operación', type: 'link' },
        { path: '/RevertirBarco', title: 'Aprobar Reversión de Barco', type: 'link' },
        { path: '/AprobacionImpugnacion', title: 'Aprobación Impugnación', type: 'link'},
      ]
    },
    {
      title: 'Fret', icon: 'droplet', type: 'sub', badgeValue: '11', active: false,
      children: [
        { path: '/FretCMIFD', title: 'Calculo', type: 'link' }, 
        {
          title: 'Data Entry', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [
            { path: '/DataEntry-Fret', title: 'Ingreso', type: 'link' },
            { path: '/Config-DataEntry-Fret', title: 'Configuración', type: 'link' },
          ]
        },   
        { path: '/PrecioTiempoReal', title: 'Precio tiempo real', type: 'link' },
      ]
    },
  ];

  MENUITEMS_PrecioRealTime: HorizontalMenu[] = [
    {
      title: 'IFD', icon: 'edit', type: 'sub', badgeValue: '6', active: false,
      children: [
        { path: '/PortafolioDerivado', title: 'Valorización de Portafolio', type: 'link' },
        { path: '/ResultadoMetricaRiesgo', title: 'Resultado Métrica IFD', type: 'link' },
        { path: '/IFDLiquidados', title: 'IFD Liquidados', type: 'link' },
        { path: '/ReporteContabilidad', title: 'Reporte Contabilidad', type: 'link' },
        { path: '/CandleStickPrice', title: 'Precios Históricos', type: 'link' }
      ]
    },
    {
      title: 'Límites', icon: 'droplet', type: 'sub', badgeValue: '11', active: false,
      children: [
            { path: '/Posicionfisica', title: 'Posición Físico', type: 'link' },     
            { path: '/TableroLimites', title: 'Tablero Límites', type: 'link' },
            { path: '/TableroVariacionMTM', title: 'Posición IFDs', type: 'link' }    
      ]
    },
    {
      title: 'Mantenedor', icon: 'droplet', type: 'sub', badgeValue: '11', active: false,
      children: [

        { path: '/Campaña', title: 'Registro Campaña', type: 'link' },
        { path: '/RegistroBrokerCampanha', title: 'Registro Broker - Campaña', type: 'link' },
        { path: '/RegistroImpugnacion', title: 'Impugnación de Bases', type: 'link' },
        { title: 'Molienda', icon: 'copy', type: 'sub', badgeValue: '6', active: false,
          children: [ { path: '/LimiteCampaña', title: 'Límite Especifico', type: 'link' }]},
        { path: '/RegistroLimite', title: 'Registro de Límites', type: 'link' }, 
      ]
    },
    {
      title: 'Administrador', icon: 'droplet', type: 'sub', badgeValue: '12', active: false,
      children: [

        { path: '/AprobarEstrategia', title: 'Aprobación Estrategia', type: 'link' },
        { path: '/AprobarOperacion', title: 'Aprobación Operación', type: 'link' },
        { path: '/RevertirBarco', title: 'Aprobar Reversión de Barco', type: 'link' },
        { path: '/AprobacionImpugnacion', title: 'Aprobación Impugnación', type: 'link'},
      ]
    },
    {
      title: 'Precio tiempo real', icon: 'droplet', type: 'sub', badgeValue: '11', active: false,
      children: [
        { path: '/PrecioTiempoReal', title: 'Precio tiempo real', type: 'link' }
      ]
    },
  ];

  MEGAMENUITEMS: HorizontalMegaMenu[] = [
 
    {
      title: 'Apps', icon: 'layers', type: 'sub', active: false,
      children: [
 
 
        { path: '/apps/chat/chat01', title: 'Chat 01', type: 'link' },
        { path: '/apps/chat/chat02', title: 'Chat 02', type: 'link' },
        { path: '/apps/chat/chat03', title: 'Chat 03', type: 'link' },
 
        { path: '/apps/contact/contact01', title: 'Contact List 01', type: 'link' },
        { path: '/apps/contact/contact02', title: 'Contact List 02', type: 'link' },
 
        { path: '/apps/filemanager/filemanager01', title: 'File Manager 01', type: 'link' },
        { path: '/apps/filemanager/filemanager02', title: 'File Manager 02', type: 'link' },
 
        { path: '/apps/todolist/todolist01', title: 'Todo List 01', type: 'link' },
        { path: '/apps/todolist/todolist02', title: 'Todo List 02', type: 'link' },
        { path: '/apps/todolist/todolist03', title: 'Todo List 03', type: 'link' },
 
 
        { path: '/apps/userlist/userlist01', title: 'User List 01', type: 'link' },
        { path: '/apps/userlist/userlist02', title: 'User List 02', type: 'link' },
        { path: '/apps/userlist/userlist03', title: 'User List 03', type: 'link' },
        { path: '/apps/userlist/userlist04', title: 'User List 04', type: 'link' },
 
        { path: '/apps/calendar', title: 'Calendar', type: 'link' },
        { path: '/apps/dragula-card', title: 'Dragula Card', type: 'link' },
        { path: '/apps/image-crop', title: 'Image Crop', type: 'link' },
        { path: '/apps/page-sessiontimeout', title: 'Page-session timeout', type: 'link' },
        { path: '/apps/notifications', title: 'Notifications', type: 'link' },
        { path: '/apps/sweet-alerts', title: 'Sweet alerts', type: 'link' },
        { path: '/apps/range-slider', title: 'Range slider', type: 'link' },
        { path: '/apps/counters', title: 'Counters', type: 'link' },
        { path: '/apps/loaders', title: 'Loaders', type: 'link' },
        { path: '/apps/time-line', title: 'Time Line', type: 'link' },
        { path: '/apps/rating', title: 'Rating', type: 'link' },
 
      ]
    },
 
    {
      title: 'Elements', icon: 'sliders', type: 'sub', active: false,
      children: [
        { path: '/elements/accordion', title: 'Accordion', type: 'link' },
        { path: '/elements/alerts', title: 'Alerts', type: 'link' },
        { path: '/elements/avatars', title: 'Avatars', type: 'link' },
        { path: '/elements/badges', title: 'Badges', type: 'link' },
        { path: '/elements/bread-crumbs', title: 'Breadcrumb', type: 'link' },
        { path: '/elements/buttons', title: 'Buttons', type: 'link' },
        { path: '/elements/cards', title: 'Cards', type: 'link' },
        { path: '/elements/card-images', title: 'Card Images', type: 'link' },
        { path: '/elements/carousel', title: 'Carousel', type: 'link' },
        { path: '/elements/dropdown', title: 'Dropdown', type: 'link' },
        { path: '/elements/footers', title: 'Footers', type: 'link' },
        { path: '/elements/headers', title: 'Headers', type: 'link' },
        { path: '/elements/list', title: 'List', type: 'link' },
        { path: '/elements/media-object', title: 'Media Object', type: 'link' },
        { path: '/elements/modal', title: 'Modal', type: 'link' },
        { path: '/elements/navigation', title: 'Navigation', type: 'link' },
        { path: '/elements/pagination', title: 'Pagination', type: 'link' },
        { path: '/elements/panels', title: 'Panel', type: 'link' },
        { path: '/elements/popover', title: 'Popover', type: 'link' },
        { path: '/elements/progress', title: 'Progress', type: 'link' },
        { path: '/elements/tabs', title: 'Tabs', type: 'link' },
        { path: '/elements/tags', title: 'Tags', type: 'link' },
        { path: '/elements/tooltips', title: 'Tooltips', type: 'link' },
 
        { path: '/basic-elements/colors', title: 'Colors', type: 'link' },
        { path: '/basic-elements/flex-items', title: 'Flex Items', type: 'link' },
        { path: '/basic-elements/height', title: 'Height', type: 'link' },
        { path: '/basic-elements/border', title: 'Border', type: 'link' },
        { path: '/basic-elements/display', title: 'Display', type: 'link' },
        { path: '/basic-elements/margin', title: 'Margin', type: 'link' },
        { path: '/basic-elements/padding', title: 'Padding', type: 'link' },
        { path: '/basic-elements/typography', title: 'Typhography', type: 'link' },
        { path: '/basic-elements/width', title: 'Width', type: 'link' },
 
        { path: '/error/error400', title: '400', type: 'link' },
        { path: '/error/error401', title: '401', type: 'link' },
        { path: '/error/error403', title: '403', type: 'link' },
        { path: '/error/error404', title: '404', type: 'link' },
        { path: '/error/error500', title: '500', type: 'link' },
        { path: '/error/error503', title: '503', type: 'link' },
 
      ]
    },
 
    {
      title: 'Pages', icon: 'file', type: 'sub', active: false,
      children: [
 
        { path: '/pages/profile/profile01', title: 'Profile 01', type: 'link' },
        { path: '/pages/profile/profile02', title: 'Profile 02', type: 'link' },
        { path: '/pages/profile/profile03', title: 'Profile 03', type: 'link' },
 
        { path: '/pages/edit-profile', title: 'Edit Profile', type: 'link' },
 
        { path: '/pages/email/email-compose', title: 'Email Compose', type: 'link' },
        { path: '/pages/email/email-inbox', title: 'Email Inbox', type: 'link' },
        { path: '/pages/email/email-read', title: 'Email Read', type: 'link' },
 
        { path: '/pages/pricing/pricing01', title: 'Pricing 01', type: 'link' },
        { path: '/pages/pricing/pricing02', title: 'Pricing 02', type: 'link' },
        { path: '/pages/pricing/pricing03', title: 'Pricing 03', type: 'link' },
 
        { path: '/pages/blog/blog01', title: 'Blog 01', type: 'link' },
        { path: '/pages/blog/blog02', title: 'Blog 02', type: 'link' },
        { path: '/pages/blog/blog03', title: 'Blog 03', type: 'link' },
        { path: '/pages/blog/blog-styles', title: 'Blog Styles', type: 'link' },
 
        { path: '/pages/gallery', title: 'Gallery', type: 'link' },
        { path: '/pages/faqs', title: 'FAQS', type: 'link' },
        { path: '/pages/terms', title: 'Terms', type: 'link' },
        { path: '/pages/empty-page', title: 'Empty Page', type: 'link' },
        { path: '/pages/search', title: 'Search', type: 'link' },
 
        { path: '/custom-pages/login/login01', title: 'Login 01', type: 'link' },
        { path: '/custom-pages/login/login02', title: 'Login 02', type: 'link' },
        { path: '/custom-pages/login/login03', title: 'Login 03', type: 'link' },
 
        { path: '/custom-pages/register/register01', title: 'Register 01', type: 'link' },
        { path: '/custom-pages/register/register02', title: 'Register 02', type: 'link' },
        { path: '/custom-pages/register/register03', title: 'Register 03', type: 'link' },
 
        { path: '/custom-pages/forget-password/forget-password01', title: 'Forget Password 01', type: 'link' },
        { path: '/custom-pages/forget-password/forget-password02', title: 'Forget Password 02', type: 'link' },
        { path: '/custom-pages/forget-password/forget-password03', title: 'Forget Password 03', type: 'link' },
 
        { path: '/custom-pages/reset-password/reset-password01', title: 'Reset Password 01', type: 'link' },
        { path: '/custom-pages/reset-password/reset-password02', title: 'Reset Password 02', type: 'link' },
        { path: '/custom-pages/reset-password/reset-password03', title: 'Reset Password 03', type: 'link' },
 
        { path: '/custom-pages/lockscreen/lockscreen01', title: 'Lock Screen 01', type: 'link' },
        { path: '/custom-pages/lockscreen/lockscreen02', title: 'Lock Screen 02', type: 'link' },
        { path: '/custom-pages/lockscreen/lockscreen03', title: 'Lock Screen 03', type: 'link' },
 
        { path: '/custom-pages/under-construction', title: 'Under Construction', type: 'link' },
        { path: '/custom-pages/comingsoon', title: 'Coming Soon', type: 'link' },
      ]
    },
  ];


  //array
  items = new BehaviorSubject<HorizontalMenu[]>(this.MENUITEMS);
  itemsConsulta = new BehaviorSubject<HorizontalMenu[]>(this.MENUITEMSCONSULTA);
  itemsFret = new BehaviorSubject<HorizontalMenu[]>(this.MENUITEMS_FRET);
  itemsMega = new BehaviorSubject<HorizontalMegaMenu[]>(this.MEGAMENUITEMS);
  itemsPrecios = new BehaviorSubject<HorizontalMenu[]>(this.MENUITEMS_PrecioRealTime);

  
  

}
