import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * TaskView - Displays detected task form for data collection
 * Shows form fields with extracted values and smart prompts for missing information
 */
export class TaskView extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 350px;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.2s ease-out;
            will-change: transform, opacity;
        }

        :host(.hiding) {
            animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }

        :host(.showing) {
            animation: slideDown 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        :host(.hidden) {
            opacity: 0;
            transform: translateY(-150%) scale(0.85);
            pointer-events: none;
        }

        * {
            font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            cursor: default;
            user-select: none;
            box-sizing: border-box;
        }

        .task-container {
            display: flex;
            flex-direction: column;
            color: #ffffff;
            position: relative;
            background: rgba(60, 25, 0, 0.6);
            overflow: hidden;
            border-radius: 12px;
            width: 100%;
            height: 100%;
        }

        .task-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 12px;
            padding: 1px;
            background: linear-gradient(169deg, rgba(255, 255, 255, 0.17) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.17) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;
            pointer-events: none;
        }

        .task-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background: rgba(60, 25, 0, 0.15);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            z-index: -1;
        }

        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 16px;
            min-height: 40px;
            position: relative;
            z-index: 1;
            width: 100%;
            flex-shrink: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .task-title {
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            font-size: 14px;
            font-weight: 600;
        }

        .task-icon {
            font-size: 18px;
        }

        .close-button {
            background: transparent;
            color: rgba(255, 255, 255, 0.7);
            border: none;
            outline: none;
            padding: 4px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            transition: background-color 0.15s ease, color 0.15s ease;
        }

        .close-button:hover {
            background: rgba(255, 255, 255, 0.15);
            color: white;
        }

        .task-content {
            padding: 16px;
            overflow-y: auto;
            max-height: 400px;
        }

        .form-section {
            margin-bottom: 16px;
        }

        .section-title {
            font-size: 11px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.6);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
        }

        .form-field {
            margin-bottom: 12px;
        }

        .field-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 4px;
            display: block;
        }

        .field-input {
            width: 100%;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            color: white;
            font-size: 13px;
            outline: none;
            transition: border-color 0.15s ease, background-color 0.15s ease;
        }

        .field-input:focus {
            border-color: rgba(255, 107, 0, 0.6);
            background: rgba(255, 255, 255, 0.12);
        }

        .field-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .field-input.has-value {
            border-color: rgba(76, 175, 80, 0.4);
            background: rgba(76, 175, 80, 0.08);
        }

        .field-select {
            width: 100%;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            color: white;
            font-size: 13px;
            outline: none;
            cursor: pointer;
            transition: border-color 0.15s ease, background-color 0.15s ease;
        }

        .field-select:focus {
            border-color: rgba(255, 107, 0, 0.6);
            background: rgba(255, 255, 255, 0.12);
        }

        .field-select option {
            background: #2a2a2a;
            color: white;
        }

        .field-select.has-value {
            border-color: rgba(76, 175, 80, 0.4);
            background: rgba(76, 175, 80, 0.08);
        }

        /* Smart Prompts Section */
        .prompts-section {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .prompts-title {
            font-size: 11px;
            font-weight: 600;
            color: rgba(255, 107, 0, 0.9);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .prompt-suggestion {
            background: rgba(255, 107, 0, 0.1);
            border: 1px solid rgba(255, 107, 0, 0.25);
            border-radius: 8px;
            padding: 10px 12px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }

        .prompt-suggestion:hover {
            background: rgba(255, 107, 0, 0.18);
            border-color: rgba(255, 107, 0, 0.4);
            transform: translateX(2px);
        }

        .prompt-icon {
            font-size: 14px;
            flex-shrink: 0;
            margin-top: 1px;
        }

        .prompt-content {
            flex: 1;
            min-width: 0;
        }

        .prompt-field-label {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 2px;
        }

        .prompt-text {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.4;
        }

        .prompt-hint {
            font-size: 10px;
            color: rgba(255, 107, 0, 0.7);
            margin-top: 4px;
        }

        /* Action Buttons */
        .action-buttons {
            display: flex;
            gap: 8px;
            padding: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .action-button {
            flex: 1;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            border: none;
            outline: none;
        }

        .action-button.cancel {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
        }

        .action-button.cancel:hover {
            background: rgba(255, 255, 255, 0.18);
            color: white;
        }

        .action-button.confirm {
            background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%);
            color: white;
        }

        .action-button.confirm:hover {
            background: linear-gradient(135deg, #FF7A1A 0%, #FF9547 100%);
            transform: translateY(-1px);
        }

        .action-button.confirm:disabled {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.4);
            cursor: not-allowed;
            transform: none;
        }

        /* No task state */
        .no-task {
            padding: 32px 16px;
            text-align: center;
            color: rgba(255, 255, 255, 0.5);
        }

        .no-task-icon {
            font-size: 32px;
            margin-bottom: 12px;
        }

        .no-task-text {
            font-size: 13px;
        }

        /* Status indicator */
        .field-status {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
            margin-left: 8px;
        }

        .field-status.filled {
            color: rgba(76, 175, 80, 0.9);
        }

        .field-status.missing {
            color: rgba(255, 107, 0, 0.9);
        }

        /* GLASS BYPASS */
        :host-context(body.has-glass) .task-container,
        :host-context(body.has-glass) .top-bar,
        :host-context(body.has-glass) .field-input,
        :host-context(body.has-glass) .field-select,
        :host-context(body.has-glass) .action-button,
        :host-context(body.has-glass) .prompt-suggestion {
            background: transparent !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            filter: none !important;
            backdrop-filter: none !important;
        }

        :host-context(body.has-glass) .task-container::before,
        :host-context(body.has-glass) .task-container::after {
            display: none !important;
        }

        :host-context(body.has-glass) * {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            filter: none !important;
            backdrop-filter: none !important;
            box-shadow: none !important;
        }

        :host-context(body.has-glass) .task-container {
            border-radius: 0 !important;
        }
    `;

    static properties = {
        taskData: { type: Object },
        fieldValues: { type: Object },
    };

    constructor() {
        super();
        this.taskData = null;
        this.fieldValues = {};
    }

    connectedCallback() {
        super.connectedCallback();

        if (window.api?.taskView) {
            window.api.taskView.onTaskData((event, data) => {
                console.log('TaskView received task data:', data);
                this.taskData = data;
                this.fieldValues = { ...data?.extractedFields } || {};
                this.requestUpdate();
                this.adjustWindowHeight();
            });

            window.api.taskView.onClear(() => {
                this.taskData = null;
                this.fieldValues = {};
                this.requestUpdate();
            });
        }
    }

    getTaskIcon(type) {
        const icons = {
            vehicle_change: '🚗',
            mortgage_change: '🏠',
            policy_update: '📋',
        };
        return icons[type] || '📝';
    }

    getTaskTitle(type) {
        const titles = {
            vehicle_change: 'Vehicle Change',
            mortgage_change: 'Mortgage Change',
            policy_update: 'Policy Update',
        };
        return titles[type] || 'New Task';
    }

    getFieldTemplate(type) {
        const templates = {
            vehicle_change: [
                { key: 'action_type', label: 'Action Type', type: 'select', options: ['Add Vehicle', 'Remove Vehicle', 'Replace Vehicle'] },
                { key: 'make', label: 'Make', type: 'text', placeholder: 'e.g., Toyota' },
                { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g., Camry' },
                { key: 'year', label: 'Year', type: 'text', placeholder: 'e.g., 2024' },
                { key: 'vin', label: 'VIN', type: 'text', placeholder: 'Vehicle Identification Number' },
            ],
        };
        return templates[type] || [];
    }

    getMissingFieldPrompts() {
        if (!this.taskData) return [];

        const prompts = [];
        const fields = this.fieldValues || {};
        const type = this.taskData.type;

        if (type === 'vehicle_change') {
            if (!fields.vin) {
                prompts.push({
                    field: 'VIN',
                    prompt: "Can you give me the VIN number?",
                    importance: 'high'
                });
            }
            if (!fields.make || !fields.model) {
                prompts.push({
                    field: 'Make/Model',
                    prompt: "What make and model is the vehicle?",
                    importance: 'medium'
                });
            }
            if (!fields.year) {
                prompts.push({
                    field: 'Year',
                    prompt: "What year is the vehicle?",
                    importance: 'medium'
                });
            }
            if (!fields.action_type) {
                prompts.push({
                    field: 'Action',
                    prompt: "Are you adding, removing, or replacing a vehicle?",
                    importance: 'high'
                });
            }
        }

        return prompts;
    }

    handleFieldChange(key, value) {
        this.fieldValues = {
            ...this.fieldValues,
            [key]: value
        };
        this.requestUpdate();
    }

    async copyPrompt(promptText) {
        try {
            await navigator.clipboard.writeText(promptText);
            console.log('Prompt copied:', promptText);
        } catch (err) {
            console.error('Failed to copy prompt:', err);
        }
    }

    handleCancel() {
        if (window.api?.taskView) {
            window.api.taskView.cancel();
        }
    }

    handleConfirm() {
        if (window.api?.taskView) {
            window.api.taskView.confirm({
                type: this.taskData.type,
                fields: this.fieldValues
            });
        }
    }

    adjustWindowHeight() {
        if (!window.api?.taskView) return;

        this.updateComplete.then(() => {
            const container = this.shadowRoot.querySelector('.task-container');
            if (!container) return;

            const height = Math.min(500, container.scrollHeight);
            window.api.taskView.adjustWindowHeight(height);
        });
    }

    getFilledFieldCount() {
        if (!this.taskData) return { filled: 0, total: 0 };

        const fields = this.getFieldTemplate(this.taskData.type);
        const total = fields.length;
        const filled = fields.filter(f => this.fieldValues[f.key]?.trim()).length;

        return { filled, total };
    }

    render() {
        if (!this.taskData) {
            return html`
                <div class="task-container">
                    <div class="no-task">
                        <div class="no-task-icon">📋</div>
                        <div class="no-task-text">No task detected yet</div>
                    </div>
                </div>
            `;
        }

        const fields = this.getFieldTemplate(this.taskData.type);
        const missingPrompts = this.getMissingFieldPrompts();
        const { filled, total } = this.getFilledFieldCount();
        const canConfirm = filled >= 2; // Require at least 2 fields

        return html`
            <div class="task-container">
                <div class="top-bar">
                    <div class="task-title">
                        <span class="task-icon">${this.getTaskIcon(this.taskData.type)}</span>
                        <span>${this.getTaskTitle(this.taskData.type)}</span>
                        <span style="font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 400;">
                            (${filled}/${total} fields)
                        </span>
                    </div>
                    <button class="close-button" @click=${this.handleCancel} title="Close">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div class="task-content">
                    <div class="form-section">
                        <div class="section-title">Task Details</div>
                        ${fields.map(field => html`
                            <div class="form-field">
                                <label class="field-label">
                                    ${field.label}
                                    ${this.fieldValues[field.key]?.trim()
                                        ? html`<span class="field-status filled">✓</span>`
                                        : html`<span class="field-status missing">missing</span>`
                                    }
                                </label>
                                ${field.type === 'select'
                                    ? html`
                                        <select
                                            class="field-select ${this.fieldValues[field.key] ? 'has-value' : ''}"
                                            @change=${(e) => this.handleFieldChange(field.key, e.target.value)}
                                        >
                                            <option value="">Select ${field.label}...</option>
                                            ${field.options.map(opt => html`
                                                <option
                                                    value="${opt}"
                                                    ?selected=${this.fieldValues[field.key] === opt}
                                                >${opt}</option>
                                            `)}
                                        </select>
                                    `
                                    : html`
                                        <input
                                            type="text"
                                            class="field-input ${this.fieldValues[field.key]?.trim() ? 'has-value' : ''}"
                                            .value=${this.fieldValues[field.key] || ''}
                                            placeholder="${field.placeholder || ''}"
                                            @input=${(e) => this.handleFieldChange(field.key, e.target.value)}
                                        />
                                    `
                                }
                            </div>
                        `)}
                    </div>

                    ${missingPrompts.length > 0 ? html`
                        <div class="prompts-section">
                            <div class="prompts-title">
                                <span>💡</span>
                                <span>Ask the customer</span>
                            </div>
                            ${missingPrompts.map(p => html`
                                <div class="prompt-suggestion" @click=${() => this.copyPrompt(p.prompt)}>
                                    <span class="prompt-icon">💬</span>
                                    <div class="prompt-content">
                                        <div class="prompt-field-label">Missing: ${p.field}</div>
                                        <div class="prompt-text">"${p.prompt}"</div>
                                        <div class="prompt-hint">Click to copy</div>
                                    </div>
                                </div>
                            `)}
                        </div>
                    ` : html`
                        <div class="prompts-section">
                            <div class="prompts-title" style="color: rgba(76, 175, 80, 0.9);">
                                <span>✅</span>
                                <span>All fields collected!</span>
                            </div>
                        </div>
                    `}
                </div>

                <div class="action-buttons">
                    <button class="action-button cancel" @click=${this.handleCancel}>
                        Cancel
                    </button>
                    <button
                        class="action-button confirm"
                        @click=${this.handleConfirm}
                        ?disabled=${!canConfirm}
                    >
                        Create Task in NexAgency
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('task-view', TaskView);
