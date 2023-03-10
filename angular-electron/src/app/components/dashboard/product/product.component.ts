import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProductoService } from 'src/app/services/producto.service';
import { lastValueFrom } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';

export interface Product {
  IDProducto: any;
  cantidad: any;
  codigoBarra: any;
  codigoCabys: any;
  iva: any;
  typeiva: any;
  nombre: any;
  precio: any;
  IDVenta: any;
  IDBodega: any;
}


export interface IVA {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  currentUser: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  form: FormGroup
  products = null;
  product = {
    IDProducto: null,
    cantidad: null,
    codigoBarra: null,
    codigoCabys: null,
    iva: null,
    typeiva:null,
    nombre: null,
    precio: null,
    IDVenta: null,
    IDBodega: null
  };
  ivaList: IVA[] = [
    {value: 0, viewValue: '0%'},
    {value: 0.13, viewValue: '0.13%'},
    
  ];
  selectedIVA: number;
  displayedColumns: string[] = ['IDProducto', 'nombre', 'precio', 'cantidad','barras', 'cabys', 'iva', 'Actions'];
  dataSource: any;
  isEditar: boolean;
  fechaCaducidad: Date | null;

  pageSlice = null;
  firstIndex = 0;
  lastIndex = 10;

  constructor( private fb: FormBuilder, private productService: ProductoService, private _snackBar: MatSnackBar, private data: DataService){
    this.form = this.fb.group({
      nameProduct : [''],
      barCode : [''],
      cabyCode : [''],
      price : [''],
      iva : [''],
      quantity : ['']
    })
    
  }

  ngAfterViewInit() {
    this.paginator = this.paginator;
  }

  ngOnInit() : void{
    this.data.currentUser.subscribe(currentUser => this.currentUser = currentUser);
    this.setElementData();
  }

  async getAllProductos() {
    const data$ = this.productService.getAllProductos(); 
    const data = await lastValueFrom(data$);
    this.products = data;
  }

  async addProduct(){
    const data$ = this.productService.addProducto(this.product);
    const data = await lastValueFrom(data$);
  }
  
  async deleteProducto(IDProducto){
    const data$ = this.productService.deleteProducto(IDProducto);
    const data = await lastValueFrom(data$);
  }

  async updateProducto(){
    const data$ = this.productService.updateProducto(this.product);
    const data = await lastValueFrom(data$);
  }

  async getProducto(IDProducto){
    const data$ = this.productService.getProducto(IDProducto);
    const data = await lastValueFrom(data$);
    this.product = data[0];
  }

  async setElementData(){
    this.form.reset();
    this.isEditar = false;
    let tempData: Product[] = [];
    await this.getAllProductos();
    this.pageSlice = this.products.slice(this.firstIndex, this.lastIndex)
    for (let e in this.pageSlice) {
      tempData.push(this.pageSlice[e]);
    }
    this.dataSource = new MatTableDataSource(tempData);
  }

  async agregar(){
    // Obtenemos valores del formulario
    const name = this.form.value.nameProduct;
    const barCode = this.form.value.barCode;
    const cabyCode = this.form.value.cabyCode;
    const price = this.form.value.price;
    var iva = this.selectedIVA
    const quantity = this.form.value.quantity;

    if(!iva){
      iva = 0
    }
    // Asignamos valores al objeto producto
    this.product.cantidad = quantity;
    this.product.codigoBarra = barCode;
    this.product.codigoCabys = cabyCode;
    this.product.iva = iva;
    if(iva == 0){
      this.product.typeiva = "NO TIENE IVA";
    } else {
      this.product.typeiva = "TIENE IVA";
    }
    this.product.nombre = name;
    this.product.precio = price;
    // consulta SQL

    if (name && barCode && cabyCode && price && quantity){
      if (isNaN(price) || isNaN(quantity) || isNaN(cabyCode) || isNaN(barCode)){
        this._snackBar.open("El precio y la cantidad deben ser n??meros",'',{
          duration: 1500,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        })
      }
      else{
        await this.addProduct();
        await this.setElementData();
        this._snackBar.open("El producto fue agregado con ??xito!",'',{
          duration: 1500,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        })
      }
    }
    else{
      this._snackBar.open("Todos los campos del formulario deben estar llenos",'',{
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      })
    }

  }

  async eliminar(id){
    await this.deleteProducto(id);
    await this.setElementData();
    this._snackBar.open("El producto fue eliminado con ??xito!",'',{
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

  async editar(){
    // Obtenemos valores del formularioS
    const name = this.form.value.nameProduct;
    const barCode = this.form.value.barCode;
    const cabyCode = this.form.value.cabyCode;
    const price = this.form.value.price;
    const iva = this.selectedIVA;
    const quantity = this.form.value.quantity;
    // Asignamos valores al objeto producto
    this.product.cantidad = quantity;
    this.product.codigoBarra = barCode;
    this.product.codigoCabys = cabyCode;
    this.product.iva = iva;
    if(iva === 0){
      this.product.typeiva = "NO TIENE IVA";
    } else {
      this.product.typeiva = "TIENE IVA";
    }
    this.product.nombre = name;
    this.product.precio = price;
    this.product.IDVenta = 'NULL';
    // consulta SQL
    await this.updateProducto();
    await this.setElementData();
    this._snackBar.open("El producto fue editado con ??xito!",'',{
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

  cargarProducto(element){
    // Cargamos datos en el formulario
    this.form.setValue({
      nameProduct: element.nombre,
      barCode: element.codigoBarra,
      cabyCode: element.codigoCabys,
      price: element.precio,
      iva: element.iva,
      quantity: element.cantidad
    });
    // Asignamos valores al objeto producto
    this.product.IDProducto = element.IDProducto;
    this.product.cantidad = element.cantidad;
    this.product.codigoBarra = element.codigoBarra;
    this.product.codigoCabys = element.codigoCabys;
    this.product.iva = element.iva;
    this.product.nombre = element.nombre;
    this.product.precio = element.precio;
    this.product.IDVenta = element.IDVenta;
    // Habilitamos modo Editar
    this.isEditar = true;
  }

  confirmar(buttonType){
    if(buttonType==="agregar") {
        this.agregar();
    }
    if(buttonType==="editar"){
        this.editar();
    }
    if(buttonType==="cancelar"){
      this.setElementData();
    }
  }

  //Metodo para manejar el Angular Material Paginator
  onPageChange(event: PageEvent){
    const startIndex = event.pageIndex * event.pageSize
    let endIndex = startIndex + event.pageSize 
    if (endIndex > this.products.length){
      endIndex = this.products.length
    }
    this.firstIndex = startIndex
    this.lastIndex = endIndex
    this.setElementData()
  }

  // Metodo para evitar null pointer exception al iniciar la aplicai??n

  productsLength(){

    if(this.products){
      return this.products.length
    }
    else{
      return 0
    }
  }

}
