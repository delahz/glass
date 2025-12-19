import { html, css, LitElement } from '../../ui/assets/lit-core-2.7.4.min.js';

/**
 * TaskFormPreview - Displays a form preview for context-aware task actions
 * Shown in AskView when user clicks a task action from SummaryView
 */
export class TaskFormPreview extends LitElement {
    static properties = {
        taskData: { type: Object },
        formValues: { type: Object, state: true },
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            color: white;
        }

        * {
            font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
        }

        .form-container {
            display: flex;
            flex-direction: column;
            padding: 16px;
            gap: 16px;
        }

        .form-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        .form-icon {
            font-size: 24px;
        }

        .form-title {
            font-size: 16px;
            font-weight: 600;
            color: white;
        }

        .form-subtitle {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 4px;
        }

        .form-fields {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .form-field {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .field-label {
            font-size: 11px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.8);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .field-input {
            background: rgba(60, 25, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 10px 12px;
            font-size: 13px;
            color: white;
            outline: none;
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .field-input:focus {
            border-color: rgba(255, 107, 0, 0.6);
            box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
        }

        .field-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .field-select {
            background: rgba(60, 25, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 10px 12px;
            font-size: 13px;
            color: white;
            outline: none;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 32px;
        }

        .field-select:focus {
            border-color: rgba(255, 107, 0, 0.6);
            box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
        }

        .field-select option {
            background: #2a1a0a;
            color: white;
        }

        .form-actions {
            display: flex;
            gap: 10px;
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
        }

        .btn {
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

        .btn-cancel {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-cancel:hover {
            background: rgba(255, 255, 255, 0.15);
            color: white;
        }

        .btn-confirm {
            background: rgba(255, 107, 0, 0.8);
            color: white;
        }

        .btn-confirm:hover {
            background: rgba(255, 107, 0, 1);
        }

        .btn-confirm:disabled {
            background: rgba(255, 107, 0, 0.4);
            cursor: not-allowed;
        }

        .extracted-badge {
            display: inline-block;
            background: rgba(255, 107, 0, 0.2);
            color: rgba(255, 107, 0, 1);
            font-size: 9px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 8px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .empty-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.5);
            font-size: 9px;
            font-weight: 500;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 8px;
        }

        .info-text {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            margin-top: 4px;
        }
    `;

    constructor() {
        super();
        this.taskData = null;
        this.formValues = {};
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('taskData') && this.taskData) {
            // Initialize form values from extracted fields
            this.formValues = { ...this.taskData.extractedFields };
        }
    }

    handleInputChange(fieldKey, value) {
        this.formValues = {
            ...this.formValues,
            [fieldKey]: value,
        };
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('task-form-cancel', {
            bubbles: true,
            composed: true,
        }));
    }

    handleConfirm() {
        this.dispatchEvent(new CustomEvent('task-form-confirm', {
            bubbles: true,
            composed: true,
            detail: {
                taskType: this.taskData?.type,
                formValues: this.formValues,
            },
        }));
    }

    getFieldConfig() {
        // Vehicle change fields
        if (this.taskData?.type === 'vehicle_change') {
            return [
                { key: 'action_type', label: 'Action Type', type: 'select', options: ['Add Vehicle', 'Remove Vehicle', 'Replace Vehicle'] },
                { key: 'make', label: 'Make', type: 'text', placeholder: 'e.g., Toyota' },
                { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g., Camry' },
                { key: 'year', label: 'Year', type: 'text', placeholder: 'e.g., 2024' },
                { key: 'vin', label: 'VIN', type: 'text', placeholder: 'Vehicle Identification Number' },
            ];
        }
        return [];
    }

    getTaskIcon() {
        if (this.taskData?.type === 'vehicle_change') {
            return '🚗';
        }
        return '📋';
    }

    getTaskTitle() {
        if (this.taskData?.type === 'vehicle_change') {
            return 'Vehicle Change Task';
        }
        return 'Task Preview';
    }

    renderField(field) {
        const value = this.formValues[field.key] || '';
        const wasExtracted = this.taskData?.extractedFields?.[field.key] && this.taskData.extractedFields[field.key] !== '';

        if (field.type === 'select') {
            return html`
                <div class="form-field">
                    <label class="field-label">
                        ${field.label}
                        ${wasExtracted ? html`<span class="extracted-badge">AI Extracted</span>` : ''}
                    </label>
                    <select
                        class="field-select"
                        .value=${value}
                        @change=${(e) => this.handleInputChange(field.key, e.target.value)}
                    >
                        <option value="">Select ${field.label}...</option>
                        ${field.options.map(opt => html`
                            <option value=${opt} ?selected=${value === opt}>${opt}</option>
                        `)}
                    </select>
                </div>
            `;
        }

        return html`
            <div class="form-field">
                <label class="field-label">
                    ${field.label}
                    ${wasExtracted ? html`<span class="extracted-badge">AI Extracted</span>` : ''}
                    ${!wasExtracted && !value ? html`<span class="empty-badge">Optional</span>` : ''}
                </label>
                <input
                    type="text"
                    class="field-input"
                    placeholder=${field.placeholder || ''}
                    .value=${value}
                    @input=${(e) => this.handleInputChange(field.key, e.target.value)}
                />
            </div>
        `;
    }

    render() {
        if (!this.taskData) {
            return html`<div class="form-container">No task data</div>`;
        }

        const fields = this.getFieldConfig();

        return html`
            <div class="form-container">
                <div class="form-header">
                    <span class="form-icon">${this.getTaskIcon()}</span>
                    <div>
                        <div class="form-title">${this.getTaskTitle()}</div>
                        <div class="form-subtitle">Review and edit the extracted information</div>
                    </div>
                </div>

                <div class="form-fields">
                    ${fields.map(field => this.renderField(field))}
                </div>

                <div class="form-actions">
                    <button class="btn btn-cancel" @click=${this.handleCancel}>
                        Cancel
                    </button>
                    <button class="btn btn-confirm" @click=${this.handleConfirm}>
                        Create Task
                    </button>
                </div>

                <div class="info-text">
                    Task will be created in NexAgency (coming soon)
                </div>
            </div>
        `;
    }
}

customElements.define('task-form-preview', TaskFormPreview);
