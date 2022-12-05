import axios from 'axios';

const API_KEY = '31815472-6ffac1728c09639d971d276fb';
const apiParams =
  '&image-type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class GalleryService {
  constructor() {
    this.currentQuery = '';
    this.currentPage = 1;
    this.totalAmountOfPages = '';
  }

  fetchGallery() {
    return axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${this.currentQuery}${apiParams}&page=${this.currentPage}`
    );
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
