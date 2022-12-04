import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import InfiniteScroll from 'infinite-scroll';

import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryWrap: document.querySelector('.gallery'),
};

let currentQuery = null;

const clearMarkup = () => {
  refs.galleryWrap.innerHTML = '';
};

const onFormSubmit = e => {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value.trim();
  currentQuery = query;

  axios
    .get(
      `https://pixabay.com/api/?key=31815472-6ffac1728c09639d971d276fb&q=${query}&image-type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`
    )
    .then(r => {
      clearMarkup();
      renderPhotos(r.data.hits);
    });

  let infScroll = new InfiniteScroll(refs.galleryWrap, {
    path: `https://pixabay.com/api/?key=31815472-6ffac1728c09639d971d276fb&q=${currentQuery}&image-type=photo&orientation=horizontal&safesearch=true&per_page=40&page={{#}}`,
    history: false,
    responseBody: 'json',
    checkLastPage: '.photo-card',
  });

  infScroll.on('load', response => {
    renderPhotos(response.hits);
  });
};

const renderPhotos = photos => {
  if (!photos.length) {
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

  const lightbox = new simpleLightbox('.gallery a');
};

refs.searchForm.addEventListener('submit', onFormSubmit);
