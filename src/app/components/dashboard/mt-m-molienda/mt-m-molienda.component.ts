import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild, ElementRef, QueryList, AfterViewInit, ViewChildren, OnDestroy } from '@angular/core';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { Underlying } from 'src/app/models/Fisico/underlying';
import Swal from 'sweetalert2';
import { NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Meses } from 'src/app/models/Fisico/Meses';
import { MTMMoliendaDetalle } from 'src/app/models/Fisico/MTMMoliendaDetalle';
import { CalculoMTMMolienda } from 'src/app/shared/services/CalculoMTMMolienda.service';
import { Item } from 'angular2-multiselect-dropdown';
//import * as XLSX from 'xlsx';
import { MTMMoliendaTotales } from 'src/app/models/Fisico/MTMMoliendaTotales';
import { ReporteMTM } from 'src/app/models/Fisico/ReporteMTM';
import { MatMenuTrigger } from '@angular/material/menu';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { number } from 'echarts';
import { campaniaSubyacenteModelo } from 'src/app/models/Fisico/campaniaSubyacneteModelo';
import { Bold, X } from 'angular-feather/icons';
import { FormControl } from '@angular/forms';
import { MtmMoliendaModelo } from 'src/app/models/Fisico/MtmMoliendaModelo';
import { MtmMoliendaListaDuplicadosModelo } from 'src/app/models/Fisico/mtmMoliendaListaDuplicadosModelo';
import { GrindingBaseMtmModelo } from 'src/app/models/Fisico/GrindingBaseMtmModelo';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx-js-style';
import { MTMMolienda } from 'src/app/models/Fisico/MtMMolienda';
import { ReporteMTMExcel } from 'src/app/models/Fisico/Consumo Masivo/ReporteMtMExcel';
import { ja } from 'date-fns/locale';

@Component({
  selector: 'app-mt-m-molienda',
  templateUrl: './mt-m-molienda.component.html',
  styleUrls: ['./mt-m-molienda.component.scss']
})
export class MtMMoliendaComponent implements OnInit, OnDestroy {

//   @HostListener('window:beforeunload', ['$event'])
//   unloadHandler(event: Event) {
//     //console.log('refresco')
//     this.guardarRefrescarPagina()
// }

public listaMtMMolienda: MTMMolienda;


  public campania: cargaCombo[] = [];
  public productos: Underlying[] = [];
  public selectedProducto: Underlying[] = [];
  public selectedCampania: cargaCombo[] = [];
  public subyacenteSelected: number = 0;
  public campaniaSelected: number = 0;
  public listadoMTMMolienda: MTMMoliendaDetalle[] = [];
  public nuevoMTMMolienda: MTMMoliendaDetalle = new MTMMoliendaDetalle();
  public nuevoMTMMoliendaTotales: MTMMoliendaTotales = new MTMMoliendaTotales();
  public totalVolumen: number = 0;
  public totalSensi_10: number[] = [];
  public totalSensi_20: number[] = [];
  public totalSensi_30: number[] = [];
  public factorMTM: number = 0;;
  public baseNegociada: string[] = [];
  public mercado: string[] = [];
  public basePY: string[] = [];
  public mtmVsPb: string[] = [];
  public UMSensibilidad: string[] = [];
  public analisis1: string[] = [];
  public analisis2: string[] = [];
  public analisis3: string[] = [];
  public analisis31: string[] = [];
  public flgModificar = false;
  public btnAgregar = false;
  public fechaMTM: NgbDateStruct;
  public mesMTM: NgbDateStruct;
  public fechaModificar: Date = new Date();
  public flgBontongenerico: Boolean = true;
  public flgBontonCopiar: Boolean = true;

  public dateToString = ((date) => {
    if (date.day < 10 && date.month < 10) {
      return `${date.year}0${date.month}0${date.day}`.toString();
    } else if (date.day < 10) {
      return `${date.year}${date.month}0${date.day}`.toString();
    } else if (date.month < 10) {
      return `${date.year}0${date.month}${date.day}`.toString();
    } else {
      return `${date.year}${date.month}${date.day}`.toString();
    }
  })

  constructor(private portafolioMoliendaService: PortafolioMoliendaService, private calculoMTMMolienda: CalculoMTMMolienda, private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    let notificacionMostrada: Boolean=false
    window.onbeforeunload  = () => {
      // Llamamos al servicio cuando se carga la página
      this.guardarRefrescarPagina()
    };




  }

  ngOnInit(): void {
    this.fechaVigenteCampañaSubyacente();
    this.obtenerCampanias();
    this.listaMTMTotales();
    this.duplicado();
  }

  public obtenerCampanias() {
    let fechaT = new Date();
    fechaT.setHours(0, 0, 0, 0);
    this.listadoMTMMolienda = [];
    this.productos = [];
    this.selectedProducto = [];
    let auxFecha = new Date()

    
    
    if (fechaT.getDay() === 1) { // 1 = LUNES
        //this.fechaMTM = { day: new Date().getDate() - 3, month: new Date().getMonth() + 1, year: new Date().getFullYear() };
        auxFecha.setDate(fechaT.getDate() - 3);
        this.fechaMTM = { day: auxFecha.getDate(), month: auxFecha.getMonth() + 1, year: auxFecha.getFullYear() };

    }else if (fechaT.getDay() === 0) { // 0 = DOMINGO
      auxFecha.setDate(fechaT.getDate() - 2);
      this.fechaMTM = { day: auxFecha.getDate(), month: auxFecha.getMonth() + 1, year: auxFecha.getFullYear() };
    }else {
      auxFecha.setDate(fechaT.getDate() - 1);
      this.fechaMTM = { day: auxFecha.getDate(), month: auxFecha.getMonth() + 1, year: auxFecha.getFullYear() };
    }

    this.calculoMTMMolienda.getComboXCodigoFechaVigente('campañaVigente').subscribe(
      (response: cargaCombo[]) => {
        this.campania = response;
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  public obtenerSubyacentes(id: number) {

    this.listadoMTMMolienda = [];
    if (id == undefined) {
      this.selectedProducto = [];
      this.productos = [];
      this.campaniaSelected = 0;
      this.selectedCampania = [];
    } else {
      this.campaniaSelected = id;
      this.selectedProducto = [];
      this.calculoMTMMolienda.getProductosMoliendaXCampania(Number(id)).subscribe(
        (responseUnderlying: Underlying[]) => {
          this.productos = responseUnderlying;
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
  }

  public obtenerFactor(id: number) {
    this.subyacenteSelected = id;
    if (this.subyacenteSelected == undefined) {
      this.selectedProducto = [];
    } else {
      this.calculoMTMMolienda.obtenerFactor(id).subscribe(
        (response: number) => {
          this.factorMTM = response;
        });
    }
  }

  public tituloReporte: string = "";

  public exportarExcel() {
    let reporteInicial: ReporteMTM[] = [];
    let reporteFinal: ReporteMTMExcel[] = [];
    let reporteExcel: ReporteMTMExcel[] = [];
    let fechaConsulta: string = this.dateToString(this.fechaVigente);
    let contador: number = 0;
    let contadorFila: number = 0;

    let campaña: string = "";
    let underlying: string = "";
    let volumen: string = "";
    let mes_entrega: string = "";
    let base_negociada: string = "";
    let mercado: string = "";
    let dif: string = "";
    let mtm: string = "";
    let base_py: string = "";
    let mtm_vs_pb: string = "";
    let mtm_10: string = "";
    let mtm_20: string = "";
    let mtm_30: string = "";

    let formatter = new Intl.NumberFormat('es-MX', {
      style: 'decimal',
      useGrouping: true,
      maximumFractionDigits: 2
    });

    this.calculoMTMMolienda.listarMTMXFecha(fechaConsulta).subscribe(
      (response: ReporteMTM[]) => {
        reporteInicial = response;

        if (reporteInicial.length > 0) {

          const reporteAgrupado = reporteInicial.reduce((acc, curr) => {
            const key = curr.campaña + curr.underlying;
            if (!acc[key]) {
              acc[key] = {
                campaña: curr.campaña,
                underlying: curr.underlying,

                items: []
              };
            }
            acc[key].items.push(curr);
            return acc;
          }, {});
          let lastAgrupadoValue: string = "";
          for (let key in reporteAgrupado) {
            contadorFila += 1;
            if (reporteAgrupado.hasOwnProperty(key)) {

              const item1 = reporteAgrupado[key];
              const currentValue = item1.underlying;
              if (currentValue !== lastAgrupadoValue) {

                if (currentValue == 'Aceite de Soya') {
                  reporteFinal.push({
                    campaña: 'Campaña',
                    underlying: 'Subyacente',
                    volumen: 'Volumen (TM)',
                    mes_entrega: 'Mes de Entrega',
                    base_negociada: 'Base Negociada (c/li)',
                    mercado: 'Mercado  (c/li)',
                    dif: 'DIF. ($/tm)',
                    mtm: 'MTM ($)',
                    base_py: 'Base PY (c/li)',
                    mtm_vs_pb: 'MTM VS PY ($)',
                    espacio1: '',
                    mtm_10: 'MTM ($) - 400(ptos)',
                    mtm_20: 'MTM ($) - 700(ptos)',
                    mtm_30: 'MTM ($) - ' + item1.items[0].valorShock.toString() + '(ptos)',
                    id: null
                  });
                } else if (currentValue == 'Harina de Girasol') {
                  reporteFinal.push({
                    campaña: 'Campaña',
                    underlying: 'Subyacente',
                    volumen: 'Volumen (TM)',
                    mes_entrega: 'Mes de Entrega',
                    base_negociada: 'Base Negociada ($/st)',
                    mercado: 'Mercado ($/st)',
                    dif: 'DIF. ($/st)',
                    mtm: 'MTM ($)',
                    base_py: 'Base PY ($/st)',
                    mtm_vs_pb: 'MTM VS PY ($)',
                    espacio1: '',
                    mtm_10: 'MTM ($) - 10',
                    mtm_20: 'MTM ($) - 20',
                    mtm_30: 'MTM ($) - ' + item1.items[0].valorShock.toString() + '(ptos)',
                    id: null
                  });
                } else if (currentValue == 'Aceite de Girasol') {
                  reporteFinal.push({
                    campaña: 'Campaña',
                    underlying: 'Subyacente',
                    volumen: 'Volumen (TM)',
                    mes_entrega: 'Mes de Entrega',
                    base_negociada: 'Flat Negociado ($/tm)',
                    mercado: 'Mercado ($/tm)',
                    dif: 'DIF. ($/tm)',
                    mtm: 'MTM ($)',
                    base_py: 'Base PY ($/tm)',
                    mtm_vs_pb: 'MTM VS PY ($)',
                    espacio1: '',
                    mtm_10: 'MTM ($) - 200',
                    mtm_20: 'MTM ($) - 300',
                    mtm_30: 'MTM ($) - ' + item1.items[0].valorShock.toString() + '(ptos)',
                    id: null
                  });
                } else if (currentValue == 'Harina de Soya') {
                  reporteFinal.push({
                    campaña: 'Campaña',
                    underlying: 'Subyacente',
                    volumen: 'Volumen (TM)',
                    mes_entrega: 'Mes de Entrega',
                    base_negociada: 'Base Negociada ($/st)',
                    mercado: 'Mercado ($/st)',
                    dif: 'DIF. ($/st)',
                    mtm: 'MTM ($)',
                    base_py: 'Base PY ($/st)',
                    mtm_vs_pb: 'MTM VS PY ($)',
                    espacio1: '',
                    mtm_10: 'MTM ($) - 10',
                    mtm_20: 'MTM ($) - 20',
                    mtm_30: 'MTM ($) - ' + item1.items[0].valorShock.toString() + '(ptos)',
                    id: null
                  });
                } else if (currentValue == 'Grano de Soya') {
                  reporteFinal.push({
                    campaña: 'Campaña',
                    underlying: 'Subyacente',
                    volumen: 'Volumen (TM)',
                    mes_entrega: 'Mes de Entrega',
                    base_negociada: 'Base Negociada ($/tm)',
                    mercado: 'Mercado ($/tm)',
                    dif: 'DIF. ($/tm)',
                    mtm: 'MTM ($)',
                    base_py: '',
                    mtm_vs_pb: '',
                    espacio1: '',
                    mtm_10: '',
                    mtm_20: '',
                    mtm_30: '',
                    id: null
                  });
                } else {
                  reporteFinal.push({
                    campaña: 'Campaña',
                    underlying: 'Subyacente',
                    volumen: 'Volumen',
                    mes_entrega: 'Mes de Entrega',
                    base_negociada: 'Base Negociada',
                    mercado: 'Mercado',
                    dif: 'DIF.',
                    mtm: 'MTM',
                    base_py: 'Base PY',
                    mtm_vs_pb: 'MTM VS PY',
                    espacio1: '',
                    mtm_10: 'MTM ($) - 10',
                    mtm_20: 'MTM ($) - 20',
                    mtm_30: 'MTM ($) - ' + item1.items[0].valorShock.toString() + '(ptos)',
                    id: null
                  });
                }

                if (reporteFinal.length > 2) {
                  if (reporteFinal[1].underlying == 'Aceite de Soya') {
                    campaña = '';
                    underlying = '';
                    volumen = '';
                    mes_entrega = '';
                    base_negociada = '';
                    mercado = '';
                    dif = '';
                    mtm = '';
                    base_py = '';
                    mtm_vs_pb = '';
                    mtm_10 = '';
                    mtm_20 = '';
                    mtm_30 = '';
                  } else {
                    campaña = '';
                    underlying = '';
                    volumen = '';
                    mes_entrega = '';
                    base_negociada = '';
                    mercado = '';
                    dif = '';
                    mtm = '';
                    base_py = '';
                    mtm_vs_pb = '';
                    mtm_10 = '';
                    mtm_20 = '';
                    mtm_30 = '';
                  }
                }
                // const subyacente = item1.underlying;

                let subtotalVolumen = item1.items.reduce((acc, curr) => acc + curr.volumen, 0);
                let subtotalBaseNegociada = item1.items.reduce((acc, curr) => acc + curr.base_negociada, 0);
                let subtotalMercado = item1.items.reduce((acc, curr) => acc + curr.mercado, 0);
                let subtotalDif = item1.items.reduce((acc, curr) => acc + curr.dif, 0);
                let subtotalMtm = item1.items.reduce((acc, curr) => acc + curr.mtm, 0);
                let subtotalBasePy;
                let subtotalMtmVsPb;
                let subtotalMtm10;
                let subtotalMtm20;
                let subtotalMtm30;

                if (item1.underlying == 'Grano de Soya') {
                  subtotalMtm10 = '';
                  subtotalMtm20 = '';
                  subtotalMtm30 = '';
                  subtotalBasePy = '';
                  subtotalMtmVsPb = '';
                } else {
                  subtotalMtm10 = item1.items.reduce((acc, curr) => acc + curr.mtm_10, 0);
                  subtotalMtm20 = item1.items.reduce((acc, curr) => acc + curr.mtm_20, 0);
                  subtotalMtm30 = item1.items.reduce((acc, curr) => acc + curr.mtm_30, 0);
                  subtotalBasePy = item1.items.reduce((acc, curr) => acc + curr.base_py, 0);
                  subtotalMtmVsPb = item1.items.reduce((acc, curr) => acc + curr.mtm_vs_pb, 0);
                }
                  reporteFinal.push(...item1.items, {
                  campaña: 'Total',
                  underlying: '',
                  volumen: subtotalVolumen,
                  mes_entrega: '',
                  base_negociada: subtotalBaseNegociada,
                  mercado: subtotalMercado,
                  dif: subtotalDif,
                  mtm: subtotalMtm,
                  base_py: subtotalBasePy,
                  mtm_vs_pb: subtotalMtmVsPb,
                  espacio1: '',
                  mtm_10: subtotalMtm10,
                  mtm_20: subtotalMtm20,
                  mtm_30: subtotalMtm30,
                  id: null
                }, {
                  // Nueva fila agregada después de la sección del volumen
                  campaña: '',
                  underlying: '',
                  volumen: '',
                  mes_entrega: '',
                  base_negociada: '',
                  mercado: '',
                  dif: '',
                  mtm: '',
                  base_py: '',
                  mtm_vs_pb: '',
                  espacio1: '',
                  mtm_10: '',
                  mtm_20: '',
                  mtm_30: '',
                  id: null
                });
                // lastAgrupadoValue = currentValue;
              }
              lastAgrupadoValue = currentValue;
            }
          }

          for (let i = 0; i < reporteFinal.length; i++) {

            let item = reporteFinal[i];
            // let iReporte = reporteFinal.length;
            reporteExcel[contador]=new ReporteMTMExcel();
            // reporteFinal[contador] = new ReporteMTM();
            reporteExcel[contador].campaña = item.campaña;
            reporteExcel[contador].underlying = item.underlying;
            reporteExcel[contador].volumen = item.volumen;
            reporteExcel[contador].mes_entrega = item.mes_entrega;
            reporteExcel[contador].base_negociada = item.base_negociada;
            reporteExcel[contador].mercado = item.mercado;
            reporteExcel[contador].dif = item.dif;
            reporteExcel[contador].mtm = item.mtm;
            // reporteFinal[contador].espacio2 = item.espacio2;
            // reporteFinal[contador].espacio3 = item.espacio3;
            if ((reporteFinal[contador].underlying === 'Grano de Soya')) {
              reporteExcel[contador].base_py = '';
              reporteExcel[contador].mtm_vs_pb = '';
              reporteExcel[contador].espacio1 = item.espacio1;
              reporteExcel[contador].mtm_10 = '';
              reporteExcel[contador].mtm_20 = '';
              reporteExcel[contador].mtm_30 = '';
            } else {
              reporteExcel[contador].base_py = item.base_py;
              reporteExcel[contador].mtm_vs_pb = item.mtm_vs_pb;
              reporteExcel[contador].espacio1 = item.espacio1;
              reporteExcel[contador].mtm_10 = item.mtm_10;
              reporteExcel[contador].mtm_20 = item.mtm_20;
              reporteExcel[contador].mtm_30 = item.mtm_30;
              
            }

            reporteFinal[contador].id = null;

            contador += 1;
          }
          

          // let element = document.getElementById('myTable1');
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(reporteExcel);
          ws[1] = '';
          var wscols = [
            { wch: 17 }, { wch: 17 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
            { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 17 }, { wch: 17 }, { wch: 17 }];

          ws['!cols'] = wscols;
          ws['K1'] = "Prueba";
          ws['A1'].v = campaña;
          ws['B1'].v = underlying;
          ws['C1'].v = volumen;
          ws['D1'].v = mes_entrega;
          ws['E1'].v = base_negociada;
          ws['F1'].v = mercado;
          ws['G1'].v = dif;
          ws['H1'].v = mtm;
          ws['I1'].v = base_py;
          ws['J1'].v = mtm_vs_pb;
          ws['L1'].v = mtm_10;
          ws['M1'].v = mtm_20;
          ws['N1'].v = mtm_30;
          ws['O1'].v = '';

          
          let row_Totales:number;
          let row_Cabecera:number;
          let columnaDivisora:number
          row_Totales=0;
          row_Cabecera=0;
          columnaDivisora=0;
          for (const i in ws) {

            if (typeof(ws[i]) != "object") continue;
            let cell = XLSX.utils.decode_cell(i);
        
            ws[i].s = { // styling for all cells
                font: {
                    name: "arial",
                    sz: 10,
                    //bold: true,
                    //color: { rgb: "FFAA00" }
                },
               
            };
            
            if (ws[i].v=='Campaña') {
              row_Cabecera=cell.r;
            }
            
            if (row_Cabecera!=0 &&  ws[i].v=='' ) {
              columnaDivisora=cell.c;
            }

            if (ws[i].v=='Total') {
              row_Totales=cell.r;
            }

            if (row_Cabecera!=cell.r){
              row_Cabecera=0;
              columnaDivisora=0;
            }
            
            
            if (row_Totales!=cell.r){
                row_Totales=0;
            }

            if (row_Totales!=0){    
                ws[i].s= 
                      {border: {
                        top: { style: "thin", color: { auto: 1 } },
                        
                          },
                      font: {
                            bold: true,
                            },
                      //fill: { fgColor: { rgb: "#111111" }}
                      };    
                      ws[i].s.numFmt = "#,##0.00";
              }
              if (row_Cabecera!=0 && columnaDivisora==0){    
                ws[i].s= 
                      {
                        font: {
                          bold: true,
                          color: { rgb: "FFFFFF" }
                          },
                        fill: { fgColor: {rgb:"C80F1E" }}
                      };    
                      
              }
              if (row_Cabecera!=0 && cell.c>11){    
                ws[i].s= 
                      {
                        font: {
                          bold: true,
                          color: { rgb: "FFFFFF" }
                          },
                        fill: { fgColor: {rgb:"#000000" }}
                      };    
                      
              }

        }  
          

          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Detalle MTM');

          /* save to file */
          XLSX.writeFile(wb, "ReporteMTM_" + fechaConsulta + ".xlsx");
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No existe data para la fecha seleccionada',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  /************************************** LISTA DE DATOS EN LA TABLA DINAMICA **************************************/

  public fechaVigente: NgbDateStruct;
  public mtmMoliendaTotal: MtmMoliendaModelo[] = [];
  public baseMercadoMolienda: number = 0;
  public campaniaDato: Number[] = [];
  public underlyingDato: Number[] = [];

  public TMTotales: MtmMoliendaListaDuplicadosModelo[] = [];
  public TMTotal: Number[] = [];
  public TMAsignar: Number[] = [];
  public TMDiferencia: Number[] = [];
  public fechax: string = "";

  public fechaVigenteCampañaSubyacente() {
    let fechaT = new Date();
    fechaT.setHours(0, 0, 0, 0);
    let fechaCompara = new Date();
    fechaCompara.setHours(0, 0, 0, 0);
    let datePipe: DatePipe
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today.setDate(today.getDate() - 1));
    yesterday.setHours(0, 0, 0, 0);
    
    if (fechaT.getDay() === 1) {
      // si hoy es lunes cambiar al viernes
      fechaCompara.setDate(fechaCompara.getDate() - 3);
      this.fechaVigente = { day: fechaCompara.getDate(), month: fechaCompara.getMonth()+1, year: fechaCompara.getFullYear()};
      this.dateCompare = fechaCompara.toISOString().substring(0, 10);
    } else if (fechaT.getDay() === 0) {
      // si hoy es domingo cambiar al viernes
      fechaCompara.setDate(fechaCompara.getDate() - 2);
      this.fechaVigente = { day: fechaCompara.getDate(), month: fechaCompara.getMonth()+1, year: fechaCompara.getFullYear()};
      this.dateCompare = fechaCompara.toISOString().substring(0, 10);
    } else {
      // si hoy es sabado a martes cambiar al t-1
      fechaCompara.setDate(fechaCompara.getDate() - 1);
      this.fechaVigente = { day: fechaCompara.getDate(), month: fechaCompara.getMonth()+1, year: fechaCompara.getFullYear()};
      this.dateCompare = fechaCompara.toISOString().substring(0, 10);
    }
  }



  public volumentTotal: Number[] = [];
  public mtmTotal: Number[] = [];
  public mtmPbTotal: Number[] = [];
  public fechaDetalle: String = "";
  public isInputDisabled = false;
  public isButtonHidden = false;

  public listaMTMTotales() {

    this.fechax = this.dateToString(this.fechaVigente);
    const year = this.fechaVigente.year.toString().padStart(4, '0');
    const month = this.fechaVigente.month.toString().padStart(2, '0');
    const day = this.fechaVigente.day.toString().padStart(2, '0');
    const fechaSeleccionada = `${year}-${month}-${day}`;
    // this.mtmMoliendaTotal = [];
    const fechaCompara = new Date();
    fechaCompara.setHours(0, 0, 0, 0);
    fechaCompara.setDate(fechaCompara.getDate() - 1);
    const formatFechaCompara = fechaCompara.toISOString().substring(0, 10);

    
    if (fechaSeleccionada > this.dateCompare) {
      this.listaMtmMoliendaDuplicado = [];
      this.mtmMoliendaTotal = [];
      this.btnAgregar = true;
      this.isButtonHidden = true;
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'La fecha no puede ser mayor al dia de hoy',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    } else if (fechaSeleccionada < this.dateCompare) {
      this.btnAgregar = true;
      this.isInputDisabled = true;
      this.isButtonHidden = true;
      // this.mtmMoliendaTotal;
      this.calculoMTMMolienda.getMtmDetalleCampaniaSubyacente(Number(this.fechax)).subscribe(
        (response: MtmMoliendaModelo[]) => {
          if (response.length > 0) {
            this.mtmMoliendaTotal = response;
            let agrupadoMtmMoliendaTotal = response.reduce((acc, curr) => {
              const key = curr.id_campania + '_' + curr.id_underliying;
              if (!acc[key]) {
                acc[key] = {
                  id_campania: curr.id_campania,
                  id_underliying: curr.id_underliying,
                  campania: curr.campania,
                  underliying: curr.underliying,
                  valorSensibilidad: curr.t379_ValorSensibilidad,
                  t379_Volume: 0,
                  t379_MTM: 0,
                  t379_MTM_VS_PB: 0,
                  t379_MTM_10: 0,
                  t379_MTM_20: 0,
                  // t379_MTM_30: 0,
                  t379_MTM_30: curr.t379_ValorSensibilidad,
                  mtmMoliendaTotal: []
                };
              }
              acc[key].t379_Volume += curr.t379_Volume;
              acc[key].t379_MTM += curr.t379_MTM;
              acc[key].t379_MTM_VS_PB += curr.t379_MTM_VS_PB;
              acc[key].t379_MTM_10 += curr.t379_MTM_10;
              acc[key].t379_MTM_20 += curr.t379_MTM_20;
              acc[key].t379_MTM_30 += curr.t379_MTM_30;
              acc[key].mtmMoliendaTotal.push(curr);
              return acc;
            }, {});
            this.mtmMoliendaTotal = Object.values(agrupadoMtmMoliendaTotal);

            let sumaVolumenTotal = 0;
            let sumaMtmTotal = 0;
            let sumaTotalMtmBp = 0;
            let sumaTotalSensi_10 = 0;
            let sumaTotalSensi_20 = 0;
            let sumaTotalSensi_30 = 0;

            for (let [index, item] of this.mtmMoliendaTotal.entries()) {
              sumaVolumenTotal = item.t379_Volume;
              this.volumentTotal[index] = sumaVolumenTotal;

              sumaMtmTotal = item.t379_MTM;
              this.mtmTotal[index] = sumaMtmTotal;

              sumaTotalMtmBp = item.t379_MTM_VS_PB
              this.mtmPbTotal[index] = sumaTotalMtmBp;

              sumaTotalSensi_10 = item.t379_MTM_10;
              this.totalSensi_10[index] = sumaTotalSensi_10;

              sumaTotalSensi_20 = item.t379_MTM_20;
              this.totalSensi_20[index] = sumaTotalSensi_20;

              sumaTotalSensi_30 = item.t379_MTM_30;
              this.totalSensi_30[index] = sumaTotalSensi_30;

              if (item.id_underliying == 5) {
                this.baseNegociada[index] = 'BASE NEGOCIADA (c/li)';
                this.mercado[index] = 'MERCADO (c/li)';
                this.basePY[index] = 'BASE PY (c/li)';
                this.mtmVsPb[index] = 'MTM VS PY ($)';
                this.UMSensibilidad[index] = 'c/li';
                this.analisis1[index] = 'MTM($) - 400';
                this.analisis2[index] = 'MTM($) - 700';
                this.analisis3[index] = 'MTM($) -';
                // this.analisis31[index] = '1000';
                this.analisis31[index] =item.valorSensibilidad.toString()
              } else if (item.id_underliying == 11) {
                this.baseNegociada[index] = 'BASE NEGOCIADA ($/st)';
                this.mercado[index] = 'MERCADO ($/st)';
                this.basePY[index] = 'BASE PY ($/st)';
                this.mtmVsPb[index] = 'MTM VS PY ($)';
                this.UMSensibilidad[index] = '$/st';
                this.analisis1[index] = 'MTM($) - 10';
                this.analisis2[index] = 'MTM($) - 20';
                this.analisis3[index] = 'MTM($) -';
                // this.analisis31[index] ='30';
                this.analisis31[index] =item.valorSensibilidad.toString()
              } else if (item.id_underliying == 8) {
                this.baseNegociada[index] = 'FLAT NEGOCIADO ($/tm)';
                this.mercado[index] = 'MERCADO ($/tm)';
                this.basePY[index] = 'BASE PY ($/tm)';
                this.mtmVsPb[index] = 'MTM VS PY ($)';
                this.UMSensibilidad[index] = '$/tm';
                this.analisis1[index] = 'MTM($) - 200';
                this.analisis2[index] = 'MTM($) - 300';
                this.analisis3[index] = 'MTM($) -';
                // this.analisis31[index] = '400';
                this.analisis31[index] =item.valorSensibilidad.toString()
              } else if (item.id_underliying == 4) {
                this.baseNegociada[index] = 'BASE NEGOCIADA ($/st)';
                this.mercado[index] = 'MERCADO ($/st)';
                this.basePY[index] = 'BASE PY ($/st)';
                this.mtmVsPb[index] = 'MTM VS PY ($)';
                this.UMSensibilidad[index] = '$/st';
                this.analisis1[index] = 'MTM($) - 10';
                this.analisis2[index] = 'MTM($) - 20';
                this.analisis3[index] = 'MTM($) -';
                // this.analisis31[index] = '30';
                this.analisis31[index] =item.valorSensibilidad.toString()
              } else if (item.id_underliying == 3) {
                this.baseNegociada[index] = 'BASE NEGOCIADA ($/tm)';
                this.mercado[index] = 'MERCADO ($/tm)';
                this.basePY[index] = '-';
                this.mtmVsPb[index] = '-';
                this.UMSensibilidad[index] = '-';
                this.analisis1[index] = '-';
                this.analisis2[index] = '-';
                this.analisis3[index] = '-';
                this.analisis31[index] = '-';
              }
              else {
                this.baseNegociada[index] = 'BASE NEGOCIADA';
                this.mercado[index] = 'MERCADO';
                this.basePY[index] = 'BASE PY';
                this.mtmVsPb[index] = 'MTM VS PY';
                this.analisis1[index] = 'MTM($) - 10';
                this.analisis2[index] = 'MTM($) - 20';
                this.analisis3[index] = 'MTM($) -';
                // this.analisis31[index] = '30';
                this.analisis31[index] =item.valorSensibilidad.toString()
              }
            }
          } else {
            this.listaMtmMoliendaDuplicado = [];
            this.mtmMoliendaTotal = [];
          }
          this.cargarTotales();
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        });
        //this.cargarTotales();
    } else {
      this.btnAgregar = false;
      this.isInputDisabled = false;
      this.isButtonHidden = false;
      // this.mtmMoliendaTotal = [];
      this.calculoMTMMolienda.getMtmDetalleCampaniaSubyacente(Number(this.fechax)).subscribe(
        (response: MtmMoliendaModelo[]) => {
          if (response.length > 0) {
            this.mtmMoliendaTotal = response;
            let agrupadoMtmMoliendaTotal = response.reduce((acc, curr) => {
              const key = curr.id_campania + '_' + curr.id_underliying;
              if (!acc[key]) {
                acc[key] = {
                  id_campania: curr.id_campania,
                  id_underliying: curr.id_underliying,
                  campania: curr.campania,
                  underliying: curr.underliying,
                  valorSensibilidad: curr.t379_ValorSensibilidad,
                  t379_Volume: 0,
                  t379_MTM: 0,
                  t379_MTM_VS_PB: 0,
                  t379_MTM_10: 0,
                  t379_MTM_20: 0,
                  t379_MTM_30: 0,
                  mtmMoliendaTotal: []
                };
              }
              acc[key].t379_Volume += curr.t379_Volume;
              acc[key].t379_MTM += curr.t379_MTM;
              acc[key].t379_MTM_VS_PB += curr.t379_MTM_VS_PB;
              acc[key].t379_MTM_10 += curr.t379_MTM_10;
              acc[key].t379_MTM_20 += curr.t379_MTM_20;
              acc[key].t379_MTM_30 += curr.t379_MTM_30;
              acc[key].mtmMoliendaTotal.push(curr);
              return acc;
            }, {});
            this.mtmMoliendaTotal = Object.values(agrupadoMtmMoliendaTotal);

            let sumaVolumenTotal = 0;
            let sumaMtmTotal = 0;
            let sumaTotalMtmBp = 0;
            let sumaTotalSensi_10 = 0;
            let sumaTotalSensi_20 = 0;
            let sumaTotalSensi_30 = 0;

            for (let [index, item] of this.mtmMoliendaTotal.entries()) {
              sumaVolumenTotal = item.t379_Volume;
              this.volumentTotal[index] = sumaVolumenTotal;

              sumaMtmTotal = item.t379_MTM;
              this.mtmTotal[index] = sumaMtmTotal;

              sumaTotalMtmBp = item.t379_MTM_VS_PB
              this.mtmPbTotal[index] = sumaTotalMtmBp;

              sumaTotalSensi_10 = item.t379_MTM_10;
              this.totalSensi_10[index] = sumaTotalSensi_10;

              sumaTotalSensi_20 = item.t379_MTM_20;
              this.totalSensi_20[index] = sumaTotalSensi_20;

              sumaTotalSensi_30 = item.t379_MTM_30;
              this.totalSensi_30[index] = sumaTotalSensi_30;

              if (item.id_underliying == 5) {
                this.baseNegociada[index] = 'BASE NEGOCIADA (c/li)';
                this.mercado[index] = 'MERCADO (c/li)';
                this.basePY[index] = 'BASE PY (c/li)';
                this.mtmVsPb[index] = 'MTM VS PY ($)';
                this.UMSensibilidad[index] = 'c/li';
                this.analisis1[index] = 'MTM($) - 400';
                this.analisis2[index] = 'MTM($) - 700';
                this.analisis3[index] = 'MTM($) -';
                // this.analisis31[index] = '1000';
                this.analisis31[index] =item.valorSensibilidad.toString()
                this.listaMtmMoliendaDuplicado

              } else if (item.id_underliying == 11) {
                this.baseNegociada[index] = 'BASE NEGOCIADA ($/st)';
                this.mercado[index] = 'MERCADO ($/st)';
                this.basePY[index] = 'BASE PY ($/st)';
                this.mtmVsPb[index] = 'MTM VS PY ($)';
                this.UMSensibilidad[index] = '$/st';
                this.analisis1[index] = 'MTM($) - 10';
                this.analisis2[index] = 'MTM($) - 20';
                this.analisis3[index] = 'MTM($) -';
                // this.analisis31[index] = '30';
                this.analisis31[index] =item.valorSensibilidad.toString()
              } else if (item.id_underliying == 8) {
                this.baseNegociada[index] = 'FLAT NEGOCIADO ($/tm)';
                this.mercado[index] = 'MERCADO ($/tm)';
                this.basePY[index] = 'BASE PY ($/tm)';
                this.mtmVsPb[index] = 'MTM VS PY ($)';
                this.UMSensibilidad[index] = '$/tm';
                this.analisis1[index] = 'MTM($) - 200';
                this.analisis2[index] = 'MTM($) - 300';
                this.analisis3[index] = 'MTM($) -';
                // this.analisis31[index] = '400';
                this.analisis31[index] =item.valorSensibilidad.toString()
              } else if (item.id_underliying == 4) {
                this.baseNegociada[index] = 'BASE NEGOCIADA ($/st)';
                this.mercado[index] = 'MERCADO ($/st)';
                this.basePY[index] = 'BASE PY ($/st)';
                this.mtmVsPb[index] = 'MTM VS PY ($)';
                this.UMSensibilidad[index] = '$/st';
                this.analisis1[index] = 'MTM($) - 10';
                this.analisis2[index] = 'MTM($) - 20';
                this.analisis3[index] = 'MTM($) -';
                // this.analisis31[index] ='30';
                this.analisis31[index] =item.valorSensibilidad.toString()
              } else if (item.id_underliying == 3) {
                this.baseNegociada[index] = 'BASE NEGOCIADA ($/tm)';
                this.mercado[index] = 'MERCADO ($/tm)';
                this.basePY[index] = '-';
                this.mtmVsPb[index] = '-';
                this.UMSensibilidad[index] = '-';
                this.analisis1[index] = '-';
                this.analisis2[index] = '-';
                this.analisis3[index] = '-';
                this.analisis31[index] = '-';
              }
              else {
                this.baseNegociada[index] = 'BASE NEGOCIADA';
                this.mercado[index] = 'MERCADO';
                this.basePY[index] = 'BASE PY';
                this.mtmVsPb[index] = 'MTM VS PY';
                this.analisis1[index] = 'MTM($) - 10';
                this.analisis2[index] = 'MTM($) - 20';
                this.analisis3[index] = 'MTM($) -';
                // this.analisis31[index] ='30';
                this.analisis31[index] =item.valorSensibilidad.toString()
              }
            }
          } else {
            this.listaMtmMoliendaDuplicado = [];
            this.mtmMoliendaTotal = [];
          }
          this.cargarTotales();
        }, (error: HttpErrorResponse) => {
          alert(error.message);
        });
//      this.cargarTotales();
    }
  }

  public changeMtmFecha() {
    const fecha = new Date(this.fechaVigente.year, this.fechaVigente.month - 1, this.fechaVigente.day); // 22 de febrero de 2023
    fecha.setHours(0, 0, 0, 0);
    // const fecha = new Date(2023, 1, 25); // 22 de febrero de 2023
    if (this.esDiaLaboral(fecha)) {
      // console.log('La fecha es un día laboral');
      this.duplicado();
      this.listaMTMTotales();
      this.listarMtmtotalesAnteriores();
    } else {
      // console.log('La fecha no es un día laboral');
      this.btnAgregar = true;
      this.isButtonHidden = true;
      this.listaMtmMoliendaDuplicado.length = 0;
      this.mtmMoliendaTotal.length = 0;
    }
  }

  public listaMtmMoliendaDuplicado: MtmMoliendaListaDuplicadosModelo[] = [];
  public dateCompare: String = "";

  public duplicado() {

    let fechaComparando = new Date();
    fechaComparando.setHours(0, 0, 0, 0);
    // let fechaCompara = new Date();
    this.fechax = this.dateToString(this.fechaVigente);
    const year = this.fechaVigente.year.toString().padStart(4, '0');
    const month = this.fechaVigente.month.toString().padStart(2, '0');
    const day = this.fechaVigente.day.toString().padStart(2, '0');
    const fechaSeleccionada = `${year}-${month}-${day}`;
    let fecha = new Date(this.fechaVigente.year, this.fechaVigente.month - 1, this.fechaVigente.day);
    fecha.setHours(0, 0, 0, 0);
    if (!this.esDiaLaboral(fecha)) {
      // console.log('Es Fin de Semana');
    } else if (fechaComparando.getDay() === 1) {
      fechaComparando.setDate(fechaComparando.getDate() - 3);
      let formatFechaCompara = fechaComparando.toISOString().split('T')[0];//fechaComparando.toISOString().substring(0, 10);
      this.dateCompare = fechaComparando.toISOString().substring(0, 10)
      if (fechaSeleccionada > formatFechaCompara) {
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'La fecha no puede ser mayor al dia de hoy',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });
      } else if (fechaSeleccionada < formatFechaCompara) {
        // console.log('la fecha es menor a la de hoy');  
      } else {
        this.calculoMTMMolienda.getDatosDuplicadosMTM(Number(this.fechax)).subscribe(
          (response: MtmMoliendaListaDuplicadosModelo[]) => {
            this.listarMtmtotalesAnteriores();
            this.listaMTMTotales();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }
    } else if (fechaComparando.getDay() === 0) {
      fechaComparando.setDate(fechaComparando.getDate() - 2);
      let formatFechaCompara = fechaComparando.toISOString().split('T')[0];//fechaComparando.toISOString().substring(0, 10);
      this.dateCompare = fechaComparando.toISOString().substring(0, 10)
      if (fechaSeleccionada > formatFechaCompara) {
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'La fecha no puede ser mayor al dia de hoy',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });
      } else if (fechaSeleccionada < formatFechaCompara) {
        // console.log('la fecha es menor a la de hoy');  
      } else {
        this.calculoMTMMolienda.getDatosDuplicadosMTM(Number(this.fechax)).subscribe(
          (response: MtmMoliendaListaDuplicadosModelo[]) => {
            this.listarMtmtotalesAnteriores();
            this.listaMTMTotales();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }
    } else {
      fechaComparando.setDate(fechaComparando.getDate() - 1);
      let formatFechaCompara = fechaComparando.toISOString().substring(0, 10);
      this.dateCompare = fechaComparando.toISOString().substring(0, 10)
      if (fechaSeleccionada > formatFechaCompara) {
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'La fecha no puede ser mayor al dia de hoy',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });

      } else if (fechaSeleccionada < formatFechaCompara) {
        // console.log('la fecha es menor a la de hoy');  
      } else {
        this.calculoMTMMolienda.getDatosDuplicadosMTM(Number(this.fechax)).subscribe(
          (response: MtmMoliendaListaDuplicadosModelo[]) => {
            this.listarMtmtotalesAnteriores();
            this.listaMTMTotales();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }
    }
  }

  public listarMtmtotalesAnteriores() {
    this.fechax = this.dateToString(this.fechaVigente);
    // this.listaMtmMoliendaDuplicado = [];
    this.calculoMTMMolienda.getMtmMoliendaTotalesXFecha(Number(this.fechax)).subscribe(
      (response: MtmMoliendaListaDuplicadosModelo[]) => {
        this.listaMtmMoliendaDuplicado = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  public volumenPregunta = false;
  public volumenError = "";
  public sumaTotalVolumen(valoresDetalle, iTarjeta) {

    let sumaTotalVol: number = 0;
    let sumaTotalMTM: number = 0;

    for (let item of valoresDetalle) {
      sumaTotalVol += item.t379_Volume;
      this.volumentTotal[iTarjeta] = sumaTotalVol;
    }

    sumaTotalMTM = this.TMTotal[iTarjeta].valueOf();// - sumaTotalVol;
    this.TMDiferencia[iTarjeta] = sumaTotalMTM - sumaTotalVol;

    if (sumaTotalVol > sumaTotalMTM) {
      this.volumenPregunta = false; //cambiar 05-05
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'Aviso',
      //   text: 'La suma del volumen es mayor al total del MTM.',
      //   confirmButtonColor: '#0162e8',
      //   customClass: {
      //     container: 'my-swal'
      //   }
      // });
      // this.volumenError = 'La suma del volumen es mayor al total del MTM.';
      this.volumenError = '';
     } 
    //else if (sumaTotalVol < 0) {
    //   this.volumenPregunta = true;
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Aviso',
    //     text: 'La suma del volumen es menor a 0.',
    //     confirmButtonColor: '#0162e8',
    //     customClass: {
    //       container: 'my-swal'
    //     }
    //   });
    //   this.volumenError = 'La suma del volumen es menor a 0.';
    // } 
    else {
      this.volumenPregunta = false;
      this.volumenError = '';
    }
  }

  public mesEntregaValidacion: Boolean = false;
  public textoValidacion: string = "";
  /**************************************  GUARDAR MTM DETALLE **************************************/
  guardarMTM(index, elemento, tarjetaFila) {
    
    //if (this.volumenPregunta == true) {
      //console.log('no guardara')
    //} 
    //else {

      this.fechax = this.dateToString(this.fechaVigente);
      this.nuevoMTMMolienda = new MTMMoliendaDetalle();
      this.fechaDetalle = `${elemento['t379_MonthYear']}${'-01'}`

      let id = elemento['id_underliying'];
      if (id == undefined) {
        id = 0;
      }

      let factorMTM = elemento['t379_Factor'];
      // this.fecha = '2022/12/19;'
      if (elemento['t379_ID'] !== undefined) {
        this.nuevoMTMMolienda.t379_ID = elemento['t379_ID'];
      }


      
      this.nuevoMTMMolienda.t379_MTMTotales = elemento['t379_MTMTotales'];
      this.nuevoMTMMolienda.t379_DIF = (elemento['t379_Market'] - elemento['t379_Base']) * factorMTM;
      this.nuevoMTMMolienda.t379_MTM = Math.round(this.nuevoMTMMolienda.t379_DIF * elemento['t379_Volume']);
      this.nuevoMTMMolienda.t379_Volume = elemento['t379_Volume'];
      let fechaDetalleX = this.fechaDetalle.replace(/-/g, '');
      this.nuevoMTMMolienda.t379_Month = fechaDetalleX;
      this.nuevoMTMMolienda.t379_Base = elemento['t379_Base'];
      this.nuevoMTMMolienda.t379_Market = elemento['t379_Market'];
      this.nuevoMTMMolienda.t379_BasePY = elemento['t379_BasePY'];
      this.nuevoMTMMolienda.t379_ValorSensibilidad = elemento['t379_ValorSensibilidad'];

      if (elemento['id_underliying'] !== 3) {
        this.nuevoMTMMolienda.t379_MTM_VS_PB = Math.round(((elemento['t379_Market'] - elemento['t379_BasePY']) * factorMTM) * elemento['t379_Volume']);
      } else {
        this.nuevoMTMMolienda.t379_MTM_VS_PB = 0;
      }

      if (elemento['id_underliying'] == 5) {
        this.nuevoMTMMolienda.t379_MTM_10 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - 4) - elemento['t379_BasePY']) * factorMTM);
        this.nuevoMTMMolienda.t379_MTM_20 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - 7) - elemento['t379_BasePY']) * factorMTM);
        // this.nuevoMTMMolienda.t379_MTM_30 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - 10) - elemento['t379_BasePY']) * factorMTM);
        this.nuevoMTMMolienda.t379_MTM_30 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - elemento['t379_ValorSensibilidad']/100) - elemento['t379_BasePY']) * factorMTM);
      } else if (elemento['id_underliying'] == 8) {
        this.nuevoMTMMolienda.t379_MTM_10 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - 200) - elemento['t379_BasePY']) * factorMTM);
        this.nuevoMTMMolienda.t379_MTM_20 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - 300) - elemento['t379_BasePY']) * factorMTM);
        // this.nuevoMTMMolienda.t379_MTM_30 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - 400) - elemento['t379_BasePY']) * factorMTM);
        this.nuevoMTMMolienda.t379_MTM_30 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - elemento['t379_ValorSensibilidad']) - elemento['t379_BasePY']) * factorMTM);
      } else if (elemento['id_underliying'] == 3) {
        this.nuevoMTMMolienda.t379_MTM_10 = 0;
        this.nuevoMTMMolienda.t379_MTM_20 = 0;
        this.nuevoMTMMolienda.t379_MTM_30 = 0;
      }
      else {
        this.nuevoMTMMolienda.t379_MTM_10 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - 10) - elemento['t379_BasePY']) * factorMTM);
        this.nuevoMTMMolienda.t379_MTM_20 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - 20) - elemento['t379_BasePY']) * factorMTM);
        // this.nuevoMTMMolienda.t379_MTM_30 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] - 30) - elemento['t379_BasePY']) * factorMTM);
        this.nuevoMTMMolienda.t379_MTM_30 = Math.round(elemento['t379_Volume'] * ((elemento['t379_Market'] -  elemento['t379_ValorSensibilidad']) - elemento['t379_BasePY']) * factorMTM);
      }

      this.nuevoMTMMolienda.t379_Status = 1
      this.nuevoMTMMolienda.t379_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
      this.nuevoMTMMolienda.t379_ModifiedBy = this.portafolioMoliendaIFDService.usuario;
      // this.nuevoMTMMolienda.t379_Month = this.dateToString(elemento['mesMTM']);

      // let checked = [];
      this.checked = this.listaMtmMoliendaDuplicado.filter(i => (Number(i.s268_ID_TMTOTALES)) == Number(this.nuevoMTMMolienda.t379_MTMTotales));
      let añoValidacion = new Date(String(this.fechaDetalle));
      añoValidacion.setHours(0, 0, 0, 0);
      // console.log(index);
      if (this.checked[0].s268_TM_ACTUAL === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Por favor ingrese un valor en Volumen Total.',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });
        this.mesEntregaValidacion = true;
        this.textoValidacion = "Por favor ingrese un valor en Volumen Total.";
        console.log(this.textoValidacion);
      } else if (this.nuevoMTMMolienda.t379_Month == 'undefined01' || this.nuevoMTMMolienda.t379_Month == '01') {
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Por favor seleccione una fecha para el mes de entrega.',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });
        this.mesEntregaValidacion = true;
        this.textoValidacion = "Por favor seleccione una fecha para el mes de entrega.";
        console.log(this.textoValidacion);
      } else if ((añoValidacion.getFullYear()) < 2000 || (añoValidacion.getFullYear()) > 2100) {
        this.mesEntregaValidacion = true;
        this.textoValidacion = "Por favor ingrese un año valido.";
        console.log(this.textoValidacion);
      }
      else if (this.nuevoMTMMolienda.t379_Volume == 0 || this.nuevoMTMMolienda.t379_Volume == null) {
        if (!this.mesEntregaValidacion) {
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Por favor ingrese un valor en el campo volumen.',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
        }
        this.mesEntregaValidacion = true;
        this.textoValidacion = "Por favor ingrese un valor en el campo volumen.";
        console.log(this.textoValidacion);
      } else {
        this.calculoMTMMolienda.guardarMTMMolienda(this.nuevoMTMMolienda).subscribe(
          data => {

            this.mesEntregaValidacion = false;
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });

            Toast.fire({
              icon: 'success',
              title: 'Se registró el MTM correctamente'
            });
           //this.listaMTMTotales(); // solo para el volumen
           this.calculoMTMMolienda.getMtmMoliendaTotalesXFecha(Number(this.fechax)).subscribe(
            (response: MtmMoliendaListaDuplicadosModelo[]) => {
              this.listaMtmMoliendaDuplicado = response;
              this.TMTotal = [];
              this.TMAsignar = [];
              this.TMDiferencia = [];
              for (let obj of this.mtmMoliendaTotal) {
                this.checked = this.listaMtmMoliendaDuplicado.filter(i => (Number(i.s268_ID_CAMPANIA)) == Number(obj.id_campania) && (Number(i.s268_ID_UNDERLIYING)) == Number(obj.id_underliying));
                if (this.checked.length > 0) {
                  this.TMTotales.push(this.checked);
                  this.TMTotal.push(this.checked[0].s268_TM_ACTUAL);
                  this.TMAsignar.push(this.checked[0].s268_TM_ASIGNAR);
                  this.TMDiferencia.push(this.checked[0].s268_TM_DIFERENCIA);
                } else {
                  // console.log(this.TMTotales , ' - ', this.TMAsignar);
                }
              }
            }, (error: HttpErrorResponse) => {
              alert(error.message);
            });





          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
        // this.listaMTMTotales();
        // location.reload();
      }
      // }
      // (error: HttpErrorResponse) => {
      //   alert(error.message);
      // });
    //} // fin del else
  }

  /************************************** AGREGAR - QUITAR FILAS EN LA TABLA **************************************/
  dynamicArray: Array<MtmMoliendaModelo> = [];
  newDynamic: MtmMoliendaModelo;

  agregarFila(iCampania, iFila, elementoFila_, valores1, valores2, mtmMoliendaTotal) {
    
    
    
    this.baseMercadoMolienda = 0;
    this.newDynamic = new MtmMoliendaModelo();
    let ultimaFila: number;

    // const fecha = new Date(elementoFila.t379_Month);

    const fecha =new Date(mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1].t379_Month)
    
    fecha.setHours(0, 0, 0, 0);
    fecha.setMonth(fecha.getMonth() + 1);
    const fechaFormateada = fecha.toISOString().substring(0, 10);
    const fechaSinGuiones = fechaFormateada.replace(/-/g, '');
    ultimaFila = this.mtmMoliendaTotal[iCampania]?.mtmMoliendaTotal.length || 0;
    let fechaConsulta: string = this.dateToString(this.fechaVigente);
    // this.calculoMTMMolienda.getBaseMarketMtm(elementoFila.id_underliying, Number(fechaSinGuiones)).subscribe(
      this.calculoMTMMolienda.getBaseMarketMtm(mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1].id_underliying, Number(fechaSinGuiones),Number(fechaConsulta)).subscribe(
      (response: number) => {
        // let fechaMes = new Date(elementoFila.t379_MonthYear);
        let fechaMes = new Date(mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1].t379_MonthYear);
        fechaMes.setHours(0, 0, 0, 0);
        fechaMes.setMonth(fechaMes.getMonth() + 1);
        let fechaFormateadaMes = fecha.toISOString().substring(0, 7);

        this.baseMercadoMolienda = response;
        if (this.baseMercadoMolienda !== null) {
          // console.log(this.baseMercadoMolienda);

          // Valor por defecto
          this.newDynamic.t379_Volume = 0;
          this.newDynamic.t379_Base = 0;
          this.newDynamic.t379_Market = this.baseMercadoMolienda;
          this.newDynamic.t379_BasePY = 0;
          this.newDynamic.t379_MTM_10 = 0;
          this.newDynamic.t379_MTM_20 = 0;
          this.newDynamic.t379_MTM_30 = 0
          this.newDynamic.t379_ValorSensibilidad = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1].t379_ValorSensibilidad;
          this.mtmMoliendaTotal[iCampania].mtmMoliendaTotal;
          this.mtmMoliendaTotal[iCampania][ultimaFila] = new MtmMoliendaModelo();

          // if (elementoFila !== null) {
          if (mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal.length] !== null) {
            // this.newDynamic.t379_MTMTotales = elementoFila['t379_MTMTotales'];
            this.newDynamic.t379_MTMTotales = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1]['t379_MTMTotales'];
            this.newDynamic.t379_DIF = 0;
            this.newDynamic.t379_MTM = 0;
            this.newDynamic.t379_MTM_VS_PB = 0;
            this.newDynamic.t379_ValorSensibilidad =0;
            // this.newDynamic.t379_ValorSensibilidad = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1].t379_ValorSensibilidad;
            // this.newDynamic.id_underliying = elementoFila['id_underliying'];
            // this.newDynamic.id_campania = elementoFila['id_campania'];
            // this.newDynamic.t379_Factor = elementoFila['t379_Factor'];
            this.newDynamic.id_underliying = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1]['id_underliying'];
            this.newDynamic.id_campania = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1]['id_campania'];
            this.newDynamic.t379_Factor = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1]['t379_Factor'];
             

            this.newDynamic.t379_MonthYear = fechaFormateadaMes;// 'undefined';

            this.nuevoMTMMolienda = new MTMMoliendaDetalle();
            // this.nuevoMTMMolienda.t379_MTMTotales = elementoFila.t379_MTMTotales;
            this.nuevoMTMMolienda.t379_MTMTotales = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1].t379_MTMTotales;
            this.nuevoMTMMolienda.t379_Volume = 0;
            this.nuevoMTMMolienda.t379_Month = fechaSinGuiones;
            this.nuevoMTMMolienda.t379_Base = 0;
            this.nuevoMTMMolienda.t379_Market = this.baseMercadoMolienda;
            this.nuevoMTMMolienda.t379_DIF = 0;
            this.nuevoMTMMolienda.t379_MTM = 0;
            this.nuevoMTMMolienda.t379_BasePY = 0;
            this.nuevoMTMMolienda.t379_MTM_VS_PB = 0;
            this.nuevoMTMMolienda.t379_MTM_10 = 0;
            this.nuevoMTMMolienda.t379_MTM_20 = 0;
            this.nuevoMTMMolienda.t379_MTM_30 = 0;
            this.nuevoMTMMolienda.t379_ValorSensibilidad =mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal[iCampania].mtmMoliendaTotal.length-1].t379_ValorSensibilidad;
            this.nuevoMTMMolienda.t379_Status = 1;
            this.nuevoMTMMolienda.t379_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
            this.nuevoMTMMolienda.t379_ModifiedBy = this.portafolioMoliendaIFDService.usuario;
            this.calculoMTMMolienda.guardarMTMMolienda(this.nuevoMTMMolienda).subscribe(
              data => {
                this.listaMTMTotales();
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
          }
          this.dynamicArray.push(this.newDynamic);
          this.mtmMoliendaTotal[iCampania]?.mtmMoliendaTotal.push(this.newDynamic);
        } else {
          this.baseMercadoMolienda = 0;

          // Valor por defecto
          this.newDynamic.t379_Volume = 0;
          this.newDynamic.t379_Base = 0;
          this.newDynamic.t379_Market = this.baseMercadoMolienda;
          this.newDynamic.t379_BasePY = 0;
          this.mtmMoliendaTotal[iCampania].mtmMoliendaTotal;
          this.mtmMoliendaTotal[iCampania][ultimaFila] = new MtmMoliendaModelo();
          // if (elementoFila !== null) {
          if ( mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal.length-1] !== null) {
            // this.newDynamic.t379_MTMTotales = elementoFila['t379_MTMTotales'];
            this.newDynamic.t379_MTMTotales = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal.length-1]['t379_MTMTotales'];
            this.newDynamic.t379_DIF = 0;
            this.newDynamic.t379_MTM = 0;
            this.newDynamic.t379_MTM_VS_PB = 0;
            this.newDynamic.t379_MTM_30 =mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal.length-1].t379_ValorSensibilidad;
            // this.newDynamic.id_underliying = elementoFila['id_underliying'];
            // this.newDynamic.id_campania = elementoFila['id_campania'];
            // this.newDynamic.t379_Factor = elementoFila['t379_Factor'];
            this.newDynamic.id_underliying = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal.length-1]['id_underliying'];
            this.newDynamic.id_campania = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal.length-1]['id_campania'];
            this.newDynamic.t379_Factor = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal.length-1]['t379_Factor'];
            
            this.newDynamic.t379_MonthYear = fechaFormateadaMes;//'undefined';
            this.nuevoMTMMolienda = new MTMMoliendaDetalle();
            // this.nuevoMTMMolienda.t379_MTMTotales = elementoFila.t379_MTMTotales;
            this.nuevoMTMMolienda.t379_MTMTotales =  mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal.length-1].t379_MTMTotales;
            this.nuevoMTMMolienda.t379_Volume = 0;
            this.nuevoMTMMolienda.t379_Month = fechaSinGuiones;
            this.nuevoMTMMolienda.t379_Base = 0;
            this.nuevoMTMMolienda.t379_Market = 0;
            this.nuevoMTMMolienda.t379_DIF = 0;
            this.nuevoMTMMolienda.t379_MTM = 0;
            this.nuevoMTMMolienda.t379_BasePY = 0;
            this.nuevoMTMMolienda.t379_MTM_VS_PB = 0;
            this.nuevoMTMMolienda.t379_MTM_10 = 0;
            this.nuevoMTMMolienda.t379_MTM_20 = 0;
            this.nuevoMTMMolienda.t379_MTM_30 = 0;
            this.nuevoMTMMolienda.t379_ValorSensibilidad = mtmMoliendaTotal[iCampania].mtmMoliendaTotal[mtmMoliendaTotal.length-1].t379_ValorSensibilidad;
            this.nuevoMTMMolienda.t379_Status = 1;
            this.nuevoMTMMolienda.t379_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
            this.nuevoMTMMolienda.t379_ModifiedBy = this.portafolioMoliendaIFDService.usuario;

            this.calculoMTMMolienda.guardarMTMMolienda(this.nuevoMTMMolienda).subscribe(
              data => {
                this.listaMTMTotales();
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
          }
          this.dynamicArray.push(this.newDynamic);
          this.mtmMoliendaTotal[iCampania]?.mtmMoliendaTotal.push(this.newDynamic);
        }
      });
      

  }


  checked: any = []; //*
  public nuevoMtmMoliendaModelo: MtmMoliendaModelo;

  agregarTarjetaNueva() {

    this.flgModificar = true;
    let ultimaFila: number;
    this.nuevoMTMMoliendaTotales = new MTMMoliendaTotales();
    this.checked = this.listaMtmMoliendaDuplicado.filter(i => (Number(i.s268_ID_CAMPANIA)) == Number(this.selectedCampania) && (Number(i.s268_ID_UNDERLIYING)) == Number(this.selectedProducto));
    let fechaConsulta: string = this.dateToString(this.fechaVigente);
    
    if (this.selectedCampania.length == 0 || this.selectedProducto.length == 0) {
      this.flgModificar = false;
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Por favor seleccione los campos',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    } else {
      this.flgModificar = false;
      if ((this.underlyingDato.includes(Number(this.subyacenteSelected))) && (this.campaniaDato.includes(Number(this.selectedCampania)))) {
        // console.log('match');
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Ya existe la tarjeta de los campos seleccionados',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });
        this.flgModificar = false;
      } else if (this.checked.length > 0) {
        // console.log('match');
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Ya existe la tarjeta de los campos seleccionados',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });
        this.flgModificar = false;
      } else {
        this.nuevoMTMMoliendaTotales.t380_Underlying = Number(this.subyacenteSelected);
        this.nuevoMTMMoliendaTotales.t380_Campaign = Number(this.selectedCampania);
        this.nuevoMTMMoliendaTotales.t380_Date = Number(this.dateToString(this.fechaMTM));
        this.nuevoMTMMoliendaTotales.t380_TM = 0;
        this.nuevoMTMMoliendaTotales.t380_Status = 1;
        this.nuevoMTMMoliendaTotales.t380_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
        this.nuevoMTMMoliendaTotales.t380_ModifiedBy = this.portafolioMoliendaIFDService.usuario;

        this.calculoMTMMolienda.agregarMTMMoliendaTotales(this.nuevoMTMMoliendaTotales).subscribe(
          data => {
            this.nuevoMTMMoliendaTotales = data;
           
            this.calculoMTMMolienda.getBaseMarketMtm(Number(this.selectedProducto), Number( this.dateToString(this.fechaMTM)),Number(fechaConsulta)).subscribe(
              (response: number) => {
                 this.baseMercadoMolienda = response;
               
              


            //AGREGAR FILA NUEVA EN TABLA DETALLE
            this.nuevoMtmMoliendaModelo = new MtmMoliendaModelo();
            this.nuevoMtmMoliendaModelo.t379_MTMTotales = this.nuevoMTMMoliendaTotales.t380_ID;
            this.nuevoMtmMoliendaModelo.t379_Volume = 0;
            this.nuevoMtmMoliendaModelo.t379_Month = this.dateToString(this.fechaMTM);
            this.nuevoMtmMoliendaModelo.t379_Base = 0;
            this.nuevoMtmMoliendaModelo.t379_Market = this.baseMercadoMolienda;
            this.nuevoMtmMoliendaModelo.t379_DIF = 0;
            this.nuevoMtmMoliendaModelo.t379_MTM = 0;
            this.nuevoMtmMoliendaModelo.t379_BasePY = 0;
            this.nuevoMtmMoliendaModelo.t379_MTM_VS_PB = 0;
            this.nuevoMtmMoliendaModelo.t379_MTM_10 = 0;
            this.nuevoMtmMoliendaModelo.t379_MTM_20 = 0;
            this.nuevoMtmMoliendaModelo.t379_MTM_30 = 0;
            this.nuevoMtmMoliendaModelo.t379_Status = 1;
            this.nuevoMtmMoliendaModelo.t379_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
            this.nuevoMtmMoliendaModelo.t379_ModifiedBy = this.portafolioMoliendaIFDService.usuario;

            //GUARDAR DATOS INICIALES EN TABLA DETALLE
            this.nuevoMTMMolienda = new MTMMoliendaDetalle();
            this.nuevoMTMMolienda.t379_MTMTotales = this.nuevoMtmMoliendaModelo.t379_MTMTotales;
            this.nuevoMTMMolienda.t379_Volume = 0;
            this.nuevoMTMMolienda.t379_Month = this.nuevoMtmMoliendaModelo.t379_Month;
            this.nuevoMTMMolienda.t379_Base = 0;
            this.nuevoMTMMolienda.t379_Market = this.baseMercadoMolienda;
            this.nuevoMTMMolienda.t379_DIF = 0;
            this.nuevoMTMMolienda.t379_MTM = 0;
            this.nuevoMTMMolienda.t379_BasePY = 0;
            this.nuevoMTMMolienda.t379_MTM_VS_PB = 0;
            this.nuevoMTMMolienda.t379_MTM_10 = 0;
            this.nuevoMTMMolienda.t379_MTM_20 = 0;
            this.nuevoMTMMolienda.t379_MTM_30 = 0;
            this.nuevoMTMMolienda.t379_Status = 1;
            this.nuevoMTMMolienda.t379_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
            this.nuevoMTMMolienda.t379_ModifiedBy = this.portafolioMoliendaIFDService.usuario;
            this.calculoMTMMolienda.guardarMTMMolienda(this.nuevoMTMMolienda).subscribe(
              data => {
                //this.guardarRefrescarPagina()
                this.listaMTMTotales();
                this.selectedCampania = [];
                this.selectedProducto = [];
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });

            // AGREGAR NUEVA TARJETA
            ultimaFila = this.mtmMoliendaTotal.length;
            this.mtmMoliendaTotal[ultimaFila] = new MtmMoliendaModelo();
            // this.mtmMoliendaTotal[ultimaFila][0] = this.nuevoMtmMoliendaModelo; //*

            this.checked = this.campania.filter(i => (Number(i.s204_ID)) == Number(this.selectedCampania));
            this.mtmMoliendaTotal[ultimaFila].campania = (this.checked[0].s204_Description);

            this.checked = [];
            this.checked = this.productos.filter(i => (i.t001_ID) == Number(this.subyacenteSelected));
            this.mtmMoliendaTotal[ultimaFila].underliying = (this.checked[0].t001_Description);

            Swal.fire({
              icon: 'success',
              title: 'Registro MTM',
              text: 'Se agrego una nueva tarjeta',
              confirmButtonColor: '#0162e8'
            });
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }); //base
          });
      }
    }
  }

  quitarFila(tarjeta, posicionTarjeta, elementoTarjeta, lista) {

    
    let idMTMTotales: number = 0;
    if (lista.mtmMoliendaTotal.length === 1) {

      Swal.fire({
        icon: 'warning',
        title: 'Eliminar MTM',
        html: `Es el unico registro para el MTM seleccionado, si preciona continuar se eliminara el MTM para la <b>campaña:</b> ${elementoTarjeta.campania} y <b>subyacente:</b> ${elementoTarjeta.underliying}. <br> ¿Desea Continuar?`,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        confirmButtonColor: '#0162e8'
      }).then((result) => {
        idMTMTotales = elementoTarjeta.t379_MTMTotales;
        if (result.isConfirmed) {
          this.calculoMTMMolienda.getEliminarDetallePorMtmTotales(idMTMTotales).subscribe(
            data => {
              this.calculoMTMMolienda.getEliminarMTMMoliendaTotales(idMTMTotales).subscribe(
                data => {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Se elimino el MTM seleccionado en la base de datos',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {
                      container: 'my-swal',
                    }
                  });
                  // this.guardarRefrescarPagina()
                  this.listarMtmtotalesAnteriores();
                  this.listaMTMTotales();
                  
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }
      });
    } else {
      let idFila = elementoTarjeta['t379_ID'];
      if (idFila == undefined) {
        this.mtmMoliendaTotal[tarjeta]?.mtmMoliendaTotal.splice(posicionTarjeta, 1);
        Swal.fire({
          title: 'Fila Eliminada',
          html: 'Se eliminó la fila seleccionada',
          icon: 'success',
          confirmButtonColor: '#0162e8'
        });
      } else {
        Swal.fire({
          title: '¿Está seguro de eliminar el registro seleccionado?',
          // text: "No !",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          // reverseButtons: true,
          confirmButtonColor: '#0162e8'
        }).then((result) => {
          if (result.isConfirmed) {

            this.calculoMTMMolienda.eliminadoLogicoDetalle(idFila).subscribe(
              data => {
                Swal.fire(
                  'Registro Eliminado!',
                  'El registro ha sido eliminado exitosamente.',
                  'success'
                )
                this.listaMTMTotales();
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });

            this.mtmMoliendaTotal[tarjeta]?.mtmMoliendaTotal.splice(posicionTarjeta, 1);
            let suma = 0;
            for (let item of lista.mtmMoliendaTotal) {
              suma += item.t379_Volume;
              this.volumentTotal[posicionTarjeta] = suma - item.t379_Volume;
            }
          }
        });
      }
    }
    
  }

  /************************************** MODAL GUARDAR MTM MOLIENDA TOTAL **************************************/
  modalNuevoMTM(modalNuevoMTMTotales: any) {
    this.modalService.open(modalNuevoMTMTotales, { windowClass: "my-nuevoMTMTotales" });
    this.flgModificar = false;
    this.selectedCampania = [];
    this.selectedProducto = [];
  }

  public camposMtmMoliendaDuplicadoModelo: MtmMoliendaListaDuplicadosModelo;

  actualizarMTMTotalesActual(i, listaMtmTM) {

    this.camposMtmMoliendaDuplicadoModelo = new MtmMoliendaListaDuplicadosModelo();
    this.camposMtmMoliendaDuplicadoModelo.s268_ID_TMTOTALES = listaMtmTM['s268_ID_TMTOTALES'];
    this.camposMtmMoliendaDuplicadoModelo.s268_TM_ACTUAL = Number(listaMtmTM['s268_TM_ACTUAL']);
    this.camposMtmMoliendaDuplicadoModelo.s268_ID_CAMPANIA = listaMtmTM['s268_ID_CAMPANIA'];
    this.camposMtmMoliendaDuplicadoModelo.s268_ID_UNDERLIYING = listaMtmTM['s268_ID_UNDERLIYING'];

    this.calculoMTMMolienda.actualizarToneladasTotales(this.camposMtmMoliendaDuplicadoModelo).subscribe(
      data => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 900,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'success',
          title: 'Se modifico correctamente'
        });

        // ACTUALIZA TABLA TOTALES
        let i = 0;
        this.calculoMTMMolienda.getMtmMoliendaTotalesXFecha(Number(this.fechax)).subscribe(
          (response: MtmMoliendaListaDuplicadosModelo[]) => {
            this.listaMtmMoliendaDuplicado = response;
            this.TMTotales = this.TMTotales.map(objTotales => {
              const obj = this.listaMtmMoliendaDuplicado.find(obj => obj.s268_ID_CAMPANIA === objTotales.s268_ID_CAMPANIA && obj.s268_ID_UNDERLIYING === objTotales.s268_ID_UNDERLIYING);
              if (obj) {
                return {
                  ...objTotales,
                  s268_TM_ACTUAL: obj.s268_TM_ACTUAL,
                  s268_TM_DIFERENCIA: obj.s268_TM_DIFERENCIA
                };
              } else {
                return objTotales;
              }

            });

          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
        this.listaMTMTotales();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    // this.listaMTMTotales();
  }

  cargarTotales() {

    this.calculoMTMMolienda.getMtmMoliendaTotalesXFecha(Number(this.fechax)).subscribe(
      (response: MtmMoliendaListaDuplicadosModelo[]) => {
        this.listaMtmMoliendaDuplicado = response;
        this.TMTotal = [];
        this.TMAsignar = [];
        this.TMDiferencia = [];
        for (let obj of this.mtmMoliendaTotal) {
          this.checked = this.listaMtmMoliendaDuplicado.filter(i => (Number(i.s268_ID_CAMPANIA)) == Number(obj.id_campania) && (Number(i.s268_ID_UNDERLIYING)) == Number(obj.id_underliying));
          if (this.checked.length > 0) {
            this.TMTotales.push(this.checked);
            this.TMTotal.push(this.checked[0].s268_TM_ACTUAL);
            this.TMAsignar.push(this.checked[0].s268_TM_ASIGNAR);
            this.TMDiferencia.push(this.checked[0].s268_TM_DIFERENCIA);
          } else {
            // console.log(this.TMTotales , ' - ', this.TMAsignar);
          }
        }
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  public listaSimpleMtmDetalle: MtmMoliendaModelo[] = [];
  public listasModificadas: MtmMoliendaModelo[] = []
  public guardarMasivamente() {
    if (this.volumenPregunta == true) {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        html: `${this.volumenError}`,
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    } else if (this.mesEntregaValidacion == true) {
      // console.log('errores')
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        // text: 'Ya existe la tarjeta de los campos seleccionados',
        html: `${this.textoValidacion}`,
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    } else {
      this.listaSimpleMtmDetalle = [];
      let notificacionMostrada = false;
      let volumenValidacion = false;
      let fechaUndefined = false;
      let fechaRango = false;
      let listaMolienda = this.mtmMoliendaTotal.map(sublista => sublista.mtmMoliendaTotal).reduce((acc, lista) => acc.concat(lista), []);
      this.listaSimpleMtmDetalle.push(...listaMolienda);
      for (let listaDetalle of this.listaSimpleMtmDetalle) {
        this.calculoMTMMolienda.getMtmDetalleCampaniaSubyacente(Number(this.fechax)).subscribe(
          (responseDetalle: MtmMoliendaModelo[]) => {

            let filtroDetalle = responseDetalle.find(filtroDetalle => filtroDetalle.t379_MTMTotales === listaDetalle.t379_MTMTotales && filtroDetalle.t379_ID === listaDetalle.t379_ID && filtroDetalle.t379_ID === listaDetalle.t379_ID);

            if (filtroDetalle && filtroDetalle?.t379_Volume !== listaDetalle.t379_Volume || filtroDetalle?.t379_MonthYear !== listaDetalle.t379_MonthYear || filtroDetalle?.t379_Base !== listaDetalle.t379_Base || filtroDetalle?.t379_Market !== listaDetalle.t379_Market || filtroDetalle?.t379_BasePY !== listaDetalle.t379_BasePY) {
              if (listaDetalle['t379_ID'] !== undefined) {
                this.listasModificadas.push(listaDetalle);
                for (let itemDetalleModificado of this.listasModificadas) {
                  // console.log(itemDetalleModificado)
                  let añoValidacion = new Date(String(this.fechaDetalle));
                  añoValidacion.setHours(0, 0, 0, 0);

                  this.nuevoMTMMolienda = new MTMMoliendaDetalle();
                  this.fechaDetalle = `${itemDetalleModificado['t379_MonthYear']}${'-01'}`
                  let factorMTM = itemDetalleModificado['t379_Factor'];
                  if (itemDetalleModificado['t379_ID'] !== undefined) {
                    this.nuevoMTMMolienda.t379_ID = itemDetalleModificado['t379_ID'];
                  }
                  this.nuevoMTMMolienda.t379_MTMTotales = itemDetalleModificado['t379_MTMTotales'];
                  this.nuevoMTMMolienda.t379_DIF = (itemDetalleModificado['t379_Market'] - itemDetalleModificado['t379_Base']) * factorMTM;
                  this.nuevoMTMMolienda.t379_MTM = Math.round(this.nuevoMTMMolienda.t379_DIF * itemDetalleModificado['t379_Volume']);
                  this.nuevoMTMMolienda.t379_Volume = itemDetalleModificado['t379_Volume'];
                  let fechaDetalleX = this.fechaDetalle.replace(/-/g, '');
                  this.nuevoMTMMolienda.t379_Month = fechaDetalleX;
                  this.nuevoMTMMolienda.t379_Base = itemDetalleModificado['t379_Base'];
                  this.nuevoMTMMolienda.t379_Market = itemDetalleModificado['t379_Market'];
                  this.nuevoMTMMolienda.t379_BasePY = itemDetalleModificado['t379_BasePY'];
                  if (itemDetalleModificado['id_underliying'] !== 3) {
                    this.nuevoMTMMolienda.t379_MTM_VS_PB = Math.round(((itemDetalleModificado['t379_Market'] - itemDetalleModificado['t379_BasePY']) * factorMTM) * itemDetalleModificado['t379_Volume']);
                  } else {
                    this.nuevoMTMMolienda.t379_MTM_VS_PB = 0;
                  }

                  if (itemDetalleModificado['id_underliying'] == 5) {
                    this.nuevoMTMMolienda.t379_MTM_10 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - 4) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                    this.nuevoMTMMolienda.t379_MTM_20 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - 7) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                    // this.nuevoMTMMolienda.t379_MTM_30 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - 10) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                    this.nuevoMTMMolienda.t379_MTM_30 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - itemDetalleModificado['t379_ValorSensibilidad']/100) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                    

                  } else if (itemDetalleModificado['id_underliying'] == 8) {
                    this.nuevoMTMMolienda.t379_MTM_10 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - 200) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                    this.nuevoMTMMolienda.t379_MTM_20 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - 300) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                    // this.nuevoMTMMolienda.t379_MTM_30 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - 400) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                    this.nuevoMTMMolienda.t379_MTM_30 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] -  itemDetalleModificado['t379_ValorSensibilidad']) - itemDetalleModificado['t379_BasePY']) * factorMTM);

                  } else if (itemDetalleModificado['id_underliying'] == 3) {
                    this.nuevoMTMMolienda.t379_MTM_10 = 0;
                    this.nuevoMTMMolienda.t379_MTM_20 = 0;
                    this.nuevoMTMMolienda.t379_MTM_30 = 0;
                  } else {
                    this.nuevoMTMMolienda.t379_MTM_10 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - 10) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                    this.nuevoMTMMolienda.t379_MTM_20 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - 20) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                    // this.nuevoMTMMolienda.t379_MTM_30 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - 30) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                    this.nuevoMTMMolienda.t379_MTM_30 = Math.round(itemDetalleModificado['t379_Volume'] * ((itemDetalleModificado['t379_Market'] - itemDetalleModificado['t379_ValorSensibilidad']) - itemDetalleModificado['t379_BasePY']) * factorMTM);
                  }
                  this.nuevoMTMMolienda.t379_Status = 1
                  this.nuevoMTMMolienda.t379_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
                  this.nuevoMTMMolienda.t379_ModifiedBy = this.portafolioMoliendaIFDService.usuario;

                  this.calculoMTMMolienda.guardarMTMMolienda(this.nuevoMTMMolienda).subscribe(
                    data => {
                      if (!notificacionMostrada) {
                        const Toast = Swal.mixin({
                          toast: true,
                          position: 'top-end',
                          showConfirmButton: false,
                          timer: 1500,
                          timerProgressBar: true,
                          didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                          }
                        });
                        Toast.fire({
                          icon: 'success',
                          title: 'Se registró el MTM correctamente'
                        });
                        notificacionMostrada = true;
                      }
                      //guardar totales



                    });
                }
              } else { }
            } else {
              // console.log('Sin Cambios')
            }
          });
      }
    }
  }

  public eliminarMTMMolienda(posicion: number, elementos) {

    let idMTM: number = 0;

    Swal.fire({
      icon: 'warning',
      title: 'Eliminar MTM',
      html: `¿Seguro que desea eliminar el MTM para la <b>campaña:</b> ${elementos.s268_CAMPANIA} y <b>subyacente:</b> ${elementos.s268_UNDERLIYING}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#0162e8'
    }).then((result) => {
      idMTM = elementos.s268_ID_TMTOTALES;
      if (result.isConfirmed) {
        this.calculoMTMMolienda.getEliminarDetallePorMtmTotales(idMTM).subscribe(
          data => {
            this.calculoMTMMolienda.getEliminarMTMMoliendaTotales(idMTM).subscribe(
              data => {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Se elimino el MTM seleccionado en la base de datos',
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    container: 'my-swal',
                  }
                });
                this.listaMTMTotales();
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }
    });
  }

  public esDiaLaboral(fecha: Date): boolean {
    if (fecha.getDay() === 0) {
      // La fecha es un fin de semana
      return false;
    }
    return true;

  }

  public valorShock: number = 0;

  public shockSensibilidad(event: any, c, iCampania) {
    let valorShockEntrada: number = 0;
    valorShockEntrada = Number(event.target.value);
    let fila: number = 0;
    let sumaTotalSensi_30: number = 0;
    for (let item of c) {
      if (item['id_underliying'] == 5) {
        this.valorShock = Math.round(item['t379_Volume'] * ((item['t379_Market'] - (valorShockEntrada / 100)) - item['t379_BasePY']) * item['t379_Factor']);
        c[fila].t379_MTM_30 = this.valorShock;
        sumaTotalSensi_30 += item.t379_MTM_30;
        this.totalSensi_30[iCampania] = sumaTotalSensi_30;
      } else if (item['id_underliying'] == 8) {
        this.valorShock = Math.round(item['t379_Volume'] * ((item['t379_Market'] - valorShockEntrada) - item['t379_BasePY']) * item['t379_Factor']);
        c[fila].t379_MTM_30 = this.valorShock;
        sumaTotalSensi_30 += item.t379_MTM_30;
        this.totalSensi_30[iCampania] = sumaTotalSensi_30;
      } else {
        this.valorShock = Math.round(item['t379_Volume'] * ((item['t379_Market'] - valorShockEntrada) - item['t379_BasePY']) * item['t379_Factor']);
        c[fila].t379_MTM_30 = this.valorShock;
        sumaTotalSensi_30 += item.t379_MTM_30;
        this.totalSensi_30[iCampania] = sumaTotalSensi_30;
      }
      this.actualizarMtMSensibilidadShock(item.t379_MTM_30,item.id_underliying,Number(this.fechax),item.id_campania,item.t379_ID)
      
      fila += 1;
    }
    this.actualizarShockSensibilidad( valorShockEntrada, c[0].id_underliying, Number(this.fechax),c[0].id_campania);
  }

  public validacionValores(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    let currentValue = input.value;
    const key = event.key;
    const isMinusSign = key === '-';
    const hasMinusSign = currentValue.includes('-');

    if (isMinusSign && hasMinusSign) {
      event.preventDefault();
      return;
    }
    currentValue = currentValue.replace(/-{2,}/g, '-');
    if (currentValue.endsWith('--')) {
      currentValue = currentValue.slice(0, -1);
      input.value = currentValue;
      return;
    }
  }

  public calculosDetalle(elementoDetalle: MtmMoliendaModelo, tarjeta, elementosTarjeta) {

    elementoDetalle.t379_DIF = (elementoDetalle.t379_Market - elementoDetalle.t379_Base) * elementoDetalle.t379_Factor;
    elementoDetalle.t379_MTM = Math.round(elementoDetalle.t379_DIF * elementoDetalle.t379_Volume);
    if (elementoDetalle.id_underliying !== 3) {
      elementoDetalle.t379_MTM_VS_PB = Math.round(((elementoDetalle.t379_Market - elementoDetalle.t379_BasePY) * elementoDetalle.t379_Factor) * elementoDetalle.t379_Volume);
    } else {
      elementoDetalle.t379_MTM_VS_PB = 0;
    }
    if (elementoDetalle['id_underliying'] == 5) {
      elementoDetalle.t379_MTM_10 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - 4) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
      elementoDetalle.t379_MTM_20 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - 7) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
      // elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - 10) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
      elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - elementoDetalle['t379_ValorSensibilidad']/100) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
    
    } else if (elementoDetalle['id_underliying'] == 8) {
      elementoDetalle.t379_MTM_10 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - 200) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
      elementoDetalle.t379_MTM_20 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - 300) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
      // elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - 400) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
      elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - elementoDetalle['t379_ValorSensibilidad']) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
    } else if (elementoDetalle['id_underliying'] == 3) {
      elementoDetalle.t379_MTM_10 = 0;
      elementoDetalle.t379_MTM_20 = 0;
      elementoDetalle.t379_MTM_30 = 0;
    } else {
      elementoDetalle.t379_MTM_10 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - 10) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
      elementoDetalle.t379_MTM_20 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - 20) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
      // elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - 30) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
      elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((elementoDetalle['t379_Market'] - elementoDetalle['t379_ValorSensibilidad']) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
    }
    let sumaTotalMTM = 0;
    let sumaTotalMtmVsPB = 0;
    let sumaTotalSensibilidad1 = 0;
    let sumaTotalSensibilidad2 = 0;
    let sumaTotalSensibilidad3 = 0;
    for (let item of elementosTarjeta) {
      sumaTotalMTM += item.t379_MTM;
      sumaTotalMtmVsPB += item.t379_MTM_VS_PB
      sumaTotalSensibilidad1 += item.t379_MTM_10
      sumaTotalSensibilidad2 += item.t379_MTM_20
      sumaTotalSensibilidad3 += item.t379_MTM_30
      this.mtmTotal[tarjeta] = sumaTotalMTM;
      this.mtmPbTotal[tarjeta] = sumaTotalMtmVsPB;
      this.totalSensi_10[tarjeta] = sumaTotalSensibilidad1;
      this.totalSensi_20[tarjeta] = sumaTotalSensibilidad2;
      this.totalSensi_30[tarjeta] = sumaTotalSensibilidad3;
    }
  }

  baseMercado(elementoDetalle: MtmMoliendaModelo, tarjeta, elementosTarjeta) {

    if (elementoDetalle.t379_MonthYear !== '' && elementoDetalle.t379_BaseMarket !== 0) {
      // this.mesEntregaValidacion = true;
      this.baseMercadoMolienda = 0;
      let mesContrato=elementoDetalle.t379_MonthYear.replace('-','')
      let fechaConsulta: string = this.dateToString(this.fechaVigente);

      // let mesContrato = new Date(elementoDetalle.t379_MonthYear);
      // mesContrato.setHours(0, 0, 0, 0);
      // const mesContratoFormateada = mesContrato.toISOString().substring(0, 10);
      // const mesContratoSinGuiones = mesContratoFormateada.replace(/-/g, '');
      this.calculoMTMMolienda.getBaseMarketMtm(elementoDetalle.id_underliying, Number(mesContrato),Number(fechaConsulta)).subscribe(
        (response: number) => {
          this.baseMercadoMolienda = response;
          elementoDetalle.t379_Market = this.baseMercadoMolienda;

          elementoDetalle.t379_DIF = (elementoDetalle.t379_Market - elementoDetalle.t379_Base) * elementoDetalle.t379_Factor;
          elementoDetalle.t379_MTM = Math.round(elementoDetalle.t379_DIF * elementoDetalle.t379_Volume);
          if (elementoDetalle.id_underliying !== 3) {
            elementoDetalle.t379_MTM_VS_PB = Math.round(((elementoDetalle.t379_Market - elementoDetalle.t379_BasePY) * elementoDetalle.t379_Factor) * elementoDetalle.t379_Volume);
          } else {
            elementoDetalle.t379_MTM_VS_PB = 0;
          }
          if (elementoDetalle['id_underliying'] == 5) {
            elementoDetalle.t379_MTM_10 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - 4) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
            elementoDetalle.t379_MTM_20 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - 7) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
            // elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - 10) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
            elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - elementoDetalle['t379_ValorSensibilidad']/100) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);

          } else if (elementoDetalle['id_underliying'] == 8) {
            elementoDetalle.t379_MTM_10 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - 200) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
            elementoDetalle.t379_MTM_20 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - 300) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
            // elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - 400) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
            elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda -  elementoDetalle['t379_ValorSensibilidad']) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
          } else if (elementoDetalle['id_underliying'] == 3) {
            elementoDetalle.t379_MTM_10 = 0;
            elementoDetalle.t379_MTM_20 = 0;
            elementoDetalle.t379_MTM_30 = 0;
          } else {
            elementoDetalle.t379_MTM_10 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - 10) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
            elementoDetalle.t379_MTM_20 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - 20) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
            // elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - 30) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
            elementoDetalle.t379_MTM_30 = Math.round(elementoDetalle['t379_Volume'] * ((this.baseMercadoMolienda - elementoDetalle['t379_ValorSensibilidad']) - elementoDetalle['t379_BasePY']) * elementoDetalle.t379_Factor);
          }
          let sumaTotalMTM = 0;
          let sumaTotalMtmVsPB = 0;
          let sumaTotalSensibilidad1 = 0;
          let sumaTotalSensibilidad2 = 0;
          let sumaTotalSensibilidad3 = 0;
          for (let item of elementosTarjeta) {
            sumaTotalMTM += item.t379_MTM;
            sumaTotalMtmVsPB += item.t379_MTM_VS_PB
            sumaTotalSensibilidad1 += item.t379_MTM_10
            sumaTotalSensibilidad2 += item.t379_MTM_20
            sumaTotalSensibilidad3 += item.t379_MTM_30
            this.mtmTotal[tarjeta] = sumaTotalMTM;
            this.mtmPbTotal[tarjeta] = sumaTotalMtmVsPB;
            this.totalSensi_10[tarjeta] = sumaTotalSensibilidad1;
            this.totalSensi_20[tarjeta] = sumaTotalSensibilidad2;
            this.totalSensi_30[tarjeta] = sumaTotalSensibilidad3;
          }
          this.guardarMTM(null, elementoDetalle, null);
        });
    } else {
      this.baseMercadoMolienda = 0;
      // elementoDetalle.t379_Market = this.baseMercadoMolienda;
      this.guardarMTM(null, elementoDetalle, null);
    }
  }
  actualizarShockSensibilidad(valor:number, underlying:number, fechaVigente:number, campanha:number ){
    let notificacionMostrada = false;

    const year = this.fechaVigente.year.toString().padStart(4, '0');
    const month = this.fechaVigente.month.toString().padStart(2, '0');
    const day = this.fechaVigente.day.toString().padStart(2, '0');
    const fechaSeleccionada = `${year}-${month}-${day}`;

    if (fechaSeleccionada == this.dateCompare) {

      this.calculoMTMMolienda.actualizarShockSensibilidad(valor, underlying, fechaVigente,campanha).subscribe(
        data => {
          if (!notificacionMostrada) {
             //this.guardarRefrescarPagina()
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });
            Toast.fire({
              icon: 'success',
              title: 'Se registró el MTM correctamente'
            });
            notificacionMostrada = true;
            
            for (let i = 0; i < this.mtmMoliendaTotal.length; i++) {
              if (this.mtmMoliendaTotal[i].id_campania === campanha  &&  this.mtmMoliendaTotal[i].id_underliying===underlying )
              {
                  this.mtmMoliendaTotal[i].valorSensibilidad=valor
                  for (let j = 0; i < this.mtmMoliendaTotal[i].mtmMoliendaTotal.length; j++) {
                    this.mtmMoliendaTotal[i].mtmMoliendaTotal[j].t379_ValorSensibilidad=valor;

                  }
              }
            }


          }
          //guardar totales
        });
    }
  }

  public guardarRefrescarPagina() {
    
    const year = this.fechaVigente.year.toString().padStart(4, '0');
    const month = this.fechaVigente.month.toString().padStart(2, '0');
    const day = this.fechaVigente.day.toString().padStart(2, '0');
    const fechaSeleccionada = `${year}-${month}-${day}`;

    if (fechaSeleccionada == this.dateCompare) {
    
      if (this.volumenPregunta == true) {
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          html: `${this.volumenError}`,
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });
      } else if (this.mesEntregaValidacion == true) {
        // console.log('errores')
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          // text: 'Ya existe la tarjeta de los campos seleccionados',
          html: `${this.textoValidacion}`,
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });
      } else {
        this.listaSimpleMtmDetalle = [];
        let notificacionMostrada = false;
        
        let listaMolienda = this.mtmMoliendaTotal.map(sublista => sublista.mtmMoliendaTotal).reduce((acc, lista) => acc.concat(lista), []);
        this.listaSimpleMtmDetalle.push(...listaMolienda);
        this.listaMtMMolienda=new MTMMolienda
        this.listaMtMMolienda.listaDetalleMtM=this.listaSimpleMtmDetalle
        this.listaMtMMolienda.listaTMTotal=this.TMTotales
        
        // this.calculoMTMMolienda.actualizarShockSensibilidad(900,4, 20230404).subscribe(
        //   data => {
        //     if (!notificacionMostrada) {
        //       const Toast = Swal.mixin({
        //         toast: true,
        //         position: 'top-end',
        //         showConfirmButton: false,
        //         timer: 1500,
        //         timerProgressBar: true,
        //         didOpen: (toast) => {
        //           toast.addEventListener('mouseenter', Swal.stopTimer)
        //           toast.addEventListener('mouseleave', Swal.resumeTimer)
        //         }
        //       });
        //       Toast.fire({
        //         icon: 'success',
        //         title: 'Se registró el MTM correctamente'
        //       });
        //       notificacionMostrada = true;
        //     }
        //     //guardar totales
        //   });

        
        for (let i = 0; i < this.listaSimpleMtmDetalle.length; i++) {

          this.checked=this.mtmMoliendaTotal.find(obj => obj.id_campania === this.listaSimpleMtmDetalle[i].id_campania  && 
                                                  obj.id_underliying===this.listaSimpleMtmDetalle[i].id_underliying );
          this.listaSimpleMtmDetalle[i].t379_ValorSensibilidad=this.checked.valorSensibilidad
            

        }

        this.calculoMTMMolienda.guardarRefrescarPagina(this.listaSimpleMtmDetalle).subscribe(
                      data => {
                        if (!notificacionMostrada) {
                          const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                              toast.addEventListener('mouseenter', Swal.stopTimer)
                              toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                          });
                          Toast.fire({
                            icon: 'success',
                            title: 'Se registró el MTM correctamente'
                          });
                          notificacionMostrada = true;
                        }
                        //guardar totales
                      });
        }
      }

    }
    actualizarMtMSensibilidadShock(valor:number, underlying:number, fechaVigente:number, campanha:number, id:number ){
      let notificacionMostrada = false;
  
      const year = this.fechaVigente.year.toString().padStart(4, '0');
      const month = this.fechaVigente.month.toString().padStart(2, '0');
      const day = this.fechaVigente.day.toString().padStart(2, '0');
      const fechaSeleccionada = `${year}-${month}-${day}`;
  
      if (fechaSeleccionada == this.dateCompare) {
  
        this.calculoMTMMolienda.actualizarMtMSensibilidadShock(valor, underlying, fechaVigente,campanha,id).subscribe(
          data => {
            
            //guardar totales
          });
      }
    }
    ngOnDestroy() {
      clearInterval(Number(this.dateCompare));
    //  this.Refrescar.unsubscribe();
  }
  }

