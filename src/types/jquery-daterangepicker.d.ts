import 'jquery';

declare global {
  interface JQuery {
    daterangepicker(options?: any): JQuery;
  }
}
