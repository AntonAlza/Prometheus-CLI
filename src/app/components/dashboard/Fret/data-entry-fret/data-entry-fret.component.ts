import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Console } from 'console';
import { Observable } from 'rxjs';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { ArrivalPlanning } from 'src/app/models/Fret/ArrivalPlanning';
import { BaseBudget } from 'src/app/models/Fret/BaseBudget';
import { FobMarketFret } from 'src/app/models/Fret/FobMarketFret';
import { FreightQuote } from 'src/app/models/Fret/FreightQuote';
import { FretAdjustment } from 'src/app/models/Fret/FretAdjustment';
import { FretSpread } from 'src/app/models/Fret/FretSpread';
import { Fret_ConfirmacionInput } from 'src/app/models/Fret/Fret_ConfirmacionInput';
import { Fret_WheatType } from 'src/app/models/Fret/Fret_WheatType';
import { ProjectOfMonth } from 'src/app/models/Fret/ProjectOfMonth';
import { TurnoverDays } from 'src/app/models/Fret/TurnoverDays';
import { UnderlyingQuality } from 'src/app/models/Fret/UnderlyingQuality';
import { columnasDataEntry } from 'src/app/models/Fret/columnasDataEntry';
import { FretService } from 'src/app/models/Fret/fret.service';
import { listaDataEntry } from 'src/app/models/Fret/listaDataEntry';
import { objInitFormDataEntry } from 'src/app/models/Fret/objInitFormDataEntry';
import { objTablas } from 'src/app/models/Fret/objTablas';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-data-entry-fret',
  templateUrl: './data-entry-fret.component.html',
  styleUrls: ['./data-entry-fret.component.scss']
})
export class DataEntryFretComponent implements OnInit {

  selectedOptions: string[] = ['Llegada'];
  fechaVigente: NgbDateStruct | null;
  fechaHoy: NgbDateStruct | null;
  date: Date = new Date();
  fechaVigenteEntero: string;
  planificacionInit: ArrivalPlanning = new ArrivalPlanning();
  listaTrigosInit: Fret_WheatType = new Fret_WheatType();
  fletesInit: FreightQuote = new FreightQuote(); 
  diasGiroInit: TurnoverDays = new TurnoverDays(); 
  nuevoPresupuestoInit: BaseBudget = new BaseBudget(); 
  nuevoProyectoInit: ProjectOfMonth = new ProjectOfMonth();
  nuevaCalidadInit: UnderlyingQuality = new UnderlyingQuality();
  nuevMercadoFOBInit: FobMarketFret = new FobMarketFret();
  nuevoAjusteFretInit: FretAdjustment = new FretAdjustment();
  tabSeleccionado: string = 'Llegada'; 
  flgDisabled: boolean = false; 
  selectedSociety: string = "2";

  objDatosFret$!: Observable<objInitFormDataEntry>

  objInitFormulario: objInitFormDataEntry = new objInitFormDataEntry;
  comboSociedades: cargaCombo[] = []; 
  flgConfirmado: boolean;
  nombreEstado: string = "Pendiente confirmación"
  claseCSSEstado: string = 'estadoPendiente'; 
  tooltipText: string = 'Las llegadas aún se encuentran pendiente de confirmar.'; 
  iconoEstado: string = "fa fa-times-circle-o";
  optionString: string 
  listaTablas: objTablas[] = [];

  listaTipoTrigos: string[] = [];


  nuevoSpreadFretInit: FretSpread=new FretSpread();
  // listaTablas: MatTableDataSource<listaDataEntry[]>;

  selectedCells: Set<string> = new Set();
  isSelecting = false;
  startCell: { elementId: string, columnName: string } | null = null;

  indiceTabla: number = 0

  toggleSelection(option: string) {
    this.optionString = option;
    this.tooltipText = this.optionString + ' se encuentran confirmadas.'; 

    this.fretService._disconnect();
    this.selectedOptions = [];
    this.selectedOptions.push(option);

    this.tabSeleccionado = option
    
    if(option == 'diasGiro' || option == 'presupuestoBase' || option == 'proyecto' || option == 'calidad'){
      this.selectedSociety = "2"
    }

    this.fechaVigenteEntero = this.dateToString(this.fechaVigente);
    this.cargarForm(this.tabSeleccionado);
  }

  public dateToString = ((date) => {
    if(date.day<10 && date.month<10){
     return `${date.year}0${date.month}0${date.day}`.toString();
    }else if (date.day<10 ){
     return `${date.year}${date.month}0${date.day}`.toString();
    }else if (date.month<10){
     return `${date.year}0${date.month}${date.day}`.toString();
    }else{
     return `${date.year}${date.month}${date.day}`.toString();
    }
 })

  public portafolioDS: MatTableDataSource<listaDataEntry>;
  public columnas: columnasDataEntry[] = [];
  public listaData: listaDataEntry[];
  displayedColumns: string[] = [];
  
  @ViewChild(MatSort) sortPortafolio!: MatSort;

  constructor(private fretService: FretService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private config: NgbDatepickerConfig) {

              this.config.markDisabled = (date: NgbDateStruct) => {
                    const day = new Date(date.year, date.month - 1, date.day).getDay();
                    return day === 0 || day === 6;
              };
  }
  
  
  ngOnInit(): void {
    
    this.date = new Date();
    this.fechaVigente = {day: this.date.getDate(),month: this.date.getMonth() + 1,year: this.date.getFullYear()};
    this.fechaHoy = {day: this.date.getDate(),month: this.date.getMonth() + 1,year: this.date.getFullYear()};
  

    this.fechaVigenteEntero = this.dateToString(this.fechaVigente);
    

    this.planificacionInit.t331_Date = Number(this.fechaVigenteEntero);
    this.planificacionInit.t331_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.planificacionInit.t331_Status = 1;
    this.planificacionInit.t331_Society = Number(this.selectedSociety);

    this.listaTrigosInit.t514_Date = Number(this.fechaVigenteEntero);
    this.listaTrigosInit.t514_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.listaTrigosInit.t514_Status = 1;
    this.listaTrigosInit.t514_Society = Number(this.selectedSociety);

    this.fletesInit.t333_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.fletesInit.t333_Status = 1;
    this.fletesInit.t333_Society = Number(this.selectedSociety);

    this.diasGiroInit.t458_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.diasGiroInit.t458_Status = 1;

    this.nuevoPresupuestoInit.t462_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.nuevoPresupuestoInit.t462_Status = 1;

    this.nuevoProyectoInit.t465_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.nuevoProyectoInit.t465_Status = 1;
    
    this.nuevaCalidadInit.t469_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.nuevaCalidadInit.t469_Status = 1;
    
    this.nuevMercadoFOBInit.t472_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.nuevMercadoFOBInit.t472_Status = 1;

    this.nuevoAjusteFretInit.t482_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.nuevoAjusteFretInit.t482_Status = 1;

    this.nuevoAjusteFretInit.t482_Society = Number(this.selectedSociety);

    this.nuevoSpreadFretInit.t507_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.nuevoSpreadFretInit.t507_Status = 1;
    this.nuevoSpreadFretInit.t507_Society = Number(this.selectedSociety);
    
    this.optionString = this.tabSeleccionado
    this.cargarForm(this.tabSeleccionado);
        

    this.inicializar()
    // this.fretService._connect();

    this.objDatosFret$.subscribe(data => {
      this.objInitFormulario = data;

      if(this.objInitFormulario !== undefined){
        this.listaTablas = data.listaData;
        this.listaTablas.forEach(objeto => {
          objeto.dataSource = new MatTableDataSource<listaDataEntry>(objeto.data);
          objeto.flgReplicarData = [...new Set(objeto.data.map(objeto => objeto["idData"]))].length
        });
      }
    });
  }

  onCellValueChange(element: any, column: any): void {
    element[column.nombre_Columna + '_Modified'] = true;
    // this.showSnackBar();
  }

  guardadoAutomatico(element: any, column: any): void {
    // this.fretService._connect();
    if(this.tabSeleccionado == 'Llegada'){

      if(element["descripcion"].includes("Tipo Trigo")){

        if(!this.listaTipoTrigos.includes(element[column["nombre_Columna"]])){
          const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'error',
            title: 'Tipo de Trigo inválido.'
          })

          element[column["nombre_Columna"]] = null;
        }

        let listaTrigos: Fret_WheatType = new Fret_WheatType();

        listaTrigos = this.listaTrigosInit;

        listaTrigos.t514_FretboardPortfolio = element["idData"]
        listaTrigos.t514_PlanningConcept_WheatType = element["idPlanningConcept"]
        listaTrigos.t514_MonthContract = column["codigoMes"]
        listaTrigos.t514_Value = element[column["nombre_Columna"]]

        this.fretService.guardarTipoTrigo(listaTrigos).subscribe(
          data=>{
            this.fretService._send(listaTrigos.t514_Date,this.tabSeleccionado,Number(this.selectedSociety))
            this.notificarGuardadoAutomatico();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });


      }else{
        let planificacion: ArrivalPlanning = new ArrivalPlanning();
        planificacion = this.planificacionInit;
    
        planificacion.t331_FretboardPortfolio = element["idData"]
        planificacion.t331_PlanningConcept = element["idPlanningConcept"]
        planificacion.t331_MonthContract = column["codigoMes"]
        planificacion.t331_Value = element[column["nombre_Columna"]]
    
        this.fretService.guardarPlanificacion(planificacion).subscribe(
          data=>{
            this.fretService._send(planificacion.t331_Date,this.tabSeleccionado,Number(this.selectedSociety))
            this.notificarGuardadoAutomatico();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
      }
    }else if(this.tabSeleccionado == 'Fletes'){
      let flete: FreightQuote = new FreightQuote();
      flete = this.fletesInit

      flete.t333_Date = Number(this.fechaVigenteEntero);
      flete.t333_FretboardPortfolio = element["idData"]
      flete.t333_TypeOfFreight = element["idTypeOfFreight"]
      flete.t333_MonthContract = column["codigoMes"]
      flete.t333_Value = element[column["nombre_Columna"]]

      this.fretService.guardarFlete(flete).subscribe(
        data=>{
          this.fretService._send(flete.t333_Date,this.tabSeleccionado,Number(this.selectedSociety))
          this.notificarGuardadoAutomatico();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }else if(this.tabSeleccionado == 'diasGiro'){
      let diasGiro: TurnoverDays = new TurnoverDays();
      diasGiro = this.diasGiroInit

      diasGiro.t458_Date = Number(this.fechaVigenteEntero);
      diasGiro.t458_FretboardPortfolio = element["idData"]
      diasGiro.t458_MonthContract = column["codigoMes"]
      diasGiro.t458_Value = element[column["nombre_Columna"]]

      this.fretService.guardarDiasGiro(diasGiro).subscribe(
        data=>{
          this.fretService._send(diasGiro.t458_Date,this.tabSeleccionado,Number(this.selectedSociety))
          this.notificarGuardadoAutomatico();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }else if(this.tabSeleccionado == 'presupuestoBase'){
      let nuevoPresupuesto: BaseBudget = new BaseBudget();
      nuevoPresupuesto = this.nuevoPresupuestoInit

      nuevoPresupuesto.t462_Date = Number(this.fechaVigenteEntero);
      nuevoPresupuesto.t462_FretboardPortfolio = element["idData"]
      nuevoPresupuesto.t462_MonthContract = column["codigoMes"]
      nuevoPresupuesto.t462_Value = element[column["nombre_Columna"]]

      this.fretService.guardarPresupuestoBase(nuevoPresupuesto).subscribe(
        data=>{
          this.fretService._send(nuevoPresupuesto.t462_Date,this.tabSeleccionado,Number(this.selectedSociety))
          this.notificarGuardadoAutomatico();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }else if(this.tabSeleccionado == 'proyecto'){
      let nuevoProyecto: ProjectOfMonth = new ProjectOfMonth();
      nuevoProyecto = this.nuevoProyectoInit

      nuevoProyecto.t465_Date = Number(this.fechaVigenteEntero);
      nuevoProyecto.t465_FretboardPortfolio = element["idData"]
      nuevoProyecto.t465_MonthContract = column["codigoMes"]
      nuevoProyecto.t465_Value = element[column["nombre_Columna"]]

      this.fretService.guardarProyectoMes(nuevoProyecto).subscribe(
        data=>{
          this.fretService._send(nuevoProyecto.t465_Date,this.tabSeleccionado,Number(this.selectedSociety))
          this.notificarGuardadoAutomatico();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }else if(this.tabSeleccionado == 'calidad'){
      let nuevaCalidad: UnderlyingQuality = new UnderlyingQuality();
      nuevaCalidad = this.nuevaCalidadInit

      nuevaCalidad.t469_Date = Number(this.fechaVigenteEntero);
      nuevaCalidad.t469_FretboardPortfolio = element["idData"]
      nuevaCalidad.t469_MonthContract = column["codigoMes"]
      nuevaCalidad.t469_Value = element[column["nombre_Columna"]]

      this.fretService.guardarCalidad(nuevaCalidad).subscribe(
        data=>{
          this.fretService._send(nuevaCalidad.t469_Date,this.tabSeleccionado,Number(this.selectedSociety))
          this.notificarGuardadoAutomatico();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }else if(this.tabSeleccionado == 'mercadoFOB'){
      let nuevoMercadoFOB: FobMarketFret = new FobMarketFret();
      nuevoMercadoFOB = this.nuevMercadoFOBInit

      nuevoMercadoFOB.t472_Date = Number(this.fechaVigenteEntero);
      nuevoMercadoFOB.t472_FretboardPortfolio = element["idData"]
      nuevoMercadoFOB.t472_MonthContract = column["codigoMes"]
      nuevoMercadoFOB.t472_Value = element[column["nombre_Columna"]]

      this.fretService.guardarMercadoFob(nuevoMercadoFOB).subscribe(
        data=>{
          this.fretService._send(nuevoMercadoFOB.t472_Date,this.tabSeleccionado,Number(this.selectedSociety))
          this.notificarGuardadoAutomatico();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }else if(this.tabSeleccionado == 'ajusteFret'){
      let nuevoAjusteFret: FretAdjustment = new FretAdjustment();
      nuevoAjusteFret = this.nuevoAjusteFretInit

      nuevoAjusteFret.t482_Date = Number(this.fechaVigenteEntero);
      nuevoAjusteFret.t482_FretboardPortfolio = element["idData"]
      nuevoAjusteFret.t482_MonthContract = column["codigoMes"]
      nuevoAjusteFret.t482_Value = element[column["nombre_Columna"]]

      this.fretService.guardarAjuste(nuevoAjusteFret).subscribe(
        data=>{
          this.fretService._send(nuevoAjusteFret.t482_Date,this.tabSeleccionado,Number(this.selectedSociety))
          this.notificarGuardadoAutomatico();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }else if(this.tabSeleccionado == 'spreadFret'){
      let nuevoSpread: FretSpread = new FretSpread();
      nuevoSpread = this.nuevoSpreadFretInit

      nuevoSpread.t507_Date = Number(this.fechaVigenteEntero);
      nuevoSpread.t507_FretboardPortfolio = element["idData"]
      nuevoSpread.t507_MonthContract = column["codigoMes"]
      nuevoSpread.t507_Value = element[column["nombre_Columna"]]

      this.fretService.guardarSpread(nuevoSpread).subscribe(
        data=>{
          this.fretService._send(nuevoSpread.t507_Date,this.tabSeleccionado,Number(this.selectedSociety))
          this.notificarGuardadoAutomatico();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }
  }
  
  notificarGuardadoAutomatico(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Se guardó la información modificada.  '
    })
  }
  
  getBackgroundColor(element: any, column: any): string {
    return element[column.nombre_Columna + '_Modified'] ? '#dba703' : '#1e5532';
  }
  
  esNumero(cadena: string): boolean {
    return !isNaN(+cadena);
  }
  
  _handleInput(value: string): string {

    if (!this.esNumero(value)){
      return  "";
    }else{
      return  value;
    }
  }

  changeDataEntryFecha(){
    this.fretService._disconnect();
    // this.obtenEstadoConfirmacion();
    this.fechaVigenteEntero = this.dateToString(this.fechaVigente);
    this.planificacionInit.t331_Date = Number(this.fechaVigenteEntero);
    if(this.dateToString(this.fechaVigente) == this.dateToString(this.fechaHoy)){
      this.flgDisabled = false
    }else{
      this.flgDisabled = true
    }

    this.cargarForm(this.tabSeleccionado);
  }

  cargarLlegada(){
    
    this.fechaVigenteEntero = this.dateToString(this.fechaVigente);

    this.cargarForm(this.tabSeleccionado);
  }

  cargarOtros(){
    this.columnas = [];
    this.displayedColumns = []
    this.listaData = [];
    this.portafolioDS = new MatTableDataSource(this.listaData);
    this.portafolioDS.sort = this.sortPortafolio;
  }

  cargarForm(opcion: string){

    this.fretService._connect(Number(this.fechaVigenteEntero),this.tabSeleccionado, Number(this.selectedSociety));
    this.obtenEstadoConfirmacion();
    this.columnas = [];
    this.displayedColumns = []
    this.listaData = [];
    this.portafolioDS = new MatTableDataSource(this.listaData);
    this.portafolioDS.sort = this.sortPortafolio;

    this.fretService.obtenerDatosDataEntry(this.fechaVigenteEntero,opcion,this.portafolioMoliendaIFDService.usuario,Number(this.selectedSociety)).subscribe(
      (response: objInitFormDataEntry) => {
        
        this.listaTablas = response.listaData;

        this.listaTipoTrigos = response.listaTrigosDisponibles;
        
        this.listaTablas.forEach(objeto => {
          objeto.dataSource = new MatTableDataSource<listaDataEntry>(objeto.data);
          objeto.flgReplicarData = [...new Set(objeto.data.map(objeto => objeto["idData"]))].length
        });


        this.objInitFormulario = response
        this.comboSociedades = this.objInitFormulario.comboSociedades;
        
        // Se llenan las Columnas
        this.columnas = this.objInitFormulario.columnas;
        console.log(this.columnas)
        this.displayedColumns = this.columnas.filter(function (contenido) {
                                            return contenido.flgColumna === true;
                                        }).map(function (contenido) {
                                            return contenido.nombre_Columna;
                                        })
        
        // Se llena la data
        this.listaData = this.objInitFormulario.data;
        this.portafolioDS = new MatTableDataSource(this.listaData);
        this.portafolioDS.sort = this.sortPortafolio;

        if(this.objInitFormulario.flgReplica){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se replicó la información de ' + this.objInitFormulario.diaReplica,
            showConfirmButton: false,
            timer: 2000
          })
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event): void {
    event.preventDefault();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    // Prevent the tab from closing
    event.preventDefault();

    // Show the confirmation dialog
    const confirmationMessage = 'Are you sure you want to close the page?';
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  }

  inicializar(){
    // setTimeout(()=>{ this.fretService._send() }, 4000)
    this.objDatosFret$ = this.fretService.obtenerDatos();
  }


  onSelectCompania():void{
    // this.obtenEstadoConfirmacion();
    this.planificacionInit.t331_Society = Number(this.selectedSociety);
    this.fletesInit.t333_Society = Number(this.selectedSociety);
    this.nuevoAjusteFretInit.t482_Society = Number(this.selectedSociety);
  
    this.fretService._disconnect();
    
    this.cargarForm(this.tabSeleccionado);
  }

  replicarGrupo(element: any){
    console.log(element);

    this.fretService.replicarGrupoTrigo(this.tabSeleccionado,Number(this.fechaVigenteEntero),element.data[0].idData,Number(this.selectedSociety),this.portafolioMoliendaIFDService.usuario,element.codTrigo).subscribe(
      (response: boolean) => {
        this.fretService._send(Number(this.fechaVigenteEntero),this.tabSeleccionado,Number(this.selectedSociety))
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  obtenEstadoConfirmacion(){
    
    this.fretService.obtenerConfirmacionInputXOpcion(Number(this.fechaVigenteEntero) ,this.optionString, this.selectedSociety).subscribe(
      (response: boolean) => {
        this.flgConfirmado = response;
        if(response){
          this.nombreEstado = "Confirmado"
          this.claseCSSEstado = 'estadoAprobado'; 
          this.iconoEstado = "fa fa-check-circle-o";
        }else{
          this.nombreEstado = "Pendiente confirmación"
          this.claseCSSEstado = 'estadoPendiente'; 
          this.iconoEstado = "fa fa-times-circle-o";

        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  confirmarIngreso(){
    if(!this.flgConfirmado){
      Swal.fire({
        icon: 'question',
        title: 'Confirmación de Input',
        html: '¿Está seguro que desea confirmar los inputs de '+ this.optionString +' al ' + this.fechaVigenteEntero + '?' ,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        confirmButtonColor: '#4b822d'
        }).then((result) => {
          if (result.isConfirmed) {
            this.registrarConfirmacion();
          }
        })

        this.tooltipText = this.optionString + ' se encuentran confirmadas.'; 
    }
    
  }

  registrarConfirmacion(){

    let objConfirmacion: Fret_ConfirmacionInput = new Fret_ConfirmacionInput();
    
    objConfirmacion.t502_Fecha = Number(this.fechaVigenteEntero)
    objConfirmacion.t502_InputOption = this.optionString
    objConfirmacion.t502_UsuarioConfirma = this.portafolioMoliendaIFDService.usuario;
    objConfirmacion.t502_Society = Number(this.selectedSociety);
    objConfirmacion.t502_Status = 1

    this.fretService.registrarConfirmacionInput(objConfirmacion).subscribe(
      data=>{
        
        if(data){

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se confirmó el ingreso correctamente.',
            showConfirmButton: false,
            timer: 2000
          })

          this.obtenEstadoConfirmacion()
        }
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });

  }

  onPaste(event: ClipboardEvent, element: listaDataEntry, column: any, tabla: objTablas) {
    event.preventDefault();
    
    if (!event.clipboardData) {
      console.error('No clipboard data available');
      return;
    }
  
    const clipboardData = event.clipboardData;
    const pastedData = clipboardData.getData('text');
    
    if (!pastedData) {
      console.error('No valid data in clipboard');
      return;
    }
  


    const rows = pastedData.split('\n');
    const startRowIndex = tabla.dataSource.data.indexOf(element);
    const startColumnIndex = this.columnas.indexOf(column);
    let filasMax = rows.length;

    rows.forEach((row, rowIndex) => {
      if(rowIndex < filasMax - 1){
        const cells = row.split('\t');
        cells.forEach((cell, cellIndex) => {
          const dataRowIndex = startRowIndex + rowIndex;
          const dataColumnIndex = startColumnIndex + cellIndex;
          
          if (dataRowIndex < tabla.dataSource.data.length && 
              dataColumnIndex < this.columnas.length) {
            const targetElement = tabla.dataSource.data[dataRowIndex];
            const targetColumn = this.columnas[dataColumnIndex];
            if(targetElement['descripcion'].includes('Tipo Trigo')){
              targetElement[targetColumn.nombre_Columna] = cell.trim();
            }else{
              targetElement[targetColumn.nombre_Columna] = this._handleInput(cell.trim());
            }
            
            this.onCellValueChange(targetElement, targetColumn);
            this.guardadoAutomatico(targetElement, targetColumn);
          }
        });
      }
    });
  
    tabla.dataSource.data = [...tabla.dataSource.data];
  }

  onMouseDown(element: any, column: any) {
    this.isSelecting = true;
    this.startCell = { elementId: element.idData+ '_' + element.idPlanningConcept, columnName: column.nombre_Columna };
    this.selectedCells.clear();
    console.log('MouseDown' + element.idData + ' --- '+column.nombre_Columna)
    this.toggleCellSelection(element.idData+ '_' + element.idPlanningConcept, column.nombre_Columna);
  }


  onMouseEnter(element: any, column: any, indTabla: number) {
    this.indiceTabla = indTabla;
    if (this.isSelecting && this.startCell) {
      this.selectCellRange(this.startCell.elementId, this.startCell.columnName, element.idData+ '_' + element.idPlanningConcept, column.nombre_Columna);
    }
  }

  onMouseUp() {
    this.isSelecting = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.deleteSelectedCells();
    }
    if (event.key === 'Escape') {
      this.selectedCells.clear();
    }
  }

  deleteSelectedCells() {
    this.listaTablas.forEach(tabla => {
      if (tabla.dataSource instanceof MatTableDataSource) {
        const data = tabla.dataSource.data;
        data.forEach((element: any) => {
          this.columnas.forEach(column => {
            const cellId = `${element.idData}_${element.idPlanningConcept}_${column.nombre_Columna}`;
            if (this.selectedCells.has(cellId)) {
              element[column.nombre_Columna] = null; // o cualquier valor por defecto
              this.guardadoAutomatico(element, column);
            }
          });
        });
        tabla.dataSource.data = [...data]; // Esto forzará una actualización de la vista
      }
    });
    this.selectedCells.clear();
  }


isCellSelected(element: any, column: any): boolean {
  return this.selectedCells.has(`${element.idData}_${element.idPlanningConcept}_${column.nombre_Columna}`);
}

toggleCellSelection(elementId: string, columnName: string) {
  const cellId = `${elementId}_${columnName}`;
  if (this.selectedCells.has(cellId)) {
    this.selectedCells.delete(cellId);
  } else {
    this.selectedCells.add(cellId);
  }
}

selectCellRange(startElementId: string, startColumnName: string, endElementId: string, endColumnName: string) {
  const startRowIndex = this.findRowIndex(startElementId);
  const endRowIndex = this.findRowIndex(endElementId);
  const startColumnIndex = this.findColumnIndex(startColumnName);
  const endColumnIndex = this.findColumnIndex(endColumnName);

  const minRowIndex = Math.min(startRowIndex, endRowIndex);
  const maxRowIndex = Math.max(startRowIndex, endRowIndex);
  const minColumnIndex = Math.min(startColumnIndex, endColumnIndex);
  const maxColumnIndex = Math.max(startColumnIndex, endColumnIndex);

  this.selectedCells.clear();
  for (let i = minRowIndex; i <= maxRowIndex; i++) {
    for (let j = minColumnIndex; j <= maxColumnIndex; j++) {
      const element = this.getElementAtIndex(i);
      const column = this.columnas[j];
      this.selectedCells.add(`${element.idData}_${element.idPlanningConcept}_${column.nombre_Columna}`);
    }
  }
}


findRowIndex(elementId: string): number {
  return this.listaTablas[this.indiceTabla].dataSource.data.findIndex(element => (element["idData"] + '_' + element["idPlanningConcept"]) === elementId);
}

findColumnIndex(columnName: string): number {
  return this.columnas.findIndex(column => column.nombre_Columna === columnName);
}

getElementAtIndex(index: number): any {
  return this.listaTablas[this.indiceTabla].dataSource.data[index];
}






}
