import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cobertura } from 'src/app/models/Tesoreria/cobertura';
import { CoberturaVigente } from 'src/app/models/Tesoreria/coberturaVigente';
import { InstrumentoPorCoberturar } from 'src/app/models/Tesoreria/instrumentoPorCoberturar';
import { TesoreriaService } from 'src/app/models/Tesoreria/tesoreria.service';
import Swal from 'sweetalert2';
import { TokenService } from 'src/app/shared/services/token.service';
import { EstructuraCorreo } from 'src/app/models/Tesoreria/estructuraCorreo';

@Component({
  selector: 'app-cobertura-por-factura',
  templateUrl: './cobertura-por-factura.component.html',
  styleUrls: ['./cobertura-por-factura.component.scss']
})
export class CoberturaPorFacturaComponent implements OnInit {

  @Input() dataCoberturas:CoberturaVigente [];
  @Output () close: EventEmitter<boolean>= new EventEmitter();

  public tituloForm: string="Detalle de Coberturas";
  dsCobertura: MatTableDataSource<CoberturaVigente>;
  public estructuraCorreo: EstructuraCorreo = new EstructuraCorreo();

  public opcionesReversion = [{id: 1, texto: 'Tipo'}, {id: 2, texto: 'Cambio de estrategia'}, {id: 3, texto: 'Otro'}];

  displayedColumnsCobertura: string[] = [
    'coverage_type',
    'id_co',
    'type_ci',
    'code_bbg',
    'nominal',
    'start_date',
    'end_date',
    'deshacer_cob'
  ];

  constructor(private modalService: NgbModal, private tesoreriaService: TesoreriaService, private tokenService: TokenService) { }

  ngOnInit(): void {
    console.log("Input cobertura: ", this.dataCoberturas);
    this.dsCobertura = new MatTableDataSource(this.dataCoberturas);
  }

  closeModal(){
    this.close.emit(false);
  }

  cerrar(){
    this.closeModal();
    this.modalService.dismissAll();
  }

  fechaIntAString(fecha): string{
    return (fecha.toString().slice(6,8) + '/' + fecha.toString().slice(4,6) + '/' + fecha.toString().slice(0,4));
  }

  enviarCorreo(motivo: string, element){
    let listInstrumentosCorreo: string = '';
    let paisesCorreo: string[] = [];
    listInstrumentosCorreo += `<br>● ${element.type_ci}-${element.id_ci} (Fec Inicio: ${this.fechaIntAString(element.start_date)})`;
    paisesCorreo.push(element.subsidiary_country);
    this.estructuraCorreo.asunto = "[ Balance ] - Se deshizo la cobertura del siguiente grupo de forwards";
    this.estructuraCorreo.copiar = "";
    this.estructuraCorreo.destinatarios = "RDT_Coberturas_Correo_Default";

    for(const paisSubsidiaria of paisesCorreo){
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
    }

    this.estructuraCorreo.cuerpo = `<p>Hola,<br><br>Se confirma que se acaba de deshacer la cobertura de un grupo de forwards. A continuación, el detalle:<br><br> <b>Motivo</b>: ${motivo}<br><b>Instrumentos:</b>${listInstrumentosCorreo}<br><b>Usuario: </b>${this.tokenService.getUserName()} <br><br>Saludos. <br>Equipo de Riesgos de Tesorería.</p>`;
    this.estructuraCorreo.importante = false;
    this.estructuraCorreo.adjuntos = [];
    console.log("estructura correo: ", this.estructuraCorreo);
    this.tesoreriaService.postEnvioCorreoJava(this.estructuraCorreo).subscribe(
      (response: any) => {
        console.log("envio correo: ", response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Las coberturas se deshicieron satisfactoriamente.',
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#4b822d'
        });
        this.cerrar();
      },(error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  deshacerCobertura(element){
    Swal.fire({
      icon: 'question',
      title: 'Deshacer Cobertura',
      html: '¿Desea deshacer las coberturas seleccionadas?',
      input: 'select',
      inputOptions: this.opcionesReversion.reduce((obj, option) => {
        obj[option.id] = option.texto;
        return obj;
      }, {}),
      customClass:{
        container: 'custom-select',
        input: 'ng-select'
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){
        const opcionIDSeleccionada = result.value;
        const opcionSeleccionada = this.opcionesReversion.find((x) => x.id == opcionIDSeleccionada);
        console.log("opcionElegida: ", opcionSeleccionada);
        let instrumentoPorDeshacer: InstrumentoPorCoberturar = new InstrumentoPorCoberturar();
        instrumentoPorDeshacer.t463_id = element.id_ci;
        let listInstrumentosPorDeshacer: InstrumentoPorCoberturar[] = [];
        listInstrumentosPorDeshacer.push(instrumentoPorDeshacer);
        listInstrumentosPorDeshacer.map(e => e.usuario = this.tokenService.getUserName());
        this.tesoreriaService.postDeshacerCobertura(listInstrumentosPorDeshacer).subscribe(
          (response: any) => {
            this.enviarCorreo(opcionSeleccionada? opcionSeleccionada.texto : '', element);
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    }
    );
  }

}
