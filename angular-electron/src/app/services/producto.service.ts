import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  url = 'http://localhost/AngularPHP/';

  constructor(private http: HttpClient) { }

  getAllProductos(){
    return this.http.get(`${this.url}getAllProductos.php`);
  }

  addProducto(producto){
    return this.http.post(`${this.url}addProducto.php`, JSON.stringify(producto));
  }

  deleteProducto(IDProducto:number){
    return this.http.get(`${this.url}deleteProducto.php?IDProducto=${IDProducto}`);
  }

  getProducto(IDProducto:number){
    return this.http.get(`${this.url}getProducto.php?IDProducto=${IDProducto}`);
  }

  getProductoBarras(codigoBarra:number){
    return this.http.get(`${this.url}getProductoBarras.php?codigoBarra=${codigoBarra}`);
  }

  updateProducto(producto){
    return this.http.post(`${this.url}updateProducto.php`, JSON.stringify(producto));
  }

  getProductoByName(nombre){
    return this.http.get(`${this.url}getProductoByName.php?nombre=${nombre}`);
  }
}
