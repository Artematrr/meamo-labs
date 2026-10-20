const header = document.querySelector('.header');

if (header) {
	const toggle = header.querySelector('.header__menu-toggle');
	const menu = header.querySelector('.header__mobile-menu');
	const compact = window.matchMedia('(max-width: 1280px)');
	const search = header.querySelector('.search__field');
	const updateSearch = () => {
		search.placeholder = compact.matches ? 'Поиск по каталогу' : 'Поиск по каталогу: название товара или бренда';
	};
	updateSearch();

	const closeMenu = (returnFocus = true) => {
		header.classList.remove('header--menu-open');
		toggle.setAttribute('aria-expanded', 'false');
		if (returnFocus) toggle.focus();
	};

	toggle.addEventListener('click', () => {
		if (toggle.getAttribute('aria-expanded') === 'true') {
			closeMenu();
		} else {
			header.classList.add('header--menu-open');
			toggle.setAttribute('aria-expanded', 'true');
			menu.querySelector('a').focus();
		}
	});
	menu.querySelector('.header__menu-close').addEventListener('click', () => closeMenu());
	menu.addEventListener('click', (event) => {
		if (event.target.closest('a') && compact.matches) closeMenu();
	});
	header.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
			event.preventDefault();
			closeMenu();
		}
	});
	header.addEventListener('focusout', (event) => {
		if (!header.contains(event.relatedTarget)) closeMenu(false);
	});
	compact.addEventListener('change', () => {
		updateSearch();
		const focusInMenu = menu.contains(document.activeElement);
		closeMenu(compact.matches && focusInMenu);
	});
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero-split--home');

if (hero) {
	const numbers = [...hero.querySelectorAll('[data-slide]')];
	const status = hero.querySelector('.hero-split__status');
	const updateHero = function () {
		numbers.forEach((button, index) => button.setAttribute('aria-pressed', String(index === this.realIndex)));
		this.slides.forEach((slide) => {
			const inactive = Number(slide.dataset.swiperSlideIndex) !== this.realIndex;
			slide.inert = inactive;
			slide.setAttribute('aria-hidden', String(inactive));
		});
		status.textContent = `Слайд ${this.realIndex + 1} из ${numbers.length}`;
	};
	const slider = new Swiper(hero.querySelector('#home-products'), {
		loop: true,
		speed: reducedMotion.matches ? 0 : 350,
		navigation: {
			prevEl: hero.querySelector('[data-direction="-1"]'),
			nextEl: hero.querySelector('[data-direction="1"]'),
		},
		a11y: {
			prevSlideMessage: 'Предыдущий слайд',
			nextSlideMessage: 'Следующий слайд',
			slideLabelMessage: 'Слайд {{index}} из {{slidesLength}}',
		},
		on: { init: updateHero, slideChange: updateHero },
	});
	numbers.forEach((button, index) => button.addEventListener('click', () => slider.slideToLoop(index)));
	reducedMotion.addEventListener('change', () => { slider.params.speed = reducedMotion.matches ? 0 : 350; });
}

document.querySelectorAll('.products-list--slider').forEach((list) => {
	const slider = new Swiper(list.querySelector('.products-list__track'), {
		slidesPerView: 'auto',
		spaceBetween: 16,
		speed: reducedMotion.matches ? 0 : 350,
		watchOverflow: true,
		breakpoints: {
			769: { slidesPerView: 3, spaceBetween: 24 },
			1025: { slidesPerView: 4, spaceBetween: 24 },
		},
		navigation: {
			prevEl: list.querySelector('[data-product-direction="-1"]'),
			nextEl: list.querySelector('[data-product-direction="1"]'),
			lockClass: 'products-list__arrow--locked',
		},
		keyboard: { enabled: true, onlyInViewport: true, pageUpDown: false },
		a11y: {
			prevSlideMessage: 'Предыдущие товары',
			nextSlideMessage: 'Следующие товары',
			slideLabelMessage: 'Товар {{index}} из {{slidesLength}}',
		},
	});
	reducedMotion.addEventListener('change', () => { slider.params.speed = reducedMotion.matches ? 0 : 350; });
});

document.querySelectorAll('.faq').forEach((faq) => {
	faq.addEventListener('click', (event) => {
		const button = event.target.closest('.faq__toggle');
		if (!button) return;
		const expanded = button.getAttribute('aria-expanded') === 'true';
		faq.querySelectorAll('.faq__toggle').forEach((toggle) => {
			const open = toggle === button && !expanded;
			const answer = document.getElementById(toggle.getAttribute('aria-controls'));
			if (!open && answer.contains(document.activeElement)) button.focus();
			toggle.setAttribute('aria-expanded', String(open));
			answer.inert = !open;
			answer.setAttribute('aria-hidden', String(!open));
		});
	});
});

const request = document.querySelector('.compact-request, .wholesale-request');

if (request) {
	const form = request.querySelector('.form');
	const fileInput = form.querySelector('.form__file');
	const fileLabel = form.querySelector('.form__file-label span');
	const removeFile = form.querySelector('.form__remove-file');
	const fileStatus = form.querySelector('.form__file-status');
	const status = form.querySelector('.form__status');
	const contextLabel = request.querySelector('.compact-request__context, .wholesale-request__context');
	const defaultContext = contextLabel.textContent;
	if (request.classList.contains('wholesale-request')) {
		const requestedContext = new URLSearchParams(window.location.search).get('request');
		let context;
		switch (requestedContext) {
			case 'other-product': context = 'Информация о другом товаре'; break;
			case 'brochures': context = 'Брошюры Jeunetique HA Dermal Filler / Jeunetique Exo'; break;
			case 'documents': context = 'Документы по выбранной позиции'; break;
			case 'supply': context = 'Вопрос по поставке'; break;
		}
		if (context) {
			contextLabel.textContent = context;
			form.elements.namedItem('context').value = context;
		}
	}

	document.querySelectorAll('a[href="#request"]').forEach((link) => {
		link.addEventListener('click', () => {
			const context = link.dataset.requestContext || defaultContext;
			contextLabel.textContent = context;
			form.elements.namedItem('context').value = context;
		});
	});

	const updateFile = () => {
		const file = fileInput.files[0];
		fileLabel.textContent = file ? file.name : 'Прикрепить файл или фото';
		removeFile.hidden = !file;
		fileStatus.textContent = file ? `Выбран файл: ${file.name}. Он ещё не отправлен.` : 'Выбранный файл удалён.';
	};
	fileInput.addEventListener('change', updateFile);
	removeFile.addEventListener('click', () => {
		fileInput.value = '';
		updateFile();
		fileInput.focus();
	});
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		status.textContent = 'Отправка пока недоступна: обработчик не подключён. Все заполненные поля и выбранный файл сохранены.';
		status.tabIndex = -1;
		status.focus();
	});
}

const expertCenter = document.querySelector('.expert-center-page');

if (expertCenter) {
	const topics = expertCenter.querySelector('.topic-filter');
	const articles = [...expertCenter.querySelectorAll('.article-card')];
	const empty = expertCenter.querySelector('.expert-center-page__empty');
	const status = expertCenter.querySelector('.expert-center-page__status');
	const pagination = expertCenter.querySelector('.pagination');
	let selectedTopic = 'all';
	let page = 1;
	const updateArticles = () => {
		const matching = articles.filter((article) => selectedTopic === 'all' || article.dataset.topic === selectedTopic);
		const pages = Math.ceil(matching.length / 6);
		articles.forEach((article) => {
			const index = matching.indexOf(article);
			article.hidden = index < (page - 1) * 6 || index >= page * 6;
		});
		empty.hidden = matching.length > 0;
		status.textContent = `Материалов по выбранной теме: ${matching.length}.`;
		pagination.hidden = pages === 0;
		pagination.replaceChildren();
		const addPageButton = (text, label, target, disabled = false) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'pagination__button';
			button.textContent = text;
			button.setAttribute('aria-label', label);
			button.dataset.page = target;
			button.disabled = disabled;
			if (text === String(page)) button.setAttribute('aria-current', 'page');
			pagination.append(button);
		};
		addPageButton('‹', 'Предыдущая страница', page - 1, page === 1);
		for (let number = 1; number <= pages; number++) addPageButton(String(number), `Страница ${number}`, number);
		addPageButton('›', 'Следующая страница', page + 1, page === pages);
	};
	topics.addEventListener('click', (event) => {
		const button = event.target.closest('.topic-filter__button');
		if (!button) return;
		selectedTopic = button.dataset.topic;
		page = 1;
		topics.querySelectorAll('button').forEach((topic) => topic.setAttribute('aria-pressed', String(topic === button)));
		updateArticles();
	});
	expertCenter.querySelector('[data-all-topics]').addEventListener('click', () => {
		const all = topics.querySelector('[data-topic="all"]');
		all.click();
		all.focus();
	});
	pagination.addEventListener('click', (event) => {
		const button = event.target.closest('[data-page]');
		if (!button) return;
		page = Number(button.dataset.page);
		updateArticles();
		pagination.querySelector('[aria-current="page"]').focus();
	});
	updateArticles();
}

const catalog = document.querySelector('.catalog');

if (catalog) {
	const grid = catalog.querySelector('.catalog-grid');
	const cards = [...grid.querySelectorAll('.product-card')];
	const panel = catalog.querySelector('.catalog-filter');
	const filterForm = panel.querySelector('form');
	const checkboxes = [...filterForm.querySelectorAll('input[type="checkbox"]')];
	const drawer = window.matchMedia('(max-width: 1280px)');
	const openFilters = catalog.querySelector('.catalog__open-filters');
	const chips = catalog.querySelector('.catalog__chips');
	const pagination = catalog.querySelector('.pagination');
	const count = catalog.querySelector('.catalog-toolbar__count');
	const sort = catalog.querySelector('#catalog-sort');
	const searchForm = header.querySelector('.search');
	const searchField = searchForm.querySelector('.search__field');
	let query = '';
	let page = 1;

	const renderCatalog = () => {
		const selected = checkboxes.filter((input) => input.dataset.applied === 'true');
		const groups = [...new Set(selected.map((input) => input.name))];
		const matches = cards.filter((card) => {
			const name = card.querySelector('.product-card__title').textContent;
			const searchable = `${name} ${card.dataset.brand} ${card.querySelector('.product-card__badge')?.textContent || ''}`.toLocaleLowerCase('ru');
			return searchable.includes(query) && groups.every((group) => selected.some((input) => input.name === group && input.value === card.dataset[group]));
		});
		if (sort.value !== 'default') {
			matches.sort((a, b) => a.querySelector('.product-card__title').textContent.localeCompare(b.querySelector('.product-card__title').textContent, 'ru', { numeric: true }) * (sort.value === 'asc' ? 1 : -1));
		}
		const pages = Math.ceil(matches.length / 8);
		page = Math.max(1, Math.min(page, pages));
		cards.forEach((card) => { card.hidden = true; });
		matches.forEach((card, index) => {
			grid.append(card);
			card.hidden = index < (page - 1) * 8 || index >= page * 8;
		});
		count.textContent = `Найдено товаров: ${matches.length}`;
		catalog.querySelector('.catalog__empty').hidden = matches.length > 0;
		chips.replaceChildren();
		selected.forEach((input) => {
			const chip = document.createElement('button');
			chip.type = 'button';
			chip.className = 'filter-chip';
			chip.textContent = `${input.dataset.groupLabel}: ${input.dataset.label}`;
			chip.setAttribute('aria-label', `Снять фильтр ${input.dataset.groupLabel}: ${input.dataset.label}`);
			chip.addEventListener('click', () => {
				input.checked = false;
				input.dataset.applied = 'false';
				page = 1;
				renderCatalog();
				(chips.querySelector('button') || count).focus({ preventScroll: true });
			});
			chips.append(chip);
		});
		chips.hidden = selected.length === 0;
		if (selected.length) {
			const reset = document.createElement('button');
			reset.type = 'button';
			reset.className = 'button button--link';
			reset.textContent = 'Сбросить всё';
			reset.dataset.clearFilters = '';
			chips.append(reset);
		}
		pagination.replaceChildren();
		pagination.hidden = pages <= 1;
		['prev', ...Array.from({ length: pages }, (_, index) => index + 1), 'next'].forEach((value) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'pagination__button';
			button.dataset.page = value;
			button.textContent = value === 'prev' ? '‹' : value === 'next' ? '›' : value;
			if (value === 'prev' || value === 'next') {
				button.setAttribute('aria-label', value === 'prev' ? 'Предыдущая страница' : 'Следующая страница');
				button.disabled = value === 'prev' ? page === 1 : page === pages;
			} else {
				button.setAttribute('aria-label', `Страница ${value}`);
				if (value === page) button.setAttribute('aria-current', 'page');
			}
			pagination.append(button);
		});
	};
	const applyFilters = () => {
		checkboxes.forEach((input) => { input.dataset.applied = String(input.checked); });
		page = 1;
		renderCatalog();
	};
	const restoreFilters = () => {
		checkboxes.forEach((input) => { input.checked = input.dataset.applied === 'true'; });
	};
	const closeFilters = () => {
		restoreFilters();
		panel.close();
		openFilters.setAttribute('aria-expanded', 'false');
		openFilters.focus({ preventScroll: true });
	};
	const adaptFilters = () => {
		const focusedInPanel = panel.contains(document.activeElement);
		restoreFilters();
		panel.close();
		openFilters.setAttribute('aria-expanded', 'false');
		panel.removeAttribute('aria-modal');
		if (!drawer.matches) panel.open = true;
		if (focusedInPanel) (drawer.matches ? openFilters : panel.querySelector('summary')).focus({ preventScroll: true });
	};
	openFilters.addEventListener('click', () => {
		restoreFilters();
		panel.setAttribute('aria-modal', 'true');
		panel.showModal();
		openFilters.setAttribute('aria-expanded', 'true');
		panel.querySelector('.catalog-filter__close').focus();
	});
	panel.querySelector('.catalog-filter__close').addEventListener('click', closeFilters);
	panel.addEventListener('cancel', (event) => {
		event.preventDefault();
		closeFilters();
	});
	panel.addEventListener('keydown', (event) => {
		if (event.key !== 'Tab' || !panel.matches(':modal')) return;
		const controls = [...panel.querySelectorAll('button, input, summary')].filter((control) => !control.disabled && control.getClientRects().length);
		const first = controls[0];
		const last = controls[controls.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	});
	drawer.addEventListener('change', adaptFilters);
	filterForm.addEventListener('change', () => { if (!drawer.matches) applyFilters(); });
	filterForm.addEventListener('submit', (event) => {
		event.preventDefault();
		applyFilters();
		if (drawer.matches) closeFilters();
	});
	filterForm.addEventListener('reset', (event) => {
		event.preventDefault();
		checkboxes.forEach((input) => { input.checked = false; });
		if (!drawer.matches) applyFilters();
	});
	catalog.addEventListener('click', (event) => {
		if (!event.target.closest('[data-clear-filters]')) return;
		checkboxes.forEach((input) => { input.checked = false; });
		applyFilters();
		count.focus({ preventScroll: true });
	});
	sort.addEventListener('change', () => { page = 1; renderCatalog(); });
	searchForm.addEventListener('submit', (event) => {
		event.preventDefault();
		query = searchField.value.trim().toLocaleLowerCase('ru');
		page = 1;
		renderCatalog();
		catalog.querySelector('.catalog__results').scrollIntoView({ block: 'start' });
	});
	catalog.querySelectorAll('[data-catalog-view]').forEach((button) => {
		button.addEventListener('click', () => {
			const list = button.dataset.catalogView === 'list';
			grid.classList.toggle('catalog-grid--list', list);
			cards.forEach((card) => card.classList.toggle('product-card--list', list));
			catalog.querySelectorAll('[data-catalog-view]').forEach((control) => {
				const pressed = control === button;
				control.setAttribute('aria-pressed', String(pressed));
				control.classList.toggle('button--secondary', !pressed);
			});
		});
	});
	pagination.addEventListener('click', (event) => {
		const button = event.target.closest('[data-page]');
		if (!button || button.disabled) return;
		page = button.dataset.page === 'prev' ? page - 1 : button.dataset.page === 'next' ? page + 1 : Number(button.dataset.page);
		renderCatalog();
		const results = catalog.querySelector('.catalog__results');
		count.focus({ preventScroll: true });
		results.scrollIntoView({ block: 'start' });
	});
	adaptFilters();
	renderCatalog();
}

const productNav = document.querySelector('.product-nav');
if (productNav) {
	const links = [...productNav.querySelectorAll('a')];
	const updateProductNav = () => {
		const current = links.find((link) => link.hash === window.location.hash) || links[0];
		links.forEach((link) => {
			if (link === current) link.setAttribute('aria-current', 'location');
			else link.removeAttribute('aria-current');
		});
	};
	window.addEventListener('hashchange', updateProductNav);
	updateProductNav();
}

const articleContents = document.querySelector('.article-contents');
if (articleContents) {
	const toggle = articleContents.querySelector('.article-contents__toggle');
	const links = document.getElementById(toggle.getAttribute('aria-controls'));
	toggle.addEventListener('click', () => {
		const expanded = toggle.getAttribute('aria-expanded') === 'true';
		toggle.setAttribute('aria-expanded', String(!expanded));
		toggle.querySelector('span').textContent = expanded ? '+' : '−';
		links.hidden = expanded;
	});
}
