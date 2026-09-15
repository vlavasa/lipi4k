import GLightbox from "glightbox";

const selector = ".post-content .glightbox";
let lightbox: ReturnType<typeof GLightbox> | undefined;

function destroyGallery() {
	if (!lightbox) return;

	const activeSlide = lightbox.getActiveSlide();
	lightbox.close();

	// GLightbox completes close() on the active slide's animationend event.
	// Finish it before Astro replaces the DOM, including an already-running close.
	activeSlide?.dispatchEvent(new Event("animationend"));
	lightbox.destroy();
	lightbox = undefined;
}

function initGallery() {
	destroyGallery();

	document
		.querySelectorAll<HTMLImageElement>(
			".post-content .gallery-grid img.gallery-item__image, .post-content .gallery-single img.gallery-item__image",
		)
		.forEach((img) => {
			if (img.closest(".post-gallery")) return;

			img.classList.add("glightbox");
			img.setAttribute("data-type", "image");
			img.setAttribute("data-gallery", "post-inline-gallery");
			img.setAttribute("data-description", img.alt || "");
		});

	if (!document.querySelector(selector)) return;

	lightbox = GLightbox({
		selector,
		touchNavigation: true,
		loop: true,
		autoplayVideos: false,
		keyboardNavigation: true,
		closeButton: true,
	});
}

document.addEventListener("astro:page-load", initGallery);
document.addEventListener("astro:before-swap", destroyGallery);
