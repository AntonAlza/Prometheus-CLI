import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from 'src/app/components/loading.service';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { listaBases } from 'src/app/models/Fisico/Consumo Masivo/listaBases';
import { objInitBase } from 'src/app/models/Fisico/Consumo Masivo/objInitBase';
import { Item } from 'angular2-multiselect-dropdown';
import Swal from 'sweetalert2';
import { MatMenuTrigger } from '@angular/material/menu';
import { CancellationBase } from 'src/app/models/Fisico/Consumo Masivo/CancellationBase';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-bases',
  templateUrl: './lista-bases.component.html',
  styleUrls: ['./lista-bases.component.scss']
})
export class ListaBasesComponent implements OnInit, OnDestroy {

  @Input() listaBasesCM: listaBases[];
  @Output () closelistaBases: EventEmitter<boolean>= new EventEmitter();
  public loading$= this.loader.loading$
  public listaBasesCMDS: MatTableDataSource<listaBases>;
  estadoPortafolio: boolean = true;
  estados$!: Observable<string[][]>
  estados: string[][];

  @ViewChild(MatPaginator, { static: true }) paginadoPortafolio!: MatPaginator;
  @ViewChild(MatSort) sortPortafolio!: MatSort;

  public objetoInitIngresoBase:objInitBase;
  
  
  columnsBases: string[] = [
    'opciones',
    's034_CodigoFisico'
    ,'s034_CodigoOperacion'
    ,'s034_Fecha'
    ,'s034_Futuro'
    ,'s034_TipoOperacion'
    ,'s034_NumeroContratos'
    ,'s034_ToneladasMetricas'
    ,'s034_Precio'
    ,'s034_Comentario'
    // ,'s034_PrecioCosto'
  ];

  constructor(private libroFisico: LibroFisicoService,
    private modalService: NgbModal,
    private loader:LoadingService,
    private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) { }

  ngOnInit(): void {
    this.listaBasesCMDS = new MatTableDataSource(this.listaBasesCM);
    this.obtenerEstadoPortafolio();
  }

  public obtenerEstadoPortafolio(): void {
    this.libroFisico.obtenerEstados().subscribe(
      (response: string[][]) => {
        if(response !== undefined){
          this.estados = response;
          for(var i = 0; i < response.length; i++){
            // if(Number(this.estados[i][0]) == this.sociedadSelected && Number(this.estados[i][1]) == this.productoSelected){
            if(Number(this.estados[i][0]) == this.libroFisico.sociedad && Number(this.estados[i][1]) == this.libroFisico.subyacente){
              this.estadoPortafolio = false;
              break;
            }else{
              this.estadoPortafolio = true;
            }
          }
          if(response.length == 0){
            this.estadoPortafolio = true;
          }
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  cerrargestionOperacion() {
    this.closeModalFactura();
  }

  applyFilterListaBases(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaBasesCMDS.filter = filterValue.trim().toLowerCase();
  }

  closeModalFactura(){
    this.closelistaBases.emit(false); 
  }

  ingresarBaseModal(ingresarBaseForm: any){

    if(!this.validarpermisos("Usted no cuenta con permisos para ingresar base")){
      return;
    }
    this.loader.show();

    if(this.libroFisico.tipoPrecioCM == 'Flat' || this.libroFisico.tipoPrecioCM == 'Flat/Bases'){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El tipo de precio no debe de ser Flat',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      this.loader.hide();
      return;
    }

    this.objetoInitIngresoBase = new objInitBase();
    this.libroFisico.objetosIngresarBase(this.libroFisico.subyacente,this.libroFisico.fisicoID).subscribe(
      (response: objInitBase) => {
        this.objetoInitIngresoBase = response;
        this.libroFisico.flgIngresoBase = true;
        if(this.objetoInitIngresoBase.crossCompany > 0){
          this.loader.hide();
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No es posible ingresar base a barco Intercompany.',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
          return;
        }
        this.objetoInitIngresoBase.codFisico = this.libroFisico.fisicoID;
        this.loader.hide();
        this.modalService.open(ingresarBaseForm,{windowClass : "modal-IngresarBaseCM",centered: true});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  cerrarModalOperacion(modal: any){
    modal.close();
    this.actualziarListaBase();
  }

  actualziarListaBase(){
    this.libroFisico.listarBases(this.libroFisico.fisicoID).subscribe(
      (response: listaBases[]) => {
        this.listaBasesCM = response;
        this.listaBasesCMDS = new MatTableDataSource(this.listaBasesCM);
        this.listaBasesCMDS.paginator = this.paginadoPortafolio;
        this.listaBasesCMDS.sort = this.sortPortafolio;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  ngOnDestroy(): void{
    this.closeModalFactura();
  }

  @ViewChild(MatMenuTrigger)
  contextmenu!: MatMenuTrigger;
  
  onContextMenu(event: MouseEvent, item: Item) {
    event.preventDefault();
    this.contextmenu.menuData = { 'item': item };
    this.contextmenu.menu.focusFirstItem('mouse');
  }

  modificarBase(modificarBaseForm: any){

    if(!this.validarpermisos("Usted no cuenta con permisos para modificar base")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }
    
    this.loader.show();
    this.libroFisico.flgIngresoBase = false;
    this.libroFisico.objetosModificarBase(this.libroFisico.subyacente,this.libroFisico.fisicoID,this.contextmenu.menuData.item).subscribe(
      (response: objInitBase) => {
        this.objetoInitIngresoBase = response;
        if(this.objetoInitIngresoBase.crossCompany > 0){
          this.loader.hide();
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No es posible ingresar base a barco Intercompany.',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
          return;
        }
        this.objetoInitIngresoBase.codFisico = this.libroFisico.fisicoID;
        this.loader.hide();
        this.modalService.open(modificarBaseForm,{windowClass : "modal-IngresarBaseCM",centered: true,backdrop : 'static',keyboard : false});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    
  }

  eliminarBase(){

    if(!this.validarpermisos("Usted no cuenta con permisos para eliminar base")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }
    this.loader.show();
    this.libroFisico.validarCrossCompany(this.libroFisico.fisicoID).subscribe(
      (response: Boolean) => {
        this.loader.hide();
        if(response){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No es posible elimiar base a barco Intercompany.',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
          return;
        }
          
        Swal.fire({
          icon: 'question',
          title: 'Cancelar Base',
          html: '¿Desea Cancelar la Base ' + this.contextmenu.menuData.item + '?' ,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true,
          confirmButtonColor: '#4b822d'
        }).then((result) => {
          if (result.isConfirmed) {
            (async () => {
              const {} = await Swal.fire({
              icon: 'question',
              title: 'Cancelar Base',
              html: 'Por favor indique el motivo de la cancelación de la base ' + this.contextmenu.menuData.item,
              input: 'text',
              inputPlaceholder: 'Sustento',
              showCancelButton: true,
              cancelButtonText: 'Cancelar',
              confirmButtonColor: '#4b822d',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Continuar',
              reverseButtons: true,
              inputValidator: (value) => {
                return new Promise((resolve) => {
                  if (value.length > 400 || value.length === 0) {
                    resolve("Número de caracteres '" + value.length + "', número de caracteres permitido 400.");
                  }else{
                    let baseCancelada: CancellationBase = new CancellationBase();
                    baseCancelada.t097_ClosingBasis = this.contextmenu.menuData.item;
                    baseCancelada.t097_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
                    baseCancelada.t097_Reason = value;
                    this.libroFisico.cancelarBase(baseCancelada).subscribe(
                      data=>{
                          this.actualziarListaBase()
                          Swal.fire({
                            icon: 'success',
                            title: 'Cancelar Base',
                            text: 'Se Canceló la base ' + this.contextmenu.menuData.item ,
                            confirmButtonColor: '#0162e8'
                          });
                      },
                      (error: HttpErrorResponse) => {
                        if(error.error.message.includes('ConstraintViolationException')){
                          Swal.fire({
                            icon: 'warning',
                            title: 'Aviso',
                            text: 'Error de Concurrencia, por favor volver a guardar.',
                            confirmButtonColor: '#0162e8',
                            customClass: {
                              container: 'my-swal'
                            }
                          });
                        }else{
                          alert(error.message);
                        }
                      });
                  }
                })
              }
            })   
          })()          
          }
        })

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    
  }

  validarEstadoPortafolio(): boolean{
    if(!this.estadoPortafolio){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El portafolio se encuentra cerrado',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return this.estadoPortafolio;
    }else{
      return this.estadoPortafolio;
    }
  }

  validarpermisos(comentario: string): boolean{
    if(!this.libroFisico.usuarioRegistra){
      Swal.fire({
        icon: 'error',
        title: 'Permiso denegado',
        text: comentario,
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return false;
    }else{
      return true;
    }
  }

}
