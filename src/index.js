import simpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import InfiniteScroll, { data } from 'infinite-scroll';
import GalleryApiService from './gallery-sevice';

import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '31815472-6ffac1728c09639d971d276fb';
const apiParams =
  '&image-type=photo&orientation=horizontal&safesearch=true&per_page=40';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryWrap: document.querySelector('.gallery'),
};

const galleryApiService = new GalleryApiService();

const clearMarkup = () => {
  refs.galleryWrap.innerHTML = '';
};

const render = photos => {
  if (galleryApiService.page === 1 && photos.totalHits != 0) {
    Notiflix.Notify.success(`"Hooray! We found ${photos.totalHits} images."`);
  }

  if (!photos.hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.loadMoreBtn.classList.add('hidden');
    return;
  }
  if (galleryApiService.page === galleryApiService.totalPages) {
    refs.loadMoreBtn.classList.add('hidden');
  }

  const markup = photos.hits.map(
    ({ webformatURL, likes, views, comments, downloads, largeImageURL }) => `
    <div class="photo-card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b>
        <span>${views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <span>${downloads}</span>
      </p>
    </div>
  </div>`
  );

  refs.galleryWrap.insertAdjacentHTML('beforeend', markup.join(''));

  const lightbox = new simpleLightbox('.gallery a');
};

const onFormSubmit = e => {
  e.preventDefault();
  clearMarkup();
  galleryApiService.resetPages();

  const query = e.target.elements.searchQuery.value.trim();
  galleryApiService.currentQuery = query;

  galleryApiService.fetchGallery().then(r => {
    galleryApiService.totalPages = Math.ceil(r.data.totalHits / 40);
    refs.loadMoreBtn.classList.remove('hidden');

    render(r.data);
  });
};

const onLoadMoreClick = () => {
  galleryApiService.currentPage += 1;

  galleryApiService.fetchGallery().then(r => {
    render(r.data);

    console.log(
      galleryApiService.totalAmountOfPages,
      galleryApiService.currentPage
    );
  });
};

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
