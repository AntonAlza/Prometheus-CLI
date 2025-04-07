import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import { ListaConsultaBench } from 'src/app/models/Bases/consultabenchmark';

interface Food {
  value: string;
  viewValue: string;
}
export interface dos_datasource {
  s344_Tipo_Valor: string | number | undefined;
  s344_Subyacente: string;
  s344_Proteina: number;
  s344_Puerto: string;
  s344_Mercado:string;
  s344_Tipo_Benchmark: string;
  [mesesContrato: string]: number | string | undefined;
}

@Component({
  selector: 'app-consulta-benchmark',
  templateUrl: './consulta-benchmark.component.html',
  styleUrls: ['./consulta-benchmark.component.scss']
})
export class ConsultaBenchmarkComponent implements OnInit {
public consulbasetrigoDS:MatTableDataSource<ListaConsultaBench>
public consulbasetrigo: ListaConsultaBench[]=[];
public mifecha: string;
public pFechaInicio:string="";
public pFechaFin:string="";
public dtpFecIni:string="";
public dtpFecFin:string="";
public tipoBENCH: number;
public selectedOption: string;
public mesesContrato: any;
public columnasNewResult: any[];
public CalculoDS=new MatTableDataSource<dos_datasource>();
public filtroSuby: string = '';
public filtroPuert: string = '';
public filtroTip: string = '';
@ViewChild(MatSort) misort: MatSort;
columnaListaBench: string[] = [
  's344_Id'
 ,'s344_Basetype'
 ,'s344_Comodities'
 ,'s344_Subyacente'
 ,'s344_Proteina'
 ,'s344_Puerto'
 ,'s344_Mercado'
 ,'s344_fechareporte'
 ,'s344_MesContrato'
 ,'s344_Base'
 ,'s344_Flat'
 ,'s344_Flete'
];

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

  this.ConsulListaBench(this.pFechaInicio,this.selectedOption) 
  
}  

  constructor(private consultaBenchmarkService: CargabasetrigoService) { }

  ngOnInit(): void {
    if(this.pFechaInicio){
      this.ConsulListaBench(this.pFechaInicio,this.selectedOption) }
  }
  
public Consultar():void{
  if(this.pFechaInicio){
  this.ConsulListaBench(this.pFechaInicio,this.selectedOption) 
  const mesesContratoSet = new Set<number>();
  this.consulbasetrigoDS.data.forEach(item => {
  mesesContratoSet.add(item.s344_MesContrato);});
  this.mesesContrato = Array.from(mesesContratoSet).sort((a,b)=>a-b); 
  this.columnasNewResult=["s344_Tipo_Valor", "s344_Subyacente","s344_Proteina","s344_Puerto","s344_Mercado","s344_Tipo_Benchmark",...this.mesesContrato];  
  const groupedData = {};
  // Iterar sobre los datos originales para agruparlos
 this.consulbasetrigoDS.data.forEach(item => {
 const key = `${item.s344_Subyacente}-${item.s344_Proteina}-${item.s344_Puerto}-${item.s344_Mercado}-${item.s344_Tipo_Benchmark}`;

 if (!groupedData[key]) {
   groupedData[key] = {
    s344_Tipo_Valor: item.s344_Tipo_Valor,
    s344_Subyacente: item.s344_Subyacente,
    s344_Proteina: item.s344_Proteina,
    s344_Puerto: item.s344_Puerto,
    s344_Mercado: item.s344_Mercado,
    s344_Tipo_Benchmark: item.s344_Tipo_Benchmark,
  };}
groupedData[key][item.s344_MesContrato.toString()] =Math.round(item.s344_Valor);
});

// Convertir el objeto en un array de objetos y datasource
const groupedArray = Object.keys(groupedData).map(key => groupedData[key]);
this.CalculoDS = new MatTableDataSource<dos_datasource>(groupedArray);
this.CalculoDS.sort=this.misort;}
}

getEstadoClass(s344_Tipo_Valor: string): string {
  return s344_Tipo_Valor === 'C' ? 'fila-SI' : 'fila-NO';
}

public oblistaSubyacente(): string[] {
  const subyacenteUnicos = [...new Set(this.CalculoDS.data.map(dato => dato.s344_Subyacente))];
  return subyacenteUnicos;
}

public oblistaPuerto(): string[] {
  const puertoUnicos = [...new Set(this.CalculoDS.data.map(dato => dato.s344_Puerto))];
  return puertoUnicos;
}
public oblistaTipoBench(): string[] {
  const tipobenchUnicos = [...new Set(this.CalculoDS.data.map(dato => dato.s344_Tipo_Benchmark))];
  return tipobenchUnicos;
}

filtroSubyacente(valoresSeleccionados: string[]) {
  this.filtroSuby = valoresSeleccionados.map(value => value.trim().toLowerCase()).join(',');
  this.filtarseleccion();
}
filtroPuerto(valoresSeleccionados: string[]) {
  this.filtroPuert = valoresSeleccionados.map(value => value.trim().toLowerCase()).join(',');
  this.filtarseleccion();
}
filtroTipoBench(valoresSeleccionados: string[]) {
  this.filtroTip = valoresSeleccionados.map(value => value.trim().toLowerCase()).join(',');
  this.filtarseleccion();
}

filtarseleccion() {
   // Aplicar filtros secuenciales
   this.CalculoDS.filterPredicate = this.customFilterPredicate();
   console.log(this.CalculoDS.filterPredicate);
    const filters = {
      s344_Subyacente: this.filtroSuby,
      s344_Puerto: this.filtroPuert,
      s344_Tipo_Benchmark: this.filtroTip
    };
    console.log(filters);
    this.CalculoDS.filter = JSON.stringify(filters);
}

customFilterPredicate() {
  const myFilterPredicate = (data: any, filter: string) => {
    const filters = JSON.parse(filter);
    let match = true;

    for (const key in filters) {
      if (filters[key]) {
        const filterValues = filters[key].split(',').map(value => value.trim().toLowerCase());
        const dataValue = data[key]?.toLowerCase();
        if (!filterValues.includes(dataValue)) {
          match = false;
          break;
        }
      }
    }

    return match;
  };

  return myFilterPredicate;
}

public ConsulListaBench(fechareporte:string,comoditie:string): void{
  this.consultaBenchmarkService.obtenerconsultabenchmark(fechareporte,comoditie).subscribe(
    (response:ListaConsultaBench[])=>{this.consulbasetrigo=response,
      this.consulbasetrigoDS=new MatTableDataSource(this.consulbasetrigo),console.log(this.consulbasetrigoDS.data),
    this.consulbasetrigoDS.sort=this.misort}
  )
}


options: any[] = [
  { value: 'Aceite de Soya', viewValue: 'Aceite de Soya' },
  { value: 'Harina de Soya', viewValue: 'Harina de Soya' },
  { value: 'Trigo', viewValue: 'Trigo' }
];

}

