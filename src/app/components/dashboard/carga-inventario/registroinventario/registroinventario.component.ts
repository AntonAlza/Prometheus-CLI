import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import { ListaInvetarioBruto } from 'src/app/models/Bases/inventariobruto';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { UnderlyingClasiall } from 'src/app/models/Fisico/underlyingclasifiall';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { Sociedad } from 'src/app/models/IFD/sociedad';
import { data } from 'src/app/shared/data/dashboard/dashboard1/dashboard1';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';
export interface InventarioAgrupado {
  s347_Sociedad: string;
  s347_Subyacente: string;
  s347_Valor: number;
}

@Component({
  selector: 'app-registroinventario',
  templateUrl: './registroinventario.component.html',
  styleUrls: ['./registroinventario.component.scss']
})
export class RegistroinventarioComponent implements OnInit {

@ViewChild(MatSort) misort: MatSort;
public frameInventarioDS:MatTableDataSource<ListaInvetarioBruto>;
public frameInventario: ListaInvetarioBruto[]=[];
fileName: string;
files: any;
progress: any;
selectedDate: any;
// public framebasetrigoDS:MatTableDataSource<BaseTrigoValor>
// public framebasetrigo: BaseTrigoValor[]=[];
public pFechaInicio:string="";
public pFechaFin:string="";
public dtpFecIni:string="";
public dtpFecFin:string="";
public tipoBENCH: number;
public fechaActual: Date = new Date();
public mifecha: string;
public mihora: string;
public listaSociedad: Sociedad[];
public listaunderclasi: UnderlyingClasiall[];
public filtroSuby: string = '';
public filtroSoc: string='';
public selectedCells: Set<string> = new Set<string>();
public isSelecting: boolean = false;
public totalSum: number = 0;
public totalCount: number = 0;

  constructor(private blobService: AzureBlobStorageService,
              private registroInventarioService: CargabasetrigoService,
              private listaInvetariobrutoService:CargabasetrigoService,
              private tokenService: TokenService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private obetenerunderall:CargabasetrigoService,
              private registrarStockTACKING:CargabasetrigoService) { }
 discolumnvalor: string[] = [
                's347_Id'
               ,'s347_nombresociedad'
               ,'s347_Sociedad'
               ,'s347_TipodeTrigo'
               ,'s347_Subyacente'
               ,'s347_Valor'
            ];
  ngOnInit(): void {
    this.getSociedad();
    this.getunderclasi();
  }

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
    this.cargarArchivo()
  }

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
public  agregarCeroIzquierda(valor: number): string {
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
      this.dtpFecFin = this.dtpFecFin;
    }
   
    this.obtenerHoraFechatoday();
    
  }  

public async cargarArchivo(){
    for (const item of this.files) {
      const miextension=item.name.split('.').pop();
      const namesinextension=item.name.replace('.' + miextension, '');
      if (miextension!== 'xlsx') {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Debes adjuntar archivo Excel',
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#4b822d'
        });
        return;}
      const nameconfecha='INVENTARIO'+'_'+this.pFechaInicio;
      const newfilename='BASESTRIGO/'+nameconfecha+'.'+miextension;
      const newfilenamesolo=nameconfecha+'.'+miextension;            
       this.blobService.uploadFile(item, newfilename,()=>{this.fileName=newfilenamesolo;console.log(newfilename),console.log("lo pude reemplazar"),
       this.registrainventarioblob(this.pFechaInicio,newfilenamesolo,this.tokenService.getUserName(),this.mifecha,this.mihora)})     
      } 
}

public registrainventarioblob(fechareporte:string,newfilename:string,usuarioname:string,fecharegistro:string,horaregistro:string):void{
  this.registroInventarioService.registroInventarioBruto(fechareporte,newfilename,usuarioname,fecharegistro,horaregistro).subscribe(
    response => {console.log('Respuesta del servicio:', response),this.obtenerlistainventarioBruto(fechareporte),
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: response,
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#4b822d'
    })},
    error => {console.error('Error al obtener lista del excel trigo:', error)})
}
public obtenerlistainventarioBruto(fechareporte:string): void{
  this.listaInvetariobrutoService.obtenerlistainventario(fechareporte,).subscribe(
    (response:ListaInvetarioBruto[])=>{this.frameInventario=response;
      this.frameInventarioDS=new MatTableDataSource(this.frameInventario);
      this.frameInventarioDS.sort=this.misort;
    }
  )
}
public isNull(value: any): boolean {
  return value === null;
}
public TransformarTrigo(): void{
  const nuevoDataStock = agruparYSumarStock(this.frameInventarioDS.data);
  console.log(nuevoDataStock);
  const modiDSinventario:any[]=nuevoDataStock.filter(data=>data.s347_Subyacente!==null).map(data=>{
    const t075_Society=this.getSocietyIdByName(data.s347_Sociedad);
    const t075_UnderlyingClassification=this.getUnderlyingIdByName(data.s347_Subyacente);
    const t075_Date=parseInt(this.pFechaInicio);
    const t075_RegisteredBy=this.tokenService.getUserName();
    const t075_MetricTons=data.s347_Valor;
    const t075_USDValue=null;
    const t075_USDPerMetricTon=null;
    const t075_Status=1;
    return{
      t075_Society:t075_Society||0,
      t075_UnderlyingClassification:t075_UnderlyingClassification||0,
      t075_Date:t075_Date||0,
      t075_RegisteredBy:t075_RegisteredBy||'',
      t075_MetricTons:t075_MetricTons||0,
      t075_USDValue:t075_USDValue||0,
      t075_USDPerMetricTon:t075_USDPerMetricTon||0,
      t075_Status:t075_Status||0,
    }
  })
  console.log(modiDSinventario)
  this.registrarStockTACKING.registrarStockTacking(modiDSinventario,parseInt(this.pFechaInicio)).subscribe(data=>{
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Carga de inventario Exitoso',
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#4b822d'}); },
  (error: HttpErrorResponse) => {
      alert(error.message);
  })

}
public getSociedad(): void {
  this.portafolioMoliendaIFDService.getSociedad().subscribe(
    (response: Sociedad[]) => {
      this.listaSociedad = response;console.log(this.listaSociedad)
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public getunderclasi(): void {
  this.obetenerunderall.obtenerUnderlyingClassiall().subscribe(
    (response: UnderlyingClasiall[]) => {
      this.listaunderclasi = response;console.log(this.listaunderclasi)
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}
public getSocietyIdByName(SociedadName: string): number | undefined {
  const Socie = this.listaSociedad.find(c => c.t033_Name === SociedadName);
  return Socie ? Socie.t033_ID : undefined;}
public getUnderlyingIdByName(UnderName: string): number | undefined {
  const under = this.listaunderclasi.find(c => c.t068_Ticker === UnderName);
  return under ? under.t068_ID : undefined;}

public obtenerOpcionesSuby(): string[] {
    const subyUnicos = [...new Set(this.frameInventario.map(dato => dato.s347_TipodeTrigo))];
    return subyUnicos;}

public obtenerOpcionesSociedad(): string[] {
      const sociedadUnicos = [...new Set(this.frameInventario.map(dato => dato.s347_nombresociedad))];
      return sociedadUnicos;}

public filtroSubyacente(valoresSeleccionados: string[]) {
    this.filtroSuby = valoresSeleccionados.map(value => value.trim().toLowerCase()).join(',');
    this.filtarseleccion();
  }
public filtroSociedad(valoresSeleccionados: string[]) {
    this.filtroSoc = valoresSeleccionados.map(value => value.trim().toLowerCase()).join(',');
    this.filtarseleccion();
  }

public filtarseleccion() {
    // Aplicar filtros secuenciales
    this.frameInventarioDS.filterPredicate = this.customFilterPredicate();
    console.log(this.frameInventarioDS.filterPredicate);
     const filters = {
      s347_nombresociedad: this.filtroSoc,
      s347_TipodeTrigo: this.filtroSuby,
      
     };
     console.log(filters);
     this.frameInventarioDS.filter = JSON.stringify(filters);
 }

public  customFilterPredicate() {
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

startSelection(element: ListaInvetarioBruto, column: string) {
  this.isSelecting = true;
  this.selectedCells.clear(); // Limpiar selección previa
  this.addCellToSelection(element, column);
}
updateSelection(element: ListaInvetarioBruto, column: string) {
  if (this.isSelecting) {
    this.addCellToSelection(element, column);
  }
}
endSelection() {
  this.isSelecting = false;
  this.calculateSumAndCount();
}
addCellToSelection(element: ListaInvetarioBruto, column: string) {
  const cellId = this.getCellId(element, column);
  if (!this.selectedCells.has(cellId)) {
    this.selectedCells.add(cellId);
  }
}
getCellId(element: ListaInvetarioBruto, column: string): string {
  return `${this.frameInventarioDS.data.indexOf(element)}-${column}`;
}
isSelected(element: ListaInvetarioBruto, column: string): boolean {
  return this.selectedCells.has(this.getCellId(element, column));
}
calculateSumAndCount() {
  this.totalSum = 0;
  this.totalCount = 0;
  this.selectedCells.forEach(cellId => {
    const [rowIndex, column] = cellId.split('-');
    const element = this.frameInventarioDS.data[+rowIndex];
    this.totalSum += element[column];
    this.totalCount++;
  });
}

}
function agruparYSumarStock(data: ListaInvetarioBruto[]): InventarioAgrupado[] {
  const resultado: { [key: string]: InventarioAgrupado } = {};

  data.forEach(item => {
      const key = `${item.s347_Sociedad}-${item.s347_Subyacente}`;

      if (!resultado[key]) {
          resultado[key] = {
              s347_Sociedad: item.s347_Sociedad,
              s347_Subyacente: item.s347_Subyacente,
              s347_Valor: 0
          };
      }

      resultado[key].s347_Valor += item.s347_Valor;
  });

  return Object.values(resultado);
}

