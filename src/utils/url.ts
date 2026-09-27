const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
const baseRoot = base === "" ? "/" : `${base}/`;

function isExternal(path: string): boolean {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path);
}

export function getAssetPath(path: string): string {
  if (
    isExternal(path) ||
    path.startsWith("#") ||
    path.startsWith("?")
  ) {
    return path;
  }

  const normalized = path.replace(/^\/+/, "");
  const normalizedBase = base.replace(/^\/+/, "");

  if (
    normalizedBase &&
    (normalized === normalizedBase ||
      normalized.startsWith(`${normalizedBase}/`))
  ) {
    return `/${normalized}`;
  }

  return normalized ? `${baseRoot}${normalized}` : baseRoot;
}

export function stripBasePath(pathname: string): string {
  if (!base) return pathname || "/";
  if (pathname === base) return "/";

  return pathname.startsWith(`${base}/`)
    ? pathname.slice(base.length)
    : pathname;
}

/** Use the same current-page matching for header and footer navigation. */
export function isActiveNavUrl(url: string, pathname: string): boolean {
  if (isExternal(url) || url.startsWith("#") || url.startsWith("?")) {
    return false;
  }

  const target = stripBasePath(getAssetPath(url.split(/[?#]/)[0]))
    .replace(/\/+$/, "") || "/";
  const current = stripBasePath(pathname).replace(/\/+$/, "") || "/";

  return current === target || (target !== "/" && current.startsWith(`${target}/`));
}

export function absoluteUrl(
  path: string,
  site?: string | URL
): string {
  return new URL(getAssetPath(path), site).toString();
}
