import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FretService } from 'src/app/models/Fret/fret.service';
import { objInitTabPosicion } from 'src/app/models/Fret/objInitTabPosicion';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { listaDataEntry } from 'src/app/models/Fret/listaDataEntry';

@Component({
  selector: 'app-detalle-tipo-trigo',
  templateUrl: './detalle-tipo-trigo.component.html',
  styleUrls: ['./detalle-tipo-trigo.component.scss']
})
export class DetalleTipoTrigoComponent implements OnInit {
  tablaDetalle: Object[];
  columnas: Object [] = [];
  @Output () close: EventEmitter<boolean>= new EventEmitter();
  selectedCells: Set<string> = new Set();
  isSelecting: boolean = false;
  selectionSum: number = 0;

  constructor(private fretService: FretService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<DetalleTipoTrigoComponent>) {
    
   }

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos(){
    
    this.fretService.obtenerDetalleTipoTrigo(Number(this.data.dato1),this.data.dato2).subscribe(
      (response: objInitTabPosicion) => {
        this.columnas = response.columnas;
        this.tablaDetalle = response.listaDataTipoTrigo;
      })
  }

  isCellSelected(row: number, column: string): boolean {
    return this.selectedCells.has(`${row}|${column}`);
    return false;
  }

  startSelection(event: MouseEvent, row: number, column: string) {
    event.preventDefault(); // Previene la selección de texto
    this.isSelecting = true;

    if(event.ctrlKey){this.addToSelection(event, row, column);}
    else{this.selectedCells.clear();this.addToSelection(event, row, column);} 

    // this.selectedCells.clear(); // Limpiar la selección previa
    // this.addToSelection(event, row, column, tabla);
    this.updateSelectionSum();
  }

  updateSelectionSum() {
    let element
    
    this.selectionSum = Array.from(this.selectedCells).reduce((sum, cellKey) => {
    const [fila, column, nombreTabla] = cellKey.split('|');
    element = this.tablaDetalle[fila][column];
    
    if(typeof element == 'number'){
      sum += (element || 0);
    }else{
      sum += (parseFloat(element.replace(/,/g, "").replace('%', '').replace(',','')) || 0);
    }
    
    
    return sum;
  }, 0);
  }

  addToSelection(event: MouseEvent, row: any, column: string) {
    if (this.isSelecting && column) {
      this.selectedCells.add(`${row}|${column}`);
      this.updateSelectionSum();
    }
  }

  endSelection() {
    this.isSelecting = false;
  }

  cerrar() {
    console.log("modal cerrado asociar");
    this.dialogRef.close();
    this.close.emit(false);  

  }

}
