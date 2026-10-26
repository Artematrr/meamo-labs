const header = document.querySelector('.js-header')
if (header) {
	const toggle = header.querySelector('.js-menu-toggle')
	const menu = header.querySelector('.js-menu')
	const compact = window.matchMedia('(max-width: 1280px)')
	const search = header.querySelector('.js-search-input')
	const updateSearch = () => {
		search.placeholder = compact.matches
			? 'Поиск по каталогу'
			: 'Поиск по каталогу: название товара или бренда'
	}
	updateSearch()

	const closeMenu = (returnFocus = true) => {
		header.classList.remove('header--menu-open')
		toggle.setAttribute('aria-expanded', 'false')
		if (returnFocus) toggle.focus()
	}

	toggle.addEventListener('click', () => {
		if (toggle.getAttribute('aria-expanded') === 'true') {
			closeMenu()
		} else {
			header.classList.add('header--menu-open')
			toggle.setAttribute('aria-expanded', 'true')
			menu.querySelector('.js-menu-link').focus()
		}
	})
	menu
		.querySelector('.js-menu-close')
		.addEventListener('click', () => closeMenu())
	menu.addEventListener('click', event => {
		if (event.target.closest('.js-menu-link') && compact.matches) closeMenu()
	})
	header.addEventListener('keydown', event => {
		if (
			event.key === 'Escape' &&
			toggle.getAttribute('aria-expanded') === 'true'
		) {
			event.preventDefault()
			closeMenu()
		}
	})
	header.addEventListener('focusout', event => {
		if (!header.contains(event.relatedTarget)) closeMenu(false)
	})
	compact.addEventListener('change', () => {
		updateSearch()
		const focusInMenu = menu.contains(document.activeElement)
		closeMenu(compact.matches && focusInMenu)
	})
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const hero = document.querySelector('.js-home-hero')
if (hero) {
	const numbers = [...hero.querySelectorAll('.js-hero-slide')]
	const status = hero.querySelector('.js-hero-status')
	const updateHero = function () {
		numbers.forEach((button, index) =>
			button.setAttribute('aria-pressed', String(index === this.realIndex)),
		)
		this.slides.forEach(slide => {
			const inactive = Number(slide.dataset.swiperSlideIndex) !== this.realIndex
			slide.inert = inactive
			slide.setAttribute('aria-hidden', String(inactive))
		})
		status.textContent = `Слайд ${this.realIndex + 1} из ${numbers.length}`
	}
	const slider = new Swiper(hero.querySelector('.js-hero-slider'), {
		loop: true,
		speed: reducedMotion.matches ? 0 : 350,
		navigation: {
			prevEl: hero.querySelector('.js-hero-prev'),
			nextEl: hero.querySelector('.js-hero-next'),
		},
		a11y: {
			prevSlideMessage: 'Предыдущий слайд',
			nextSlideMessage: 'Следующий слайд',
			slideLabelMessage: 'Слайд {{index}} из {{slidesLength}}',
		},
		on: { init: updateHero, slideChange: updateHero },
	})
	numbers.forEach((button, index) =>
		button.addEventListener('click', () => slider.slideToLoop(index)),
	)
	reducedMotion.addEventListener('change', () => {
		slider.params.speed = reducedMotion.matches ? 0 : 350
	})
}

document.querySelectorAll('.js-products-carousel').forEach(list => {
	const slider = new Swiper(list.querySelector('.js-products-slider'), {
		slidesPerView: 'auto',
		spaceBetween: 16,
		speed: reducedMotion.matches ? 0 : 350,
		watchOverflow: true,
		breakpoints: {
			769: { slidesPerView: 3, spaceBetween: 24 },
			1025: { slidesPerView: 4, spaceBetween: 24 },
		},
		navigation: {
			prevEl: list.querySelector('.js-products-prev'),
			nextEl: list.querySelector('.js-products-next'),
			lockClass: 'products-list__arrow--locked',
		},
		keyboard: { enabled: true, onlyInViewport: true, pageUpDown: false },
		a11y: {
			prevSlideMessage: 'Предыдущие товары',
			nextSlideMessage: 'Следующие товары',
			slideLabelMessage: 'Товар {{index}} из {{slidesLength}}',
		},
	})
	reducedMotion.addEventListener('change', () => {
		slider.params.speed = reducedMotion.matches ? 0 : 350
	})
})

document.querySelectorAll('.js-faq').forEach(faq => {
	faq.addEventListener('click', event => {
		const button = event.target.closest('.js-faq-toggle')
		if (!button) return
		const expanded = button.getAttribute('aria-expanded') === 'true'
		faq.querySelectorAll('.js-faq-toggle').forEach(toggle => {
			const open = toggle === button && !expanded
			const answer = toggle
				.closest('.js-faq-item')
				.querySelector('.js-faq-answer')
			if (!open && answer.contains(document.activeElement)) button.focus()
			toggle.setAttribute('aria-expanded', String(open))
			answer.inert = !open
			answer.setAttribute('aria-hidden', String(!open))
		})
	})
})

const request = document.querySelector('.js-request')
if (request) {
	const form = request.querySelector('.js-request-form')
	const fileInput = form.querySelector('.js-request-file')
	const fileLabel = form.querySelector('.js-request-file-label')
	const removeFile = form.querySelector('.js-request-remove-file')
	const fileStatus = form.querySelector('.js-request-file-status')
	const status = form.querySelector('.js-request-status')
	const contextLabel = request.querySelector('.js-request-context')
	const defaultContext = contextLabel.textContent
	if (request.classList.contains('js-wholesale-request')) {
		const requestedContext = new URLSearchParams(window.location.search).get(
			'request',
		)
		let context
		switch (requestedContext) {
			case 'other-product':
				context = 'Информация о другом товаре'
				break
			case 'brochures':
				context = 'Брошюры Jeunetique HA Dermal Filler / Jeunetique Exo'
				break
			case 'documents':
				context = 'Документы по выбранной позиции'
				break
			case 'supply':
				context = 'Вопрос по поставке'
				break
		}
		if (context) {
			contextLabel.textContent = context
			form.elements.namedItem('context').value = context
		}
	}

	document.querySelectorAll('.js-request-link').forEach(link => {
		link.addEventListener('click', () => {
			const context = link.dataset.requestContext || defaultContext
			contextLabel.textContent = context
			form.elements.namedItem('context').value = context
		})
	})

	const updateFile = () => {
		const file = fileInput.files[0]
		const error =
			file &&
			(file.size > 10 * 1024 * 1024
				? 'Выберите файл до 10 МБ.'
				: !/\.(pdf|xlsx|xls|csv|jpe?g|png)$/i.test(file.name)
					? 'Выберите файл PDF, XLSX, XLS, CSV, JPG, JPEG или PNG.'
					: '')
		fileInput.setCustomValidity(error || '')
		fileLabel.textContent = file ? file.name : 'Прикрепить файл или фото'
		removeFile.hidden = !file
		fileStatus.textContent =
			error || (file ? `Выбран файл: ${file.name}.` : 'Выбранный файл удалён.')
	}
	fileInput.addEventListener('change', updateFile)
	removeFile.addEventListener('click', () => {
		fileInput.value = ''
		updateFile()
		fileInput.focus()
	})
	form.addEventListener('input', () => {
		form.elements.namedItem('name').setCustomValidity('')
		if (form.elements.namedItem('email'))
			form.elements.namedItem('email').setCustomValidity('')
	})
	form.addEventListener('submit', event => {
		event.preventDefault()
		const name = form.elements.namedItem('name')
		name.setCustomValidity(name.value.trim() ? '' : 'Укажите имя.')
		const email = form.elements.namedItem('email')
		if (email)
			email.setCustomValidity(
				email.value.trim() || form.elements.namedItem('phone').value.trim()
					? ''
					: 'Укажите email или телефон.',
			)
		if (!form.reportValidity()) return
		status.hidden = false
		status.textContent =
			'Не удалось отправить запрос. Попробуйте позже — заполненные поля и выбранный файл сохранены.'
		status.tabIndex = -1
		status.focus()
	})
}

const expertCenter = document.querySelector('.js-expert-center')
if (expertCenter) {
	const topics = expertCenter.querySelector('.js-topics')
	const articles = [...expertCenter.querySelectorAll('.js-expert-article')]
	const empty = expertCenter.querySelector('.js-expert-empty')
	const status = expertCenter.querySelector('.js-expert-status')
	const pagination = expertCenter.querySelector('.js-pagination')
	const pageSize = 6
	let selectedTopic = 'all'
	let page = 1
	const updateArticles = () => {
		const matching = articles.filter(
			article =>
				selectedTopic === 'all' || article.dataset.topic === selectedTopic,
		)
		const pages = Math.ceil(matching.length / pageSize)
		articles.forEach(article => {
			const index = matching.indexOf(article)
			article.hidden = index < (page - 1) * pageSize || index >= page * pageSize
		})
		empty.hidden = matching.length > 0
		status.textContent = `Материалов по выбранной теме: ${matching.length}.`
		pagination.hidden = pages <= 1
		pagination.replaceChildren()
		const addPageButton = (text, label, target, disabled = false) => {
			const button = document.createElement('button')
			button.type = 'button'
			button.className = 'pagination__button js-pagination-button'
			button.textContent = text
			button.setAttribute('aria-label', label)
			button.dataset.page = target
			button.disabled = disabled
			if (target === page) button.setAttribute('aria-current', 'page')
			pagination.append(button)
		}
		addPageButton('‹', 'Предыдущая страница', 'prev', page === 1)
		for (let number = 1; number <= pages; number++) {
			addPageButton(String(number), `Страница ${number}`, number)
		}
		addPageButton('›', 'Следующая страница', 'next', page >= pages)
	}
	topics.addEventListener('click', event => {
		const button = event.target.closest('.js-topic-button')
		if (!button) return
		selectedTopic = button.dataset.topic
		page = 1
		topics
			.querySelectorAll('.js-topic-button')
			.forEach(topic =>
				topic.setAttribute('aria-pressed', String(topic === button)),
			)
		updateArticles()
	})
	expertCenter
		.querySelector('.js-topics-reset')
		.addEventListener('click', () => {
			const all = topics.querySelector('.js-topic-button[data-topic="all"]')
			all.click()
			all.focus()
		})
	pagination.addEventListener('click', event => {
		const button = event.target.closest('.js-pagination-button')
		if (!button || button.disabled) return
		page =
			button.dataset.page === 'prev'
				? page - 1
				: button.dataset.page === 'next'
					? page + 1
					: Number(button.dataset.page)
		updateArticles()
		pagination.querySelector('.js-pagination-button[aria-current="page"]').focus()
	})
	updateArticles()
}

const catalog = document.querySelector('.js-catalog')
if (catalog) {
	const grid = catalog.querySelector('.js-catalog-grid')
	const cards = [...grid.querySelectorAll('.js-product-card')]
	const panel = catalog.querySelector('.js-catalog-filters')
	const filterForm = panel.querySelector('.js-catalog-filter-form')
	const checkboxes = [...filterForm.querySelectorAll('.js-catalog-filter-input')]
	const drawer = window.matchMedia('(max-width: 1280px)')
	const openFilters = catalog.querySelector('.js-catalog-filters-open')
	const chips = catalog.querySelector('.js-catalog-chips')
	const pagination = catalog.querySelector('.js-pagination')
	const count = catalog.querySelector('.js-catalog-count')
	const sort = catalog.querySelector('.js-catalog-sort')
	const searchForm = header.querySelector('.js-search-form')
	const searchField = searchForm.querySelector('.js-search-input')
	let query = ''
	let page = 1

	const renderCatalog = () => {
		const selected = checkboxes.filter(
			input => input.dataset.applied === 'true',
		)
		const groups = [...new Set(selected.map(input => input.name))]
		const matches = cards.filter(card => {
			const name = card.querySelector('.js-product-title').textContent
			const searchable =
				`${name} ${card.dataset.brand} ${card.querySelector('.js-product-badge')?.textContent || ''}`.toLocaleLowerCase(
					'ru',
				)
			return (
				searchable.includes(query) &&
				groups.every(group =>
					selected.some(
						input =>
							input.name === group && input.value === card.dataset[group],
					),
				)
			)
		})
		if (sort.value !== 'default') {
			matches.sort(
				(a, b) =>
					a
						.querySelector('.js-product-title')
						.textContent.localeCompare(
							b.querySelector('.js-product-title').textContent,
							'ru',
							{ numeric: true },
						) * (sort.value === 'asc' ? 1 : -1),
			)
		}
		const pages = Math.ceil(matches.length / 8)
		page = Math.max(1, Math.min(page, pages))
		cards.forEach(card => {
			card.hidden = true
		})
		matches.forEach((card, index) => {
			grid.append(card)
			card.hidden = index < (page - 1) * 8 || index >= page * 8
		})
		count.textContent = `Найдено товаров: ${matches.length}`
		catalog.querySelector('.js-catalog-empty').hidden = matches.length > 0
		chips.replaceChildren()
		selected.forEach(input => {
			const chip = document.createElement('button')
			chip.type = 'button'
			chip.className = 'filter-chip js-filter-chip'
			chip.textContent = `${input.dataset.groupLabel}: ${input.dataset.label}`
			chip.setAttribute(
				'aria-label',
				`Снять фильтр ${input.dataset.groupLabel}: ${input.dataset.label}`,
			)
			chip.addEventListener('click', () => {
				input.checked = false
				input.dataset.applied = 'false'
				page = 1
				renderCatalog()
				;(chips.querySelector('.js-filter-chip') || count).focus({
					preventScroll: true,
				})
			})
			chips.append(chip)
		})
		chips.hidden = selected.length === 0
		if (selected.length) {
			const reset = document.createElement('button')
			reset.type = 'button'
			reset.className = 'button button--link js-catalog-clear-filters'
			reset.textContent = 'Сбросить всё'
			reset.dataset.clearFilters = ''
			chips.append(reset)
		}
		pagination.replaceChildren()
		pagination.hidden = pages <= 1
		;[
			'prev',
			...Array.from({ length: pages }, (_, index) => index + 1),
			'next',
		].forEach(value => {
			const button = document.createElement('button')
			button.type = 'button'
			button.className = 'pagination__button js-pagination-button'
			button.dataset.page = value
			button.textContent =
				value === 'prev' ? '‹' : value === 'next' ? '›' : value
			if (value === 'prev' || value === 'next') {
				button.setAttribute(
					'aria-label',
					value === 'prev' ? 'Предыдущая страница' : 'Следующая страница',
				)
				button.disabled = value === 'prev' ? page === 1 : page === pages
			} else {
				button.setAttribute('aria-label', `Страница ${value}`)
				if (value === page) button.setAttribute('aria-current', 'page')
			}
			pagination.append(button)
		})
	}
	const applyFilters = () => {
		checkboxes.forEach(input => {
			input.dataset.applied = String(input.checked)
		})
		page = 1
		renderCatalog()
	}
	const restoreFilters = () => {
		checkboxes.forEach(input => {
			input.checked = input.dataset.applied === 'true'
		})
	}
	const closeFilters = () => {
		restoreFilters()
		panel.close()
		openFilters.setAttribute('aria-expanded', 'false')
		openFilters.focus({ preventScroll: true })
	}
	const adaptFilters = () => {
		const focusedInPanel = panel.contains(document.activeElement)
		restoreFilters()
		panel.close()
		openFilters.setAttribute('aria-expanded', 'false')
		panel.removeAttribute('aria-modal')
		if (!drawer.matches) panel.open = true
		if (focusedInPanel)
			(
				drawer.matches
					? openFilters
					: panel.querySelector('.js-catalog-filter-toggle')
			).focus({ preventScroll: true })
	}
	openFilters.addEventListener('click', () => {
		restoreFilters()
		panel.setAttribute('aria-modal', 'true')
		panel.showModal()
		openFilters.setAttribute('aria-expanded', 'true')
		panel.querySelector('.js-catalog-filters-close').focus()
	})
	panel
		.querySelector('.js-catalog-filters-close')
		.addEventListener('click', closeFilters)
	panel.addEventListener('cancel', event => {
		event.preventDefault()
		closeFilters()
	})
	panel.addEventListener('keydown', event => {
		if (event.key !== 'Tab' || !panel.matches('.js-catalog-filters:modal')) return
		const controls = [
			...panel.querySelectorAll('.js-catalog-filter-control'),
		].filter(control => !control.disabled && control.getClientRects().length)
		const first = controls[0]
		const last = controls[controls.length - 1]
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault()
			last.focus()
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault()
			first.focus()
		}
	})
	drawer.addEventListener('change', adaptFilters)
	filterForm.addEventListener('change', () => {
		if (!drawer.matches) applyFilters()
	})
	filterForm.addEventListener('submit', event => {
		event.preventDefault()
		applyFilters()
		if (drawer.matches) closeFilters()
	})
	filterForm.addEventListener('reset', event => {
		event.preventDefault()
		checkboxes.forEach(input => {
			input.checked = false
		})
		if (!drawer.matches) applyFilters()
	})
	catalog.addEventListener('click', event => {
		if (!event.target.closest('.js-catalog-clear-filters')) return
		checkboxes.forEach(input => {
			input.checked = false
		})
		applyFilters()
		count.focus({ preventScroll: true })
	})
	sort.addEventListener('change', () => {
		page = 1
		renderCatalog()
	})
	searchForm.addEventListener('submit', event => {
		event.preventDefault()
		query = searchField.value.trim().toLocaleLowerCase('ru')
		page = 1
		renderCatalog()
		catalog
			.querySelector('.js-catalog-results')
			.scrollIntoView({ block: 'start' })
	})
	catalog.querySelectorAll('.js-catalog-view').forEach(button => {
		button.addEventListener('click', () => {
			const list = button.dataset.catalogView === 'list'
			grid.classList.toggle('catalog-grid--list', list)
			cards.forEach(card => card.classList.toggle('product-card--list', list))
			catalog.querySelectorAll('.js-catalog-view').forEach(control => {
				const pressed = control === button
				control.setAttribute('aria-pressed', String(pressed))
				control.classList.toggle('button--secondary', !pressed)
			})
		})
	})
	pagination.addEventListener('click', event => {
		const button = event.target.closest('.js-pagination-button')
		if (!button || button.disabled) return
		page =
			button.dataset.page === 'prev'
				? page - 1
				: button.dataset.page === 'next'
					? page + 1
					: Number(button.dataset.page)
		renderCatalog()
		const results = catalog.querySelector('.js-catalog-results')
		count.focus({ preventScroll: true })
		results.scrollIntoView({ block: 'start' })
	})
	adaptFilters()
	renderCatalog()
}

const productNav = document.querySelector('.js-product-nav')
if (productNav) {
	const links = [...productNav.querySelectorAll('.js-product-nav-link')]
	const updateProductNav = () => {
		const current =
			links.find(link => link.hash === window.location.hash) || links[0]
		links.forEach(link => {
			if (link === current) link.setAttribute('aria-current', 'location')
			else link.removeAttribute('aria-current')
		})
	}
	window.addEventListener('hashchange', updateProductNav)
	updateProductNav()
}

const articleContents = document.querySelector('.js-article-contents')
if (articleContents) {
	const links = [...articleContents.querySelectorAll('.js-article-contents-link')]
	const toggle = articleContents.querySelector('.js-article-contents-toggle')
	const list = articleContents.querySelector('.js-article-contents-list')
	const mobileContents = window.matchMedia('(max-width: 768px)')
	const updateContentsVisibility = () => {
		const collapsed =
			mobileContents.matches && toggle.getAttribute('aria-expanded') === 'false'
		if (collapsed && list.contains(document.activeElement)) toggle.focus()
		list.hidden = collapsed
		if (!mobileContents.matches && document.activeElement === toggle) {
			;(
				links.find(link => link.hasAttribute('aria-current')) || links[0]
			).focus({ preventScroll: true })
		}
	}
	toggle.addEventListener('click', () => {
		const expanded = toggle.getAttribute('aria-expanded') !== 'true'
		toggle.setAttribute('aria-expanded', String(expanded))
		toggle.querySelector('.js-article-contents-indicator').textContent = expanded
			? '−'
			: '+'
		updateContentsVisibility()
	})
	mobileContents.addEventListener('change', updateContentsVisibility)
	updateContentsVisibility()
	const updateContents = () =>
		links.forEach(link => {
			if (link.hash === (window.location.hash || links[0].hash))
				link.setAttribute('aria-current', 'location')
			else link.removeAttribute('aria-current')
		})
	window.addEventListener('hashchange', updateContents)
	updateContents()
}
