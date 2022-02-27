import { IAddress } from '../interfaces/address.interface';

const _homeAddress: IAddress = {
  name: 'My House',
  address: 'Sderot Ben Gurion 79,Tel Aviv',
  lat: 32.08345,
  long: 34.776772,
};
const _workAddress: IAddress = {
  name: 'Moveo Office',
  address: 'Har Sinai 1, Tel Aviv',
  lat: 32.06462,
  long: 34.77176,
};

export const ADDRESSES = { home: _homeAddress, work: _workAddress };
