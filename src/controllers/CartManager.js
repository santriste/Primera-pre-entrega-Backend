import {promises as fs} from 'fs'
import { nanoid } from 'nanoid';
import ProductManager from "./productManager.js"

const productAll = new ProductManager

class CartManager {
    constructor (){
        this.path = "./src/models/carts.json";
    }
    readCarts = async () =>{
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    }

    writeCarts = async (cart) => {
        await fs.writeFile(this.path,JSON.stringify(cart));
    }

    exist = async (id) => {
        let carts = await this.readCarts()
        return carts.find(cart => cart.id === id)
    }

    addCarts = async () => {
        let cartsOld = await this.readCarts();
        let id = nanoid()
        let cartsConcat = [{id :id, products : []}, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return "Carrito agregado."
    }

    getCartsById = async (id) =>{
        let cartById = await this.exist(id)
        if(!cartById) return "Carrito no encontrado."
        return cartById
    };
    //////////////////////////////////////////////////////
    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId);
        if (!cartById) return "Carrito no encontrado.";
    
        let productById = await productAll.exist(productId);
        if (!productById) return "Producto no encontrado.";
    
        let cartsAll = await this.readCarts();
        let cartToUpdate = cartsAll.find((cart) => cart.id === cartId);
    
        if (cartToUpdate) {
            const existingProduct = cartToUpdate.products.find((prod) => prod.id === productId);
    
            if (existingProduct) {
                existingProduct.cantidad++;
                await this.writeCarts(cartsAll);
                return "Producto sumado al carrito.";
            } else {
                cartToUpdate.products.push({ id: productId, cantidad: 1 });
                await this.writeCarts(cartsAll);
                return "Producto agregado al carrito.";
            }
        } else {
            return "Carrito no encontrado.";
        }
    };
    
    
    }


export default CartManager