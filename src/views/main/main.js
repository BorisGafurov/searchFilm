import { AbstractView } from '../../common/view.js';
import onChange from 'on-change';
import { Header } from '../../components/header/header.js';
import { Search } from '../../components/search/search.js';
import { CardList } from '../../components/card-list/card-list.js';

export class MainView extends AbstractView {
  state = {
    list: [],
    numFound: 0,
    loading: false,
    searchQuery: undefined,
    offset: 0
  };

  constructor(appState) {
    super();
    this.appState = appState;
    this.appState = onChange(this.appState, this.appStateHook.bind(this));
    this.state = onChange(this.state, this.stateHook.bind(this));
    this.setTitle('Поиск фильмов');
  }

  destroy() {
    onChange.unsubscribe(this.appState);
    onChange.unsubscribe(this.state);
  }

  appStateHook(path) {
    if (path === 'favorites') {
      this.render();
    }
  }

  async stateHook(path) {
    if (path === 'searchQuery') {
      this.state.loading = true;
      const data = await this.loadList(this.state.searchQuery, this.state.offset);
      this.state.loading = false;
      this.state.numFound = data.limit;
      this.state.list = data.docs;
    }
    if (path === 'list' || path === 'loading') {
      this.render();
    }
  }

  async loadList(q, offset) {
    try {
      const res = await fetch(`https://api.kinopoisk.dev/v1.4/movie/search?page=1&limit=6&query=${encodeURIComponent(q)}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-API-KEY': 'HHR0RJF-KVC4PVB-KQDJG0D-5T3RJSV'
        },
      });

      console.log('Offset:', offset);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Data:', data);
      return data;
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      throw error;
    }
  }

  render() {
    const main = document.createElement('div');
    main.innerHTML = `
      <h1>Найдено фильмов – ${this.state.numFound}</h1>
    `;
    main.append(new Search(this.state).render());
    main.append(new CardList(this.appState, this.state).render());
    this.app.innerHTML = '';
    this.app.append(main);
    this.renderHeader();
  }

  renderHeader() {
    const header = new Header(this.appState).render();
    this.app.prepend(header);
  }
}