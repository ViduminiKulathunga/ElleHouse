import { Collection, ObjectId } from 'mongodb';

export interface Listing {
  _id: ObjectId;
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  numOfBaths: number;
  rating: number;
}

export interface Database {
  listings: Collection<Listing>;
}

// ---- Generics
interface IdentityObj<T = number> {
  field: T;
}

const identity = <TData = number, TVariables = number>(arg: TData): TData => {
  const obt: IdentityObj<TData> = {
    field: arg,
  };
  return ObjectId.field;
};

identity<number>(5);
identity<string>('5'); 
