import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MTMInstrumentoHistorico } from 'src/app/models/Tesoreria/mtmInstrumentoHistorico';
import { Pais } from 'src/app/models/Tesoreria/pais';
import { Subsidiaria } from 'src/app/models/Tesoreria/subsidiaria';
import { TesoreriaService } from 'src/app/models/Tesoreria/tesoreria.service';
import { TipoCobertura } from 'src/app/models/Tesoreria/tipoCobertura';
import { TipoInstrumento } from 'src/app/models/Tesoreria/tipoInstrumento';
//import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-valorizacion-derivados',
  templateUrl: './valorizacion-derivados.component.html',
  styleUrls: ['./valorizacion-derivados.component.scss']
})
export class ValorizacionDerivadosComponent implements OnInit {
  public tituloTabla: string="Valorización de Derivados";
  public fec_ini = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
  public strFecIni: string = "";
  public listMTMInstrumentoHistorico: MTMInstrumentoHistorico[] = [];
  public listPais;
  public idPaisSeleccionado;
  public listSubsidiarias: Subsidiaria[] = [];
  public idSubsidiariaSeleccionada;
  public listTipoCobertura;
  public idTipoCoberturaSeleccionado;
  public listTipoInstrumento;
  public idTipoInstrumentoSeleccionado;

  public totalMTM: number = 0;

  @ViewChild('picker') picker: MatDatepicker<Date>;
  @ViewChild('picker1') picker1: MatDatepicker<Date>;

  dataSource: MatTableDataSource<MTMInstrumentoHistorico>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('dsSort') dsSort!: MatSort;
  displayedColumns: string[] = [
    't467_date',
    'cod_ci',
    't467_mtm_rec',
    't467_mtm_del'
  ];

  constructor(private tesoreriaService: TesoreriaService) { }

  ngOnInit(): void {
    //filtros
    this.strFecIni = this.dateToString(this.fec_ini);
    this.obtenerPaises();
    this.obtenerSubsidiarias();
    this.obtenerTipoCobertura();
    this.obtenerTipoInstrumento();
    //tabla
    this.obtenerMtmInstrumentoHistorico();
  }

  obtenerPaises(){
    this.tesoreriaService.getListaPaisesConSubsidiaria().subscribe(
      (response: Pais[]) => {
        this.listPais = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  obtenerSubsidiarias(){
    this.tesoreriaService.getListaSubsidiarias().subscribe(
      (response: Subsidiaria[]) => {
        this.listSubsidiarias = response.filter(e => e.t453Status);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  obtenerTipoCobertura(){
    this.tesoreriaService.getListaTipoCobertura().subscribe(
      (response: TipoCobertura[]) => {
        this.listTipoCobertura = response.filter(e => e.t447Status = true);
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }

  obtenerTipoInstrumento(){
    this.tesoreriaService.getListaTipoInstrumento().subscribe(
      (response: TipoInstrumento[]) => {
        this.listTipoInstrumento = response;
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }

  onSelectPais(pais){
    this.idPaisSeleccionado = pais;
    console.log("pais seleccionado: ", this.idPaisSeleccionado);
    this.aplicarFiltros();
  }

  onSelectSubsidiaria(subsidiaria){
    this.idSubsidiariaSeleccionada = subsidiaria;
    console.log("subsidiaria seleccionada: ", this.idSubsidiariaSeleccionada);
    this.aplicarFiltros();
    
  }

  onSelectTipoCobertura(tipoCobertura){
    this.idTipoCoberturaSeleccionado = tipoCobertura
    console.log("tipo cobertura seleccionado: ", this.idTipoCoberturaSeleccionado);
    this.aplicarFiltros();
  }

  onSelectTipoInstrumento(tipoInstrumento){
    this.idTipoInstrumentoSeleccionado = tipoInstrumento;
    console.log("tipo instrumento seleccionado: ", this.idTipoInstrumentoSeleccionado);
    this.aplicarFiltros();
  }

  aplicarFiltros(){
    this.dataSource.filterPredicate = (data : MTMInstrumentoHistorico, filter) => {
      return ((this.idPaisSeleccionado && this.idPaisSeleccionado.length > 0) ? this.idPaisSeleccionado.includes(data.t018_code_alpha2) : data.t018_code_alpha2 == data.t018_code_alpha2)
      && ((this.idSubsidiariaSeleccionada && this.idSubsidiariaSeleccionada.length > 0) ? this.idSubsidiariaSeleccionada.includes(data.t463_id_subsidiary.toString()) : data.t463_id_subsidiary == data.t463_id_subsidiary)
      && ((this.idTipoCoberturaSeleccionado && this.idTipoCoberturaSeleccionado.length > 0) ? this.idTipoCoberturaSeleccionado.includes(data.t463_id_coverage_type.toString())  : data.t463_id_coverage_type == data.t463_id_coverage_type)
      && ((this.idTipoInstrumentoSeleccionado && this.idTipoInstrumentoSeleccionado.length > 0) ? this.idTipoInstrumentoSeleccionado.includes(data.t463_type_ci) : data.t463_type_ci == data.t463_type_ci);
    };
    this.dataSource.filter = "filtro";

    this.totalMTM = this.dataSource.filteredData.length > 0 ? this.dataSource.filteredData.map(e => e.mtm_rec_conv).reduce(function(a, b){return a + b}) : 0;
  }

  obtenerMtmInstrumentoHistorico(){
    this.tesoreriaService.getListMtmInstrumentoHistorico(this.strFecIni).subscribe(
      (response: MTMInstrumentoHistorico[]) => {
        this.listMTMInstrumentoHistorico = response;
        this.dataSource = new MatTableDataSource(this.listMTMInstrumentoHistorico);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.dsSort;
        this.aplicarFiltros();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public dateToString = ((date) => {
    if(date.day<10 && date.month<10){
      return `${date.year}-0${date.month}-0${date.day}`.toString();
    }else if (date.day<10 ){
      return `${date.year}-${date.month}-0${date.day}`.toString();
    }else if (date.month<10){
      return `${date.year}-0${date.month}-${date.day}`.toString();
    }else{
      return `${date.year}-${date.month}-${date.day}`.toString();
    }
  });

  setDateInicio(date){
    let posicion=date.indexOf("/",1)
    let posicion2=date.indexOf( "/",posicion+1)

    let pMes=date.substring(0,posicion)
    let pDia=date.substring(posicion+1, posicion2)
    let pAnho=date.substring(posicion2+1)

    this.fec_ini = {day: pDia, month: pMes, year: pAnho};
    this.strFecIni = this.dateToString(this.fec_ini);

    this.obtenerMtmInstrumentoHistorico();
  }

  formatColumnNumber(columnIndex: number, worksheet: XLSX.WorkSheet): void {
    const range = worksheet['!ref'];
    if (range) {
      const decodedRange = XLSX.utils.decode_range(range);
      for (let row = decodedRange.s.r; row <= decodedRange.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: columnIndex });
        const cell = worksheet[cellAddress];
        if (cell && cell.t === 'n') {
          cell.z = '#,##0.00'; // Formato numérico con dos decimales y separador de miles
        }
      }
    }
  }
  
  descargarExcel(){
    let listExportExcel = this.dataSource.filteredData.map((x) => {return{Fecha: new Date(Number(x.t467_date.toString().substring(0, 10).split('-')[0]), Number(x.t467_date.toString().substring(0, 10).split('-')[1]) - 1, Number(x.t467_date.toString().substring(0, 10).split('-')[2]), 12), Código: x.cod_ci, 'Moneda Recibe': x.t463_currency_rec, 'MTM Recibe': x.t467_mtm_rec, 'Moneda Entrega': x.t463_currency_del, 'MTM Entrega': x.t467_mtm_del}});
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(listExportExcel);
    this.formatColumnNumber(3, ws);
    this.formatColumnNumber(5, ws);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws,'Valorizacion Derivados');
    XLSX.writeFile(wb, 'Valorizacion Derivados.xlsx');
  }
}
