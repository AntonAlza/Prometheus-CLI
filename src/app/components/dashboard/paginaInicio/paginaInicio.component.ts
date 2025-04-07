import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  
  selector: 'app-paginaInicio',
  templateUrl: './paginaInicio.component.html',
  styleUrls: ['./paginaInicio.component.scss']

  
})

export class paginaInicioComponent implements OnInit, OnDestroy {
  public dialog: MatDialogModule;
  private _refresh$ = new Subject<void>();
  suscription: Subscription;
  public usuario: string = '';
  myModal = false;
  modalReference: any;
  closeResult = '';

  constructor(
    private router: Router, 
    private modalService: NgbModal, 
    private portafolioMoliendaIFDService: PortafolioIFDMoliendaService
  ) {}
  
  ngOnInit(): void {
    this.usuario = this.portafolioMoliendaIFDService.usuario;
  }

  abrirModuloMolienda(): void {
    this.router.navigate(['/ventasMolienda']);
  }
  
  abrirModuloDerivado(): void {
    this.router.navigate(['/PortafolioDerivado']);
  }
  
  abrirModuloTesoreria(): void {
    this.router.navigate(['/PortafolioDerivado']);
  }

  cerrarModal(event: boolean): void {
    this.myModal = false;
    if (this.modalReference) {
      this.modalReference.close();
    }
  }
  
  ngOnDestroy(): void {
    if (this.suscription) {
      this.suscription.unsubscribe();
    }
  }

}

