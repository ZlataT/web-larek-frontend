import { ICard } from "../types";


export class BasketData{
    items: ICard[];
    
    addItem(card:ICard){
        this.items.push(card);
    };

    removeItem(id:string){
        const index = this.items.findIndex(item => item.id === id);
        this.items.splice(index, 1);
    };

    clearItems(){
        this.items = [];
    }
}