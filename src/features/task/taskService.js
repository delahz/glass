const { BrowserWindow } = require('electron');
const { getTaskTemplate } = require('../listen/summary/taskTemplates');

/**
 * TaskService - Manages task detection and task window state
 */
class TaskService {
    constructor() {
        this.currentTask = null;
        this.onTaskUpdate = null;
        this.onTaskConfirm = null;
        this.onTaskCancel = null;
    }

    /**
     * Set callbacks for task events
     */
    setCallbacks({ onTaskUpdate, onTaskConfirm, onTaskCancel }) {
        this.onTaskUpdate = onTaskUpdate;
        this.onTaskConfirm = onTaskConfirm;
        this.onTaskCancel = onTaskCancel;
    }

    /**
     * Send data to the task window renderer
     */
    sendToRenderer(channel, data) {
        const { windowPool } = require('../../window/windowManager');
        const taskWindow = windowPool?.get('task');

        if (taskWindow && !taskWindow.isDestroyed()) {
            taskWindow.webContents.send(channel, data);
        }
    }

    /**
     * Set the current task and notify the task window
     */
    setTask(taskAction) {
        if (!taskAction) {
            this.clearTask();
            return;
        }

        this.currentTask = {
            type: taskAction.type,
            label: taskAction.label,
            extractedFields: taskAction.extractedFields || {},
            timestamp: Date.now()
        };

        console.log('TaskService: Setting task:', this.currentTask);

        // Notify task window
        this.sendToRenderer('task:data', this.currentTask);

        // Notify callback
        if (this.onTaskUpdate) {
            this.onTaskUpdate(this.currentTask);
        }
    }

    /**
     * Update extracted fields in real-time
     */
    updateFields(fields) {
        if (!this.currentTask) return;

        this.currentTask.extractedFields = {
            ...this.currentTask.extractedFields,
            ...fields
        };

        console.log('TaskService: Updated fields:', this.currentTask.extractedFields);

        // Notify task window
        this.sendToRenderer('task:data', this.currentTask);

        // Notify callback
        if (this.onTaskUpdate) {
            this.onTaskUpdate(this.currentTask);
        }
    }

    /**
     * Get the current task
     */
    getTask() {
        return this.currentTask;
    }

    /**
     * Clear the current task
     */
    clearTask() {
        this.currentTask = null;

        // Notify task window to clear
        this.sendToRenderer('task:clear', null);

        console.log('TaskService: Task cleared');
    }

    /**
     * Confirm the task and trigger action
     */
    confirmTask(taskData) {
        console.log('TaskService: Task confirmed:', taskData);

        // Here you would integrate with NexAgency API
        // For now, just log and clear

        if (this.onTaskConfirm) {
            this.onTaskConfirm(taskData);
        }

        this.clearTask();
    }

    /**
     * Cancel the current task
     */
    cancelTask() {
        console.log('TaskService: Task cancelled');

        if (this.onTaskCancel) {
            this.onTaskCancel(this.currentTask);
        }

        this.clearTask();
    }

    /**
     * Get missing field prompts for the current task
     */
    getMissingFieldPrompts() {
        if (!this.currentTask) return [];

        const prompts = [];
        const fields = this.currentTask.extractedFields || {};
        const type = this.currentTask.type;

        if (type === 'vehicle_change') {
            if (!fields.vin) {
                prompts.push({
                    field: 'VIN',
                    prompt: "Can you give me the VIN number?"
                });
            }
            if (!fields.make || !fields.model) {
                prompts.push({
                    field: 'Make/Model',
                    prompt: "What make and model is the vehicle?"
                });
            }
            if (!fields.year) {
                prompts.push({
                    field: 'Year',
                    prompt: "What year is the vehicle?"
                });
            }
            if (!fields.action_type) {
                prompts.push({
                    field: 'Action Type',
                    prompt: "Are you adding, removing, or replacing a vehicle?"
                });
            }
        }

        return prompts;
    }

    /**
     * Check if all required fields are filled
     */
    isTaskComplete() {
        if (!this.currentTask) return false;

        const fields = this.currentTask.extractedFields || {};
        const type = this.currentTask.type;

        if (type === 'vehicle_change') {
            // Require at least action_type and one of (make+model, vin)
            return fields.action_type && (
                (fields.make && fields.model) || fields.vin
            );
        }

        return false;
    }
}

module.exports = TaskService;
