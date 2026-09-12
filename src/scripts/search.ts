type SearchResult = {
	id: string;
	data(): Promise<{ url: string; meta: { title?: string }; excerpt: string }>;
};

type SearchEngine = {
	init(): Promise<void>;
	filters(): Promise<unknown>;
	search(query: string): Promise<{ results: SearchResult[] } | null>;
	destroy(): Promise<void>;
};

type Pagefind = {
	createInstance(options: {
		basePath: string;
		baseUrl: string;
		excerptLength: number;
	}): SearchEngine;
};

const PAGE_SIZE = 8;

class SiteSearch extends HTMLElement {
	private events = new AbortController();
	private engine?: SearchEngine;
	private enginePromise?: Promise<SearchEngine>;
	private dialog!: HTMLDialogElement;
	private input!: HTMLInputElement;
	private trigger!: HTMLButtonElement;
	private list!: HTMLOListElement;
	private status!: HTMLParagraphElement;
	private more!: HTMLButtonElement;
	private retry!: HTMLButtonElement;
	private clear!: HTMLButtonElement;
	private results: SearchResult[] = [];
	private lastFocusedResult?: HTMLAnchorElement;
	private shown = 0;
	private revision = 0;
	private timer = 0;
	private openedWithPointer = false;

	connectedCallback() {
		this.events = new AbortController();
		const { signal } = this.events;
		this.dialog = this.element("dialog");
		this.input = this.element("input");
		this.trigger = this.element("#search-toggle", document);
		this.list = this.element("ol");
		this.status = this.element("[data-search-status]");
		this.more = this.element("[data-search-more]");
		this.retry = this.element("[data-search-retry]");
		this.clear = this.element("[data-search-clear]");
		this.trigger.disabled = false;

		this.trigger.addEventListener("click", (event) => this.open(event.detail > 0), { signal });
		const clearPointerFocus = () => this.trigger.removeAttribute("data-search-pointer-focus");
		this.trigger.addEventListener("blur", clearPointerFocus, { signal });
		this.trigger.addEventListener("keydown", clearPointerFocus, { signal });
		this.element("[data-search-close]").addEventListener("click", () => this.close(), {
			signal,
		});
		this.dialog.addEventListener(
			"close",
			() => {
				this.trigger.setAttribute("aria-expanded", "false");
				if (this.isConnected) this.trigger.focus({ preventScroll: true });
			},
			{ signal },
		);
		this.dialog.addEventListener(
			"cancel",
			(event) => {
				event.preventDefault();
				this.close();
			},
			{ signal },
		);
		this.dialog.addEventListener(
			"click",
			(event) => {
				if (event.target !== this.dialog) return;
				const rect = this.dialog.getBoundingClientRect();
				if (
					event.clientX < rect.left ||
					event.clientX > rect.right ||
					event.clientY < rect.top ||
					event.clientY > rect.bottom
				)
					this.close();
			},
			{ signal },
		);
		this.dialog.addEventListener(
			"keydown",
			(event) => {
				if (event.key === "Escape") {
					// Close immediately instead of clearing the native search input first.
					event.preventDefault();
					this.close();
				} else this.navigateResults(event);
			},
			{ signal },
		);
		this.input.addEventListener("input", () => this.queueSearch(), { signal });
		this.element("form").addEventListener(
			"submit",
			(event) => {
				event.preventDefault();
				window.clearTimeout(this.timer);
				void this.search();
			},
			{ signal },
		);
		this.clear.addEventListener(
			"click",
			() => {
				this.input.value = "";
				this.queueSearch();
				this.input.focus();
			},
			{ signal },
		);
		this.more.addEventListener("click", () => void this.showMore(this.revision, true), { signal });
		this.retry.addEventListener(
			"click",
			() => {
				void this.engine?.destroy();
				this.engine = undefined;
				this.enginePromise = undefined;
				void this.search();
			},
			{ signal },
		);
		this.list.addEventListener(
			"focusin",
			(event) => {
				if (event.target instanceof HTMLAnchorElement) this.lastFocusedResult = event.target;
			},
			{ signal },
		);
		this.list.addEventListener(
			"click",
			(event) => {
				if (event.target instanceof Element && event.target.closest("a")) this.close();
			},
			{ signal },
		);
		document.addEventListener(
			"keydown",
			(event) => {
				if (
					event.defaultPrevented ||
					event.altKey ||
					event.shiftKey ||
					!(event.ctrlKey || event.metaKey) ||
					event.key.toLowerCase() !== "k"
				)
					return;
				if (
					event.target instanceof Element &&
					event.target.closest("input, textarea, select, [contenteditable], dialog[open]")
				)
					return;
				event.preventDefault();
				this.open();
			},
			{ signal },
		);
		document.addEventListener("astro:before-swap", () => this.close(), { signal });
		window.addEventListener("beforeprint", () => this.close(), { signal });
	}

	disconnectedCallback() {
		this.events.abort();
		window.clearTimeout(this.timer);
		this.revision++;
		void this.engine?.destroy();
		this.engine = undefined;
		this.enginePromise = undefined;
	}

	private open(withPointer = false) {
		if (this.dialog.open) return;
		this.openedWithPointer = withPointer;
		const menu = document.querySelector<HTMLButtonElement>("#menu-toggle");
		if (menu?.getAttribute("aria-expanded") === "true") menu.click();
		this.dialog.showModal();
		this.trigger.setAttribute("aria-expanded", "true");
		if (this.dataset.dev === "true") {
			this.input.disabled = true;
			this.element("[data-search-close]").focus();
			this.status.textContent =
				"Search is available in the production preview. Run npm run build, then npm run preview.";
			return;
		}
		this.input.focus();
		if (!this.enginePromise) void this.search();
	}

	private close() {
		if (!this.dialog.open) return;
		// Set the return style before close() restores focus, not in the later close event.
		this.trigger.toggleAttribute("data-search-pointer-focus", this.openedWithPointer);
		this.dialog.close();
	}

	private getEngine(): Promise<SearchEngine> {
		if (!this.enginePromise) {
			const signal = this.events.signal;
			const baseUrl = this.dataset.baseUrl ?? "/";
			const basePath = `${baseUrl}pagefind/`;
			this.enginePromise = (async () => {
				const pagefind: Pagefind = await import(/* @vite-ignore */ `${basePath}pagefind.js`);
				if (signal.aborted) throw new DOMException("Search closed", "AbortError");
				const engine = pagefind.createInstance({ basePath, baseUrl, excerptLength: 24 });
				try {
					await engine.init();
					await engine.filters();
					if (signal.aborted) throw new DOMException("Search closed", "AbortError");
					this.engine = engine;
					return engine;
				} catch (error) {
					await engine.destroy();
					throw error;
				}
			})();
		}
		return this.enginePromise;
	}

	private queueSearch() {
		window.clearTimeout(this.timer);
		this.revision++;
		this.clear.hidden = !this.input.value;
		this.list.hidden = true;
		this.more.hidden = true;
		this.retry.hidden = true;
		this.lastFocusedResult = undefined;
		if (!this.input.value.trim()) {
			this.results = [];
			this.list.replaceChildren();
			this.status.textContent = "Type to search articles and pages.";
			return;
		}
		this.status.textContent = "Searching…";
		this.timer = window.setTimeout(() => void this.search(), 180);
	}

	private async search() {
		const revision = ++this.revision;
		const query = this.input.value.trim();
		this.retry.hidden = true;
		this.more.hidden = true;
		this.list.hidden = true;
		this.status.textContent = query ? "Searching…" : "Loading search…";
		try {
			const engine = await this.getEngine();
			if (!this.isCurrent(revision)) return;
			if (!query) {
				this.status.textContent = "Type to search articles and pages.";
				return;
			}
			const response = await engine.search(query);
			if (!this.isCurrent(revision)) return;
			this.results = response?.results ?? [];
			this.shown = 0;
			this.list.replaceChildren();
			this.lastFocusedResult = undefined;
			this.status.textContent = this.results.length
				? `${this.results.length} ${this.results.length === 1 ? "result" : "results"} for “${query}”`
				: `No results for “${query}”. Try a different word or a shorter phrase.`;
			await this.showMore(revision);
		} catch {
			if (this.isCurrent(revision)) this.showError();
		}
	}

	private async showMore(revision: number, restoreResultFocus = false) {
		const previousResult = restoreResultFocus ? this.lastFocusedResult : undefined;
		this.more.disabled = true;
		try {
			const batch = await Promise.all(
				this.results.slice(this.shown, this.shown + PAGE_SIZE).map((result) => result.data()),
			);
			if (!this.isCurrent(revision)) return;
			for (const result of batch) {
				const url = new URL(result.url, window.location.origin);
				if (url.origin !== window.location.origin || !/^https?:$/.test(url.protocol)) continue;
				const item = document.createElement("li");
				const link = document.createElement("a");
				link.href = url.href;
				const title = document.createElement("span");
				title.className = "search-result-title";
				title.textContent = result.meta.title || url.pathname;
				const excerpt = document.createElement("p");
				excerpt.className = "search-result-excerpt";
				// Keep Pagefind's highlighted text, without inserting arbitrary HTML.
				const template = document.createElement("template");
				template.innerHTML = result.excerpt;
				for (const node of template.content.childNodes) {
					if (node instanceof HTMLElement && node.tagName === "MARK") {
						const mark = document.createElement("mark");
						mark.textContent = node.textContent;
						excerpt.append(mark);
					} else excerpt.append(document.createTextNode(node.textContent ?? ""));
				}
				link.append(title, excerpt);
				item.append(link);
				this.list.append(item);
			}
			this.shown += batch.length;
			this.list.hidden = !this.shown;
			this.more.hidden = this.shown >= this.results.length;
			previousResult?.focus();
		} catch {
			if (this.isCurrent(revision)) this.showError();
		} finally {
			if (this.isCurrent(revision)) this.more.disabled = false;
		}
	}

	private isCurrent(revision: number) {
		return this.isConnected && !this.events.signal.aborted && revision === this.revision;
	}

	private showError() {
		this.status.textContent = "Search could not be loaded. Please try again.";
		this.retry.hidden = false;
		this.more.hidden = true;
	}

	private element<T extends HTMLElement>(selector: string, root: ParentNode = this): T {
		const element = root.querySelector<T>(selector);
		if (!element) throw new Error(`Missing search element: ${selector}`);
		return element;
	}

	private navigateResults(event: KeyboardEvent) {
		if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
		const links = Array.from(this.list.querySelectorAll("a"));
		if (this.list.hidden || !links.length) return;
		const items: HTMLElement[] = [this.input, ...links];
		if (!this.more.hidden && !this.more.disabled) items.push(this.more);
		const current = items.indexOf(document.activeElement as HTMLElement);
		if (current < 0) return;
		event.preventDefault();
		const next = event.key === "ArrowDown" ? current + 1 : current - 1;
		items[Math.max(0, Math.min(next, items.length - 1))].focus();
	}
}

if (!customElements.get("site-search")) customElements.define("site-search", SiteSearch);
