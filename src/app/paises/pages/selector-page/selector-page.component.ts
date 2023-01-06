import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { switchMap, tap } from 'rxjs/operators';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {

  miFormulario : FormGroup = this.fb.group({
    region:['', Validators.required],
    pais:['', Validators.required],
    frontera:['', Validators.required]
  })

  //llenar selectores
  regiones:string[] = [];
  paises: PaisSmall[] = [];
  // fronteras:string[] = [];
  fronteras:PaisSmall[] = [];

  cargando:boolean = false;

  constructor(  private fb: FormBuilder,
                private paisesService: PaisesService) { }

  ngOnInit(): void {


    this.regiones = this.paisesService.regiones;

    //cuando cambie la region OPCION 1
    // this.miFormulario.get('region')?.valueChanges
    // .subscribe( region => {
    //   console.log(region);

    //   this.paisesService.getPaisesPorRegion( region )
    //   .subscribe( paises =>{
    //     this.paises = paises;
    //     console.log(paises)
    //   })
    // })

// OPCION 2
    this.miFormulario.get('region')?.valueChanges
    .pipe(tap( ()=>{this.miFormulario.get('pais')?.reset('');
                    this.cargando = true})
      ,switchMap(region => this.paisesService.getPaisesPorRegion( region )))
    .subscribe(paises=>{this.paises = paises;
                        this.cargando = false})

// 
    this.miFormulario.get('pais')?.valueChanges
    .pipe(tap(()=> {
      this.fronteras = [];
      this.miFormulario.get('frontera')?.reset('');;
      this.cargando = true;
      }),
      switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo) ),
      switchMap( pais => this.paisesService.getPaisesPorCodigos(pais?.borders!) ) )
    .subscribe(resp => {
      this.fronteras = resp || [];
      console.log(resp);
    })
    
  }
  

  guardar(){
    console.log(this.miFormulario.value);
  }

}
