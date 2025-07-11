import { ICard, IOrder, IProductListResponse, ISuccess } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface ILarekApi {
    getProductList: () => Promise<IProductListResponse>; 
    orderResult: (order: IOrder) => Promise<ISuccess>;
}

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }


   async getProductList(): Promise<IProductListResponse> {
        const response = await this.get('/product') as ApiListResponse<ICard>;
        return {
            total: response.total,
            items: response.items.map(item => ({
                ...item,
                image: this.cdn + item.image
            }))
        };
    }

    async orderResult(order: IOrder): Promise<ISuccess> {
        return this.post('/order', order) as Promise<ISuccess>;
    }
}