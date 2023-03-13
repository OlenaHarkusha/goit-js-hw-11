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

refs.form.addEventListener('submit', loadPicures);
refs.loadBtn.addEventListener('click', loadPicures);

async function loadPicures(e) {
  e.preventDefault();

  const query = refs.form.elements.searchQuery.value;

  const searchResult = await getPictures(query);

  if (!searchResult.length) {
    Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (e.type === 'submit') {
    clearMarkup();
  }
  currentPage += 1;
  if (searchResult) {
    const markup = await createMarkup(searchResult);
    insertMarkup(markup);
    const lightbox = new SimpleLightbox('.gallery a');
  }

  console.log(searchResult);
}

async function getPictures(query) {
  const KEY = '34375479-0be71e9ee085bc26f1477b7fd';
  const url = `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;

  const res = await axios.get(url);
  console.log(res.data);
  return res.data.hits;
}

async function createMarkup(array) {
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

async function loadMorePictures() {}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}
