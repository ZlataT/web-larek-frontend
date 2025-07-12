import { IProduct, IOrder, ISuccess } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface ILarekApi {
    getProductList: () => Promise<IProduct[]>;
    placeOrder: (order: IOrder) => Promise<ISuccess>;
}

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }


    async getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item: IProduct) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    async placeOrder(order: IOrder): Promise<ISuccess> {
        return this.post('/order', order) as Promise<ISuccess>;
    }
}