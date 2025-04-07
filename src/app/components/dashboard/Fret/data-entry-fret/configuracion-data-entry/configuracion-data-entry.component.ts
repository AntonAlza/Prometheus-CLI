import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { columnasConfigDataEntry } from 'src/app/models/Fret/columnasConfigDataEntry';
import { FretService } from 'src/app/models/Fret/fret.service';
import { listaConfigDataEntry } from 'src/app/models/Fret/listaConfigDataEntry';
import { objInitFormConfigDataEntry } from 'src/app/models/Fret/objInitFormConfigDataEntry';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion-data-entry',
  templateUrl: './configuracion-data-entry.component.html',
  styleUrls: ['./configuracion-data-entry.component.scss']
})
export class ConfiguracionDataEntryComponent implements OnInit {

  selectedOptions: string[] = ['CommoditiesLlegadas'];
  tabSeleccionado: string = 'CommoditiesLlegadas'; 
  portafolioDS: MatTableDataSource<listaConfigDataEntry>;
  columnas: columnasConfigDataEntry[] = [];
  listaData: listaConfigDataEntry[];
  idFretPortafolioPadre: number;
  // listaAsignacionPadre: listAsignacionUnderlyingClassification[];

  listaGrupoFretPadre :cargaCombo[]
  
  @ViewChild(MatPaginator, { static: true }) paginadoPortafolio!: MatPaginator;
  @ViewChild(MatSort) sortPortafolio!: MatSort;

  displayedColumns: string[] = [];

  constructor(private fretService: FretService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private modalService: NgbModal,
              private config: NgbDatepickerConfig) { }

  ngOnInit(): void {
    this.cargarForm(this.tabSeleccionado)
  }

  toggleSelection(option: string) {
    this.selectedOptions = [];
    this.selectedOptions.push(option);
    this.tabSeleccionado = option
    this.cargarForm(this.tabSeleccionado);
  }

  getBackgroundColor(element: any, column: any): string {
    return element[column.nombre_Columna + '_modified'] ? '#C80F1E' : '#1e5532';
  }

  cargarForm(opcion: string){

    this.fretService.obtenerDatosConfigDataEntry(opcion,this.portafolioMoliendaIFDService.usuario).subscribe(
      (response: objInitFormConfigDataEntry) => {

        // this.objInitFormulario = response

        // // Se llenan las Columnas
        this.columnas = response.columnas;

        this.displayedColumns = response.columnas.filter(function (contenido) {
                                            return contenido.flgColumna === true;
                                        }).map(function (contenido) {
                                            return contenido.nombre_Columna;
                                        })
        
        // // Se llena la data
        this.listaData = response.data;
        this.portafolioDS = new MatTableDataSource(this.listaData);
        this.portafolioDS.paginator = this.paginadoPortafolio;
        this.portafolioDS.sort = this.sortPortafolio;
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });    
  }

  agregarCommoditie(){
    let nuevaFinal: listaConfigDataEntry = new listaConfigDataEntry();

    this.listaData.push(nuevaFinal);

    this.portafolioDS = new MatTableDataSource(this.listaData);
  }

  onCellValueChange(element: any, column: any): void {
    element[column.nombre_Columna + '_modified'] = true;
    // this.showSnackBar();

    this.fretService.guardarConfiguracion(this.tabSeleccionado,element["idFretboardPortfolio"],column["idColumna"],element[column["nombre_Columna"]]).subscribe(
      (response: boolean) => {
        Swal.fire({
          title: 'Guardar Configuración',
          html: 'Se guardó la configuración correctamente.',
          icon: 'success',
          confirmButtonColor: '#4b822d'
        })
      },
      (error: HttpErrorResponse) => { //element["idFretboardPortfolio"]  ---  column["idColumna"]

        alert(error.message);
      });  
  }
  
  guardadoAutomatico(element: any, column: any): void {
    console.log(element);
    console.log(column);

    if(element["idFretboardPortfolio"] == undefined){
      element["idFretboardPortfolio"] = 0
    }
    this.fretService.guardarFretPortafolio_Actualizar(element["idFretboardPortfolio"],element["descripcion"],element["ticker"],this.tabSeleccionado).subscribe(
      (response: objInitFormConfigDataEntry) => {

        // this.objInitFormulario = response

        // // Se llenan las Columnas
        this.columnas = response.columnas;

        this.displayedColumns = response.columnas.filter(function (contenido) {
                                            return contenido.flgColumna === true;
                                        }).map(function (contenido) {
                                            return contenido.nombre_Columna;
                                        })
        
        // // Se llena la data
        this.listaData = response.data;
        this.portafolioDS = new MatTableDataSource(this.listaData);
        this.portafolioDS.paginator = this.paginadoPortafolio;
        this.portafolioDS.sort = this.sortPortafolio;
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  contextMenuPosition = { x: '0px', y: '0px' };

  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  
  onContextMenu(event: MouseEvent, item: Item) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  asignarCommodities(asignarCommoditiesForm: any){

    // this.fretService.listarAsignacionUnderlyingClassification(this.contextMenu.menuData.item).subscribe(
    //   (response: listAsignacionUnderlyingClassification[]) => {
    //     this.listaAsignacionPadre =  response;        
    //     this.modalService.open(asignarCommoditiesForm,{windowClass : "my-class-Asignar",centered: true,backdrop : 'static',keyboard : false});
    //   },
    //   (error: HttpErrorResponse) => {
    //     alert(error.message);
    //   }); 
      this.idFretPortafolioPadre = this.contextMenu.menuData.item;

      this.fretService.listarGruposFret().subscribe(
        (response: cargaCombo[]) => {
          this.listaGrupoFretPadre =  response;        
          this.modalService.open(asignarCommoditiesForm,{windowClass : "my-class-Asignar",centered: true,backdrop : 'static',keyboard : false});
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }); 
  }

  cerrarModal(modal: any){
    modal.close();
  }
  


}
