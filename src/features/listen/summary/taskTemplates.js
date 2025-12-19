/**
 * Task Templates for Context-Aware Task Detection
 *
 * Each task type defines:
 * - id: Unique identifier
 * - label: Display text shown in insights
 * - fields: Form fields to collect/display
 * - triggerKeywords: Keywords that suggest this task type
 */

const taskTemplates = {
    vehicle_change: {
        id: 'vehicle_change',
        label: 'Start vehicle change in NexAgency',
        icon: '🚗',
        fields: [
            { key: 'action_type', label: 'Action Type', type: 'select', options: ['Add Vehicle', 'Remove Vehicle', 'Replace Vehicle'] },
            { key: 'make', label: 'Make', type: 'text', placeholder: 'e.g., Toyota' },
            { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g., Camry' },
            { key: 'year', label: 'Year', type: 'text', placeholder: 'e.g., 2024' },
            { key: 'vin', label: 'VIN', type: 'text', placeholder: 'Vehicle Identification Number' },
        ],
        triggerKeywords: [
            'new vehicle',
            'new car',
            'new truck',
            'changing car',
            'trading in',
            'getting rid of',
            'buying a car',
            'buying a truck',
            'adding a vehicle',
            'removing a vehicle',
            'replacing my car',
            'got a new car',
            'got a new truck',
            'got a new vehicle',
            'vehicle change',
            'change my vehicle',
            'change my car',
            'add a car',
            'add a vehicle',
            'remove a car',
            'remove a vehicle',
            'replace my vehicle',
            'switching cars',
            'switching vehicles',
        ],
    },
    // Future task types can be added here:
    // mortgage_change: { ... },
    // policy_update: { ... },
};

/**
 * Get task template by ID
 */
function getTaskTemplate(taskId) {
    return taskTemplates[taskId] || null;
}

/**
 * Get all available task templates
 */
function getAllTaskTemplates() {
    return Object.values(taskTemplates);
}

/**
 * Detect task type from conversation text using keyword matching
 * @param {string} conversationText - The full conversation text to analyze
 * @returns {object|null} - Task action object if detected, null otherwise
 */
function detectTaskFromConversation(conversationText) {
    if (!conversationText || typeof conversationText !== 'string') {
        return null;
    }

    const lowerText = conversationText.toLowerCase();

    for (const [taskId, template] of Object.entries(taskTemplates)) {
        for (const keyword of template.triggerKeywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                console.log(`🎯 Task detected: "${taskId}" (matched keyword: "${keyword}")`);
                return {
                    type: taskId,
                    label: `${template.icon} ${template.label}`,
                    extractedFields: extractFieldsFromText(lowerText, template),
                };
            }
        }
    }

    return null;
}

/**
 * Extract field values from conversation text
 * @param {string} text - Lowercase conversation text
 * @param {object} template - Task template with field definitions
 * @returns {object} - Extracted field values
 */
function extractFieldsFromText(text, template) {
    const fields = {};

    // Initialize all fields as empty
    for (const field of template.fields) {
        fields[field.key] = '';
    }

    // Vehicle-specific extraction patterns
    if (template.id === 'vehicle_change') {
        // Detect action type
        if (text.includes('add') || text.includes('adding') || text.includes('new')) {
            fields.action_type = 'Add Vehicle';
        } else if (text.includes('remove') || text.includes('removing') || text.includes('getting rid')) {
            fields.action_type = 'Remove Vehicle';
        } else if (text.includes('replace') || text.includes('replacing') || text.includes('trading') || text.includes('switching')) {
            fields.action_type = 'Replace Vehicle';
        }

        // Extract year (4-digit number between 1990-2030)
        const yearMatch = text.match(/\b(19[9][0-9]|20[0-3][0-9])\b/);
        if (yearMatch) {
            fields.year = yearMatch[1];
        }

        // Extract VIN (17 alphanumeric characters)
        const vinMatch = text.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i);
        if (vinMatch) {
            fields.vin = vinMatch[0].toUpperCase();
        }

        // Common car makes
        const makes = ['toyota', 'honda', 'ford', 'chevrolet', 'chevy', 'nissan', 'hyundai', 'kia', 'bmw', 'mercedes', 'audi', 'lexus', 'mazda', 'subaru', 'volkswagen', 'vw', 'jeep', 'ram', 'gmc', 'dodge', 'tesla', 'buick', 'cadillac', 'chrysler', 'acura', 'infiniti', 'volvo', 'porsche', 'land rover', 'jaguar', 'mini', 'fiat', 'alfa romeo', 'genesis', 'lincoln', 'mitsubishi'];
        for (const make of makes) {
            if (text.includes(make)) {
                // Normalize some makes
                let normalizedMake = make.charAt(0).toUpperCase() + make.slice(1);
                if (make === 'chevy') normalizedMake = 'Chevrolet';
                if (make === 'vw') normalizedMake = 'Volkswagen';
                fields.make = normalizedMake;
                break;
            }
        }

        // Common car models (basic list)
        const models = ['camry', 'corolla', 'rav4', 'highlander', 'tacoma', 'tundra', 'civic', 'accord', 'cr-v', 'pilot', 'f-150', 'f150', 'mustang', 'explorer', 'escape', 'silverado', 'tahoe', 'suburban', 'malibu', 'altima', 'rogue', 'sentra', 'maxima', 'elantra', 'sonata', 'santa fe', 'tucson', 'optima', 'sorento', 'sportage', 'soul', 'model 3', 'model y', 'model s', 'model x', 'cybertruck', 'wrangler', 'grand cherokee', 'compass', 'cx-5', 'cx-9', 'mazda3', 'outback', 'forester', 'impreza', 'crosstrek', 'jetta', 'passat', 'tiguan', 'golf'];
        for (const model of models) {
            if (text.includes(model.toLowerCase())) {
                // Normalize model name
                let normalizedModel = model.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                if (model === 'f-150' || model === 'f150') normalizedModel = 'F-150';
                if (model === 'cr-v') normalizedModel = 'CR-V';
                if (model === 'cx-5') normalizedModel = 'CX-5';
                if (model === 'cx-9') normalizedModel = 'CX-9';
                fields.model = normalizedModel;
                break;
            }
        }
    }

    return fields;
}

module.exports = {
    taskTemplates,
    getTaskTemplate,
    getAllTaskTemplates,
    detectTaskFromConversation,
};
