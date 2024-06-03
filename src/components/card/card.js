import { DivComponent } from '../../common/div-component';
import './card.css';

export class Card extends DivComponent {
	constructor(appState, cardState) {
		super();
		this.appState = appState;
		this.cardState = cardState;
		this.key = cardState.id;
	}

	#addToFavorites() {
		if (!this.appState.favorites.find(b => b.id === this.key)) {
		this.appState.favorites.push(this.cardState);
		}
	}

	#deleteFromFavorites() {
		this.appState.favorites = this.appState.favorites.filter(
			b => b.key !== this.cardState.key
		);
	}

	render() {
		this.el.classList.add('card');
		const existInFavorites = this.appState.favorites.find(
			b => b.key == this.cardState.key
		);
		this.el.innerHTML = `
			<div class="card__image">
				<img src="${this.cardState.poster.previewUrl}" alt="Постер" />
			</div>
			<div class="card__info">
				<div class="card__tag">
					${this.cardState.genres[1].name || 'Не задано'}
				</div>
				<div class="card__name">
					${this.cardState.name}
				</div>
				<div class="card__description">
					${this.cardState.description || 'Не задано' }
				</div>
				<div class="card__footer">
					<button class="button__add ${existInFavorites ? 'button__active' : ''}">
						${existInFavorites 
							? '<img src="/static/favorites.svg" />'
							: '<img src="/static/favorites-white.svg" />'
						}
					</button>
				</div>
			</div>
		`;
		if (existInFavorites) {
			this.el
				.querySelector('button')
				.addEventListener('click', this.#deleteFromFavorites.bind(this));
		} else {
			this.el
				.querySelector('button')
				.addEventListener('click', this.#addToFavorites.bind(this));
		}
		return this.el;
	}
}