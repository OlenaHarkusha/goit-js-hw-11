import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};

let currentPage = 1;

refs.loadBtn.classList.add('hide');

refs.form.addEventListener('submit', loadPictures);
refs.loadBtn.addEventListener('click', loadMorePictures);

async function loadPictures(e) {
  e.preventDefault();
  currentPage = 1;

  const query = refs.form.elements.searchQuery.value.trim();

  if (!query) {
    Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const searchResult = await getPictures(query);

  if (!searchResult.hits.length) {
    Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  clearMarkup();

  Notify.info(`Hooray! We found ${searchResult.totalHits} images.`);

  if (searchResult.hits) {
    const markup = createMarkup(searchResult.hits);

    insertMarkup(markup);

    const lightbox = new SimpleLightbox('.gallery a');

    refs.loadBtn.classList.remove('hide');

    lightbox.refresh();
  }
}

async function loadMorePictures() {
  currentPage += 1;
  const query = refs.form.elements.searchQuery.value.trim();
  const searchResult = await getPictures(query);
  const markup = createMarkup(searchResult.hits);

  insertMarkup(markup);

  if (e.type === 'click') {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

  if (currentPage > Math.ceil(searchResult.totalHits / 40)) {
    refs.loadBtn.classList.add('hide');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  lightbox.refresh();
}

async function getPictures(query) {
  const KEY = '34375479-0be71e9ee085bc26f1477b7fd';
  const url = `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;
  try {
    const res = await axios.get(url);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(array) {
  return array.reduce(
    (acc, item) =>
      acc +
      `
  <a href="${item.largeImageURL}" class="gallery__item">
        <div class="photo-card">
          <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" class="gallery__image"/>
          <div class="info">
            <p class="info-item">
              <b>Likes: ${item.likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${item.views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${item.comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${item.downloads}</b>
            </p>
          </div>
        </div>
      </a>
  `,
    ''
  );
}

function insertMarkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', data);
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}
