import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingService } from 'src/app/components/loading.service';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import { objConsumobruto } from 'src/app/models/Bases/consumobruto';
import { ObjConsumo } from 'src/app/models/Bases/objconsumo';
import { UnderlyingClasiall } from 'src/app/models/Fisico/underlyingclasifiall';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { Sociedad } from 'src/app/models/IFD/sociedad';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registroconsumo',
  templateUrl: './registroconsumo.component.html',
  styleUrls: ['./registroconsumo.component.scss']
})
export class RegistroconsumoComponent implements AfterViewInit  {

  public fileName: string;
  public files: any;
  public pFechaInicio:string="";
  public pFechaFin:string="";
  public dtpFecIni:string="";
  public dtpFecFin:string="";
  public tipoBENCH: number;
  public fechaActual: Date = new Date();
  public mifecha: string;
  public mihora: string;
  public listaconsumobruto:objConsumobruto[]=[];
  public listaconsumobrutoDS = new MatTableDataSource<objConsumobruto>([]);
  columnKeys: string[] = [];
  loading$= this.loader.loading$
  @ViewChild(MatSort) sort: MatSort;
  public selectionSum: number;
  public selectionCount:number;
  public selectionAvg:number;
  public listaregistroconsumo:ObjConsumo[]=[];
  public fecharegistro:string;
  public listaSociedad: Sociedad[];
  public listaunderclasi: UnderlyingClasiall[];
  @Output() transformarEvento = new EventEmitter<void>();
    
  ngAfterViewInit() {
      this.listaconsumobrutoDS.sort = this.sort;
  
    }
  
  nombreheaderconsumo: { [key: string]: string } = {
    's378_Id': 'ID',
    's378_sociedad': 'Sociedad',
    's378_sociedad_val': 'Valor Sociedad',
    's378_subyacente': 'Subyacente',
    's378_subyacente_val': 'Valor Subyacente',
    's378_mes': 'Mes',
    's378_mes_val': 'Valor Mes',
    's378_TM': 'TM'
  };
  
    constructor(private blobService: AzureBlobStorageService,
                private tokenService: TokenService,
                private registroConsumoService:CargabasetrigoService,
                private loader:LoadingService,
                private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
            ) { }
  
    ngOnInit(): void {
      this.getSociedad()
      this.getunderclasi()
      this.columnKeys = Object.keys(this.nombreheaderconsumo) 
    }
  
  
  
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
    
      formatearNumero(valor: number): string {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(valor);
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
          const nameconfecha='CONSUMO'+'_'+this.pFechaInicio;
          const newfilename='CONSUMO/'+nameconfecha+'.'+miextension;
          const newfilenamesolo=nameconfecha+'.'+miextension;            
           this.blobService.uploadFile(item, newfilename,()=>{this.fileName=newfilenamesolo;console.log(newfilename),console.log("lo pude reemplazar")
           this.registraconsumoblob(this.pFechaInicio,newfilenamesolo,this.tokenService.getUserName(),this.mifecha,this.mihora)
          }
          )     
          } 
    }
    
    public registraconsumoblob(fechareporte: string,newfilename: string, usuarioname: string,fecharegistro: string,horaregistro: string): void {
     
      this.loader.show();
  
    
      this.registroConsumoService.registroConsumoBruto(fechareporte, newfilename, usuarioname, fecharegistro, horaregistro).subscribe(
        (respuesta: any) => {
          console.log(respuesta);this.loader.hide();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: respuesta,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4b822d'
          }).then((result) => {if (result.isConfirmed) {this.obtenerlistaconsumobruto(); }});
          
        },
        error => {
          console.error('Error al registrar el consumo:', error);
          this.loader.hide();  
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al registrar el consumo',
            text: error.error ? error.error.error : 'Ocurrió un error inesperado',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33'
          });
        }
      );
    }
  
    public obtenerlistaconsumobruto():void{
     
      this.registroConsumoService.obtenerconsumobruto(parseInt(this.pFechaInicio)).subscribe(
        (response:objConsumobruto[])=>{        
          this.listaconsumobruto=response;this.listaconsumobrutoDS=new MatTableDataSource(this.listaconsumobruto); console.log(this.listaconsumobruto)  ;     
          if (this.sort) {this.listaconsumobrutoDS.sort = this.sort; };  this.resumenListaConsumoBruto()
        },
        error => {
          console.error('Error al obtener lista del excel trigo:', error);
        }
      );    
    }
  public resumenporsociedad = new MatTableDataSource<{ s378_sociedad: string; s378_sociedad_val: string; s378_TM: number }>();
  public resumenporcomoditie = new MatTableDataSource<{ s378_subyacente: string; s378_subyacente_val: string; s378_TM: number }>();
  public totalRowSociedad!: { s378_sociedad: string; s378_sociedad_val: string; s378_TM: number };
  public totalRowSubyacente!: { s378_subyacente: string; s378_subyacente_val: string; s378_TM: number };
  displaySociedad: string[] = ['s378_sociedad', 's378_sociedad_val', 's378_TM'];
  displaySubyacente: string[] = ['s378_subyacente', 's378_subyacente_val', 's378_TM'];
  public resumenListaConsumoBruto():void{
  
   const resumenporsociedad=this.listaconsumobruto.reduce((acum,item)=>{
    if(item.s378_subyacente_val!==null){
      const sociedadexistente=acum.find(item_1=>item_1.s378_sociedad===item.s378_sociedad)
      if(sociedadexistente){sociedadexistente.s378_TM=sociedadexistente.s378_TM+item.s378_TM}
      else{acum.push({s378_sociedad:item.s378_sociedad,s378_sociedad_val:item.s378_sociedad_val,s378_TM:item.s378_TM})}}
      return acum
    },[] as {s378_sociedad:string,s378_sociedad_val:string,s378_TM:number}[] )
  
   console.log(resumenporsociedad)
    this.resumenporsociedad.data=resumenporsociedad
  
    const totalTMsociedad = resumenporsociedad.reduce((sum, item) => sum + item.s378_TM, 0);
    this.totalRowSociedad = { s378_sociedad: 'Total', s378_sociedad_val: 'Total', s378_TM: totalTMsociedad };
  
    const resumenporcomoditie=this.listaconsumobruto.reduce((acum,item)=>{
      if(item.s378_sociedad_val!==null){
      const sociedadexistente=acum.find(item_1=>item_1.s378_subyacente===item.s378_subyacente)
      if(sociedadexistente){sociedadexistente.s378_TM=sociedadexistente.s378_TM+item.s378_TM}
      else{acum.push({s378_subyacente:item.s378_subyacente,s378_subyacente_val:item.s378_subyacente_val,s378_TM:item.s378_TM})}}
      return acum
    },[] as {s378_subyacente:string,s378_subyacente_val:string,s378_TM:number}[] )
    this.resumenporcomoditie.data=resumenporcomoditie
  
    const totalTMsubyacente = resumenporcomoditie.reduce((sum, item) => sum + item.s378_TM, 0);
    this.totalRowSubyacente = { s378_subyacente: 'Total', s378_subyacente_val: 'Total', s378_TM: totalTMsubyacente};
  
  }
  
  mimaximo:number=0
  miminimo:number=-916
  
    public TransformarRegistrarConsumo(){ 
          if (!this.pFechaInicio || !this.listaconsumobruto || this.listaconsumobruto.length === 0) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Debes Cargar Excel y seleccionar fecha',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
            });
            return;
          }
     
      this.loader.show();
      const listaregistroconsumofiltrado=this.listaconsumobruto.filter(item=>item.s378_sociedad_val!==null&& item.s378_subyacente_val !== null)
      const listaregistroconsumo=listaregistroconsumofiltrado.map(item=>{
        const t089_UnderlyingClassification=this.listaunderclasi.find((elemento)=>elemento.t068_Ticker===item.s378_subyacente_val)?.t068_ID||0
        const t089_MonthContract=item.s378_mes_val
        const t089_UpdateDate=parseInt(this.pFechaInicio)
        const t089_RegisteredBy=this.tokenService.getUserName()
        const t089_MetricTons=item.s378_TM
        const t089_Status=1
        const t089_Society=this.listaSociedad.find((elemento)=>elemento.t033_Name===item.s378_sociedad_val)?.t033_ID||0
        const t089_TypeOfConsumption=2
        return{
          t089_UnderlyingClassification:t089_UnderlyingClassification,
          t089_MonthContract:t089_MonthContract,
          t089_UpdateDate:t089_UpdateDate,
          t089_RegisteredBy:t089_RegisteredBy,
          t089_MetricTons:t089_MetricTons,
          t089_Status:t089_Status,
          t089_Society:t089_Society,
          t089_TypeOfConsumption:t089_TypeOfConsumption
        }
       });
  
       this.registroConsumoService.insertarConsumo(parseInt(this.pFechaInicio),listaregistroconsumo).subscribe(
        (respuesta:any)=>{console.log(respuesta);this.loader.hide();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: respuesta.message,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4b822d'
          }).then((result) => {if (result.isConfirmed) {this.transformarEvento.emit()}});
       })
    }
    public getunderclasi(): void {
      this.registroConsumoService.obtenerUnderlyingClassiall().subscribe(
        (response: UnderlyingClasiall[]) => {
          this.listaunderclasi = response
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    public getSociedad(): void {
      this.portafolioMoliendaIFDService.getSociedad().subscribe(
        (response: Sociedad[]) => {
          this.listaSociedad = response
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
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
  
    public  agregarCeroIzquierda(valor: number): string {
      return valor < 10 ? '0' + valor : valor.toString();
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
      this.fecharegistro=`${año}${mes}${dia}`
    }
  
    Formato_columna_MatTable(column: string, value: any): string {
      if (column === 's378_TM') {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      }
    
      // Indica que la celda está vacía en la columna s378_sociedad_val
      if (column === 's378_sociedad_val' && (value === null || value === undefined || value === '')) {
        return '';
      }
      if (column === 's378_subyacente_val' && (value === null || value === undefined || value === '')) {
        return '';
      }
    
      return value;
    }
    
  // CODIGO PARA FILTROS
  
  selectedFilters: { [key: string]: Set<string> } = {};
  toggleSelection(column: string, value: string, isSelected: boolean): void {
    if (!this.selectedFilters[column]) {
      this.selectedFilters[column] = new Set<string>();
    }
    if (isSelected) {
      this.selectedFilters[column].add(value);
    } else {
      this.selectedFilters[column].delete(value);
    }
  console.log(this.selectedFilters);
    this.applyFilters();
  }
  
  applyFilters(): void {
    this.listaconsumobrutoDS.filterPredicate = (data, filter) => {
      for (let column in this.selectedFilters) {
        if (this.selectedFilters[column].size > 0 && !this.selectedFilters[column].has(data[column])) {
          return false;
        }
      }
      return true;
    };
    this.listaconsumobrutoDS.filter = JSON.stringify(this.selectedFilters);
  }
  
  getOptionsForColumn(column: string): string[] {
    if (!this.listaconsumobrutoDS || !this.listaconsumobrutoDS.data) {
      return [];
    }
  
    const filteredData = this.listaconsumobrutoDS.data.filter(data => {
      for (let col in this.selectedFilters) {
        if (col !== column && this.selectedFilters[col]?.size > 0) {
          if (!this.selectedFilters[col].has(data[col])) {
            return false; 
          }
        }
      }
      return true; 
    });
    let options = filteredData.map(item => item[column]);
    let numericOptions = options.filter(option => !isNaN(option)).sort((a, b) => a-b);
    let nonNumericOptions = options.filter(option => isNaN(option));
  
    let uniqueOptions = Array.from(new Set([...numericOptions, ...nonNumericOptions]));
  
    return uniqueOptions;
  }
  
  isFilterApplied(column: string): boolean {
    return this.selectedFilters[column] && this.selectedFilters[column].size > 0;
  }
  
  
  //PARA SUMAR  INTERACCION CON CELDAS MAT-TABLE
  selectedCells: Set<string> = new Set<string>();
  currentTable: string = ''; 
  isSelecting: boolean = false;
  
  empezarSeleccion(event: MouseEvent, element: any, column: string) {
    event.preventDefault();  // Evitar el comportamiento predeterminado del navegador
    this.isSelecting = true;  // Habilitar el modo de selección
  
    const rowIndex = element.s378_Id; // Suponiendo que este es el índice único
    if (event.ctrlKey) {
      // Si se presiona 'ctrl', añadir a la selección actual
      this.agregarACeldasSeleccionadas(rowIndex, column);
    } else {
      // Si no se presiona 'ctrl', limpiar la selección anterior y agregar solo la nueva celda
      this.selectedCells.clear();
      this.agregarACeldasSeleccionadas(rowIndex, column);
    }
  
    this.updateSumListadataHedge();  // Actualizar los valores calculados
  }
  
  
  agregarACeldasSeleccionadas(rowIndex: number, column: string) {
    if (this.isSelecting) {
      const cellKey = `${rowIndex}|${column}`;  // Generar una clave única para la celda
      this.selectedCells.add(cellKey);  // Agregar la celda al conjunto de seleccionadas
      this.updateSumListadataHedge();  // Actualizar los valores calculados
    }
  }
  
  finalizarSeleccion() {
    this.isSelecting = false;
  }
  limpiarseleccion(event: MouseEvent) {
    if (!event.ctrlKey) {
      this.selectedCells.clear();
      this.updateSumListadataHedge();
    }
  }
    
  updateSumListadataHedge() {
    console.log("Selected Cells (before processing):", Array.from(this.selectedCells));
    
    let numericSum = 0;
    let totalCount = 0;
    const filteredData = this.listaconsumobrutoDS.filteredData;
  
    // Revisamos cómo estamos obteniendo los valores de cada celda seleccionada
    this.selectionSum = Array.from(this.selectedCells).reduce((sum, cellKey) => {
      if (typeof cellKey !== 'string') {
        console.error('Invalid cellKey:', cellKey);
        return sum; // Ignorar valores no válidos
      }
  
      const [rowId, column] = cellKey.split('|'); // Obtener rowId y column
      const element = filteredData.find((data: any) => data.s378_Id === parseInt(rowId, 10)); // Buscar el elemento correcto por s378_Id
      
      if (element) {
        const value = element[column as keyof objConsumobruto]; // Obtener el valor de la celda
        totalCount++;
        if (typeof value === 'number') {
          numericSum += value; // Sumar solo los valores numéricos
        }
      }
      return sum;
    }, 0);
  
    // Asignar los valores finales a las variables de selección
    this.selectionSum = numericSum;
    this.selectionCount = totalCount;
    this.selectionAvg = this.selectionSum / (this.selectionCount || 1);
  }
  
  
  
  esCeldaSeleccionada(element: any, column: string): boolean {
    const cellKey = `${element.s378_Id}|${column}`;
    return this.selectedCells.has(cellKey);  // Verificar si la celda está seleccionada
  }
  
}
