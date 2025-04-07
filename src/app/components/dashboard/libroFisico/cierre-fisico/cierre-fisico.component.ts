import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from 'src/app/components/loading.service';
import { ControlBasesFlatsCM } from 'src/app/models/Fisico/Consumo Masivo/ControlBasesFlatsCM';
import { ControlCierresCM } from 'src/app/models/Fisico/Consumo Masivo/ControlCierresCM';
import { LibroFisicoOpenShipments } from 'src/app/models/Fisico/Consumo Masivo/LibroFisicoOpenShipments';
import { ObjInitCierreCM } from 'src/app/models/Fisico/Consumo Masivo/ObjInitCierreCM';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import Swal from 'sweetalert2';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Curve } from 'src/app/models/Fisico/Curve';
import { ToastrService } from 'ngx-toastr';
import { listaValidacionBaseConsumoInventario } from 'src/app/models/Fisico/Consumo Masivo/listaValidacionBaseConsumoInventario';

@Component({
  selector: 'app-cierre-fisico',
  templateUrl: './cierre-fisico.component.html',
  styleUrls: ['./cierre-fisico.component.scss']
})
export class CierreFisicoComponent implements OnInit {

  flgCierrePortafolio: boolean =  true;
  
  fecha: NgbDateStruct;
  pNombreForm: string = 'Cierre Fisico'
  tituloCabecera: string = 'Cerrar'
  loading$= this.loader.loading$
  checked: any = [];
  
  flgCierreConsumo: boolean =  true;
  flgCierreInventario: boolean =  true;

  flgBenchmarkNull: boolean =  false;
  flgBenchmarkCero: boolean =  false;
  flgBenchmarkAntiguo: boolean =  false;
  flgPrecioFuturo: boolean =  false;
  flgBenchmarkConsumo: boolean =  true;
  flgBenchmarkInventario: boolean =  true;

  flgConsumoBenchmarkError: boolean =  false;  
  flgInventarioBenchmarkError: boolean =  false;

  mensajeTooltipBenchmark: string;
  mensajeTooltipPrecios: string;

  listaCierreDS: MatTableDataSource<ControlCierresCM>;
  @Input() listaCierres: ControlCierresCM[];
  @Input() listaBasesFlats: ControlBasesFlatsCM[];
  @Input() objCierre: ObjInitCierreCM;
  @Output () closeCierreFisico: EventEmitter<boolean>= new EventEmitter();

  listaDetallePrecios: ControlBasesFlatsCM[] = [];
  listaDetalleBenchmark: ControlBasesFlatsCM[] = [];
 
  @ViewChild(MatPaginator, { static: false }) paginatorLista!: MatPaginator;
  @ViewChild(MatSort) sortLista!: MatSort;  
  
  listaDetalleConsumo: listaValidacionBaseConsumoInventario[]
  listaDetalleInventario: listaValidacionBaseConsumoInventario[]
  flgBoton: boolean = true;

  displayedColumns: string[] = [
    'desc_Subyacente'
    ,'flgCerrar'
    ,'flgEstado'
    ,'flgBenchmark'
    ,'flgPrecio'
    ,'horacierreString'
  ];

  constructor(private loader:LoadingService,
              private libroFisico: LibroFisicoService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private modalService: NgbModal,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.flgCierrePortafolio = this.libroFisico.flgCierre;
    if(!this.flgCierrePortafolio){
      this.pNombreForm = 'Deshacer cierre Fisico'
      this.tituloCabecera = 'Deshacer Cierre'
    }
    this.listaCierres = this.objCierre.listaCierre;
    this.listaBasesFlats = this.objCierre.listaBases;
    
    this.checked = this.listaCierres.filter(i => (i.flgCerrar )!==false );  
    this.selection = new SelectionModel<ControlCierresCM>(true, []);
    let cont = 0;

    let object1Names = this.listaBasesFlats.map(obj => obj.subyacente); // for caching the result
    let results = this.listaCierres.filter(name => object1Names.includes(name.idSubyacente));
    this.listaCierres = results

    for(let item of this.listaCierres){
      item.usuarioRegistra =this.portafolioMoliendaIFDService.usuario;
      if(this.listaBasesFlats.some(x => x.subyacente == item.idSubyacente && ((x.valor_base == null && x.tipo_precio != 'Flat') || (x.valor_flat == null && x.tipo_precio == 'Flat')))){
        item.flgBenchmark = false;
        this.flgBenchmarkNull = true;
        this.mensajeTooltipBenchmark = "Benchmark Vacio"
      }

      if(this.listaBasesFlats.some(x => x.subyacente == item.idSubyacente && x.tipo_precio == 'Flat' && x.valor_flat == 0)){
        item.flgBenchmark = false;
        this.flgBenchmarkCero = true;
        this.mensajeTooltipBenchmark = "Flat con valor 0"
      }

      if(this.listaBasesFlats.some(x => x.subyacente == item.idSubyacente && ((x.antiguedad_flat >= 28 && x.tipo_precio == 'Flat') || (x.antiguedad_base >= 28) && x.tipo_precio != 'Flat'))){
        item.flgBenchmark = false;
        this.flgBenchmarkAntiguo = true;
        this.mensajeTooltipBenchmark = "Informacion BenchMarck Antigua"
      }

      if(this.listaBasesFlats.some(x => x.subyacente == item.idSubyacente && x.valor_futuro == 0 && x.tipo_precio !== 'Flat' )){ //Validar si puede venir valor 0
        item.flgPrecios = false;
        this.flgPrecioFuturo = true;
        this.mensajeTooltipPrecios = "Precio de Futuros Incompleto"
      }

      cont +=1
    }

    this.listaCierreDS = new MatTableDataSource(this.listaCierres);
    this.listaCierreDS.paginator = this.paginatorLista;
    this.listaCierreDS.sort = this.sortLista;

    this.listaDetalleConsumo = this.objCierre.listaBenchmarkConsumo;
    this.listaDetalleInventario = this.objCierre.listaBenchmarkInventario;

    if(this.listaDetalleConsumo.some(x => ((x.tipo_precio != 'Flat' && x.valor_base == null )
    || (x.tipo_precio == 'Flat' && x.valor_flat == 0)))){
      this.flgBenchmarkConsumo = false;
      this.flgConsumoBenchmarkError =  true;
    }
    if(this.listaDetalleConsumo.some(x => ((x.antiguedad_base >= 28 && x.tipo_precio != 'Flat') || (x.antiguedad_flat >= 28 && x.tipo_precio == 'Flat')))){
      this.flgBenchmarkConsumo = false;
    }
    
    if(this.listaDetalleInventario.some(x => ((x.tipo_precio != 'Flat' && x.valor_base == null )
    || (x.tipo_precio == 'Flat' && x.valor_flat == 0)))){
      this.flgBenchmarkInventario = false;
      this.flgInventarioBenchmarkError =  true;
    }
    if(this.listaDetalleInventario.some(x => ((x.antiguedad_base >= 28 && x.tipo_precio != 'Flat') || (x.antiguedad_flat >= 28 && x.tipo_precio == 'Flat')))){
      this.flgBenchmarkInventario = false;
    }
  }

  cerrargestionOperacion() {
    this.closeCierreModal();
  }

  closeCierreModal(){
    this.closeCierreFisico.emit(false); 
  }

  selection = new SelectionModel<ControlCierresCM>(true, []);

  isAllSelected() {
    let numSelected: number = this.selection.selected.length;
    // let numRows: number = this.listaCierreDS.data.length;
    this.checked = this.listaCierres.filter(i => (i.flgEstado )==false);
    const numRows = this.checked.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
        this.selection.clear() 
        }
    else{    
        this.checked = this.listaCierres.filter(i => (i.flgEstado )==false);  
        this.selection = new SelectionModel<ControlCierresCM>(true, this.checked);
    }
  }

  seleccionSubyacente(row2, event){
    const numSelected = this.selection.selected.length;
    if(event !== undefined){
      let index = this.listaCierres.findIndex(x => x.idSubyacente == row2.idSubyacente);
      if(index !== undefined){
        this.listaCierres[index].flgCerrar = event.checked;
      }
    }else{
      for (let item of this.listaCierres){
        if(!item.flgEstado){
          item.flgCerrar = !item.flgCerrar;
        }
      }
      if(this.objCierre.estadoConsumo && this.flgCierrePortafolio){
        this.objCierre.flgCerrarConsumo = !this.objCierre.flgCerrarConsumo;
      }
      if(this.objCierre.estadoInventario && this.flgCierrePortafolio){
        this.objCierre.flgCerrarInventario = !this.objCierre.flgCerrarInventario;
      }
    }
  }

  cerrarPortafolio(){
    if(!this.listaCierres.some(x => x.flgCerrar == true)){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Por favor seleccionar subyacente',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    this.flgBoton = false;
    
    if(!this.objCierre.flgCierrePrecios){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Aún no se ha realizado el Cierre de Precios',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.flgBoton = true;
      return;
    }

    if(this.listaCierres.some(x => x.flgCerrar == true && x.flgPrecios == false)){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Los precios de futuros se encuentran incompletos, por favor comuníquese con el Middle Office ',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.flgBoton = true;
      return;
    }
    if(this.flgPrecioFuturo){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Los precios de futuros se encuentran incompletos, por favor comuníquese con el Middle Office ',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.flgBoton = true;
      return;
    }
    if(this.flgBenchmarkNull || this.flgBenchmarkCero){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El Benchmark se encuentra incompleto, no se completó el cierre por favor comuníquese con el Middle Office',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.flgBoton = true;
      return;
    }
    
    if(this.flgInventarioBenchmarkError && this.objCierre.flgCerrarInventario){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El Benchmark de Inventario se encuentra incompleto, no se completó el cierre por favor comuníquese con el Middle Office',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.flgBoton = true;
      return;
    }

    if(this.flgConsumoBenchmarkError && this.objCierre.flgCerrarConsumo){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El Benchmark de Consumo se encuentra incompleto, no se completó el cierre por favor comuníquese con el Middle Office',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.flgBoton = true;
      return;
    }

    if(this.flgBenchmarkAntiguo){
      Swal.fire({
        icon: 'question',
        title: 'Aviso',
        html: 'Informacion BenchMarck Antigua, ¿Aún desea realizar el cierre?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        confirmButtonColor: '#4b822d'
        }).then((result) => {
          if (result.isConfirmed) {
            this.realizarCierreCM();
          }})
    }else{
      this.realizarCierreCM();
    }
  }

  realizarCierreCM(){
    this.libroFisico.realizarCierreCM(this.listaCierres).subscribe(
      data=>{
          this.libroFisico._send();
          this.listaCierres = data;
          this.listaCierreDS = new MatTableDataSource(this.listaCierres);

          this.toastr.success('Se realizaron los cierres satisfactoriamente.','Cierre de Portafolios');
          this.flgBoton = true;
      },
      (error: HttpErrorResponse) => {
        this.flgBoton = true;
        alert(error.message);
      }); 
    
      if(this.objCierre.flgCerrarConsumo){
        if(this.flgConsumoBenchmarkError){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'El Benchmark de Consumo se encuentra incompleto, no se completó el cierre por favor comuníquese con el Middle Office',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return;
        }

        this.libroFisico.cerrarConsumo(this.portafolioMoliendaIFDService.usuario).subscribe(
          (response: ObjInitCierreCM) => {
            this.objCierre = response;
            this.objCierre.listaCierre = this.listaCierres;
            this.objCierre.listaBases = this.listaBasesFlats;
            this.objCierre.flgCerrarConsumo = false;
            this.toastr.success('Se realizó el cierre de consumo.','Cerrar Consumo')
          },
          (error: HttpErrorResponse) => {
            this.loader.hide();
            alert(error.message);
          });
      }

      if(this.objCierre.flgCerrarInventario){
        if(this.flgInventarioBenchmarkError){
          Swal.fire({
            icon: 'warning',
            title: 'Cierre de Inventario',
            text: 'El Benchmark de Inventario se encuentra incompleto, no se completó el cierre por favor comuníquese con el Middle Office',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return;
        }

        this.libroFisico.cerrarInventario(this.portafolioMoliendaIFDService.usuario).subscribe(
          (response: ObjInitCierreCM) => {
            this.objCierre = response;
            this.objCierre.listaCierre = this.listaCierres;
            this.objCierre.listaBases = this.listaBasesFlats;

            this.toastr.success('Se realizó el cierre de inventario.','Cerrar Inventario')
          },
          (error: HttpErrorResponse) => {
            this.loader.hide();
            alert(error.message);
          });
      }
    
  }

  deshacerCierrePortafolio(){
    if(!this.listaCierres.some(x => x.flgCerrar == true)){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Por favor seleccionar subyacente',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    this.flgBoton = false;
    Swal.fire({
      icon: 'question',
      title: 'Deshacer Cierre de Portafolios',
      html: '¿Está seguro que desea Deshacer los cierres?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
      }).then((result) => {
        if (result.isConfirmed) {
          this.libroFisico.deshacerCierreCM(this.listaCierres).subscribe(
            data=>{
                this.libroFisico._send();
                this.listaCierres = data;
                this.listaCierreDS = new MatTableDataSource(this.listaCierres);
                Swal.fire({
                  icon: 'success',
                  title: 'Deshacer Cierre de Portafolios',
                  text: 'Se deshicieron los cierres satisfactoriamente.',
                  confirmButtonColor: '#0162e8'
                });
                this.flgBoton = true;
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }})
  }

  cerrarConsumo(){
    this.flgBoton = false;
    if(!this.objCierre.flgCerrarConsumo){
      this.flgBoton = true;
      return;
    }

    if(!this.objCierre.flgCierrePrecios){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Aún no se ha realizado el Cierre de Precios',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.flgBoton = true;
      return;
    }

    if(this.flgConsumoBenchmarkError){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El Benchmark de Consumo se encuentra incompleto, no se completó el cierre por favor comuníquese con el Middle Office',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.flgBoton = true;
      return;
    }

    this.libroFisico.cerrarConsumo(this.portafolioMoliendaIFDService.usuario).subscribe(
      (response: ObjInitCierreCM) => {
        this.objCierre = response;
        this.objCierre.listaCierre = this.listaCierres;
        this.objCierre.listaBases = this.listaBasesFlats;

        Swal.fire({
          icon: 'success',
          title: 'Cerrar Consumo',
          text: 'Se realizó el cierre de consumo.',
          confirmButtonColor: '#0162e8'
        });
        this.flgBoton = true;
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });

      
  }

  cerrarInventario(){
    this.flgBoton = false;
    if(!this.objCierre.flgCerrarInventario){
      this.flgBoton = true;
      return;
    }

    if(!this.objCierre.flgCierrePrecios){
      this.flgBoton = true;
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Aún no se ha realizado el Cierre de Precios',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    if(this.flgCierrePortafolio && this.objCierre.estadoConsumo){
      this.flgBoton = true;
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Falta cerrar Consumo',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    if(this.flgInventarioBenchmarkError){
      this.flgBoton = true;
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El Benchmark de Inventario se encuentra incompleto, no se completó el cierre por favor comuníquese con el Middle Office',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    this.libroFisico.cerrarInventario(this.portafolioMoliendaIFDService.usuario).subscribe(
      (response: ObjInitCierreCM) => {
        this.objCierre = response;
        this.objCierre.listaCierre = this.listaCierres;
        this.objCierre.listaBases = this.listaBasesFlats;
        Swal.fire({
          icon: 'success',
          title: 'Cerrar Inventario',
          text: 'Se realizó el cierre de inventario.',
          confirmButtonColor: '#0162e8'
        });
        this.flgBoton = true;
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }

  deshacerCierreConsumo(){
    this.flgBoton = false;
    if(!this.objCierre.flgCerrarConsumo){
      this.flgBoton = true;
      return;
    }

    this.libroFisico.deshacerCierreConsumo_Inventario(5).subscribe(
      (response: ObjInitCierreCM) => {
        this.objCierre = response;
        this.objCierre.listaCierre = this.listaCierres;
        this.objCierre.listaBases = this.listaBasesFlats;
        Swal.fire({
          icon: 'success',
          title: 'Deshacer Cierre Consumo',
          text: 'Se deshizo el cierre de consumo.',
          confirmButtonColor: '#0162e8'
        });
        this.flgBoton = true;
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }

  deshacerCierreInventario(){
    this.flgBoton = false;
    if(!this.objCierre.flgCerrarInventario){
      this.flgBoton = true;
      return;
    }
    this.libroFisico.deshacerCierreConsumo_Inventario(3).subscribe(
      (response: ObjInitCierreCM) => {
        this.objCierre = response;
        this.objCierre.listaCierre = this.listaCierres;
        this.objCierre.listaBases = this.listaBasesFlats;
        Swal.fire({
          icon: 'success',
          title: 'Deshacer Cierre Inventario',
          text: 'Se deshizo el cierre de inventario.',
          confirmButtonColor: '#0162e8'
        });
        this.flgBoton = true;
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }


  ModalObservaciones(listaObservacionesBenchark:any, idSubyacente: number){
    this.listaDetalleBenchmark = this.listaBasesFlats.filter(x => x.subyacente == idSubyacente && (((x.valor_base == null && x.tipo_precio != 'Flat')
      || (x.tipo_precio == 'Flat' && x.valor_flat == 0)) || (x.antiguedad_base >= 28 || x.antiguedad_flat >= 28)))
    this.modalService.open(listaObservacionesBenchark,{windowClass : "class-DetalleCierreBase-CM",centered: true,backdrop : 'static',keyboard : false});

  }

  mostrarDetallePrecios(listaObservacionesPrecios:any, idSubyacente: number){
    this.listaDetallePrecios = this.listaBasesFlats.filter(x => x.subyacente == idSubyacente && x.valor_futuro == 0)
    this.modalService.open(listaObservacionesPrecios,{windowClass : "class-DetalleCierreFuturo-CM",centered: true,backdrop : 'static',keyboard : false});

  }

  mostrarDetalleConsumo(listaObservacionesConsumo:any){

    this.listaDetalleConsumo = this.listaDetalleConsumo.filter(x => ((x.tipo_precio != 'Flat' && x.valor_base == null )
    || (x.tipo_precio == 'Flat' && x.valor_flat == 0)) || ((x.antiguedad_base >= 28 && x.tipo_precio != 'Flat') || (x.antiguedad_flat >= 28 && x.tipo_precio == 'Flat')))

    this.modalService.open(listaObservacionesConsumo,{windowClass : "class-DetalleCierreConsumo-CM",centered: true,backdrop : 'static',keyboard : false});

  }

  mostrarDetalleInventario(listaObservacionesInventario:any){

    this.listaDetalleInventario = this.listaDetalleInventario.filter(x => ((x.tipo_precio != 'Flat' && x.valor_base == null )
    || (x.tipo_precio == 'Flat' && x.valor_flat == 0)) || ((x.antiguedad_base >= 28 && x.tipo_precio != 'Flat') || (x.antiguedad_flat >= 28 && x.tipo_precio == 'Flat')))
    
    this.modalService.open(listaObservacionesInventario,{windowClass : "class-DetalleCierreInventario-CM",centered: true,backdrop : 'static',keyboard : false});

  }

  

  actualizarCurva(codigo: number, valor: number){
    let precio: Curve = new Curve();
    precio.t027_Value = Number(this.listaDetallePrecios.filter(x => x.cod_Fisico == codigo)[0]["s266_ValorIngresar"]);
    precio.t027_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    precio.t027_Contract = codigo;
    
    this.libroFisico.guardarPrecioContrato(precio).subscribe(
      data=>{
          Swal.fire({
            icon: 'success',
            title: 'Guardar Precios',
            text: 'Se guardó el precio correctamente.',
            confirmButtonColor: '#0162e8'
          });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  cerrarModalOperacion(modal: any){
    modal.close();
  }
  

}
