import '../scss/main.scss';
import SearchForm from './components/search-form';
import CatalogMenu from './components/catalog-menu';

const searchFormElement = document.querySelector('.search-form');
if (searchFormElement) {
  new SearchForm({
    element: searchFormElement
  });
}

const catalogMenuElement = document.querySelector('.catalog-menu');
if (catalogMenuElement) {
  new CatalogMenu({
    element: catalogMenuElement
  });
}