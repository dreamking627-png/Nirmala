export function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.replace(/\n/g, '<br>');
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}