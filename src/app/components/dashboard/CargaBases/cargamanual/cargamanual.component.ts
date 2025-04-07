import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import { listaregistrobenchmark } from 'src/app/models/Bases/registrobenchmark';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';

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

type OptionType = PuertoOption | ProteinaOption;


interface NuevoDataSourceType extends tipodatasource_1 {

}
export interface tipodatasource_1 {
  Posicion: number;
  Subyacente: string;
  Proteina: number;
  Puerto: string;
  Mercado:string;
  Tipo: string;
}
export interface tipodatasource_2 {
  Posicion: number;
  Subyacente: string;
  Proteina: number;
  Puerto: string;
  Mercado:string;
  Tipo: string;
  [columnaMes: string]: number | string | undefined;
}

@Component({
  selector: 'app-cargamanual',
  templateUrl: './cargamanual.component.html',
  styleUrls: ['./cargamanual.component.scss']
})
export class CargamanualComponent implements OnInit {

public fileName: string;
public files: any;
public progress: any;
public columnaMes: string[];
public columnasTotales: string[];
public mifecha: string;
public pFechaInicio:string="";
public pFechaFin:string="";
public dtpFecIni:string="";
public dtpFecFin:string="";
editedItem: any[] = [];
isEditMode: boolean[] = [];

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

 datos: tipodatasource_1[] = [
  { Posicion: 1,Subyacente: "HRW",Proteina: 0.11,Puerto:"Houston",Mercado:"KCBT",Tipo:"Base"},
  { Posicion: 2,Subyacente: "HRW" ,Proteina: 0.115,Puerto:"Houston",Mercado:"KCBT",Tipo:"Base"},
  { Posicion: 3,Subyacente: "HRW" ,Proteina:0.12,Puerto:"Houston",Mercado:"KCBT",Tipo:"Base"},
  { Posicion: 4,Subyacente: "WCW" ,Proteina:0.12,Puerto:"Vancou",Mercado:"KCBT",Tipo:"Base"},
  { Posicion: 5,Subyacente: "DNS" ,Proteina:0.135,Puerto:"Portland",Mercado:"MGEmin",Tipo:"Base"},
  { Posicion: 6,Subyacente: "TPA" ,Proteina:0.135,Puerto:"Bahía Blanca",Mercado:"FLAT",Tipo:"Flat"},
  { Posicion: 7,Subyacente: "TPR" ,Proteina:0.125,Puerto:"Black Sea",Mercado:"FLAT",Tipo:"Flat"},
  { Posicion: 8,Subyacente: "CWRS" ,Proteina:0.13,Puerto:"Vancou",Mercado:"MGEmin",Tipo:"Base"},
  { Posicion: 9,Subyacente: "CWAD2" ,Proteina:0.125,Puerto:"Vancou",Mercado:"FLAT",Tipo:"Flat"},
  { Posicion: 10,Subyacente: "SRW" ,Proteina:0.087,Puerto:"Mriver",Mercado:"CBOT",Tipo:"Base"},
  { Posicion: 11,Subyacente: "SWW" ,Proteina:0.105,Puerto:"Portland",Mercado:"CBOT",Tipo:"Base"},
];
nuevosdatos: tipodatasource_2[]=[]
miDataSource_1=new MatTableDataSource<tipodatasource_1>(this.datos)
// nuevoDataSource: MatTableDataSource<any>;
nuevoDataSource=new MatTableDataSource<tipodatasource_2>(this.nuevosdatos)
  dataSourceApilado: any;
datasourcemodi=new MatTableDataSource<listaregistrobenchmark>()

 public ApilarTransformar():void{
  // const datosApilados: any[] = [];
  // const columnasApiladas = Object.keys(this.nuevoDataSource.data[0]).slice(0,6); // Obtiene las columnas del dataSource a partir del índice 6 hasta el 11 (inclusive)
  const stackedDatasource: { Posicion: number, Subyacente: string, Proteina: number, Puerto: string, Mercado: string,Tipo:string, nuevacolumna: string, nuevovalor: number }[] = [];

    // Iterar sobre cada fila del datasource original
    for (const row of this.nuevoDataSource.data) {
      // Obtener las columnas de meses dinámicas
      const months = Object.keys(row).filter(key => !['Posicion', 'Subyacente', 'Proteina', 'Puerto', 'Mercado','Tipo','editing'].includes(key));
  
      // Iterar sobre las columnas de meses dinámicas
      for (const month of months) {
          const nuevovalor = row[month] as number;
          if (nuevovalor !== 0) { // Solo si nuevovalor es diferente de cero
              const stackedRow = {
                  Posicion: row.Posicion,
                  Subyacente: row.Subyacente,
                  Proteina: row.Proteina,
                  Puerto: row.Puerto,
                  Mercado: row.Mercado,
                  Tipo: row.Tipo,
                  nuevacolumna: month,
                  nuevovalor: nuevovalor
              };
              stackedDatasource.push(stackedRow);
          }
      }
  }
  
  console.log(this.nuevoDataSource.data)
  console.log(stackedDatasource)

  const modifiedDataSource: listaregistrobenchmark[] = stackedDatasource.map(data => {
    const t225_UnderlyingClassification = obtenerIdOption(this.SubyacenteOption, data.Subyacente);
    const t225_ProteinLevel = data.Proteina
    const t225_LoadingPort = obtenerIdOption(this.PuertoOption, data.Puerto);
    const t225_BaseType=3;
    const t225_MonthContract=parseInt(data.nuevacolumna);
    const t225_TypeOfBenchmark=obtenerIdOption(this.TipoOption,data.Tipo);
    const t225_Date =parseInt(this.pFechaInicio);
    const t225_Exchange = obtenerIdOption(this.MercadoOption, data.Mercado);
    const t225_RegisteredBy=this.tokenService.getUserName();
    const t225_Value=data.nuevovalor;
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

  this.registrarBench.registrarbenchmark(modifiedDataSource).subscribe(data=>{
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Carga Manual Exitoso',
      confirmButtonText: "Aceptar",
    confirmButtonColor: '#4b822d'}); },
  (error: HttpErrorResponse) => {
      alert(error.message);
  })
  
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
  
  const selectedMonth = parseInt(this.pFechaInicio.slice(4, 6));
  const selectedYear = parseInt(this.pFechaInicio.slice(0, 4));
  this.columnaMes = [];

  for (let i = 0; i < 12; i++) {
    const nextMonth = selectedMonth + i; 
    const nextYear = selectedYear + Math.floor((selectedMonth + i - 1) / 12); 
    const formattedMonth = ((nextMonth - 1) % 12) + 1; 
    const mesAnioConcatenado = this.formatMesAnio(formattedMonth, nextYear); 
    this.columnaMes.push(mesAnioConcatenado);
  }

this.columnasTotales=["Posicion", "Subyacente","Proteina","Puerto","Mercado","Tipo",...this.columnaMes,"Acciones"];  

const datosConMeses = this.miDataSource_1.data.map(dato => ({ ...dato }));
this.columnaMes.forEach(mes => {datosConMeses.forEach(dato => {dato[mes] = 0;});
});
this.nuevoDataSource = new MatTableDataSource<tipodatasource_2>(datosConMeses);
console.log(this.nuevoDataSource.data)
}  

 private formatMesAnio(month: number, year: number): string {
  const monthString = month < 10 ? '0' + month : '' + month;
  return year+ '' + monthString;
}

constructor(private tokenService: TokenService,
            private registrarBench: CargabasetrigoService) {}

onEdit(element: any): void {
      element.editing = true;
  }
onSave(element: any): void {
    element.editing = false;
}

nextId = 1; // Inicializamos el contador de ID
addRowToEnd() {
  const lastId = this.nuevoDataSource.data.length > 0 ? this.nuevoDataSource.data[this.nuevoDataSource.data.length - 1].Posicion : 0;
  const newData = {Posicion: lastId + 1 ,Subyacente: '',Proteina: 0,Puerto: '',Mercado: '',Tipo:''}; 
  this.nuevoDataSource.data.push(newData);
  this.nuevoDataSource.data = [...this.nuevoDataSource.data]; 
}

deleteLastRow() {
  if (this.nuevoDataSource.data.length > 0) {
    this.nuevoDataSource.data.pop();
    this.nuevoDataSource.data = [...this.nuevoDataSource.data];
  }
}



  ngOnInit(): void {
  }



}
