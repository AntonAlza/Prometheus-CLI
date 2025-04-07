import { Component, OnInit } from '@angular/core';
// because it is referencing the tableau js library
// declare var tableau: any;

@Component({
  selector: 'app-riesgo-de-tesoreria',
  templateUrl: './riesgo-de-tesoreria.component.html',
  styleUrls: ['./riesgo-de-tesoreria.component.scss']
})
export class RiesgoDeTesoreriaComponent implements OnInit {

  // tableauViz: any
  
  // name:string;


  constructor() { 
  }

  ngOnInit(): void {
    
      if (!localStorage.getItem('foo')) { 
        localStorage.setItem('foo', 'no reload') 
        location.reload() 
      } else {
        localStorage.removeItem('foo') 
      }
    }
    
    // var placeholderDiv = document.getElementById('tableauViz');
    // var url = 'https://public.tableau.com/app/profile/mario3166/viz/Reporte_ALIRisk_empaquetadov3/Dashboard1?publish=yes';
    // // var url = 'https://public.tableau.com/views/USTreasuryInterestRate/Sheet1?:embed=y&:display_count=yes';
    // var options = {
    //   hideTabs: true,
    //   width: '800px',
    //   height: '700px',
    //   onFirstInteractive: function() {
    //     // The viz is now ready and can be safely used.
    //   }
    // };
    // this.tableauViz = new tableau.Viz(placeholderDiv, url, options);
  }

  


