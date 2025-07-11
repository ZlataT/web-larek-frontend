import { ICard, IOrder, IProductListResponse, ISuccess } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface ILarekApi {
    getProductList: () => Promise<ICard[]>; 
    orderResult: (order: IOrder) => Promise<ISuccess>;
}

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }


   async getProductList(): Promise<ICard[]> {
    return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item: ICard) => ({ 
                ...item,
                 image: this.cdn + item.image }))
		);
}

    async orderResult(order: IOrder): Promise<ISuccess> {
        return this.post('/order', order) as Promise<ISuccess>;
    }
}