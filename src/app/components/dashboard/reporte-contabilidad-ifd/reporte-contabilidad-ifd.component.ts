import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { ReporteContabilidad } from 'src/app/models/IFD/reporteContabilidad';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-reporte-contabilidad-ifd',
  templateUrl: './reporte-contabilidad-ifd.component.html',
  styleUrls: ['./reporte-contabilidad-ifd.component.scss']
})
export class ReporteContabilidadIfdComponent implements OnInit {
  
  dataSource: MatTableDataSource<ReporteContabilidad>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  selected = new FormControl(0);
  
  public idSubyacente: number;
  public listaEstado:cargaCombo[];
  public listaSubyacente: cargaCombo[];
  public strFecReporte: string = "";
  public fec_reporte = new Date();
  public fechasPermitidas;
  public listReporteContabilidadLiquidados: ReporteContabilidad[] = [];
  public listReporteContabilidadTomados: ReporteContabilidad[] = [];
  public listReporteContabilidadVigentes: ReporteContabilidad[] = [];

  displayedColumns: string[] = [
    'id_Operacion',
    'estado_Operacion',
    'underlying',
    'product',
    'estrategia',
    'tipo_Cobertura',
    'strike',
    'status_Cobertura',
    'broker',
    'ref',
    'expiration',
    'quantity',
    'tm',
    'trade_Date',
    'mtm_Activo',
    'mtm_Pasivo',
    'status_Operation',
    'fecha_Liquidacion',
    'settlement',
    'option_USD',
    'spot_Cierre',
    'prima_Pagada',
    'prima_Recibida',
    'com_CRM',
    'prima_MTM',
    'mmPP',
    'tipo_Trigo',
    'fecha_Estimada_Embarque',
    'fecha_Estimada_Llegada',
    'semestre',
    'papeleta',
    'exceso_Rango_Delta_P2',
  ];

  constructor(
    private portafolioMoliendaService: PortafolioMoliendaService,
    private portafolioIFDMoliendaService: PortafolioIFDMoliendaService
  ) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel="Registros por Página";
    this.strFecReporte = this.dateToString(this.fec_reporte);
    this.llenarCombos();
    this.validarFechasHabiles();
  }

  public dateToString = ((date) => {
    if(date.getDate()<10 && (date.getMonth() + 1)<10){
      return `${date.getFullYear()}-0${(date.getMonth() + 1)}-0${date.getDate()}`.toString();
    }else if (date.getDate()<10 ){
      return `${date.getFullYear()}-${(date.getMonth() + 1)}-0${date.getDate()}`.toString();
    }else if ((date.getMonth() + 1)<10){
      return `${date.getFullYear()}-0${(date.getMonth() + 1)}-${date.getDate()}`.toString();
    }else{
      return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`.toString();
    }
  });

  public llenarCombos(): void {
    this.portafolioMoliendaService.getCombo("underlying_ReporteContaIFD").subscribe(
      (response: cargaCombo[]) => {
        this.listaSubyacente = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

    this.portafolioMoliendaService.getCombo("estado_ReporteContaIFD").subscribe(
      (response: cargaCombo[]) => {
        this.listaEstado = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  validarFechasHabiles(){
    this.fechasPermitidas = (d: Date | null): boolean => {
      const day = (d || new Date());
      const fechaHoy = new Date();
      fechaHoy.setHours(0,0,0,0);
      day.setHours(0,0,0,0);
      return ![0,6].includes(day.getDay()) && day <= fechaHoy;
    };
  }

  setFechaReporte(date){
    let posicion=date.indexOf("/",1)
    let posicion2=date.indexOf( "/",posicion+1)

    let pMes=date.substring(0,posicion)
    let pDia=date.substring(posicion+1, posicion2)
    let pAnho=date.substring(posicion2+1)

    this.fec_reporte =  new Date(pAnho, pMes - 1, pDia);
    this.fec_reporte.setHours(0,0,0,0);
    this.strFecReporte = this.dateToString(this.fec_reporte);
  }

  descargarExcel(){
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    var dataTomadosExcel = this.listReporteContabilidadTomados.map(obj => {
      const newObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        newObj[key.toUpperCase().replace(/_/g, ' ')] = value;
      }
      return newObj;
    });

    var dataLiquidadosExcel = this.listReporteContabilidadLiquidados.map(obj => {
      const newObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        newObj[key.toUpperCase().replace(/_/g, ' ')] = value;
      }
      return newObj;
    });

    var dataVigentesExcel = this.listReporteContabilidadVigentes.map(obj => {
      const newObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        newObj[key.toUpperCase().replace(/_/g, ' ')] = value;
      }
      return newObj;
    });

    const wsTomados: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataTomadosExcel);
    const wsLiquidados: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataLiquidadosExcel);
    const wsVigentes: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataVigentesExcel);
    XLSX.utils.book_append_sheet(wb, wsTomados, 'Tomados');
    XLSX.utils.book_append_sheet(wb, wsLiquidados, 'Liquidados');
    XLSX.utils.book_append_sheet(wb, wsVigentes, 'Vigentes');
    var subyacenteNombreArchivo = /\((.*?)\)/.exec(this.listaSubyacente.filter(e => e.s204_ID == this.idSubyacente.toString())[0].s204_Description);
    var fechaNombreArchivo = this.convertirFechaNombreArchivo(this.strFecReporte);
    XLSX.writeFile(wb, `Delta Hedge - ${subyacenteNombreArchivo ? subyacenteNombreArchivo[1]: null} Var. MTM al ${fechaNombreArchivo}.xlsx`);
  }

  convertirFechaNombreArchivo(fechaString: string): string {
    // Parsea la cadena de fecha
    const fecha = new Date(fechaString + 'T00:00:00'); // Agregamos la hora para evitar problemas de zona horaria
    
    // Obtiene los componentes de la fecha
    const dia = fecha.getUTCDate(); // Usamos getUTCDate() para obtener el día en UTC
    const mes = fecha.getUTCMonth() + 1; // Suma 1 al mes
    const año = fecha.getUTCFullYear() % 100; // Obtiene los últimos dos dígitos del año

    // Formatea la fecha según el formato dd.mm.yy
    const fechaFormateada = `${dia.toString().padStart(2, '0')}.${mes.toString().padStart(2, '0')}.${año.toString().padStart(2, '0')}`;

    return fechaFormateada;
  }

  selectedTabChange(event: any){
    console.log("Tab: ", event.tab.textLabel.toString());
    switch(event.tab.textLabel.toString()){
      case 'Tomados':
        this.dataSource = new MatTableDataSource(this.listReporteContabilidadTomados);
        this.dataSource.paginator = this.paginator;
        break;
      case 'Liquidados':
        this.dataSource = new MatTableDataSource(this.listReporteContabilidadLiquidados);
        this.dataSource.paginator = this.paginator;
        break;
      case 'Vigentes':
        this.dataSource = new MatTableDataSource(this.listReporteContabilidadVigentes);
        this.dataSource.paginator = this.paginator;
        break;
    }
  }

  consultarReporte(){
    this.portafolioIFDMoliendaService.getReportesContabilidad(Number(this.strFecReporte.replace(/-/g, '')), this.idSubyacente).subscribe(
      (response: Array<Array<ReporteContabilidad>>) => {
        this.listReporteContabilidadTomados = response[0];
        this.listReporteContabilidadLiquidados = response[1];        
        this.listReporteContabilidadVigentes = response[2];
        this.dataSource = new MatTableDataSource(response[this.selected.value]);
        this.dataSource.paginator = this.paginator;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Consulta exitosa.',
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#4b822d'
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}
