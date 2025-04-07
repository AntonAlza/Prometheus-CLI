import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LimiteService } from 'src/app/models/Limites/LimiteService.service';
import { LimiteConsumo } from 'src/app/models/Limites/limiteConsumo';
import { DetalleLimiteCM } from 'src/app/models/Limites/detalleLimite';
import { LimiteGeneral } from 'src/app/models/Limites/limiteGeneral';

@Component({
  selector: 'app-registroLimites',
  templateUrl: './registroLimites.component.html',
  styleUrls: ['./registroLimites.component.scss']
})

export class registroLimitesComponent implements OnInit {

  esNumerico: boolean = true;

  public dialog: MatDialogModule;
  public indice:number;
  suscription: Subscription;
  public keypressed;
  public usuario: string='';
  public fecha:number;
  date: NgbDateStruct;
  checked: any = [];  
  public listaLimiteConsumo:LimiteConsumo[];
  public listaDetalleLimite:DetalleLimiteCM[];
  public limiteGeneral:LimiteGeneral;
  public usuarioRegistra: boolean=false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns: string[] = [
     'temp_Descripcion'
     ,'temp_TotalMed'
     ,'temp_TrigoRac'
     ,'temp_TrigoMed'
     ,'temp_DurumRac'
     ,'temp_DurumMed'
     ,'temp_SBORac'
     ,'temp_SBOMed'
     ,'temp_SBMRac'
     ,'temp_SBMMed'
     ,'temp_PalmaRac'
     ,'temp_PalmaMed'
  ];

  displayedColumnsConsumo: string[] = [
     'temp_Descripcion'
     ,'temp_Trigo'
     ,'temp_Durum'
     ,'temp_SBO'
     ,'temp_SBM'
     ,'temp_CPO'
  ];
    
  @ViewChild(MatTable) myTable: MatTable<DetalleLimiteCM>;
  dataSource: MatTableDataSource<DetalleLimiteCM>;
  dataSourceConsumo: MatTableDataSource<LimiteConsumo>;

  constructor(private limiteService: LimiteService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
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

  getformattedDate():number{
    this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    return Number(this.dateToString(this.date));
  }

  ngOnInit(): void {
    if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1 || this.portafolioMoliendaIFDService.perfiles.indexOf("MO_RegistroLimites") > -1){
      this.usuarioRegistra = true;
    }
    
    this.fecha=this.getformattedDate();
    this.usuario=this.portafolioMoliendaIFDService.usuario;

    this.getConsumoMensual();
    this.getDetalleLimite();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  applyFilterSQL(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  public getConsumoMensual(): void {
    this.limiteService.getConsumoMensual().subscribe(
      (response: LimiteConsumo[]) => {
        this.listaLimiteConsumo = response;
        this.dataSourceConsumo = new MatTableDataSource(this.listaLimiteConsumo);
        console.log("this.listaLimiteConsumo: ", this.listaLimiteConsumo);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getDetalleLimite(): void {
    this.limiteService.getDetalleLimite(1).subscribe(
      (response: DetalleLimiteCM[]) => {
        this.listaDetalleLimite = response;
        this.dataSource = new MatTableDataSource(this.listaDetalleLimite);
        this.myTable.renderRows();
        
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onSelectCommodity(element:any, valorIn:any,commodity:any,limitData:any){
    let cantidad:number = 0;
    let TM:number = 0;
    let valor:number = 0;

    valor = Number(valorIn.toString().replace(/,/g, ''))

    switch (Number(commodity)) {
      case 0:
        cantidad = this.listaLimiteConsumo.filter(i => i.temp_Limite == 1)[0].temp_Trigo;
        TM = this.listaLimiteConsumo.filter(i => i.temp_Limite == 2)[0].temp_Trigo;
        break;  
      case 1:
        cantidad = this.listaLimiteConsumo.filter(i => i.temp_Limite == 1)[0].temp_Durum;
        TM = this.listaLimiteConsumo.filter(i => i.temp_Limite == 2)[0].temp_Durum;
        break;  
      case 2:
        cantidad = this.listaLimiteConsumo.filter(i => i.temp_Limite == 1)[0].temp_SBO;
        TM = this.listaLimiteConsumo.filter(i => i.temp_Limite == 2)[0].temp_SBO;
        break;  
      case 3:
        cantidad = this.listaLimiteConsumo.filter(i => i.temp_Limite == 1)[0].temp_SBM;
        TM = this.listaLimiteConsumo.filter(i => i.temp_Limite == 2)[0].temp_SBM;
        break;  
      case 4:
        cantidad = this.listaLimiteConsumo.filter(i => i.temp_Limite == 1)[0].temp_CPO;
        TM = this.listaLimiteConsumo.filter(i => i.temp_Limite == 2)[0].temp_CPO;
        break;  
      default: 
        break;
    }
    
    switch (Number(element.temp_CodLimite)) {
      case 1://Inventario y Tránsito
      case 8://Inventario & Tránsito: % Cobertura (50%)
      case 2://Posición Delta Neto
      case 3://Bases:
      case 12://Bases: % Cobertura (35%)
        if(Number(commodity) == 0) {
          element.temp_TrigoRac = valor;
          element.temp_TrigoMed = (Number(valor)*cantidad);
          
        }else if(Number(commodity) == 1) {
          element.temp_DurumRac = valor;
          element.temp_DurumMed = (Number(valor)*cantidad);
        }else if(Number(commodity) == 2) {
          element.temp_SBORac = valor;
          element.temp_SBOMed = (Number(valor)*cantidad);
        }else if(Number(commodity) == 3) {
          element.temp_SBMRac = valor;
          element.temp_SBMMed = (Number(valor)*cantidad);
        }else if(Number(commodity) == 4) {
          element.temp_PalmaRac = valor;
          element.temp_PalmaMed = (Number(valor)*cantidad);
        }
        element.temp_TotalMed = element.temp_CodLimite == 2 ? null : element.temp_TrigoMed + element.temp_DurumMed + element.temp_SBOMed + element.temp_SBMMed + element.temp_PalmaMed;
        break;
      case 5://Cash en Posición por Embarcar
      case 6://Cash en Posición Comprada
        if(Number(commodity) == 0) {
          element.temp_TrigoRac = valor;
          element.temp_TrigoMed = (Number(valor) * cantidad * TM);
        }else if(Number(commodity) == 1) {
          element.temp_DurumRac = valor;
          element.temp_DurumMed = (Number(valor) * cantidad * TM);
        }else if(Number(commodity) == 2) {
          element.temp_SBORac = valor;
          element.temp_SBOMed = (Number(valor) * cantidad * TM);
        }else if(Number(commodity) == 3) {
          element.temp_SBMRac = valor;
          element.temp_SBMMed = (Number(valor) * cantidad * TM);
        }else if(Number(commodity) == 4) {
          element.temp_PalmaRac = valor;
          element.temp_PalmaMed = (Number(valor) * cantidad * TM);
        }
        element.temp_TotalMed = element.temp_TrigoMed + element.temp_DurumMed + element.temp_SBOMed + element.temp_SBMMed + element.temp_PalmaMed;
        break;
      case 13://MTM: Liquidación a Precio FOB
      case 135://Gasto de Primas
        if(Number(commodity) == 5) {
          element.temp_TotalMed = valor;
        }
        break;
      case 15://PMD: Compras Flat
      case 16://PMD: Compras Bases
      case 17://PMD: IFDs
        if(Number(commodity) == 0) {
          element.temp_TrigoMed = valor;
        }else if(Number(commodity) == 1) {
          element.temp_DurumMed = valor;
        }else if(Number(commodity) == 2) {
          element.temp_SBOMed = valor;
        }else if(Number(commodity) == 3) {
          element.temp_SBMMed = valor;
        }else if(Number(commodity) == 4) {
          element.temp_PalmaMed = valor;
        }
        break;
      case 4://Meses Giro
        if(Number(commodity) == 0) {
          element.temp_TrigoRac = valor;
          element.temp_TrigoMed = valor;
        }else if(Number(commodity) == 1) {
          element.temp_DurumRac = valor;
          element.temp_DurumMed = valor;
        }else if(Number(commodity) == 2) {
          element.temp_SBORac = valor;
          element.temp_SBOMed = valor;
        }else if(Number(commodity) == 3) {
          element.temp_SBMRac = valor;
          element.temp_SBMMed = valor;
        }else if(Number(commodity) == 4) {
          element.temp_PalmaRac = valor;
          element.temp_PalmaMed = valor;
        }
        element.temp_TotalMed = null;
        break;
      case 14://MTM + PnL Portafolio 2
        if(Number(commodity) == 0 && Number(limitData) == 1){
          element.temp_TrigoRac = valor;
        }else if(Number(commodity) == 0 && Number(limitData) == 2) {
          element.temp_TrigoMed = valor;
        }else if(Number(commodity) == 1 && Number(limitData) == 1){
          element.temp_DurumRac = valor;
        }else if(Number(commodity) == 1 && Number(limitData) == 2) {
          element.temp_DurumMed = valor;
        }else if(Number(commodity) == 2 && Number(limitData) == 1){
          element.temp_SBORac = valor;
        }else if(Number(commodity) == 2 && Number(limitData) == 2) {
          element.temp_SBOMed = valor;
        }else if(Number(commodity) == 3 && Number(limitData) == 1){
          element.temp_SBMRac = valor;
        }else if(Number(commodity) == 3 && Number(limitData) == 2) {
          element.temp_SBMMed = valor;
        }else if(Number(commodity) == 4 && Number(limitData) == 1){
          element.temp_PalmaRac = valor;
        }else if(Number(commodity) == 4 && Number(limitData) == 2) {
          element.temp_PalmaMed = valor;
        }
        
        element.temp_TotalMed = element.temp_TrigoMed + element.temp_DurumMed + element.temp_SBOMed + element.temp_SBMMed + element.temp_PalmaMed;
        break;
      default: 
        break;
    }
   }
   onSelectCommodityConsumo(elemento:any, valorCant:any,commodity:any){
    let cantidad:number = 0;
    let TM:number = 0;
    let valor:number = 0;

    cantidad=Number(valorCant.toString().replace(/,/g,''));

    if(Number(commodity)==0) {
      elemento.temp_Trigo = cantidad;
    }else if(Number(commodity)==1) {
      elemento.temp_Durum = cantidad;
    }else if(Number(commodity)==2) {
      elemento.temp_SBO = cantidad;
    }else if(Number(commodity)==3) {
      elemento.temp_SBM = cantidad;
    }else if(Number(commodity)==4) {
      elemento.temp_CPO = cantidad;
    }

    for (let element of this.listaDetalleLimite ){
      switch (Number(element.temp_CodLimite)) {
        case 1://Inventario y Tránsito
        case 8://Inventario & Tránsito: % Cobertura (50%)
        case 2://Posición Delta Neto
        case 3://Bases:
        case 12://Bases: % Cobertura (35%)
          if(Number(commodity)==0) {
            valor=element.temp_TrigoRac
            cantidad = this.listaLimiteConsumo[0].temp_Trigo
            element.temp_TrigoMed = (Number(valor) * cantidad);
          }else if(Number(commodity)==1) {
            valor=element.temp_DurumRac
            cantidad = this.listaLimiteConsumo[0].temp_Durum
            element.temp_DurumMed = (Number(valor) * cantidad);
          }else if(Number(commodity)==2) {
            valor=element.temp_SBORac
            cantidad = this.listaLimiteConsumo[0].temp_SBO
            element.temp_SBOMed = (Number(valor) * cantidad);
          }else if(Number(commodity)==3) {
            valor=element.temp_SBMRac
            cantidad = this.listaLimiteConsumo[0].temp_SBM
            element.temp_SBMMed = (Number(valor) * cantidad);
          }else if(Number(commodity)==4) {
            valor=element.temp_PalmaRac
            cantidad = this.listaLimiteConsumo[0].temp_CPO
            element.temp_PalmaMed = (Number(valor) * cantidad);
          }
          if (element.temp_CodLimite != 2)
            element.temp_TotalMed = element.temp_TrigoMed + element.temp_DurumMed + element.temp_SBOMed + element.temp_SBMMed + element.temp_PalmaMed;
          break;
        case 5://Cash en Posición por Embarcar
        case 6://Cash en Posición Comprada
          if(Number(commodity)==0) {
            TM= this.listaLimiteConsumo[1].temp_Trigo
            cantidad = this.listaLimiteConsumo[0].temp_Trigo
            valor = element.temp_TrigoRac
            element.temp_TrigoMed = (Number(valor) * cantidad * TM);
          }else if(Number(commodity)==1) {
            TM= this.listaLimiteConsumo[1].temp_Durum
            cantidad = this.listaLimiteConsumo[0].temp_Durum
            valor = element.temp_DurumRac
            element.temp_DurumMed = (Number(valor) * cantidad * TM);
          }else if(Number(commodity)==2) {
            TM= this.listaLimiteConsumo[1].temp_SBO
            cantidad = this.listaLimiteConsumo[0].temp_SBO
            valor = element.temp_SBORac
            element.temp_SBOMed = (Number(valor) * cantidad * TM);
          }else if(Number(commodity)==3) {
            TM= this.listaLimiteConsumo[1].temp_SBM
            cantidad = this.listaLimiteConsumo[0].temp_SBM
            valor = element.temp_SBMRac
            element.temp_SBMMed = (Number(valor) * cantidad * TM);
          }else if(Number(commodity)==4) {
            TM= this.listaLimiteConsumo[1].temp_CPO
            cantidad = this.listaLimiteConsumo[0].temp_CPO
            valor = element.temp_PalmaRac
            element.temp_PalmaMed = (Number(valor) * cantidad * TM);
          }
          element.temp_TotalMed = element.temp_TrigoMed + element.temp_DurumMed + element.temp_SBOMed + element.temp_SBMMed + element.temp_PalmaMed;
          break;
        default: 
          break;
      }
    }
  }

  public guardarLimites(): void {
    this.limiteGeneral=new LimiteGeneral()
    this.limiteGeneral.detalleLimiteCM=[]
    this.limiteGeneral.detalleLimiteConsumo=[]
    this.limiteGeneral.detalleLimiteCM=this.listaDetalleLimite
    this.limiteGeneral.detalleLimiteConsumo=this.listaLimiteConsumo
    this.limiteGeneral.usuario=this.usuario
    this.limiteGeneral.fecha=this.fecha
    
    this.limiteService.guardarLimites(this.limiteGeneral).subscribe(data=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se guardó los límites de CM.',
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#4b822d'
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

  guardarCambios(){
    Swal.fire({
      icon: 'question',
      title: 'Aviso',
      html: 'Desea actualizar los límites de CMP al ' + this.fecha.toString().substring(0,4) + '/' + this.fecha.toString().substring(4,6) + '/' + this.fecha.toString().substring(6,8),
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.guardarLimites();
      }
      else{
        return;
      }
    });
  }

  esCampoEditable(fila: number, columna: number): boolean{
    return (
      (fila === 6 && columna === 2) || (fila === 8 && columna === 2)

      || (fila === 0 && columna ===3) || (fila === 1 && columna ===3)
      || (fila === 2 && columna ===3) || (fila === 3 && columna ===3)
      || (fila === 4 && columna ===3) || (fila === 5 && columna ===3)
      || (fila === 7 && columna ===3) || (fila === 12 && columna ===3)
      || (fila === 13 && columna ===3)

      || (fila === 9 && columna ===4) || (fila === 10 && columna ===4)
      || (fila === 11 && columna ===4) || (fila === 13 && columna ===4)

      || (fila === 0 && columna ===5) || (fila === 1 && columna ===5)
      || (fila === 2 && columna ===5) || (fila === 3 && columna ===5)
      || (fila === 4 && columna ===5) || (fila === 5 && columna ===5)
      || (fila === 7 && columna ===5) || (fila === 12 && columna ===5)
      || (fila === 13 && columna ===5)

      || (fila === 9 && columna ===6) || (fila === 10 && columna ===6)
      || (fila === 11 && columna ===6) || (fila === 13 && columna ===6)

      || (fila === 0 && columna ===7) || (fila === 1 && columna ===7)
      || (fila === 2 && columna ===7) || (fila === 3 && columna ===7)
      || (fila === 4 && columna ===7) || (fila === 5 && columna ===7)
      || (fila === 7 && columna ===7) || (fila === 12 && columna ===7)
      || (fila === 13 && columna ===7)

      || (fila === 9 && columna ===8) || (fila === 10 && columna ===8)
      || (fila === 11 && columna ===8) || (fila === 13 && columna ===8)

      || (fila === 0 && columna ===9) || (fila === 1 && columna ===9)
      || (fila === 2 && columna ===9) || (fila === 3 && columna ===9)
      || (fila === 4 && columna ===9) || (fila === 5 && columna ===9)
      || (fila === 7 && columna ===9) || (fila === 12 && columna ===9)
      || (fila === 13 && columna ===9)

      || (fila === 9 && columna ===10) || (fila === 10 && columna ===10)
      || (fila === 11 && columna ===10) || (fila === 13 && columna ===10)

      || (fila === 0 && columna ===11) || (fila === 1 && columna ===11)
      || (fila === 2 && columna ===11) || (fila === 3 && columna ===11)
      || (fila === 4 && columna ===11) || (fila === 5 && columna ===11)
      || (fila === 7 && columna ===11) || (fila === 12 && columna ===11)
      || (fila === 13 && columna ===11)

      || (fila === 9 && columna ===12) || (fila === 10 && columna ===12)
      || (fila === 11 && columna ===12) || (fila === 13 && columna ===12)
    );
  }

  formatearValorMonto(event: Event, valorModel){
    const inputElement = event.target as HTMLInputElement;
    let newValue = inputElement.value;
    newValue = newValue.replace(/[^0-9.]/g, '');
    inputElement.value = this.formatNumber(newValue);
    valorModel = Number(newValue);
  }
  
  formatNumber(value: string): string {
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}
