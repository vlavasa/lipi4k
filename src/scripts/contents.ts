class ArticleContentsMenu extends HTMLElement {
	private events = new AbortController();
	private observer?: ResizeObserver;
	private frame = 0;
	private offset = 96;
	private active = "";
	private panel!: HTMLElement;
	private trigger!: HTMLButtonElement;
	private headings: HTMLElement[] = [];
	private links: HTMLAnchorElement[] = [];
	private wide = window.matchMedia("(min-width: 80rem)");

	connectedCallback() {
		this.events = new AbortController();
		const { signal } = this.events;
		const panel = this.querySelector<HTMLElement>("#contents-panel");
		const trigger = this.querySelector<HTMLButtonElement>("#contents-toggle");
		const article = document.querySelector<HTMLElement>("[data-contents-article]");
		const header = document.querySelector<HTMLElement>(".site-header");
		if (!panel || !trigger || !article || !header) return;
		this.panel = panel;
		this.trigger = trigger;
		this.active = "";
		this.links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-contents-id]"));
		const ids = new Set(this.links.map((link) => link.dataset.contentsId));
		this.headings = Array.from(article.querySelectorAll<HTMLElement>("h2[id], h3[id]")).filter(
			(heading) => ids.has(heading.id),
		);
		trigger.disabled = false;

		const measure = () => {
			const anchorOffset =
				Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingBlockStart) || 96;
			this.offset = Math.max(header.getBoundingClientRect().bottom + 16, anchorOffset);
			document.documentElement.style.setProperty("--contents-top", `${this.offset}px`);
			this.scheduleUpdate();
		};
		this.observer = new ResizeObserver(measure);
		this.observer.observe(header);
		this.observer.observe(article);
		measure();
		trigger.addEventListener("click", () => this.toggle(), { signal });
		this.querySelector(".contents-close")?.addEventListener("click", () => this.close(true), {
			signal,
		});
		document.addEventListener(
			"click",
			(event) => {
				if (!(event.target instanceof Element)) return;
				const link = event.target.closest<HTMLAnchorElement>("a[data-contents-id]");
				if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
					this.close();
					const heading = document.getElementById(link.dataset.contentsId ?? "");
					if (heading) {
						// Keep keyboard navigation at the destination, not in the now-hidden panel.
						if (!heading.hasAttribute("tabindex")) {
							heading.setAttribute("tabindex", "-1");
							heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), {
								once: true,
								signal,
							});
						}
						heading.focus({ preventScroll: true });
					}
				} else if (!this.contains(event.target)) this.close();
			},
			{ signal },
		);
		document.addEventListener(
			"keydown",
			(event) => {
				if (event.key === "Escape" && !this.panel.hidden) {
					event.preventDefault();
					this.close(true);
				}
			},
			{ signal },
		);
		document.addEventListener(
			"focusin",
			(event) => {
				if (event.target instanceof Node && !this.contains(event.target)) this.close();
			},
			{ signal },
		);
		// Search may also open through its keyboard shortcut rather than its button.
		document.addEventListener("site-search:open", () => this.close(), { signal });
		window.addEventListener("scroll", () => this.scheduleUpdate(), { passive: true, signal });
		window.addEventListener("resize", measure, { signal });
		window.addEventListener("hashchange", () => this.scheduleUpdate(), { signal });
		window.addEventListener("beforeprint", () => this.close(), { signal });
		this.wide.addEventListener("change", () => this.close(), { signal });
		document.addEventListener("astro:before-swap", () => this.close(), { signal });
		void document.fonts.ready.then(() => {
			if (!signal.aborted) measure();
		});
	}

	disconnectedCallback() {
		this.events.abort();
		this.observer?.disconnect();
		cancelAnimationFrame(this.frame);
		this.frame = 0;
		document.documentElement.style.removeProperty("--contents-top");
	}

	private toggle() {
		if (!this.panel.hidden) {
			this.close();
			return;
		}
		if (this.wide.matches) return;
		const menu = document.querySelector<HTMLButtonElement>("#menu-toggle");
		if (menu?.getAttribute("aria-expanded") === "true") menu.click();
		this.panel.hidden = false;
		this.trigger.setAttribute("aria-expanded", "true");
		const current = this.panel.querySelector<HTMLElement>('a[aria-current="location"]');
		if (current) this.keepVisible(this.panel, current);
	}

	private close(restoreFocus = false) {
		if (this.panel.hidden) return;
		this.panel.hidden = true;
		this.trigger.setAttribute("aria-expanded", "false");
		if (restoreFocus) this.trigger.focus({ preventScroll: true });
	}

	private scheduleUpdate() {
		if (this.frame) return;
		this.frame = requestAnimationFrame(() => {
			this.frame = 0;
			let active = "";
			for (const heading of this.headings) {
				if (heading.getBoundingClientRect().top > this.offset + 4) break;
				active = heading.id;
			}
			if (active === this.active) return;
			this.active = active;
			for (const link of this.links) {
				if (link.dataset.contentsId === active) link.setAttribute("aria-current", "location");
				else link.removeAttribute("aria-current");
			}
			const sidebar = document.querySelector<HTMLElement>(".contents-sidebar");
			const current = sidebar?.querySelector<HTMLElement>('a[aria-current="location"]');
			if (sidebar && current && this.wide.matches) {
				this.keepVisible(sidebar, current);
			}
		});
	}

	private keepVisible(container: HTMLElement, current: HTMLElement) {
		// Scroll only the contents, without interrupting the article's anchor navigation.
		const bounds = container.getBoundingClientRect();
		const item = current.getBoundingClientRect();
		if (item.top < bounds.top) container.scrollTop += item.top - bounds.top;
		else if (item.bottom > bounds.bottom) container.scrollTop += item.bottom - bounds.bottom;
	}
}

if (!customElements.get("article-contents")) {
	customElements.define("article-contents", ArticleContentsMenu);
}
