import { escapeHtml } from '../utils/helpers.js';
import { THEME } from '../../config/theme.js';

export class UI {
    constructor() {
        this.app = document.getElementById('app');
        this.chatArea = null;
        this.statusDiv = null;
        this.modelSelect = null;
        this.testBtn = null;
        this.input = null;
        this.sendBtn = null;
        this.applyTheme();
    }

    applyTheme() {
        const root = document.documentElement;
        const c = THEME.colors;
        root.style.setProperty('--primary', c.primary);
        root.style.setProperty('--bg-color', c.background);
        root.style.setProperty('--container-bg', c.containerBg);
        root.style.setProperty('--header-bg', c.headerBg);
        root.style.setProperty('--chat-bg', c.chatBg);
        root.style.setProperty('--user-bubble', c.userBubble);
        root.style.setProperty('--user-text', c.userText);
        root.style.setProperty('--ai-bubble', c.aiBubble);
        root.style.setProperty('--ai-text', c.aiText);
        root.style.setProperty('--input-bg', c.inputBg);
        root.style.setProperty('--input-text', c.inputText);
        root.style.setProperty('--border-color', c.borderColor);
        root.style.setProperty('--status-text', c.statusText);
        root.style.setProperty('--font-family', THEME.fonts.family);
        root.style.setProperty('--font-size', THEME.fonts.size);
        root.style.setProperty('--heading-size', THEME.fonts.headingSize);
        root.style.setProperty('--border-radius', THEME.borderRadius);
        root.style.setProperty('--bubble-radius', THEME.bubbleRadius);
        root.style.setProperty('--input-radius', THEME.inputRadius);
    }

    render() {
        this.app.innerHTML = `
            <div class="container">
                <div class="header">
                    <h1>${escapeHtml(THEME.title)}</h1>
                    <p>${escapeHtml(THEME.subtitle)}</p>
                    <div class="model-select">
                        <select id="modelSelect"></select>
                        <button id="testModelBtn">Test Model</button>
                    </div>
                </div>
                <div class="chat-area" id="chatArea">
                    <div class="message ai">
                        <div class="bubble">
                            ${escapeHtml('Ask anything. I\'ll give you a concise answer.')}
                        </div>
                    </div>
                </div>
                <div class="status" id="status">Ready</div>
                <div class="input-area">
                    <input type="text" id="queryInput" placeholder="Ask anything..." autofocus>
                    <button id="sendBtn">Send</button>
                </div>
            </div>
        `;
        this.chatArea = document.getElementById('chatArea');
        this.statusDiv = document.getElementById('status');
        this.modelSelect = document.getElementById('modelSelect');
        this.testBtn = document.getElementById('testModelBtn');
        this.input = document.getElementById('queryInput');
        this.sendBtn = document.getElementById('sendBtn');
    }

    addMessage(role, content) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.innerHTML = `<div class="bubble">${escapeHtml(content)}</div>`;
        this.chatArea.appendChild(msgDiv);
        this.chatArea.scrollTop = this.chatArea.scrollHeight;
    }

    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `<div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
        this.chatArea.appendChild(typingDiv);
        this.chatArea.scrollTop = this.chatArea.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    setStatus(text, isError = false) {
        this.statusDiv.innerHTML = text;
        if (isError) {
            this.statusDiv.style.color = '#f87171';
        } else {
            this.statusDiv.style.color = 'var(--status-text)';
        }
    }

    updateModelSelect(provider, models, currentModel) {
        const groups = {};
        for (const [model, info] of Object.entries(models[provider])) {
            groups[provider] = groups[provider] || [];
            groups[provider].push({ value: model, label: info.name });
        }
        let html = '';
        for (const [providerName, modelsArray] of Object.entries(groups)) {
            html += `<optgroup label="${providerName.toUpperCase()}">`;
            modelsArray.forEach(m => {
                html += `<option value="${m.value}" ${currentModel === m.value ? 'selected' : ''}>${m.label}</option>`;
            });
            html += `</optgroup>`;
        }
        this.modelSelect.innerHTML = html;
    }

    getQuery() {
        return this.input.value.trim();
    }

    clearInput() {
        this.input.value = '';
    }

    setLoading(loading) {
        this.sendBtn.disabled = loading;
        if (loading) {
            this.input.disabled = true;
        } else {
            this.input.disabled = false;
            this.input.focus();
        }
    }
}