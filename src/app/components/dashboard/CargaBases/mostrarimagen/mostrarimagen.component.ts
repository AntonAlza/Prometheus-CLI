import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CalculoImagenTrigo } from 'src/app/models/Bases/calculoImagenTrigo';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import { ImagenBaseTrigo } from 'src/app/models/Bases/imagenbasetrigo';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';

export class filterValues {
  s346_subyacente:string[];
}


export interface PuertoOption {
  id: number;
  value: string;
}
export interface ProteinaOption {
  id: number;
  value: number;
}
export interface SubyacenteOption {
  id: number;
  value: string;
}
export interface MercadoOption {
  id: number;
  value: string;
}
export interface Option {
  id: number;
  value: string | number;
}

function obtenerIdOption(optionsArray: Option[], value: string | number): number | null {
  const option = optionsArray.find(option => option.value === value);
  return option ? option.id : null;
}
export interface dos_datasource {
  s346_calculo: string | number | undefined;
  s346_subyacente: string;
  s346_proteina: number;
  s346_puerto: string;
  s346_mercado:string;
  s346_tipo: string;
  [mesesContrato: string]: number | string | undefined;
}

@Component({
  selector: 'app-mostrarimagen',
  templateUrl: './mostrarimagen.component.html',
  styleUrls: ['./mostrarimagen.component.scss']
})
export class MostrarimagenComponent implements OnInit{



public frameimagenbasetrigoDS:MatTableDataSource<ImagenBaseTrigo>;
public frameimagenbasetrigo:ImagenBaseTrigo[]=[];
public frameCalcimagenbasetrigoDS:MatTableDataSource<CalculoImagenTrigo>;
public frameCalcimagenbasetrigo:CalculoImagenTrigo[]=[];
public fileName: string;
public files: any;
public pFechaInicio:string="";
public pFechaFin:string="";
public dtpFecIni:string="";
public dtpFecFin:string="";
public segundoDatasource: any[] = [];
public mesesContrato: any;
public columnasNewResult: any[];
public CalculoDS: MatTableDataSource<dos_datasource>;
public filterValue: filterValues;
public fechaActual: Date = new Date();
public mifecha: string;
public mihora: string;

@ViewChild(MatSort) sort!: MatSort;
@ViewChild('MatSortSQL') MatSortSQL!: MatSort;

PuertoOption: Option[] = [
  { id: 1, value: "Houston" },
  { id: 2, value: "Mriver" },
  { id: 3, value: "Portland" },
  { id: 4, value: "Vancou" },
  { id: 5, value: "EU" },
  { id: 6, value: "Black Sea" },
  { id: 7, value: "Albany" },
  { id: 8, value: "Plate" },
  { id: 9, value: "Aún sin puerto asignado" },
  { id: 10, value: "Buenos Aires" },
  { id: 11, value: "Bahía Blanca" },
  { id: 12, value: "Rosario" },
  { id: 13, value: "UP River" },
  { id: 14, value: "Arica" },
  { id: 15, value: "Kaliningrado" },
  { id: 16, value: "No Aplica Puerto" },
  { id: 17, value: "US GULF" },
  { id: 18, value: "St. Lawrence" }
];
ProteinaOption: Option[] = [
  { id: 1, value: 0 },
  { id: 2, value: 0.087 },
  { id: 3, value: 0.1 },
  { id: 4, value: 0.105 },
  { id: 5, value: 0.11 },
  { id: 6, value: 0.115 },
  { id: 7, value: 0.12 },
  { id: 8, value: 0.125 },
  { id: 9, value: 0.13 },
  { id: 10, value: 0.135 },
  { id: 11, value: 0.14 },
  { id: 12, value: 0.145 },
  { id: 13, value: 0.146 },
  { id: 14, value: 0.152 },
  { id: 15, value: 0.455 },
  { id: 16, value: 0.46 },
  { id: 17, value: 0.465 },
  { id: 18, value: 0.47 },
  { id: 19, value: 0.475 },
  { id: 20, value: 0.48 },
  { id: 21, value: 0.485 },
  { id: 22, value: 0.49 }
];
SubyacenteOption: Option[] = [
  {id:1,  value:"CPSR"},
  {id:2,	value:"CWRS"},
  {id:17,	value:"CWAD1"},
  {id:4,	value:"DNS"},
  {id:5,	value:"HAD"},
  {id:6,	value:"HRW"},
  {id:7,	value:"TPA"},
  {id:8,	value:"TPR"},
  {id:9,	value:"SRW"},
  {id:14,	value:"GERMAN"},
  {id:15,	value:"CWAD2"},
  {id:16,	value:"CWAD3"},
  {id:19,	value:"WCW"},
  {id:24,	value:"SWW"},
];
MercadoOption: Option[]=[
  {id:1, value:"CBOT"},
  {id:6, value:"KCBT"},
  {id:7, value:"MGEmin"},
  {id:18 ,value:"FLAT"}
]
TipoOption: Option[]=[
  {id:1, value:"Base"},
  {id:2, value:"Flat"},
  {id:3, value:"Flete"}
]

public obtenerHoraFechatoday():void{
  const hora: string = this.agregarCeroIzquierda(this.fechaActual.getHours());
  const minutos: string = this.agregarCeroIzquierda(this.fechaActual.getMinutes());
  const segundos: string = this.agregarCeroIzquierda(this.fechaActual.getSeconds());
  console.log('Hora:', `${hora}:${minutos}:${segundos}`);
  this.mihora=`${hora}:${minutos}:${segundos}`;

  const dia: string = this.agregarCeroIzquierda(this.fechaActual.getDate());
  const mes: string = this.agregarCeroIzquierda(this.fechaActual.getMonth() + 1); // Se suma 1 porque los meses comienzan desde 0
  const año: number = this.fechaActual.getFullYear();
  console.log('Fecha:', `${dia}/${mes}/${año}`);
  this.mifecha=`${dia}/${mes}/${año}`;
}
agregarCeroIzquierda(valor: number): string {
  return valor < 10 ? '0' + valor : valor.toString();
}

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
    this.dtpFecFin = this.dtpFecIni;
  }
  this.obtenerHoraFechatoday();
}  
 private formatMesAnio(month: number, year: number): string {
  const monthString = month < 10 ? '0' + month : '' + month;
  return year+ '' + monthString;
}

 ngOnInit(): void {
}
 
constructor(private blobService: AzureBlobStorageService,
            private registrobrutoimagentrigoService:CargabasetrigoService,
            private imagenbasetrigovalorService: CargabasetrigoService,
            private obtenerCalculoImagenService: CargabasetrigoService,
            private tokenService: TokenService,
            private registrarBench: CargabasetrigoService
            ){};

discolumnvalor: string[] = [
              's342_Id'
             ,'s342_producto'
             ,'s342_subyacente'
             ,'s342_proteina'
             ,'s342_puerto'
             ,'s342_puerto_1'
             ,'s342_mercado'
             ,'s342_tipo'
             ,'s342_mesbase'
             ,'s342_mescontrato'
             ,'s342_Valor'
          ];
ColumnCalcImagen: string[] = [
            's346_Id'
           ,'s346_subyacente'
           ,'s346_proteina'
           ,'s346_puerto'
           ,'s346_mercado'
           ,'s346_tipo'
           ,'s346_mescontrato'
           ,'s346_valor'
           ,'s346_calculo'
        ];
  //al arrastrar los archivos
  public onFileDropped1($event) {
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
    this.files=$event;
    this.cargarArchivo();
  }

  //al adjuntar los archivos desde el explorador
 public fileBrowseHandler1(files) {
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
  
    this.files=files;
    this.cargarArchivo();
  }

  public async cargarArchivo(){
    for (const item of this.files) {
      const miextension=item.name.split('.').pop();
      if (miextension!== 'xlsx') {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Debes adjuntar archivo Excel',
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#4b822d'
        });
        return;}
      const nameconfecha='IMAGENBASETRIGO'+'_'+this.pFechaInicio;
      const newfilename='BASESTRIGO/'+nameconfecha+'.'+miextension;
      const newfilenamesolo=nameconfecha+'.'+miextension;             
      this.blobService.uploadFile(item, newfilename,()=>{this.fileName=newfilenamesolo,console.log(newfilename),console.log("lo pude reemplazar"),
      this.registraimagenblob(this.pFechaInicio,newfilenamesolo,this.tokenService.getUserName(),this.mifecha,this.mihora)})     
      ;   

      }
}


//Guarda la Imagen en el Blob y aplica OCR llamando a api Python
// para despues obtener y mostarr la lista de datos en la app, de paso hace el calculode otros productos
  public registraimagenblob(fechareporte:string,newfilename:string,usuarioname:string,fecharegistro:string,horaregistro:string):void{
    this.registrobrutoimagentrigoService.registroImagenTrigo(fechareporte,newfilename,usuarioname,fecharegistro,horaregistro).subscribe(
      response => {
        console.log('Respuesta del servicio:', response),
          Swal.fire({
              position: 'center',
              icon: 'success',
              title: response,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
               }).then((result) => {
        // Se ejecuta después de que se confirma la primera alerta
                   if (result.isConfirmed) 
                  {
          // Segunda alerta
                   this.obtenerlistaImagenbasetrigo(fechareporte),
                   this.calcularImagen(fechareporte.toString())
                  }
                 })
                },
      error => {
        Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Error al obtener data de Imagen:',
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#4b822d'
      }),console.error('Error al obtener data de Imagen:', error);
    })
  }
//Obtengo la lista generada de l ocr en la base de datos
  public obtenerlistaImagenbasetrigo(fechareporte:string): void{
    this.imagenbasetrigovalorService.listaImagenTrigo(fechareporte).subscribe(
      (response:ImagenBaseTrigo[])=>{this.frameimagenbasetrigo=response,this.frameimagenbasetrigoDS=new MatTableDataSource(this.frameimagenbasetrigo),
      this.frameimagenbasetrigoDS.sort=this.sort
       })}
// Transformo los datos de la imagen para que esten aptos para el calculo
  public calcularImagen(fechareporte:string): void {
        this.obtenerCalculoImagenService.listaCalculoImagenTrigo(fechareporte).subscribe(
          (response:CalculoImagenTrigo[])=>{
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Cálculos Correctos',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
            }),this.frameCalcimagenbasetrigo=response,this.frameCalcimagenbasetrigoDS=new MatTableDataSource(this.frameCalcimagenbasetrigo),
            this.ClickTransFormPoner(),console.log(this.frameCalcimagenbasetrigoDS.data)},error => {Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'No se puede Calcular, Revisar datos de la imagen',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
            }),console.error('No se puede Calcular', error);}
        )
      }

  public ClickTransFormPoner():void{
      const mesesContratoSet = new Set<number>();
      this.frameCalcimagenbasetrigoDS.data.forEach(item => {
      mesesContratoSet.add(item.s346_mescontrato);});
      this.mesesContrato = Array.from(mesesContratoSet).sort((a,b)=>a-b);
      this.columnasNewResult=["s346_calculo", "s346_subyacente","s346_proteina","s346_puerto","s346_mercado","s346_tipo",...this.mesesContrato];  
      const groupedData = {};
      // Iterar sobre los datos originales para agruparlos
     this.frameCalcimagenbasetrigoDS.data.forEach(item => {
     const key = `${item.s346_subyacente}-${item.s346_proteina}-${item.s346_puerto}-${item.s346_mercado}-${item.s346_tipo}`;

     if (!groupedData[key]) {
       groupedData[key] = {
        s346_calculo: item.s346_calculo,
        s346_subyacente: item.s346_subyacente,
        s346_proteina: item.s346_proteina,
        s346_puerto: item.s346_puerto,
        s346_mercado: item.s346_mercado,
        s346_tipo: item.s346_tipo,
      };}
  groupedData[key][item.s346_mescontrato.toString()] =Math.round(parseFloat(item.s346_valor));
});

// Convertir el objeto en un array de objetos y datasource
const groupedArray = Object.keys(groupedData).map(key => groupedData[key]);
this.CalculoDS = new MatTableDataSource<dos_datasource>(groupedArray);
this.CalculoDS.sort=this.MatSortSQL;
console.log(this.CalculoDS.data);
  }


  public registrarenbench():void{
    // Transformar el Store frameCalcimagenbasetrigoDS//
  const modifiedDataSource: any[] = this.frameCalcimagenbasetrigoDS.data.map(data => {
    const t225_UnderlyingClassification = obtenerIdOption(this.SubyacenteOption, data.s346_subyacente);
    const t225_ProteinLevel =parseFloat(data.s346_proteina);
    const t225_LoadingPort = obtenerIdOption(this.PuertoOption, data.s346_puerto);
    const t225_BaseType=3;
    const t225_MonthContract=data.s346_mescontrato;
    const t225_TypeOfBenchmark=obtenerIdOption(this.TipoOption,data.s346_tipo);
    const t225_Date =parseInt(data.s346_date);
    const t225_Exchange = obtenerIdOption(this.MercadoOption, data.s346_mercado);
    const t225_RegisteredBy=data.s346_usuario;
    const t225_Value=parseFloat(data.s346_valor);
    const t225_Status=1;
    const t225_TypeValue=data.s346_calculo;
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
  
  console.log(modifiedDataSource);
  this.registrarBench.registrarbenchmark(modifiedDataSource).subscribe(data=>{
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Carga Imagen Exitoso',
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#4b822d'}); },
  (error: HttpErrorResponse) => {
      alert(error.message);
  })
  
  }

  getEstadoClass(s346_calculo: string): string {
    return s346_calculo === 'C' ? 'fila-SI' : 'fila-NO';
  }

  public obtenerOpcionesMercado(): string[] {
    const mercadosUnicos = [...new Set(this.CalculoDS.data.map(dato => dato.s346_subyacente))];
    return mercadosUnicos;
  }

  aplicarFiltro(valoresSeleccionados: string[]) {
    const filtroAproximado = valoresSeleccionados.map(valor => valor.trim().toLowerCase());

    // Aplicar el filtro
    this.CalculoDS.filterPredicate = (data: any, filter: string) => {
        const dataString = data.s346_subyacente ? data.s346_subyacente.toString().toLowerCase() : ''; // Convertir a cadena y a minúsculas
        return filtroAproximado.some(val => dataString.includes(val)); // Cambiar a some para que se aplique un operador lógico OR
    };

    // Establecer el filtro en los valores seleccionados separados por un operador lógico OR
    this.CalculoDS.filter = filtroAproximado.join('|');
  }

  isNull(value: any): boolean {
    return value === null;
  }

}




