import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { INPUT_IC } from 'src/app/models/Tesoreria/INPUT_IC';
import { INPUT_ICOC } from 'src/app/models/Tesoreria/INPUT_ICOC';
import { INPUT_OC } from 'src/app/models/Tesoreria/INPUT_OC';
import { Cobertura } from 'src/app/models/Tesoreria/cobertura';
import { Factor } from 'src/app/models/Tesoreria/factor';
import { InstrumentoPorCoberturar } from 'src/app/models/Tesoreria/instrumentoPorCoberturar';
import { ObjetoCobertura } from 'src/app/models/Tesoreria/objetoCobertura';
import { RegistroSAP } from 'src/app/models/Tesoreria/registroSAP';
import { TesoreriaService } from 'src/app/models/Tesoreria/tesoreria.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { UserOptions } from 'jspdf-autotable';
import { EstructuraCorreo } from 'src/app/models/Tesoreria/estructuraCorreo';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { LoadingService } from 'src/app/components/loading.service';

class RecomendacionCobertura{
  id: number;
  idInstrumento: number;
  idFactura: string;
}

interface jsPDFWithPlugin extends jsPDF {
  autoTable : (options: UserOptions) => jsPDF;
}

@Component({
  selector: 'app-asociar-facturas-rtd',
  templateUrl: './asociar-facturas-rtd.component.html',
  styleUrls: ['./asociar-facturas-rtd.component.scss']
})
export class AsociarFacturasRTDComponent implements OnInit {
  @Input() dataInstrumentos:InstrumentoPorCoberturar [];
  @Input() flgDeshacerCobertura: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();

  public tituloForm: string="Asignar Cobertura";
  public listInstrumentos: InstrumentoPorCoberturar[] = [];
  public listFacturas: ObjetoCobertura[] = [];
  public listRecomendaciones: RecomendacionCobertura[] = [];
  public listRecomendacionesPorInstrumento: String[] = [];
  public facturasSeleccionadas: String[] = [];
  public listFacturaXInstrumentoSeleccionado: Cobertura[] = [];
  public listInstrumentosCoberturados: InstrumentoPorCoberturar[] = [];
  public listCoberturasAGuardar: Cobertura[] = [];
  public fechaHoy = new Date().toLocaleDateString('en-GB');

  public ultimoInstrumentoSeleccionado: number = 0;

  public flgSeleccionarTodo: boolean = false;
  public flgRecomendarCobertura: boolean = true;

  public resultadosTE: INPUT_IC[];

  public indiceSubsidiariaCorreo: number = 0;
  public listSubsidiariasCorreo: number[] = [];
  public estructuraCorreo: EstructuraCorreo = new EstructuraCorreo();
  public carpetaArchivos: string = "RDT/Coberturas/";

  loading$= this.loader.loading$;
  flgCargando: boolean = false;

  dsInstrumentos: MatTableDataSource<InstrumentoPorCoberturar>;
  dsFacturas: MatTableDataSource<ObjetoCobertura>;

  @ViewChild('MatPaginatorInstrumentos', { static: true }) paginatorInstrumentos!: MatPaginator;

  @ViewChild('MatPaginatorFacturas', { static: true }) paginatorFacturas!: MatPaginator;
  @ViewChild('sortFacturas') sortFacturas!: MatSort;

  displayedColumnsInstrumentos: string[] = [
    't463_code_bbg',
    'nominal',
    'desc_subsidiary',
    't463_start_date',
    't463_end_date',
    'par_moneda',
    'monto_cubierto',
    'desc_counterpart'
  ];

  displayedColumnsFacturas: string[] = [
    'flg_seleccionado',
    'subsidiaria',
    'nominal',
    'montoUtilizado',
    'saldo',
    'plazo',
    'fecha_documento',
    'moneda',
    'barco',
    'materia_prima',
    'codigoFactura'
  ];

  constructor(private modalService: NgbModal,
    private tesoreriaService: TesoreriaService,
    private blobService: AzureBlobStorageService,
    private tokenService: TokenService,
    private loader:LoadingService) { }

  ngOnInit(): void {
    this.paginatorInstrumentos._intl.itemsPerPageLabel="Registros por Página";
    this.paginatorFacturas._intl.itemsPerPageLabel="Registros por Página";

    for (const i of this.dataInstrumentos){
      i.montoCubierto = 0;
    }

    this.dsInstrumentos = new MatTableDataSource(this.dataInstrumentos.sort((a, b) => (b.t463_currency_rec == "EUR" ? b.t463_nominal_del : b.t463_nominal_rec) - (a.t463_currency_rec == "EUR" ? a.t463_nominal_del : a.t463_nominal_rec)));
    this.dsInstrumentos.paginator = this.paginatorInstrumentos;
    this.consultarObjetosCobertura();
  }

  obtenerRecomendacionesPorInstrumento(){
    let nominal: number;
    let saldo: number;
    let saldoRestanteTotal: number;
    let facturasXInstrumento: ObjetoCobertura[] = [];

    for(const instrumento of this.dsInstrumentos.data){
      nominal = (instrumento.t463_currency_rec == "EUR" ? instrumento.t463_nominal_del : instrumento.t463_nominal_rec);
      facturasXInstrumento = this.listFacturas.filter(e => this.listFacturas.filter(e => e.codigoInstrumento == instrumento.t463_id).map(e => e.codigoFactura).includes(e.codigoFactura));
        if(facturasXInstrumento.length > 0){
          saldoRestanteTotal = facturasXInstrumento.map(e => e.saldo).reduce(function(a, b){return a + b});
          for(const factura of this.listFacturas.filter(e => e.codigoInstrumento == instrumento.t463_id && e.codigoFactura.startsWith("A-"))){
            if(instrumento.montoCubierto < nominal && saldoRestanteTotal >= (nominal - instrumento.montoCubierto) && factura.saldo > 0){
              saldo = (factura.saldo > (nominal - instrumento.montoCubierto)) ? (nominal - instrumento.montoCubierto) : factura.saldo;
              this.listFacturas.filter(e => e.codigoFactura == factura.codigoFactura).map(e=>e.saldo -= saldo);
              instrumento.montoCubierto += saldo;
              this.listFacturas.filter(e => e.codigoInstrumento == instrumento.t463_id && e.codigoFactura == factura.codigoFactura).map(e=>e.montoUtilizado = saldo);
  
              let objFacturaXInstrumento: Cobertura = new Cobertura();
              objFacturaXInstrumento.t464_id_ci = instrumento.t463_id;
              objFacturaXInstrumento.t464_id_co = factura.codigoFactura;
              objFacturaXInstrumento.t464_nominal = saldo;
              objFacturaXInstrumento.t464_id_coverage_type = 1;
              objFacturaXInstrumento.t464_status = true;
              objFacturaXInstrumento.t464_rel_start_date = instrumento.t463_start_date;
              objFacturaXInstrumento.t464_rel_end_date = instrumento.t463_end_date;
              this.listFacturaXInstrumentoSeleccionado.push(objFacturaXInstrumento);
            }
          }
        }
    }
    this.flgRecomendarCobertura = false;
  }

  consultarObjetosCobertura(){
    if (this.dsInstrumentos.data){
      this.loader.show();
      this.flgCargando = true;
      let listIDsInstrumentos: number[] = [];
      for(const [key, i] of this.dsInstrumentos.data.entries()){
        listIDsInstrumentos.push(i.t463_id);
      }
      this.tesoreriaService.getListaObjetosCobertura(listIDsInstrumentos).subscribe(
        (response: ObjetoCobertura[]) => {
          this.loader.hide();
          this.flgCargando = false;
          this.listFacturas = response;

          this.seleccionarInstrumento(this.dsInstrumentos.data[0]);
          
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          this.cerrar();
        }
      );
    }
  }

  consultarFacturasPorInstrumento(element){
    this.dsFacturas = new MatTableDataSource(this.listFacturas.filter(e => e.codigoInstrumento == element.t463_id));
    this.dsFacturas.paginator = this.paginatorFacturas;
    this.dsFacturas.sort = this.sortFacturas;

    for (const i of this.dsFacturas.data){
      i.flg_seleccionado = false;
    }

    if (this.flgRecomendarCobertura)
      this.obtenerRecomendacionesPorInstrumento();

    for(const i of this.listFacturaXInstrumentoSeleccionado.filter(e=>e.t464_id_ci == element.t463_id)){
      this.dsFacturas.data.filter(e => e.codigoFactura == i.t464_id_co)[0].flg_seleccionado = true;
      this.listRecomendacionesPorInstrumento.push(i.t464_id_co);
    }

    this.flgSeleccionarTodo = (this.dsFacturas.data.filter(e => e.flg_seleccionado).length > 0);
  }

  closeModal(){
    this.close.emit(false);
  }

  cerrar(){
    this.closeModal();
    this.modalService.dismissAll();
  }


  seleccionarInstrumento(element){
    this.ultimoInstrumentoSeleccionado = element.t463_id;
    this.facturasSeleccionadas = [];
    this.listRecomendaciones = [];
    this.listRecomendacionesPorInstrumento = [];
    this.consultarFacturasPorInstrumento(element);
  }

  facturaSeleccionada(element: any){
    let instrumento = this.dsInstrumentos.data.filter(e=>e.t463_id == this.ultimoInstrumentoSeleccionado)[0];
    let nominalInstrumento = (instrumento.t463_currency_rec == "EUR" ? instrumento.t463_nominal_del : instrumento.t463_nominal_rec)
    let saldo = (element.saldo > (nominalInstrumento - instrumento.montoCubierto)) ? (nominalInstrumento - instrumento.montoCubierto) : element.saldo;
    if(element.flg_seleccionado && saldo > 0){
      let objFacturaXInstrumento: Cobertura = new Cobertura();
      objFacturaXInstrumento.t464_id_ci = instrumento.t463_id;
      objFacturaXInstrumento.t464_id_co = element.codigoFactura;
      objFacturaXInstrumento.t464_nominal = saldo;
      objFacturaXInstrumento.t464_id_coverage_type = 1;
      objFacturaXInstrumento.t464_status = element.flg_seleccionado;
      objFacturaXInstrumento.t464_rel_start_date = instrumento.t463_start_date;
      objFacturaXInstrumento.t464_rel_end_date = instrumento.t463_end_date;
      this.listFacturaXInstrumentoSeleccionado.push(objFacturaXInstrumento);

      this.listFacturas.filter(e => e.codigoFactura == element.codigoFactura).map(e=>e.saldo -= saldo);
      instrumento.montoCubierto += saldo;
      this.listFacturas.filter(e => e.codigoInstrumento == instrumento.t463_id && e.codigoFactura == element.codigoFactura).map(e=>e.montoUtilizado += saldo);
    }
    else{
      this.listFacturaXInstrumentoSeleccionado.forEach((value, index) => {
        if(value.t464_id_ci == instrumento.t463_id && value.t464_id_co == element.codigoFactura){
          this.listFacturas.filter(e => e.codigoFactura == element.codigoFactura).map(e=>e.saldo += value.t464_nominal);
          instrumento.montoCubierto -= value.t464_nominal;
          this.listFacturas.filter(e => e.codigoInstrumento == instrumento.t463_id && e.codigoFactura == element.codigoFactura).map(e=>e.montoUtilizado -= value.t464_nominal);
          this.listFacturaXInstrumentoSeleccionado.splice(index,1);
        }
      });
    }

    this.flgSeleccionarTodo = (this.dsFacturas.data.filter(e => e.flg_seleccionado).length > 0);
  }

  calcularTestEfectividad2(){
    let idsInstCoberturados: number [] = this.listInstrumentosCoberturados.map((x) => {return x.t463_id});
    let INPUT_IC: INPUT_IC[] = this.dsInstrumentos.data.filter(e => idsInstCoberturados.includes(e.t463_id)).map((x) => {return{CODIGO: x.t463_id, MON_REC: ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'].includes(x.t463_currency_del) ? x.t463_currency_del : x.t463_currency_rec, MON_ENT: ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'].includes(x.t463_currency_del) ? x.t463_currency_rec : x.t463_currency_del, NOMINAL_REC: x.t463_nominal_rec, FECHA_INICIO: x.t463_start_date, FECHA_FIN: x.t463_end_date, TEST_EFECTIVIDAD: 0.0, TE_COBERTURA: 0.0, TE_EXPO: 0.0}});
    let INPUT_ICOC: INPUT_ICOC[] = this.listFacturaXInstrumentoSeleccionado.filter(e => idsInstCoberturados.includes(e.t464_id_ci)).map((x) => {return{CODIGO_OC: x.t464_id_co, CODIGO_IC: x.t464_id_ci, NOMINAL: x.t464_nominal, RELA_COB_INICIO: x.t464_rel_start_date, RELA_COB_FIN: x.t464_rel_end_date, VIGENTE: x.t464_status, TEST_EFECTIVIDAD: 0.0}});
    let INPUT_OC: INPUT_OC[] = [];
    for(const i of INPUT_ICOC){
      INPUT_OC = INPUT_OC.concat(this.listFacturas.filter(e => e.codigoFactura == i.CODIGO_OC && e.codigoInstrumento == i.CODIGO_IC).map((x) => {return{CODIGO_OC: x.codigoFactura, SALDO_USD: x.montoUtilizado, FECHA_FIN: x.fecha_vencimiento}}));
    }

    let listFechasIniICs: string[] = [];
    for(const i of INPUT_IC){
      listFechasIniICs.push(i.FECHA_INICIO.toString());
    }

    let FACTORES: Factor[];
    this.tesoreriaService.getListFactores(listFechasIniICs).subscribe(
      (response: Factor[]) => {
        FACTORES = response;
        const INPUTS = {
          INPUT_IC: INPUT_IC,
          INPUT_ICOC: INPUT_ICOC,
          INPUT_OC: INPUT_OC,
          FACTORES: FACTORES
        }

        this.tesoreriaService.getTestEfectividadJava(INPUTS).subscribe(
          (response: INPUT_IC[]) => {
            this.resultadosTE = response;
            this.registrarAsociacionBD();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  guardarAsociacion(){
    this.listInstrumentosCoberturados = this.dsInstrumentos.data.filter(e => e.montoCubierto == (e.t463_currency_rec == "EUR" ? e.t463_nominal_del : e.t463_nominal_rec));
    this.resultadosTE = [];
    
    if(this.dataInstrumentos.filter(e => e.montoCubierto < (e.t463_currency_rec == "EUR" ? e.t463_nominal_del : e.t463_nominal_rec)).length == this.dataInstrumentos.length){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Ningún instrumento fue cubierto en su totalidad.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    }
    else if(this.flgDeshacerCobertura && this.dataInstrumentos.filter(e => e.montoCubierto < (e.t463_currency_rec == "EUR" ? e.t463_nominal_del : e.t463_nominal_rec)).length > 0){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario cubrir todos los instrumentos.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    }
    else{
      this.calcularTestEfectividad2();
    }
  }

  registrarAsociacionBD(){
    let mensaje: string = this.dataInstrumentos.some(e => e.montoCubierto < (e.t463_currency_rec == "EUR" ? e.t463_nominal_del : e.t463_nominal_rec)) ? "Existen instrumentos sin cubrir.<br>Solo se registrarán las coberturas completas." : "Todos los instrumentos han sido cubiertos.";
    let strResultados: string = "";
    let codInst: string = "";

    this.listCoberturasAGuardar = this.listFacturaXInstrumentoSeleccionado.filter(e => this.listInstrumentosCoberturados.map(e => e.t463_id).includes(e.t464_id_ci));

    for(const i of this.resultadosTE){
      codInst = this.dsInstrumentos.data.filter(e => e.t463_id == i.CODIGO)[0].t463_type_ci + "-" + this.dsInstrumentos.data.filter(e => e.t463_id == i.CODIGO)[0].t463_code_bbg;
      strResultados += "<br>" + codInst + ": " + (i.TEST_EFECTIVIDAD * 100).toFixed(2) + "%";
    }

    Swal.fire({
      icon: 'question',
      title: 'Registrar Cobertura',
      html: '¿Desea registrar las coberturas seleccionadas?' + "<br>" + mensaje + "<br><br>Resultados del Test de Efectividad:" + strResultados,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){

        let listSubsidiariasDistintas = new Set (this.listInstrumentosCoberturados.map(x => x.t463_id_subsidiary));
        for(const i of listSubsidiariasDistintas){
          this.listSubsidiariasCorreo.push(i);
        }

        this.generarPDFFichaCob();
      }
    }
    );
  }

  generarDataExcelRegistroSAP(listInstrumentoXSubsidiaria: InstrumentoPorCoberturar[]){
    let registroSAP: RegistroSAP[] = [];
    for(const i of listInstrumentoXSubsidiaria){
      let objRegSAP: RegistroSAP = new RegistroSAP();
      objRegSAP.ID = i.t463_id;
      objRegSAP.FECHA_INICIO = this.formatearFecha(i.t463_start_date.toString(), ".");
      objRegSAP.FECHA_FIN = this.formatearFecha(i.t463_end_date.toString(), ".");
      objRegSAP.FECHA_LIQUIDACION = this.formatearFecha(i.t463_settlement_date.toString(), ".");
      objRegSAP.NOMINAL = i.t463_currency_rec == "EUR" ? i.t463_nominal_del.toString() : i.t463_nominal_rec.toString();
      objRegSAP.STRIKE = i.t463_strike.toString();
      objRegSAP.SPOT = i.t463_spot.toString();
      objRegSAP.MON_LIQUID = i.t463_currency_liqu;
      objRegSAP.MODALIDAD = i.t463_id_modality;
      objRegSAP.SUBSIDIARIA = i.desc_subsidiary;
      objRegSAP.CONTRAPARTE = i.desc_counterpart;
      objRegSAP.CONT_TRADER = i.t463_counterparty_trader_name;
      objRegSAP.FACTURA_ = this.listCoberturasAGuardar.filter(e => e.t464_id_ci == i.t463_id).map(c => c.t464_id_co);
      objRegSAP.IC_NOM_ = this.listCoberturasAGuardar.filter(e => e.t464_id_ci == i.t463_id).map(c => c.t464_nominal.toString());
      registroSAP.push(objRegSAP);
    }

    let nombreColumnasIDFacturas: string[] = [];
    let nombrecolumnasNominalFacturas: string[] = [];
    let maxFacturas: number = 0;

    for(const i of registroSAP){
      if(i.FACTURA_.length > maxFacturas){
        maxFacturas = i.FACTURA_.length;
      }
    }

    for(let i = 1; i <= maxFacturas; i++){
      nombreColumnasIDFacturas.push(`SUBYACENTE_${i}`);
      nombrecolumnasNominalFacturas.push(`IC_NOM_${i}`);
    }

    let registroSAPFinal = registroSAP.map(item => {
      const{FACTURA_, IC_NOM_, ...resto} = item;
      return resto;
    });

    for(let i of registroSAPFinal){
      let registro = registroSAP.filter(e => e.ID == i.ID)[0];
      for(let [key, nombreCol] of nombreColumnasIDFacturas.entries()){
        i[nombreCol] = registro.FACTURA_[key];
      }
      for(let [key, nombreCol] of nombrecolumnasNominalFacturas.entries()){
        i[nombreCol] = registro.IC_NOM_[key] ? registro.IC_NOM_[key]: '0';
      }
    }

    this.generarExcelRegistroSAP(registroSAPFinal, listInstrumentoXSubsidiaria[0].desc_subsidiary, listInstrumentoXSubsidiaria[0].subsidiary_country);
  }

  generarExcelRegistroSAP(registroSAP, subsidiaria, paisSubsidiaria){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(registroSAP);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws,'Sheet1');
    var wbout = XLSX.write(wb, {type:"array", bookType:'xlsx'});
    var blobXLSX = new Blob([wbout], {type: 'application/octet-stream'});
    var nombreArchivo = this.carpetaArchivos + 'Registro_SAP.xlsx';
    this.blobService.uploadFile(blobXLSX, nombreArchivo, () => {
      this.blobService.downloadFile(nombreArchivo, blobURL => {
        this.estructuraCorreo.adjuntos.push(blobURL);
        this.enviarCorreo(subsidiaria, paisSubsidiaria);
      });
    });
  }

  formatearFecha(fecha: string, separador: string): string{
    const anio = fecha.substring(0, 4);
    const mes = fecha.substring(4, 6);
    const dia = fecha.substring(6, 8);
    const fechaFormateada = dia + separador + mes + separador + anio;
    return fechaFormateada;
  }

  seleccionarTodo(){
    for (const i of this.dsFacturas.data){
      if(i.saldo > 0 || i.montoUtilizado > 0)
        i.flg_seleccionado = this.flgSeleccionarTodo;
    }
    for (const i of this.dsFacturas.data){
      this.facturaSeleccionada(i);
    }
  }

  obtenerRecomendacionCobertura(){
    this.flgRecomendarCobertura = true;
    this.consultarFacturasPorInstrumento(this.dsInstrumentos.data.find(e => e.t463_id == this.ultimoInstrumentoSeleccionado));
  }

  convertNumberToLocaleDateString(fecha: number): string{
    return `${fecha.toString().substring(6, 8)}/${fecha.toString().substring(4, 6)}/${fecha.toString().substring(0, 4)}`;
  }

  async generarPDFFichaCob(){
    this.estructuraCorreo.adjuntos = [];
    let listInstrumentoXSubsidiaria: InstrumentoPorCoberturar[] = this.listInstrumentosCoberturados.filter(e => e.t463_id_subsidiary == this.listSubsidiariasCorreo[this.indiceSubsidiariaCorreo]);
    for(const [key, i] of listInstrumentoXSubsidiaria.entries()){
      let PDF = new jsPDF('p', 'mm', 'a4', true) as jsPDFWithPlugin;
      const pageHeight = PDF.internal.pageSize.getHeight();
      let posXCenter = PDF.internal.pageSize.getWidth() / 2;
      let posXText = 0;
      let posYText = 0;
      let txtLine = "";
      let textWidth = 0;

      let porcentajeCob = 0;

      let objetosCob: Cobertura[] = this.listCoberturasAGuardar.filter(e => e.t464_id_ci == i.t463_id);
      let factura: ObjetoCobertura[] = this.listFacturas.filter(e => e.codigoInstrumento == i.t463_id && objetosCob.map(e => e.t464_id_co).includes(e.codigoFactura));
      let resultadosTest: INPUT_IC = this.resultadosTE.filter(e => e.CODIGO == i.t463_id)[0];
      
      PDF.setFont('calibri',"bold").setFontSize(10);

      txtLine = 'Contrato ' + i.desc_subsidiary +' - ' + i.desc_counterpart +' - ' + i.t463_id_modality;
      textWidth = PDF.getTextWidth(txtLine);
      posXText = posXCenter - (textWidth / 2);
      posYText = 20;
      PDF.text(txtLine , posXText , posYText);
      PDF.line(posXText, posYText + 1, posXText + textWidth, posYText + 1);

      txtLine = 'Sustento de la cobertura';
      textWidth = PDF.getTextWidth(txtLine);
      posXText = posXCenter - (textWidth / 2);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      PDF.line(posXText, posYText + 1, posXText + textWidth, posYText + 1);

      txtLine = 'Tipo de Cotización:';
      posXText = 20;
      posYText += 10;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"normal");

      txtLine = 'RFQ - Bloomberg';
      textWidth = PDF.getTextWidth(txtLine);
      posXText = posXCenter - (textWidth / 2);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"bold");

      txtLine = 'Fecha de transacción de la cobertura:';
      posXText = 20;
      posYText += 10;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"normal");

      txtLine = this.convertNumberToLocaleDateString(i.t463_start_date);
      textWidth = PDF.getTextWidth(txtLine);
      posXText = posXCenter - (textWidth / 2);
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);

      PDF.setFont('Calibri',"bold");

      txtLine = 'Duración y fecha fin de la cobertura:';
      posXText = 20;
      posYText += 10;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"normal");
      txtLine = 'Duración de la cobertura: ' + (this.restarFechasInt(i.t463_start_date, i.t463_end_date));
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'Fecha final de la cobertura: ' + this.convertNumberToLocaleDateString(i.t463_end_date);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'Fecha de Fixing: ' + this.convertNumberToLocaleDateString(i.t463_end_date);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'Fecha de Liquidación: ' + this.convertNumberToLocaleDateString(i.t463_settlement_date);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"bold");

      txtLine = 'Objetivo de la cobertura:';
      posYText += 10;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"normal");

      if (factura.map(e => e.nominal).reduce(function(a, b){return a + b}) != 0){
        porcentajeCob = (i.t463_nominal_rec /(factura.map(e => e.nominal).reduce(function(a, b){return a + b}))) * 100;
      }

      txtLine = 'Cubrir en un ' + porcentajeCob.toFixed(2).toString() + '% (equivalente a ' + i.t463_currency_rec + ' ' + i.t463_nominal_rec.toLocaleString('en-US') + ') el riesgo de tipo de cambio spot de una cartera de Cuentas por Pagar';
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'en Moneda Extranjera. A la fecha de designación de la cobertura, este(os) SUBYACENTE(s) por pagar asciende a ';
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = factura[0].moneda + ' '+ factura.map(e => e.nominal).reduce(function(a, b){return a + b}).toLocaleString('en-US') +'.';
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"bold");

      txtLine = 'Tipo de Cobertura:';
      posYText += 10;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"normal");

      txtLine = 'Cobertura de Flujo de Efectivo';
      textWidth = PDF.getTextWidth(txtLine);
      posXText = posXCenter - (textWidth / 2);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"bold");

      txtLine = 'Estrategia de Cobertura:';
      posXText = 20;
      posYText += 10;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"normal");

      txtLine = 'La cobertura consiste en un Non-Deliverable Forward, mediante el cual se compran a futuro ' + i.t463_currency_rec + ' ' + i.t463_nominal_rec.toLocaleString('en-US');
      textWidth = PDF.getTextWidth(txtLine);
      posXText = posXCenter - (textWidth / 2);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);

      txtLine = 'a un tipo de cambio de ' + i.t463_strike;
      textWidth = PDF.getTextWidth(txtLine);
      posXText = posXCenter - (textWidth / 2);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"bold");

      txtLine = 'Riesgo Cubierto:';
      posXText = 20;
      posYText += 10;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"normal");

      txtLine = 'Variación de tipo de cambio spot de una cartera de cuentas por pagar en moneda extranjera.';
      textWidth = PDF.getTextWidth(txtLine);
      posXText = posXCenter - (textWidth / 2);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"bold");

      txtLine = 'Términos del Instrumento de cobertura:';
      posXText = 20;
      posYText += 10;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"normal");

      txtLine = 'El instrumento de cobertura es un ' + i.t463_id_modality + ' ' + i.t463_type_ci + ' con las siguientes características:';
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'Fecha de Cierre: ' + this.convertNumberToLocaleDateString(i.t463_start_date);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'Monto Nominal en ' + i.t463_currency_rec + ': ' + i.t463_nominal_rec.toLocaleString('en-US');
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'Monto Nominal en ' + i.t463_currency_del + ': ' + i.t463_nominal_del.toLocaleString('en-US');
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'Tipo de Cambio Spot al cierre: ' + i.t463_spot;
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'Tipo de Cambio Strike: ' + i.t463_strike;
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'Fecha de Fixing: ' + this.convertNumberToLocaleDateString(i.t463_end_date);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);
      txtLine = 'Fecha de Liquidación: ' + this.convertNumberToLocaleDateString(i.t463_settlement_date);
      posYText += 5;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"bold");

      txtLine = 'Términos de la partida cubierta:';
      posYText += 10;
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"normal");

      txtLine = 'La partida cubierta, procedente de las obligaciones con el(los) proveedor(es)/acreedor(es) ';
      let auxValor = '';
      let listProveedoresAcreedores: string[] = [];
      for(const [key, i] of factura.entries()){
        listProveedoresAcreedores.push(i.proveedor != null ? i.proveedor : i.subsidiaria_acreedor != null ? i.subsidiaria_acreedor : i.contraparte_acreedor);
      }
      for(const [key, i] of listProveedoresAcreedores.filter((valor, index, self) => self.indexOf(valor) === index).entries()){
        auxValor = key > 0 ? ', ' : '';
        auxValor += i;
        if(txtLine.length + auxValor.length > 120){
          posYText += 5;
          PDF.text(txtLine, posXText, posYText);
          txtLine = '';
        }
        txtLine += auxValor;
      }
      posYText += 5;

      let txtEndLine = 'denominados en moneda extranjera, es:'
      if (txtLine.length + txtEndLine.length + 1 <= 120){
        PDF.text(txtLine + ' ' + txtEndLine, posXText, posYText);
      }
      else{
        PDF.text(txtLine, posXText, posYText);
        posYText += 5;
        PDF.text(txtEndLine, posXText, posYText);
      }

      //TABLA DE COBERTURAS
      posYText += 5;
      let tablaCobPDF;
      if (objetosCob[0].t464_id_co.toString().startsWith("A-")){
        tablaCobPDF = objetosCob.map((x) => {return{
          CODIGO_OC: x.t464_id_co, 
          SUBSIDIARIA: factura.filter(e => e.codigoFactura == x.t464_id_co)[0].subsidiaria, 
          PROVEEDOR: factura.filter(e => e.codigoFactura == x.t464_id_co)[0].proveedor, 
          MATERIA_PRIMA: factura.filter(e => e.codigoFactura == x.t464_id_co)[0].materia_prima, 
          NOMINAL_USD: factura.filter(e => e.codigoFactura == x.t464_id_co)[0].nominal.toLocaleString('en-US'), 
          FECHA_FIN: this.convertNumberToLocaleDateString(factura.filter(e => e.codigoFactura == x.t464_id_co)[0].fecha_vencimiento)
        }});
      }
      else if (objetosCob[0].t464_id_co.toString().startsWith("INT_") || objetosCob[0].t464_id_co.toString().startsWith("PRE_")){
        tablaCobPDF = objetosCob.map((x) => {return{
          CODIGO_OC: x.t464_id_co,
          DEUDOR: factura.filter(e => e.codigoFactura == x.t464_id_co)[0].subsidiaria_deudor,
          ACREEDOR: x.t464_id_co.startsWith("INT_")
            ? factura.filter(e => e.codigoFactura == x.t464_id_co)[0].subsidiaria_acreedor
            : factura.filter(e => e.codigoFactura == x.t464_id_co)[0].contraparte_acreedor,
          NOMINAL_USD: factura.filter(e => e.codigoFactura == x.t464_id_co)[0].nominal.toLocaleString('en-US'),
          FECHA_FIN: this.convertNumberToLocaleDateString(factura.filter(e => e.codigoFactura == x.t464_id_co)[0].fecha_vencimiento)
        }});
      }
      
      let dataTablePDF;
      const columnas = Object.keys(tablaCobPDF[0]);
      PDF.autoTable({
        startY: posYText,
        head: [columnas],
        body: tablaCobPDF.map((fila) => Object.values(fila)),
        didDrawPage: (data) => {
          dataTablePDF = data.table;
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineColor: [0, 0, 0], // Color del borde de la celda (RGB)
          lineWidth: 0.1, // Ancho del borde de la celda
        },
        headStyles: {
          fillColor: '#37aaf1',
        }
      });

      PDF.setFont('Calibri',"bold");

      posYText = dataTablePDF.finalY +  10;

      if (posYText + 40 > pageHeight) {
        PDF.addPage(); // Agregar una nueva página
        posYText = 20; // Restablecer la posición de inicio en la nueva página
      }

      txtLine = 'Test de Efectividad:';
      PDF.text(txtLine , posXText, posYText);

      PDF.setFont('Calibri',"normal");

      txtLine = 'Los test de efectividad se calcularán al momento de pactar el derivado y al cierre de cada mes.';
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);
      txtLine = 'La cobertura será efectiva si la variación del tipo de cambio spot es contrarrestada por la ganancia/pérdida generadas';
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);
      txtLine = 'por los derivados. Solo se considerará como cobertura el valor intrínseco del forward, es decir,';
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);
      txtLine = 'se excluirán los puntos forward y el valor temporal de las opciones para el cálculo del test de efectividad.';
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);
      txtLine = 'El valor intrínseco, a su vez, será calculado de la siguiente manera:';
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);
      txtLine = 'Valor intrínseco = TC spot – TC inicial';
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);

      if (posYText + 40 > pageHeight) {
        PDF.addPage(); // Agregar una nueva página
        posYText = 10; // Restablecer la posición de inicio en la nueva página
      }

      txtLine = 'Descripción de la prueba prospectiva:';
      textWidth = PDF.getTextWidth(txtLine);
      posYText += 10;
      PDF.text(txtLine , posXText , posYText);
      PDF.line(posXText, posYText + 1, posXText + textWidth, posYText + 1);
      txtLine = 'Se usará el método Dollar Offset y se calculará la efectividad como la relación entre el cambio en el valor intrínseco del';
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);
      txtLine = 'contrato derivado, dividido entre el cambio del valor de la partida cubierta atribuible a variaciones en el tipo de cambio.';
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);
      txtLine = 'Para ello, se considerará un escenario de tipo de cambio 5% más alto al tipo de cambio spot.';
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);
      txtLine = 'Si la efectividad se encuentra en el rango de 80%-125%, se considerará que el instrumento derivado es de cobertura.';
      posYText += 5;
      PDF.text(txtLine, posXText, posYText);

      if (posYText + 35 > pageHeight) {
        PDF.addPage(); // Agregar una nueva página
        posYText = 15; // Restablecer la posición de inicio en la nueva página
      }

      txtLine = 'Resultado de la prueba prospectiva:';
      textWidth = PDF.getTextWidth(txtLine);
      posYText += 5;
      PDF.text(txtLine , posXText , posYText);
      PDF.line(posXText, posYText + 1, posXText + textWidth, posYText + 1);

      let txtLineValue: string = '';

      txtLine = 'P&L Instrumento de Cobertura:';
      txtLineValue = ' ' + (Math.trunc(resultadosTest.TE_COBERTURA).toLocaleString('en-US'));
      textWidth = PDF.getTextWidth(txtLine);
      posYText += 10;
      PDF.text(txtLine + txtLineValue , posXText , posYText);
      PDF.line(posXText, posYText + 1, posXText + textWidth, posYText + 1);

      txtLine = 'P&L Partida Cubierta: ';
      txtLineValue = ' ' + (Math.trunc(resultadosTest.TE_EXPO).toLocaleString('en-US'));
      textWidth = PDF.getTextWidth(txtLine);
      posYText += 5;
      PDF.text(txtLine + txtLineValue, posXText , posYText);
      PDF.line(posXText, posYText + 1, posXText + textWidth, posYText + 1);

      txtLine = '% de Efectividad:';
      txtLineValue = ' ' + (resultadosTest.TEST_EFECTIVIDAD * 100) + '%';
      textWidth = PDF.getTextWidth(txtLine);
      posYText += 5;
      PDF.text(txtLine + txtLineValue, posXText , posYText);
      PDF.line(posXText, posYText + 1, posXText + textWidth, posYText + 1);

      var blobPDF = new Blob([PDF.output('blob')], {type: 'application/pdf'});
      let nombreArchivo = `${this.carpetaArchivos}FichaCob_${i.t463_type_ci}_${i.t463_id}.pdf`;

      let archivosPrevios = await this.blobService.getBlobNames(this.carpetaArchivos);
      let nArchivosIguales = archivosPrevios.filter(e => e.replace('.pdf','') == nombreArchivo.replace('.pdf','') || e.split("_M_")[0] == nombreArchivo.replace('.pdf','')).length;
      if (nArchivosIguales > 0){
        nombreArchivo = `${this.carpetaArchivos}FichaCob_${i.t463_type_ci}_${i.t463_id}_M_${(nArchivosIguales + 1)}.pdf`;
      }

      this.blobService.uploadFile(blobPDF, nombreArchivo, () => {
        this.blobService.downloadFile(nombreArchivo, blobURL => {
          this.estructuraCorreo.adjuntos.push(blobURL);
          if(key == listInstrumentoXSubsidiaria.length - 1)
            this.generarDataExcelRegistroSAP(listInstrumentoXSubsidiaria);
        });
      });
    }
  }

  restarFechasInt(fecha1: number, fecha2: number): number{
    const fecha1Date = new Date(parseInt(fecha1.toString().substring(0, 4)), parseInt(fecha1.toString().substring(4, 6)) - 1, parseInt(fecha1.toString().substring(6, 8)));
    const fecha2Date = new Date(parseInt(fecha2.toString().substring(0, 4)), parseInt(fecha2.toString().substring(4, 6)) - 1, parseInt(fecha2.toString().substring(6, 8)));
    const diferenciaDias = Math.floor((fecha2Date.getTime() - fecha1Date.getTime()) / (1000 * 3600 * 24));
    return diferenciaDias;
  }

  fechaIntAString(fecha): string{
    return (fecha.toString().slice(6,8) + '/' + fecha.toString().slice(4,6) + '/' + fecha.toString().slice(0,4));
  }

  enviarCorreo(subsidiaria: string, paisSubsidiaria: string){
    let listInstrumentosCorreo: string = '';
    let idICsCorreoCob: number[] = [];
    for (const i of this.listCoberturasAGuardar){
      if (!idICsCorreoCob.includes(i.t464_id_ci)){
    	idICsCorreoCob.push(i.t464_id_ci);
    	listInstrumentosCorreo += `<br>● FWD-${i.t464_id_ci} (Fec Inicio: ${this.fechaIntAString(i.t464_rel_start_date)})`;
      }
    }
    this.estructuraCorreo.asunto = "[ Balance ] - Se ingresó el siguiente grupo de forwards de " + subsidiaria;
    this.estructuraCorreo.copiar = "";
    this.estructuraCorreo.destinatarios = "RDT_Coberturas_Correo_Default";
    switch (paisSubsidiaria){
      case 'PE':{
        this.estructuraCorreo.destinatarios += "//RDT_Coberturas_Correo_Peru";
        break;
      }
      case 'UY':{
        this.estructuraCorreo.destinatarios += "//RDT_Coberturas_Correo_Uruguay";
        break;
      }
      case 'CO':{
        this.estructuraCorreo.destinatarios += "//RDT_Coberturas_Correo_Colombia";
        break;
      }
      case 'ES':{
        this.estructuraCorreo.destinatarios += "//RDT_Coberturas_Correo_Espana";
        break;
      }
    }
    this.estructuraCorreo.cuerpo = `<p>Hola,<br><br>Se confirma que se acaba de ingresar el siguiente grupo de forwards: ${listInstrumentosCorreo} <br><br>Los detalles de la operación se encuentran adjuntos. <br><br>Saludos. <br>Equipo de Riesgos de Tesorería.</p>`;
    this.estructuraCorreo.importante = false;
    this.tesoreriaService.postEnvioCorreoJava(this.estructuraCorreo).subscribe(
      (response: any) => {
        if(this.indiceSubsidiariaCorreo == this.listSubsidiariasCorreo.length - 1){
          let fecha = new Date();
          let fechaStr = `${fecha.getFullYear()}-${('0'+(fecha.getMonth()+1)).slice(-2)}-${('0'+(fecha.getDate())).slice(-2)}`;
          let horaStr = `${('0'+(fecha.getHours())).slice(-2)}:${('0'+(fecha.getMinutes())).slice(-2)}:${('0'+(fecha.getSeconds())).slice(-2)}`;
          this.listCoberturasAGuardar = this.listCoberturasAGuardar.map(
            i => {
              return {...i, t464_register_datetime: `${fechaStr} ${horaStr}`, t464_registered_by: this.tokenService.getUserName()}
            }
          );
          this.tesoreriaService.postGuardarCobertura(this.listCoberturasAGuardar).subscribe(
            (response: any) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Las coberturas se registraron satisfactoriamente.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#4b822d'
              });
              this.cerrar();
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        }
        else{
          this.indiceSubsidiariaCorreo++;
          this.generarPDFFichaCob();
        }
      },(error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
}
