import { IProduct, IOrder, ISuccess, IProductResponse } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface ILarekApi {
    getProductList: () => Promise<IProductResponse>;
    placeOrder: (order: IOrder) => Promise<ISuccess>;
}

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    async getProductList(): Promise<IProductResponse> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) => {
            return {
                products: data.items.map((item: IProduct) => ({
                    ...item,
                    image: this.cdn + item.image
                })),
            } as IProductResponse;
        });
    }

    async placeOrder(order: IOrder): Promise<ISuccess> {
        return this.post('/order', order) as Promise<ISuccess>;
    }
}