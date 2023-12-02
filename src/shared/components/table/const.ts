import { ITableHeaders } from './table.model';

export const iconMenu =
  '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"  viewBox="0 0 768 768"><title/><g id="icomoon-ignore"></g><path d="M384 511.5q25.5 0 45 19.5t19.5 45-19.5 45-45 19.5-45-19.5-19.5-45 19.5-45 45-19.5zM384 319.5q25.5 0 45 19.5t19.5 45-19.5 45-45 19.5-45-19.5-19.5-45 19.5-45 45-19.5zM384 256.5q-25.5 0-45-19.5t-19.5-45 19.5-45 45-19.5 45 19.5 19.5 45-19.5 45-45 19.5z"/></svg>';

export const tableHeaders: ITableHeaders[] = [
  {
    key: 'logo',
    name: 'Logo',
    type: 'image',
  },
  {
    key: 'name',
    name: 'Nombre del producto',
  },
  {
    key: 'description',
    name: 'Descripción',
  },
  {
    key: 'date_release',
    name: 'Fecha de liberación',
  },
  {
    key: 'date_revision',
    name: 'Fecha de reestructuración',
  },
];
