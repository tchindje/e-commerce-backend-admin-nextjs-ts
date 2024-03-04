export interface ProductType {
  _id?: string;
  title: string;
  price: number;
  description: string;
  images?: string[];
}

export interface CategoryType {
  _id?: string;
  name: string;
  parent?: CategoryType;
}

export enum SubmitAction {
  POST = "POST",
  PUT = "PUT",
}
