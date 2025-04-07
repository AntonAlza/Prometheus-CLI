import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BaseTrigoValor } from 'src/app/models/Bases/basetrigovalor';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostravaluehistoric',
  templateUrl: './mostravaluehistoric.component.html',
  styleUrls: ['./mostravaluehistoric.component.scss']
})
export class MostravaluehistoricComponent implements OnInit{
@ViewChild(MatSort) misort: MatSort;
fileName: string;
files: any;
progress: any;
selectedDate: any;
public framebasetrigoDS:MatTableDataSource<BaseTrigoValor>
public framebasetrigo: BaseTrigoValor[]=[];
public pFechaInicio:string="";
public pFechaFin:string="";
public dtpFecIni:string="";
public dtpFecFin:string="";
public tipoBENCH: number;
public fechaActual: Date = new Date();
public mifecha: string;
public mihora: string;

constructor(private blobService: AzureBlobStorageService,
            private listaBasetrigovalorService:CargabasetrigoService,
            private registrobrutovaluehistoricService: CargabasetrigoService,
            private transfvalortrigoService:CargabasetrigoService,
            private tokenService: TokenService ){}
  ngOnInit(): void {
    
  }
discolumnvalor: string[] = [
    's340_Id'
   ,'s340_fecha'
   ,'s340_producto'
   ,'s340_puerto'
   ,'s340_market'
   ,'s340_mescontrato'
   ,'s340_base'
   ,'s340_fob'
   ,'s340_flete'
];

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
    this.dtpFecFin = this.dtpFecFin;
  }
 
  this.obtenerHoraFechatoday();
  
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
        const nameconfecha='VALORHISTORICO'+'_'+this.pFechaInicio;
        const newfilename='BASESTRIGO/'+nameconfecha+'.'+miextension;
        const newfilenamesolo=nameconfecha+'.'+miextension;            
         this.blobService.uploadFile(item, newfilename,()=>{this.fileName=newfilenamesolo;console.log(newfilename),console.log("lo pude reemplazar"),
         this.registravaluehistoricblob(this.pFechaInicio,newfilenamesolo,this.tokenService.getUserName(),this.mifecha,this.mihora)
        })     
        }
  }
 
  
  public registravaluehistoricblob(fechareporte:string,newfilename:string,usuarioname:string,fecharegistro:string,horaregistro:string):void{
    this.registrobrutovaluehistoricService.registroValueTrigo(fechareporte,newfilename,usuarioname,fecharegistro,horaregistro).subscribe(
      response => {console.log('Respuesta del servicio:', response),this.obtenerlistabasetrigo(fechareporte),
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#4b822d'
      })},
      error => {Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Error al obtener data de excel:',
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#4b822d'
      }),console.error('Error al obtener data de excel:', error)})
  }
public TransformarTrigo(): void{
  this.ejecutartransfvalortrigo(this.pFechaInicio)
}

public ejecutartransfvalortrigo(fechareporte:string):void{
  this.transfvalortrigoService.obtenerrespuesta(fechareporte).subscribe(
    response => {console.log('Respuesta del servicio:', response);
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: response,
    confirmButtonText: "Aceptar",
    confirmButtonColor: '#4b822d'
  })},
  error => {console.error('Error en la transformacion trigo:', error);})
}


public obtenerlistabasetrigo(fechareporte:string): void{
    this.listaBasetrigovalorService.listabasestrigo(fechareporte,).subscribe(
      (response:BaseTrigoValor[])=>{this.framebasetrigo=response,
        this.framebasetrigoDS=new MatTableDataSource(this.framebasetrigo),
        this.framebasetrigoDS.sort=this.misort
      }
    )
  }

  public obtenerOpcionesMercado(): string[] {
    const datos: string[] = [
      'HRW',
      'HRS',
      'CWRS',
      'CWAD',
      'PSR',
      'GERMAN',
      'ARG', 
      'Russ',
      'SRW'
    ];
    
    const mercadosUnicos = [...new Set(datos.map(dato => dato))];
    return mercadosUnicos;
  }
  
  aplicarFiltro(valoresSeleccionados: string[]) {
    const filtroAproximado = valoresSeleccionados.map(valor => valor.trim().toLowerCase());

    // Aplicar el filtro
    this.framebasetrigoDS.filterPredicate = (data: any, filter: string) => {
        const dataString = data.s340_producto ? data.s340_producto.toString().toLowerCase() : ''; // Convertir a cadena y a minúsculas
        return filtroAproximado.some(val => dataString.includes(val)); // Cambiar a some para que se aplique un operador lógico OR
    };

    // Establecer el filtro en los valores seleccionados separados por un operador lógico OR
    this.framebasetrigoDS.filter = filtroAproximado.join('|');
  }
}
