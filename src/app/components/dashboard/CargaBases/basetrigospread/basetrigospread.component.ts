import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import { ListaPuertos } from 'src/app/models/Bases/loadingport';
import { ListaMercados } from 'src/app/models/Bases/mercado';
import { ListaMescontrato } from 'src/app/models/Bases/mescontratovalor';
import { ListaProteina } from 'src/app/models/Bases/nivelproteina';
import { listaregistrobenchmark } from 'src/app/models/Bases/registrobenchmark';
import { UnderlyingClasiall } from 'src/app/models/Fisico/underlyingclasifiall';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';


export interface Option {
  id: number;
  value: string | number;
}
function obtenerIdOption(optionsArray: Option[], value: string | number): number | null {
  const option = optionsArray.find(option => option.value === value);
  return option ? option.id : null;
}
@Component({
  selector: 'app-basetrigospread',
  templateUrl: './basetrigospread.component.html',
  styleUrls: ['./basetrigospread.component.scss']
})
export class BasetrigospreadComponent implements OnInit {

public mescontratoDS:MatTableDataSource<ListaMescontrato>
public mescontrato: ListaMescontrato[]=[];
public pFechaInicio:string="";
public pFechaFin:string="";
public dtpFecIni:string="";
public dtpFecFin:string="";
public miscolumnas:string[] = [];
public  valoresM: number[];
public  valores: any[] = [];
public tipoSeleccionado: string; 

public Id_UnderClass_1: number;
public Id_Proteina_1:number;
public Id_Puerto_1:number;
public Id_Tipo_1:number;
public Id_Mercado_1:number; 

public Id_UnderClass_2: number;
public Id_Proteina_2:number;
public Id_Puerto_2:number;
public Id_Tipo_2:number;
public Id_Mercado_2:number; 

public valorspread: number=0;
public listaunderclasi: UnderlyingClasiall[];
public lista_nivelproteina:ListaProteina[];
public lista_puertos:ListaPuertos[];
public lista_mercados:ListaMercados[];




  constructor(private mesescontratoservice:CargabasetrigoService,
              private obtenerUnderClassservice:CargabasetrigoService,
              private obtenerProteinaservice:CargabasetrigoService,
              private obtenerPuertosservice:CargabasetrigoService,
              private obtenerMercadosservice:CargabasetrigoService,
              private tokenService:TokenService,
              private registrarBench: CargabasetrigoService) { }

  ngOnInit(): void {
    this.Id_Tipo_1 = this.TipoOption[0].id,
    this.Id_Tipo_2 = this.TipoOption[0].id // Por ejemplo, seleccionamos el primer elemento de la lista
  ,this.getunderclasi(),this.getnivelproteina(),this.getPuertos(),this.getMercados()
  }
  TipoOption: Option[]=[
    {id:1, value:"Base"},
    {id:2, value:"Flat"},
    {id:3, value:"Flete"}
  ]
  public setDateInicio(date:string) {
    var pDia:string
    var pMes:string
    var pAnho:string
    var posicion:number
    var posicion2:number
    
    this.dtpFecIni = date;
  
    posicion=date.indexOf("/",1)
    posicion2=date.indexOf( "/",posicion+1)
  
    pMes=date.substring(0,posicion)
    pDia=date.substring(posicion+1, posicion2)
    pAnho=date.substring(posicion2+1)
  
    if(Number(pDia)<10 && Number(pMes)<10){
      this.pFechaInicio= `${pAnho}0${pMes}0${pDia}`.toString(); 
    }else if (Number(pDia)<10 ){
      this.pFechaInicio= `${pAnho}${pMes}0${pDia}`.toString(); 
    }else if (Number(pMes)<10){
      this.pFechaInicio= `${pAnho}0${pMes}${pDia}`.toString(); 
    }else{
      this.pFechaInicio= `${pAnho}${pMes}${pDia}`.toString();
    }
    if(typeof this.dtpFecFin == 'undefined'  || this.dtpFecFin==='' || this.pFechaInicio > this.pFechaFin){
      this.dtpFecFin = this.dtpFecFin;
    }
    
  }  

public Consultar(): void{
  if (!this.pFechaInicio) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Debes seleccionar una fecha',
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#4b822d'
    });
    return;
  }
  console.log( this.Id_UnderClass_1,this.Id_Proteina_1,this.Id_Puerto_1,this.Id_Tipo_1,this.Id_Mercado_1);
  this.ConsulListaMesescontrato(this.Id_UnderClass_1,this.Id_Proteina_1,this.Id_Puerto_1,this.Id_Tipo_1,this.Id_Mercado_1,parseInt(this.pFechaInicio));

}
public ConsulListaMesescontrato(underlying:number,proteina:number,puerto:number,
  tipobase:number,mercado:number,fechareporte:number): void{
  this.mesescontratoservice.obt_COnsulta_mescontrato_valor(underlying,proteina,puerto,tipobase,mercado,fechareporte).subscribe(
    (response:ListaMescontrato[])=>{this.mescontrato=response,
      this.mescontratoDS=new MatTableDataSource(this.mescontrato),console.log(this.mescontratoDS.data),this.transformar()}
  ,(error: HttpErrorResponse) => {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'No existe registro',
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#4b822d'
    });
    return;
})
}
public transformar():void{

this.miscolumnas=this.mescontratoDS.data.map(item=>item.mescontrato.toString())
console.log(this.miscolumnas)
this.valores=this.mescontratoDS.data.map(item=>item.valor)
console.log(this.valores)
this.valoresM=this.valores.map(valor=>valor+this.valorspread)
console.log(this.valoresM)
}

public getunderclasi(): void {
  this.obtenerUnderClassservice.obtenerUnderlyingClassiall().subscribe(
    (response: UnderlyingClasiall[]) => {
      this.listaunderclasi = response;console.log(this.listaunderclasi);if (this.listaunderclasi.length > 0) {
        this.Id_UnderClass_1 = this.listaunderclasi[0].t068_ID;
        this.Id_UnderClass_2 = this.listaunderclasi[0].t068_ID // Por ejemplo, seleccionamos el primer elemento de la lista
      }
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public getnivelproteina(): void {
  this.obtenerProteinaservice.obtenerNivelProteina().subscribe(
    (response: ListaProteina[]) => {
      this.lista_nivelproteina = response;console.log(this.lista_nivelproteina);if (this.lista_nivelproteina.length > 0) {
        this.Id_Proteina_1 = this.lista_nivelproteina[5].t080_ID;
        this.Id_Proteina_2 = this.lista_nivelproteina[8].t080_ID // Por ejemplo, seleccionamos el primer elemento de la lista
      }
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public getPuertos(): void {
  this.obtenerPuertosservice.obtenerLoadingPort().subscribe(
    (response: ListaPuertos[]) => {
      this.lista_puertos= response;console.log(this.lista_puertos);if (this.lista_puertos.length > 0) {
        this.Id_Puerto_1 = this.lista_puertos[3].t077_ID;
        this.Id_Puerto_2 = this.lista_puertos[3].t077_ID// Por ejemplo, seleccionamos el primer elemento de la lista
      }
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public getMercados(): void {
  this.obtenerMercadosservice.obtenerMercados().subscribe(
    (response: ListaMercados[]) => {
      this.lista_mercados= response;console.log(this.lista_mercados);if (this.lista_mercados.length > 0) {
        this.Id_Mercado_1 = this.lista_mercados[1].t003_ID;
        this.Id_Mercado_2 = this.lista_mercados[1].t003_ID// Por ejemplo, seleccionamos el primer elemento de la lista
      }
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public guardarBenchmark(): void{
  if (!this.pFechaInicio) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Debes seleccionar una fecha',
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#4b822d'
    });
    return;
  }

  const datoscalculados: ContratoValor[] = this.miscolumnas.map((mes, index) => ({ mescontrato: mes, valor: this.valoresM[index] }));

  const modifiedDataSource: listaregistrobenchmark[] = datoscalculados.map(data => {
    const t225_UnderlyingClassification = this.Id_UnderClass_2;
    const t225_ProteinLevel = this.Id_Proteina_2;
    const t225_LoadingPort = this.Id_Puerto_2;
    const t225_BaseType=3;
    const t225_MonthContract=parseInt(data.mescontrato);
    const t225_TypeOfBenchmark=this.Id_Tipo_2;
    const t225_Date =parseInt(this.pFechaInicio);
    const t225_Exchange = this.Id_Mercado_2;
    const t225_RegisteredBy=this.tokenService.getUserName();
    const t225_Value=data.valor;
    const t225_Status=1;
    const t225_TypeValue='C';
    const t225_Index=null;
    
    return {
      t225_UnderlyingClassification: t225_UnderlyingClassification || 0, // Asegurar que SubyacenteID tenga un valor válido
      t225_ProteinLevel: t225_ProteinLevel || 0, // Asegurar que ProteinaID tenga un valor válido
      t225_LoadingPort: t225_LoadingPort || 0, // Asegurar que PuertoID tenga un valor válido 
      t225_BaseType: t225_BaseType ||0,  
      t225_MonthContract:t225_MonthContract || 0, 
      t225_TypeOfBenchmark:t225_TypeOfBenchmark||0,
      t225_Date:t225_Date|| 0,
      t225_Exchange: t225_Exchange || 0, // Asegurar que MercadoID tenga un valor válido
      t225_RegisteredBy:t225_RegisteredBy || '',
      t225_Value:t225_Value|| 0,
      t225_Status:t225_Status || 0,
      t225_TypeValue:t225_TypeValue || '',
      t225_Index: t225_Index || 0,  
    };
  });
 
  console.log(modifiedDataSource)

  this.registrarBench.registrarbenchmark(modifiedDataSource).subscribe(data=>{
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Carga Spread adicional Exitoso',
      confirmButtonText: "Aceptar",
    confirmButtonColor: '#4b822d'}); },
  (error: HttpErrorResponse) => {
      alert(error.message);
  })

}
}
export interface ContratoValor {
  mescontrato: string;
  valor: number;
}