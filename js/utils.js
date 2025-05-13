// Utility functions for the website

// Debounce function to limit the rate at which a function can fire
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Check if an element is in viewport
export const isInViewport = (element, offset = 0) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 - offset &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Smooth scroll to element
export const scrollToElement = (element, offset = 0) => {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

// Add event listener with automatic cleanup
export const addEventListenerWithCleanup = (element, event, handler) => {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
};

// Format number with commas
export const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Generate random ID
export const generateId = (prefix = 'id') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Parse URL parameters
export const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
};

// Local storage wrapper with error handling
export const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    }
};

// Media query helper
export const mediaQuery = {
    isMobile: () => window.matchMedia('(max-width: 768px)').matches,
    isTablet: () => window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches,
    isDesktop: () => window.matchMedia('(min-width: 1025px)').matches
};

// Error handling wrapper
export const tryCatch = async (fn, errorHandler) => {
    try {
        return await fn();
    } catch (error) {
        if (errorHandler) {
            return errorHandler(error);
        }
        console.error('Operation failed:', error);
        throw error;
    }
}; 