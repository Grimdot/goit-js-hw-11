import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';

import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryWrap: document.querySelector('.gallery'),
};

const onFormSubmit = e => {
  e.preventDefault();

  const query = e.target.elements.searchQuery.value.trim();

  axios
    .get(
      `https://pixabay.com/api/?key=31815472-6ffac1728c09639d971d276fb&q=${query}&image-type=photo&orientation=horizontal&safesearch=true`
    )
    .then(r => {
      renderPhotos(r.data.hits);
    });
};

const clearMarkup = () => {
  refs.galleryWrap.innerHTML = '';
};

const renderPhotos = photos => {
  clearMarkup();

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
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
  );

  refs.galleryWrap.insertAdjacentHTML('beforeend', markup.join(''));

  const lightbox = new SimpleLightbox('.gallery a');
};

refs.searchForm.addEventListener('submit', onFormSubmit);
