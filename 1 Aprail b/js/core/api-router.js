import { API_KEYS, DEFAULT_PROVIDER } from '../../config/api.js';
import { MODELS } from '../../config/models.js';
import { callGemini } from '../providers/gemini.js';
import { callGroq } from '../providers/groq.js';

export class ApiRouter {
    constructor() {
        this.provider = DEFAULT_PROVIDER;
        this.currentModel = Object.keys(MODELS[this.provider])[0];
        this.keyIndex = 0;
    }

    setProvider(provider) {
        this.provider = provider;
        this.currentModel = Object.keys(MODELS[provider])[0];
        this.keyIndex = 0;
    }

    async call(prompt) {
        const keys = API_KEYS[this.provider];
        if (!keys || keys.length === 0) {
            throw new Error(`No API keys for provider ${this.provider}`);
        }
        let lastError = null;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[(this.keyIndex + i) % keys.length];
            try {
                let answer;
                if (this.provider === 'gemini') {
                    answer = await callGemini(this.currentModel, prompt, key);
                } else if (this.provider === 'groq') {
                    answer = await callGroq(this.currentModel, prompt, key);
                } else {
                    throw new Error(`Unknown provider: ${this.provider}`);
                }
                // rotate key index for next request
                this.keyIndex = (this.keyIndex + i + 1) % keys.length;
                return answer;
            } catch (err) {
                lastError = err;
                // If it's a quota error, try next key
                if (err.message && (err.message.includes('quota') || err.message.includes('429'))) {
                    continue;
                }
                // Otherwise, stop trying
                throw err;
            }
        }
        throw new Error(`All keys exhausted. Last error: ${lastError}`);
    }
}