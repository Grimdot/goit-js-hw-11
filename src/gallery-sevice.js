import axios from 'axios';

const API_KEY = '31815472-6ffac1728c09639d971d276fb';
const CARDS_PER_PAGE = 40;

const apiParams = `&image-type=photo&orientation=horizontal&safesearch=true&per_page=${CARDS_PER_PAGE}`;
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class GalleryService {
  constructor() {
    this.currentQuery = '';
    this.currentPage = 1;
    this.totalAmountOfPages = '';
  }

  fetchGallery() {
    return axios.get(
      `?key=${API_KEY}&q=${this.currentQuery}${apiParams}&page=${this.currentPage}`
    );
  }

  calculateTotalPagesAmount(amountOfCards) {
    this.totalAmountOfPages = Math.ceil(amountOfCards / CARDS_PER_PAGE);
  }

  resetPages() {
    this.currentPage = 1;
    this.totalAmountOfPages = '';
  }

  get page() {
    return this.currentPage;
  }

  set page(newPage) {
    return (this.currentPage = newPage);
  }

  get totalPages() {
    return this.totalAmountOfPages;
  }

  set totalPages(newTotalPages) {
    return (this.totalAmountOfPages = newTotalPages);
  }
}
