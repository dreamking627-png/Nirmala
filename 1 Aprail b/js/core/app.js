import { UI } from './ui.js';
import { ApiRouter } from './api-router.js';
import { Storage } from './storage.js';
import { MODELS } from '../../config/models.js';
import { THEME } from '../../config/theme.js';

// Initialize
const ui = new UI();
const apiRouter = new ApiRouter();

// Load settings from storage
const settings = Storage.get('ai_settings', { provider: apiRouter.provider, model: apiRouter.currentModel });
apiRouter.setProvider(settings.provider);
apiRouter.currentModel = settings.model;

// Render UI (this also applies theme)
ui.render();

// Populate model selector
ui.updateModelSelect(apiRouter.provider, MODELS, apiRouter.currentModel);

// Test model function
async function testModel() {
    const model = ui.modelSelect.value;
    apiRouter.currentModel = model;
    ui.setStatus(`Testing ${model}...`);
    try {
        const answer = await apiRouter.call("Say 'OK'");
        ui.setStatus(`✅ Connected (${model}) – ready`);
        ui.addMessage('ai', `✅ Ready with ${model}. Ask anything!`);
    } catch (err) {
        ui.setStatus(`❌ ${model} error: ${err.message}`, true);
        ui.addMessage('ai', `⚠️ Could not use ${model}. ${err.message}`);
    }
}

// Search function
async function search() {
    const query = ui.getQuery();
    if (!query) return;
    ui.clearInput();
    ui.setLoading(true);
    ui.setStatus('🤖 Thinking...');
    ui.addMessage('user', query);
    ui.showTyping();
    try {
        const answer = await apiRouter.call(`Answer concisely in 2-3 sentences: ${query}`);
        ui.hideTyping();
        ui.addMessage('ai', answer);
        ui.setStatus('✅ Answer ready');
    } catch (err) {
        ui.hideTyping();
        ui.addMessage('ai', `❌ Error: ${err.message}`);
        ui.setStatus('⚠️ Failed', true);
    }
    ui.setLoading(false);
}

// Event listeners
ui.sendBtn.addEventListener('click', search);
ui.input.addEventListener('keypress', (e) => { if (e.key === 'Enter') search(); });
ui.testBtn.addEventListener('click', testModel);
ui.modelSelect.addEventListener('change', () => {
    const newModel = ui.modelSelect.value;
    apiRouter.currentModel = newModel;
    Storage.set('ai_settings', { provider: apiRouter.provider, model: newModel });
});

// Auto-test on load
testModel();