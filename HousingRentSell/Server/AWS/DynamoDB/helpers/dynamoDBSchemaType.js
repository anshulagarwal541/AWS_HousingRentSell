const asStringAndRequired = (item) => {
    if (typeof item !== 'string') {
        throw new Error('Item must be a string');
    }
    if (!item) {
        throw new Error('Item is required');
    }
    return item;
}

const asStringAndOptional = (item) => {
    if (typeof item !== 'string') {
        throw new Error('Item must be a string');
    }
    return item;
}

const asListAndRequired = (items) => {
    if (!Array.isArray(items)) {
        if (!items) {
            throw new Error('Items is required');
        }
        items = [items];
    }
    if (items.length === 0) {
        throw new Error('Items is required');
    }
    return items;
}

const asListAndOptional = (items) => {
    if (!Array.isArray(items)) {
        if (!items) {
            return null;
        }
        items = [items];
    }
    return items;
}

const asNumericAndRequired = (item) => {
    if (typeof item !== 'number') {
        throw new Error('Item must be a number');
    }
    return item;
}

const asNumericAndOptional = (item) => {
    if (!item) {
        return null;
    }
    if (typeof item !== 'number') {
        throw new Error('Item must be a number');
    }
    return item;
}

const asNNumericAndRequiredWithDefault = (item, defaultValue) => {
    if (!item) {
        return defaultValue;
    }
    if (typeof item !== 'number') {
        throw new Error('Item must be a number');
    }
    return item;
}

const asTypeWithDefaults = (filters) => {
    const { data, type_value, enum_values, min_value, max_value, required_value, default_value } = filters;

    // Handle required + default first
    if (required_value && (data === null || data === undefined || data === "")) {
        if (default_value !== undefined) {
            return default_value;
        }
        throw new Error(`Value cannot be NULL or undefined for field ${filters.field_value}`);
    }

    // Type check
    if (type_value === "date") {
        const parsed = (data instanceof Date) ? data : new Date(data);
        if (isNaN(parsed.getTime())) {
            throw new Error(`Invalid date for field ${filters.field_value}`);
        }
        // Return ISO string instead of Date object
        return parsed.toISOString();
    }
    if (type_value  && (typeof data !== type_value)) {
        if (default_value !== undefined) {
            return default_value;
        }
        if (!required_value) {
            return data; // allow invalid type if not required
        }
        throw new Error(`Type doesn't match for data ${data}, expected = ${type_value} for field ${filters.field_value}`);
    }

    // Enum check
    if (enum_values && !enum_values.includes(data)) {
        throw new Error(`Value is not in enums: ${data} for field ${filters.field_value}`);
    }

    // Min/Max checks
    if (min_value !== undefined && data < min_value) {
        throw new Error(`Data is less than min value: ${data} for field ${filters.field_value}`);
    }
    if (max_value !== undefined && data > max_value) {
        throw new Error(`Data is greater than max value: ${data} for field ${filters.field_value}`);
    }

    return data;
};

module.exports = {
    SchemaHelper: {
        asListAndOptional,
        asListAndRequired,
        asNNumericAndRequiredWithDefault,
        asNumericAndOptional,
        asNumericAndRequired,
        asStringAndOptional,
        asStringAndRequired,
        asTypeWithDefaults
    }
}