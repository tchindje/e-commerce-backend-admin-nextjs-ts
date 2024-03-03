export interface ProductType {
  _id?: string;
  title: string;
  price: number;
  description: string;
  images?: string[];
}

export enum SubmitAction {
  POST = "POST",
  PUT = "PUT",
}
