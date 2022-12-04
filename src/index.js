import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';

import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryWrap: document.querySelector('.gallery'),
};

let page = null;
let query = null;

const onFormSubmit = e => {
  e.preventDefault();
  page = 1;

  query = e.target.elements.searchQuery.value.trim();

  axios
    .get(
      `https://pixabay.com/api/?key=31815472-6ffac1728c09639d971d276fb&q=${query}&image-type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    )
    .then(r => {
      clearMarkup();
      renderPhotos(r.data.hits);
      page += 1;
    });
};

const onLoadMoreClick = () => {
  axios
    .get(
      `https://pixabay.com/api/?key=31815472-6ffac1728c09639d971d276fb&q=${query}&image-type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    )
    .then(r => {
      renderPhotos(r.data.hits);
      page += 1;
    });
};

const clearMarkup = () => {
  refs.galleryWrap.innerHTML = '';
};

const renderPhotos = photos => {
  if (photos.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const markup = photos.map(
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

  showLoadMoreBtn();

  const lightbox = new SimpleLightbox('.gallery a');
};

const showLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.remove('hidden');
};

refs.searchForm.addEventListener('submit', onFormSubmit);

refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
