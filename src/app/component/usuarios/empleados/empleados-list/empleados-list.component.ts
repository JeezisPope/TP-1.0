import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Empleados } from 'src/app/model/empleados.model';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatSlider } from '@angular/material/slider';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-cat',
  templateUrl: './empleados-list.component.html',
  styleUrls: ['./empleados-list.component.css']
})
export class EmpleadosListComponent implements OnInit, AfterViewInit {
  searchText: any;

  noResultsFound: boolean = false;

  selectedDistrict: string = '';

  lista: Empleados[] = [];

  empleadoData!: Empleados;

  dataSource = new MatTableDataSource<Empleados>();

  @ViewChild(MatSort)

  sort!: MatSort;
  selectedMinAge: number = 18;
  selectedMaxAge: number = 65;



  selectedProfession: string = '';

  @ViewChild('districtSelect') districtSelect!: MatSelect;
  @ViewChild('professionSelect') professionSelect!: MatSelect;


  constructor(private as: EmpleadosService) {
    this.empleadoData = {} as Empleados;
    this.noResultsFound = this.dataSource.filteredData.length === 0;
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.getAllEmpleados();
  }

  ngAfterViewInit() {
    this.districtSelect.value = null;
    this.professionSelect.value = null;
  }


  getAllEmpleados() {
    this.as.getList().subscribe((data: any) => {
      this.dataSource.data = data;
    });
  }

  extractProfessions(data: Empleados[]): string[] {
    const professionsSet = new Set<string>();
    data.forEach(item => {
      if (item.profession) {
        professionsSet.add(item.profession.toLowerCase());
      }
    });
    return Array.from(professionsSet);
  }

  extractDistricts(data: Empleados[]): string[] {
    const districtSet = new Set<string>();
    data.forEach(item => {
      if (item.district) {
        districtSet.add(item.district.toLowerCase());
      }
    });
    return Array.from(districtSet);
  }


  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };
  }

  applyAgeFilter() {
    if (this.selectedMinAge >= 18 && this.selectedMaxAge >= this.selectedMinAge && this.selectedMaxAge <= 65) {
      this.dataSource.filteredData = this.dataSource.data.filter(element => {
        return element.age >= this.selectedMinAge && element.age <= this.selectedMaxAge;
      });
    } else {
      // Si los valores ingresados están fuera del rango válido, mostrar todos los elementos
      this.dataSource.filteredData = this.dataSource.data;
    }
  }



  applyDistrict(filterValue: string) {
    this.selectedDistrict = filterValue; // Almacenar el distrito seleccionado
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: Empleados, filter: string) => {
      if (this.selectedProfession) {
        // Aplicar filtro de profesión solo si se ha seleccionado una
        return (
          (data.name.toLowerCase().includes(filter) || data.district.toLowerCase().includes(filter)) &&
          data.profession.toLowerCase() === this.selectedProfession
        );
      } else {
        // Si no se ha seleccionado una profesión, aplicar filtro solo por distrito
        return data.name.toLowerCase().includes(filter) || data.district.toLowerCase().includes(filter);
      }
    };
  }

  applyProfession(filterValue: string) {
    this.selectedProfession = filterValue; // Almacenar la profesión seleccionada
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: Empleados, filter: string) => {
      if (this.selectedDistrict) {
        // Aplicar filtro de distrito solo si se ha seleccionado uno
        return (
          (data.name.toLowerCase().includes(filter) || data.profession.toLowerCase().includes(filter)) &&
          data.district.toLowerCase() === this.selectedDistrict
        );
      } else {
        // Si no se ha seleccionado un distrito, aplicar filtro solo por profesión
        return data.name.toLowerCase().includes(filter) || data.profession.toLowerCase().includes(filter);
      }
    };
  }


  clearFilters() {
    this.dataSource.filter = '';
    this.selectedDistrict = '';
    this.selectedProfession = '';
    this.noResultsFound = false;
    this.selectedMinAge = 18;
    this.selectedMaxAge = 65;

    this.districtSelect.value = null;
    this.professionSelect.value = null;
  }


  perro: any;
}

