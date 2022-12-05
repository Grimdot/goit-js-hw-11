import simpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import GalleryService from './gallery-sevice';

import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryWrap: document.querySelector('.gallery'),
};

const galleryService = new GalleryService();

const clearMarkup = () => {
  refs.galleryWrap.innerHTML = '';
};

const showLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.remove('hidden');
};

const hideLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.add('hidden');
};

const notify = photosObj => {
  const { totalHits, hits } = photosObj;

  if (galleryService.page === galleryService.totalPages) {
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
    hideLoadMoreBtn();
  }

  if (galleryService.page === 1 && totalHits != 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (!hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    hideLoadMoreBtn();
    return;
  }
};

const render = photos => {
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
  hideLoadMoreBtn();
  clearMarkup();
  galleryService.resetPages();

  const query = e.target.elements.searchQuery.value.trim();

  galleryService.currentQuery = query;

  galleryService.fetchGallery().then(r => {
    galleryService.totalPages = Math.ceil(r.data.totalHits / 40);

    showLoadMoreBtn();
    render(r.data);
    notify(r.data);
  });
};

const onLoadMoreClick = () => {
  galleryService.currentPage += 1;

  galleryService.fetchGallery().then(r => {
    render(r.data);
    notify(r.data);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
};

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
