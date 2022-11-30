
export function isJSAdded(url: string): boolean {
    return !!document.querySelector(`script[src="${url}"]`);
}
