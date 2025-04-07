import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { tipoCliente } from 'src/app/models/Fisico/Consumo Masivo/Cliente';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { tipoRelacion_Soc_Puertoorigen } from 'src/app/models/Fisico/Rel_Soc_Puerto';
import { tipoRelacion_Soc_PuertoDestino } from 'src/app/models/Fisico/Rel_Soc_Puerto_Origen';
import { tipoRelacion_Soc_Und } from 'src/app/models/Fisico/Rel_Soc_Under_cost';
import { tipoSociedad } from 'src/app/models/Fisico/Sociedad_plus';
import { Society } from 'src/app/models/Fisico/Society';
import { Underlying } from 'src/app/models/Fisico/underlying';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenedorcost',
  templateUrl: './mantenedorcost.component.html',
  styleUrls: ['./mantenedorcost.component.scss']
})
export class MantenedorcostComponent implements OnInit {
 
  public ListaUnderlying:Underlying[]=[]
  @Input() ListaRelacionUnderluing:Underlying[]=[]
  @Input() SociedadSeleccionada:number=0
  public SociedadHeader:string=''
  @Input() ObjetoSociedad:tipoSociedad[]=[]
  @Output() alertaedicion: EventEmitter<void> = new EventEmitter<void>(); 
  public ListaCliente:tipoCliente[]=[]
  public id_anterior:number=0
  public id_actual:number=0 
  public displayedColumns:string[]=[
    't001_Description',
    'actions'    
  ]
  @Input() listapuertoOrigen: cargaCombo[]=[];
  combopuerto: cargaCombo[]=[];

  @Input() listapuertoDestino: cargaCombo[]=[];
  public displayedColumns_puerto:string[]=[
    's204_Description',
    'actions'    
  ]

  constructor(
    private servicio_costplus:PortafolioMoliendaService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }
modalsubyacente(mantenedorsubyacente:any){

  if(this.SociedadSeleccionada == null || typeof this.SociedadSeleccionada == 'undefined' || this.SociedadSeleccionada == 0)  {
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Es necesario seleccionar una Sociedad',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return;
        }
  this.SociedadHeader=this.ObjetoSociedad.filter(item=>item.t033_ID==this.SociedadSeleccionada)[0].t033_Name

  this.servicio_costplus.getunderlying_cost().subscribe(
      (respuesta:Underlying[])=>{this.ListaUnderlying=respuesta})
  this.modalService.open(mantenedorsubyacente,{windowClass : "claseConsulta",centered: false,backdrop : 'static',keyboard : false}); 
  }
modalCliente(){  
    this.servicio_costplus.getcliente_cost().subscribe(
      (respuesta:tipoCliente[])=>{this.ListaCliente=respuesta;console.log(this.ListaCliente)}
    )
  }

modalPuerto_origen(mantenedorpuerto_origen:any){  
    if(this.SociedadSeleccionada == null || typeof this.SociedadSeleccionada == 'undefined' || this.SociedadSeleccionada == 0)  {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar una Sociedad',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }
this.SociedadHeader=this.ObjetoSociedad.filter(item=>item.t033_ID==this.SociedadSeleccionada)[0].t033_Name
this.servicio_costplus.getComboParam1('puertoOrigen',this.SociedadSeleccionada.toString()).subscribe(
      (response: cargaCombo[]) => {this.listapuertoOrigen = response;
        this.servicio_costplus.getPuerto_cost().subscribe(
          (respuesta:cargaCombo[])=>{this.combopuerto=respuesta;console.log(this.combopuerto)})
      })
this.modalService.open(mantenedorpuerto_origen,{windowClass : "claseConsulta",centered: false,backdrop : 'static',keyboard : false}); 
  }

modalPuerto_destino(mantenedorpuerto_destino:any){  
  if(this.SociedadSeleccionada == null || typeof this.SociedadSeleccionada == 'undefined' || this.SociedadSeleccionada == 0)  {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Es necesario seleccionar una Sociedad',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })
    return;
  }
this.SociedadHeader=this.ObjetoSociedad.filter(item=>item.t033_ID==this.SociedadSeleccionada)[0].t033_Name
this.servicio_costplus.getComboParam1('puertoDestino',this.SociedadSeleccionada.toString()).subscribe(
      (response: cargaCombo[]) => {this.listapuertoDestino = response;
        this.servicio_costplus.getPuerto_cost().subscribe(
          (respuesta:cargaCombo[])=>{this.combopuerto=respuesta;console.log(this.combopuerto)})
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    
this.modalService.open(mantenedorpuerto_destino,{windowClass : "claseConsulta",centered: false,backdrop : 'static',keyboard : false}); 
  }

addRowToEnd_subyacente() {
    const newId = this.ListaRelacionUnderluing.length + 1;
    const newData: Underlying = {
      t001_ID: newId,        // ID basado en la longitud de la lista
      t001_Ticker: '',       // Inicializar con un valor vacío
      t001_Description: '',  // Inicializar con un valor vacío
      t001_Status: 1         // Estado inicial (puedes ajustarlo según tu lógica)
    };
  
    this.ListaRelacionUnderluing.push(newData);
  
    this.ListaRelacionUnderluing = [...this.ListaRelacionUnderluing];
  }  
deleteLastRow_subyacente() {
    if (this.ListaRelacionUnderluing.length > 0) {
      this.ListaRelacionUnderluing.pop();
      this.ListaRelacionUnderluing = [...this.ListaRelacionUnderluing];
    }
  }
editarfila_subyacente(element: any): void {
  element.editing = !element.editing;
}
eliminarfila_subyacente(element: Underlying): void {
 this.id_anterior=element.t001_ID
  this.servicio_costplus.eliminar_Rel_Soc_Under(this.SociedadSeleccionada,this.id_anterior).subscribe(
    (respuesta:boolean)=>{console.log(respuesta);this.alertaedicion.emit()}
  )
}
onIDChange_subyacente(element: Underlying) {
  this.id_anterior=element.t001_ID
  this.id_actual=this.ListaUnderlying.filter(item=>item.t001_Description==element.t001_Description)[0].t001_ID
  
  console.log("Anterior:"+this.id_anterior);
  console.log("Actual:"+this.id_actual);
  const objetorelacion={t530_Society:this.SociedadSeleccionada,t530_Underlying:this.id_actual,t530_Status:1}
  console.log("Objetonuevo:",objetorelacion);
 
      this.servicio_costplus.eliminar_Rel_Soc_Under(this.SociedadSeleccionada,this.id_anterior).subscribe(
        (respuesta:boolean)=>{console.log(respuesta);
          this.servicio_costplus.registrar_Rel_Soc_Under(objetorelacion).subscribe(
            (respuesta:tipoRelacion_Soc_Und)=>{console.log(respuesta);this.alertaedicion.emit()

        }
      )
    })
}
refrescar_row_subyacente(){
  this.alertaedicion.emit()
}

//Para el caso Puerto de Origen
editarfila_puerto_origen(element:any){
  element.editing = !element.editing;
}

eliminarfila_puerto_origen(element:cargaCombo){
  this.id_anterior=parseInt(element.s204_ID)
  console.log(this.id_anterior)
  this.servicio_costplus.eliminar_Rel_Soc_Puerto_Origen(this.SociedadSeleccionada,this.id_anterior).subscribe(
    (respuesta:boolean)=>{console.log(respuesta);
      this.servicio_costplus.getComboParam1('puertoOrigen',this.SociedadSeleccionada.toString()).subscribe(
        (response: cargaCombo[]) => {this.listapuertoOrigen = response;})
    }
  )

}
addRowToEnd_puerto_origen() {
  const newId = this.listapuertoOrigen.length + 1;
  const newData: cargaCombo = {
    s204_ID: newId.toString(),        // ID basado en la longitud de la lista
    s204_Description: '',       // Inicializar con un valor vacío
  };
  this.listapuertoOrigen.push(newData);
  this.listapuertoOrigen = [...this.listapuertoOrigen];
}  
deleteLastRow_puerto_origen() {
  if (this.listapuertoOrigen.length > 0) {
    this.listapuertoOrigen.pop();
    this.listapuertoOrigen = [...this.listapuertoOrigen];
  }
}
onIDChange_puerto_origen(element: cargaCombo) {
  this.id_anterior=parseInt(element.s204_ID)
  this.id_actual=parseInt(this.combopuerto.filter(item=>item.s204_Description==element.s204_Description)[0].s204_ID)
  
  console.log("Anterior:"+this.id_anterior);
  console.log("Actual:"+this.id_actual);
  const objetorelacion={t246_Society:this.SociedadSeleccionada,t246_LoadingPort:this.id_actual,t246_Status:1}
  console.log("Objetonuevo:",objetorelacion);
 
      this.servicio_costplus.eliminar_Rel_Soc_Puerto_Origen(this.SociedadSeleccionada,this.id_anterior).subscribe(
        (respuesta:boolean)=>{console.log(respuesta);
          this.servicio_costplus.regis_Soc_Puerto_Origen(objetorelacion).subscribe(
            (respuesta:tipoRelacion_Soc_Puertoorigen)=>{console.log(respuesta);
              this.servicio_costplus.getComboParam1('puertoOrigen',this.SociedadSeleccionada.toString()).subscribe(
                (response: cargaCombo[]) => {this.listapuertoOrigen = response;})
        }
      )
    })
}
refrescar_row_puerto_origen(){
  this.servicio_costplus.getComboParam1('puertoOrigen',this.SociedadSeleccionada.toString()).subscribe(
    (response: cargaCombo[]) => {this.listapuertoOrigen = response;})
}
//Para el caso Puerto de Destino

editarfila_puerto_destino(element:any){
  element.editing = !element.editing;
}

eliminarfila_puerto_destino(element:cargaCombo){
  this.id_anterior=parseInt(element.s204_ID)
  console.log(this.id_anterior)
  this.servicio_costplus.eliminar_Rel_Soc_Puerto_Destino(this.SociedadSeleccionada,this.id_anterior).subscribe(
    (respuesta:boolean)=>{console.log(respuesta);
      this.servicio_costplus.getComboParam1('puertoDestino',this.SociedadSeleccionada.toString()).subscribe(
        (response: cargaCombo[]) => {this.listapuertoDestino = response;})
    }
  )

}
addRowToEnd_puerto_destino() {
  const newId = this.listapuertoDestino.length + 1;
  const newData: cargaCombo = {
    s204_ID: newId.toString(),        // ID basado en la longitud de la lista
    s204_Description: '',       // Inicializar con un valor vacío
  };
  this.listapuertoDestino.push(newData);
  this.listapuertoDestino = [...this.listapuertoDestino];
}  
deleteLastRow_puerto_destino() {
  if (this.listapuertoDestino.length > 0) {
    this.listapuertoDestino.pop();
    this.listapuertoDestino = [...this.listapuertoDestino];
  }
}
onIDChange_puerto_destino(element: cargaCombo) {
  this.id_anterior=parseInt(element.s204_ID)
  this.id_actual=parseInt(this.combopuerto.filter(item=>item.s204_Description==element.s204_Description)[0].s204_ID)
  
  console.log("Anterior:"+this.id_anterior);
  console.log("Actual:"+this.id_actual);
  const objetorelacion={t247_Society:this.SociedadSeleccionada,t247_LoadingPort:this.id_actual,t247_Status:1}
  console.log("Objetonuevo:",objetorelacion);
 
      this.servicio_costplus.eliminar_Rel_Soc_Puerto_Destino(this.SociedadSeleccionada,this.id_anterior).subscribe(
        (respuesta:boolean)=>{console.log(respuesta);
          this.servicio_costplus.regis_Soc_Puerto_Destino(objetorelacion).subscribe(
            (respuesta:tipoRelacion_Soc_PuertoDestino)=>{console.log(respuesta);
              this.servicio_costplus.getComboParam1('puertoDestino',this.SociedadSeleccionada.toString()).subscribe(
                (response: cargaCombo[]) => {this.listapuertoDestino = response;})
        }
      )
    })
}
refrescar_row_puerto_destino(){
  this.servicio_costplus.getComboParam1('puertoDestino',this.SociedadSeleccionada.toString()).subscribe(
    (response: cargaCombo[]) => {this.listapuertoDestino = response;})
}

 
}
