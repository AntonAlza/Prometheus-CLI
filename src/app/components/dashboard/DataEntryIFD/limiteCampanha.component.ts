import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input, Output, OnChanges, SimpleChanges, ElementRef, Directive } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import {NgbDateStruct, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PortafolioIFDMolienda } from 'src/app/models/IFD/portafolioIFDMolienda';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';
import { ViewChildren, QueryList } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

import { AsociarSQL } from 'src/app/models/IFD/asociarSQL';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { number } from 'echarts';
import { HostListener } from '@angular/core';
import { TypeOperation } from 'src/app/models/IFD/TypeOperation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import { PlanningByCampaign } from 'src/app/models/IFD/planningByCampaign';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Campaign } from 'src/app/models/IFD/campaign';


@Component({
  
  selector: 'app-limiteCampanha',
  templateUrl: './limiteCampanha.component.html',
  styleUrls: ['./limiteCampanha.component.scss']

  
})

export class limiteCampanhaComponent implements OnInit {



  public dialog: MatDialogModule;
  private _refresh$= new Subject<void>();
  public indice:number;
  suscription: Subscription;
  public keypressed;
  private wasInside = false;
  public usuario: string='';
  public fecha:number;
  date: NgbDateStruct;
  checked: any = [];  
  public listaSeason:CargarCombo[];
  public listaOptionClass:CargarCombo[];
  public listaSpecificLimit:CargarCombo[];
  public listaCampaign: Campaign [] = [];
  public idOptionClass:string;
  public idCampanha:string
  public idSeason:string;
  public idSpecificLimit:string;
  public toneladasMetrica:number;
  public factor:number;
  public volEsperado:number;
  public idAnho:number;
  public idUnderlying:number;

  public listaPlanningByCampaign: PlanningByCampaign [] = [];
  public planningByCampaign: PlanningByCampaign;

  
public estadoRegistrarLimite:boolean=false;

public estadoRegistroFO:boolean=false;
public estadoMOValorizar:boolean=false;
public estadoMOAprobacion:boolean=false;
public estadoAdministrador:boolean=false;


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  
  
  myModal=false;
  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();

  //public  visible: boolean;

  displayedColumns: string[] = [
    't345_DescSpecificLimit'
    //,'t345_DescSeason'
    //,'t345_Anho'
    ,'t345_DescOptionClass'
    ,'t345_DescCampanha'
     ,'t345_VolEsperado'
     ,'t345_Factor'
     ,'t345_MetricTons'
     ,'actions'
  ];

  dataSource: MatTableDataSource<PlanningByCampaign>;
  selection = new SelectionModel<PlanningByCampaign>(true, []);
  hidden = false;

  formGroup : FormGroup;

  constructor(private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    // this.alwaysShowCalendars = true;

  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  

  closeModal(){
    //console.log("Emite cerrado");
    this.close.emit(false);
    
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

  contextMenuPosition = { x: '0px', y: '0px'};

  public titulo: string;



  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;


  
@HostListener('click') 
  clickInside() { 
    this.wasInside = true;
    //console.log('clic dentro de modal'); 
  } 
  
  @HostListener('document:click') 
  clickout() {
    if (!this.wasInside) { 
      //console.log('clic fuera de modal');
      this.closeModal();
    } 
    this.wasInside = false;
  
    ; 
  }



  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.keypressed = event.keyCode;
    if (this.keypressed=27){
      console.log('tecla'+this.keypressed);
      this.closeModal();
      //this.close.emit(true);
    }
  }
  
  setDefaultValue(){
    this.formGroup.patchValue({
      itemCtrl : '1'
    })
  }

  @ViewChild('teamDropdown') teamDropdown: MatSelect;
  ngAfterViewInit() {
    if(this.teamDropdown !=undefined){
      setTimeout(() => {
          this.teamDropdown.options.first.select();
          
      });
    }
  }

  getformattedDate():number{
    this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    return Number(this.dateToString(this.date));
  }

  ngOnInit(): void {
      
      //this.fecha=20220225;//20220307;//20220225;
      this.usuario=this.portafolioMoliendaIFDService.usuario;
      this.fecha=this.getformattedDate();


      if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1){
        this.estadoAdministrador=true;
      }else if(  this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_IFD") > -1){
        this.estadoMOValorizar=true;
      }else if(this.portafolioMoliendaIFDService.perfiles.indexOf("MO_IFD_Aprobacion") > -1){
        this.estadoMOAprobacion=true;
      }else if (this.portafolioMoliendaIFDService.perfiles.indexOf("FO_IFD_RegistroOperacion") > -1 ){
          this.estadoRegistroFO = true;
      }
      //Registrar Límite
      if (this.estadoMOAprobacion || this.estadoAdministrador){
        this.estadoRegistrarLimite=true;
      }
      else{this.estadoRegistrarLimite=false;
      }
      


      //this.fecha=this.portafolioMoliendaIFDService.fecha;
      this.visible=true;
      //this.getListaSeason();
      this.getListaCampaign();
      this.getListaOptionClass();
      this.getListaSpecificLimit();
      this.paginator._intl.itemsPerPageLabel="Registros por Página";
      this.getListaPlanningCampaign()




      
    
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}


applyFilterSQL(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  //this.dataSourceSQL.filter = filterValue.trim().toLowerCase();
}

  cerrar() {
    //this.modalReference.close();
    this.closeModal();
    this.modalService.dismissAll();
  }


  cerrarModal(e){
    console.log("modal padre cerrado");
    this.getListaPlanningCampaign()

    this.myModal=false;
    
  }


  public getListaSeason(): void {
    this.portafolioMoliendaIFDService.getListaSeason().subscribe(
      (response: CargarCombo[]) => {
        this.listaSeason = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getListaOptionClass(): void {
    this.portafolioMoliendaIFDService.getListaOptionClass().subscribe(
      (response: CargarCombo[]) => {
        this.listaOptionClass = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getListaSpecificLimit(): void {
    this.portafolioMoliendaIFDService.getListaSpecificLimit().subscribe(
      (response: CargarCombo[]) => {
        this.listaSpecificLimit = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getListaPlanningCampaign(): void {

      

    this.portafolioMoliendaIFDService.getListaPlanningCampaign().subscribe(
    (response: PlanningByCampaign[]) => {
      this.listaPlanningByCampaign = response;
      this.dataSource = new MatTableDataSource(this.listaPlanningByCampaign);

      this.selection = new SelectionModel<PlanningByCampaign>(true, []);
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );

}

AgregarLimiteCampanha(){
  this.myModal=true;
  this.planningByCampaign = new PlanningByCampaign();

  
  this.planningByCampaign.t345_Season=Number(this.idSeason);
  this.planningByCampaign.t345_Anho= this.idAnho;
  this.planningByCampaign.t345_Underlying=this.idUnderlying;

  this.planningByCampaign.t345_Factor=this.factor;
  
  this.planningByCampaign.t345_OptionClass=Number(this.idOptionClass);
  this.planningByCampaign.t345_SpecificLimit=Number(this.idSpecificLimit);
  this.planningByCampaign.t345_Date=this.fecha;
  this.planningByCampaign.t345_RegisteredBy=this.usuario;
  this.planningByCampaign.t345_MetricTons=this.toneladasMetrica;
  this.planningByCampaign.t345_Status=1;
  


  this.portafolioMoliendaIFDService.guardarLimiteEspecifico(this.planningByCampaign).subscribe(data=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se registro el límite especifico en la base de datos',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
        container: 'my-swal',

        }
      });
      this.getListaPlanningCampaign()
    },
    (error: HttpErrorResponse) => {
        alert(error.message);
    });

}

eliminarLimiteEspecifico(fila: PlanningByCampaign){
  
  this.myModal=true;
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar Límte especifico',
      html: '¿Seguro que desea eliminar el límite <b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
      }).then((result) => {
      if (result.isConfirmed) {
        this.planningByCampaign = new PlanningByCampaign;
        this.indice=0;
        this.planningByCampaign.t345_Season=Number(fila.t345_Season);
        this.planningByCampaign.t345_OptionClass=Number(fila.t345_OptionClass);
        this.planningByCampaign.t345_SpecificLimit=Number(fila.t345_SpecificLimit);
        this.planningByCampaign.t345_Date=fila.t345_Date
        this.planningByCampaign.t345_RegisteredBy=this.usuario;
        this.planningByCampaign.t345_MetricTons=fila.t345_MetricTons;
        this.planningByCampaign.t345_Status=0;

        this.portafolioMoliendaIFDService.getEliminarLimiteEspecifico(this.planningByCampaign).subscribe(data=>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se liquido la operación en la base de datos',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
            container: 'my-swal',
      
            }
          });
          this.cerrar();
          this.getListaPlanningCampaign()
          },
          (error: HttpErrorResponse) => {
              alert(error.message);
          });
         
        }
      
      })
  }
  editarLimiteEspecifico(detalleForm:any, planningByCampaign: PlanningByCampaign){

    //RESETEO DE EL MODELO
    console.log("modal abierto");
    this.portafolioMoliendaIFDService.fecha=this.fecha;
    this.portafolioMoliendaIFDService.planningByCampaign =planningByCampaign;
    const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classEliminarLimite"});
    clearInterval()
    }
  
    public getListaCampaign(): void {

      

      this.portafolioMoliendaIFDService.getListaCampaign().subscribe(
      (response: Campaign[]) => {
        this.listaCampaign = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  
  }    
  onSelectToneladas(factor: number){

    if (factor!=undefined){
      this.factor=factor;
    this.toneladasMetrica =this.volEsperado*factor
    }
    else{
      this.toneladasMetrica=0;
    }

  }

  onSelectCampaign(id:string){
    if (typeof id !== 'undefined') {
      this.checked = this.listaCampaign.filter(i => i.t204_Id==Number(id) );
      if (this.checked.length>0 ){
          this.volEsperado=this.checked[0].t204_VolumenEsperado;
          this.idSeason=this.checked[0].t204_Season;
          this.idAnho=this.checked[0].t204_Anho;
          this.idUnderlying=this.checked[0].t204_Underlying ;
      }
      else{ 
          this.volEsperado=0;
      }
    }
  }


}

