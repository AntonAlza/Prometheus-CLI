import { Component, OnInit } from '@angular/core';
import { Holiday } from 'src/app/models/Tesoreria/holiday';
import * as moment from 'moment';
import { TesoreriaService } from 'src/app/models/Tesoreria/tesoreria.service';
import { TipoInstrumento } from 'src/app/models/Tesoreria/tipoInstrumento';
import { HttpErrorResponse } from '@angular/common/http';
import { OpcionesCombo } from 'src/app/models/Tesoreria/opcionesCombo';
import Swal from 'sweetalert2';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: 'app-reproceso-mtm',
  templateUrl: './reproceso-mtm.component.html',
  styleUrls: ['./reproceso-mtm.component.scss']
})
export class ReprocesoMtmComponent implements OnInit {
  public strFecIni: string = "";
  public fec_ini = new Date();
  public strFecFin: string = "";
  public fec_fin = new Date();
  public fechasPermitidas;
  public listTipoInstrumento: TipoInstrumento[] = [];
  public listProceso: OpcionesCombo[] = [];
  public listParidadPais: OpcionesCombo[] = [];
  public idTipoInstrumentoSeleccionado: string = 'FWD';
  public idProceso: number = 1;
  public idParidadPais: number = 1;

  constructor(private tesoreriaService: TesoreriaService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.obtenerTipoInstrumento();
    this.obtenerProceso();
    this.obtenerParidadPais();
    this.fec_ini = new Date();
    this.strFecIni = this.dateToString(this.fec_ini);
    this.fec_fin = new Date();
    this.strFecFin = this.dateToString(this.fec_fin);
    this.validarFechasHabiles();
  }

  obtenerTipoInstrumento(){
    this.tesoreriaService.getListaTipoInstrumento().subscribe(
      (response: TipoInstrumento[]) => {
        this.listTipoInstrumento = response.filter(e => e.t455Id == 'FWD' || e.t455Id == 'OPT_FX');
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }

  obtenerProceso(){
    this.tesoreriaService.getListaCombo(7).subscribe(
      (response: OpcionesCombo[]) => {
        this.listProceso = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  obtenerParidadPais(){
    this.tesoreriaService.getListaCombo(8).subscribe(
      (response: OpcionesCombo[]) => {
        this.listParidadPais = response;
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

  setDateInicio(date){
    let posicion=date.indexOf("/",1)
    let posicion2=date.indexOf( "/",posicion+1)

    let pMes=date.substring(0,posicion)
    let pDia=date.substring(posicion+1, posicion2)
    let pAnho=date.substring(posicion2+1)

    this.fec_ini =  new Date(pAnho, pMes - 1, pDia);
    this.fec_ini.setHours(0,0,0,0);
    this.strFecIni = this.dateToString(this.fec_ini);

    this.fec_fin.setHours(0,0,0,0);

    if(typeof this.strFecFin == 'undefined'  || this.strFecFin==='' ||  this.fec_ini > this.fec_fin){
      this.fec_fin = this.fec_ini;
      this.strFecFin = this.strFecIni;
    }
  }

  setDateFin(date){
    let posicion=date.indexOf("/",1)
    let posicion2=date.indexOf( "/",posicion+1)

    let pMes=date.substring(0,posicion)
    let pDia=date.substring(posicion+1, posicion2)
    let pAnho=date.substring(posicion2+1)

    this.fec_fin =  new Date(pAnho, pMes - 1, pDia);
    this.fec_fin.setHours(0,0,0,0);
    this.strFecFin = this.dateToString(this.fec_fin);

    this.fec_ini.setHours(0,0,0,0);

    if(typeof this.strFecIni == 'undefined'  || this.strFecIni==='' || this.fec_ini > this.fec_fin){
      this.fec_ini = this.fec_fin;
      this.strFecIni = this.strFecFin;
    }
  }

  reprocesar(){
    this.fec_ini.setHours(0,0,0,0);
    this.fec_fin.setHours(0,0,0,0);

    let inputReproceso = {
      fec_ini : this.fec_ini,
      fec_fin : this.fec_fin,
      proceso : this.idProceso,
      tipoInstrumento : this.idTipoInstrumentoSeleccionado,
      paridadPais : this.idParidadPais,
      listPaises : this.listParidadPais.filter(e => e.id_combo == this.idParidadPais)[0].descripcion_combo.split('/'),
      usuarioRegistra : this.tokenService.getUserName()
    }

    this.tesoreriaService.postReprocesoValLiq(inputReproceso).subscribe(
      (response: any) => {
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se realizó el reproceso solicitado.',
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