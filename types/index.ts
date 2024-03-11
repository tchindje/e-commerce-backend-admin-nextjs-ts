export interface ProductType {
  _id?: string;
  title: string;
  price: number;
  description: string;
  category?: any;
  properties?: any;
  images?: string[];
}

export interface CategoryType {
  _id?: string;
  name: string;
  properties?: { name: string; values: string[] }[];
  parent?: CategoryType;
}

export enum SubmitAction {
  POST = "POST",
  PUT = "PUT",
}
