/**
 * Document Manager - Knowledge Base for Geopolitical Analysis
 * Stores and retrieves analytical documents for AI reasoning
 */

class DocumentManager {
    constructor() {
        this.documents = this.loadDocuments();
    }

    /**
     * Load documents from localStorage
     */
    loadDocuments() {
        try {
            const stored = localStorage.getItem('geopolitical_documents');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading documents:', e);
            return [];
        }
    }

    /**
     * Save documents to localStorage
     */
    saveDocuments() {
        try {
            localStorage.setItem('geopolitical_documents', JSON.stringify(this.documents));
        } catch (e) {
            console.error('Error saving documents:', e);
        }
    }

    /**
     * Add a new document to the knowledge base
     */
    addDocument(doc) {
        const document = {
            id: Date.now().toString(),
            title: doc.title,
            content: doc.content,
            type: doc.type || 'report', // report, memo, analysis, news
            tags: doc.tags || [],
            actors: doc.actors || [], // Which countries mentioned
            date: doc.date || new Date().toISOString(),
            source: doc.source || 'Manual upload',
            metadata: doc.metadata || {}
        };

        this.documents.push(document);
        this.saveDocuments();
        return document;
    }

    /**
     * Search documents by query
     */
    searchDocuments(query, filters = {}) {
        let results = [...this.documents];

        // Text search
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(doc => 
                doc.title.toLowerCase().includes(q) ||
                doc.content.toLowerCase().includes(q) ||
                doc.tags.some(tag => tag.toLowerCase().includes(q))
            );
        }

        // Filter by type
        if (filters.type) {
            results = results.filter(doc => doc.type === filters.type);
        }

        // Filter by actors
        if (filters.actors && filters.actors.length > 0) {
            results = results.filter(doc => 
                filters.actors.some(actor => doc.actors.includes(actor))
            );
        }

        // Filter by date range
        if (filters.dateFrom) {
            results = results.filter(doc => new Date(doc.date) >= new Date(filters.dateFrom));
        }
        if (filters.dateTo) {
            results = results.filter(doc => new Date(doc.date) <= new Date(filters.dateTo));
        }

        return results;
    }

    /**
     * Get relevant documents for scenario analysis
     */
    getRelevantDocuments(scenarioDescription, actors = []) {
        // Extract keywords from scenario description
        const keywords = this.extractKeywords(scenarioDescription);
        
        // Search by keywords and actors
        let relevant = this.searchDocuments(keywords.join(' '), { actors });

        // Score documents by relevance
        relevant = relevant.map(doc => {
            let score = 0;
            
            // Score by keyword matches
            keywords.forEach(kw => {
                if (doc.title.toLowerCase().includes(kw)) score += 3;
                if (doc.content.toLowerCase().includes(kw)) score += 1;
                doc.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(kw)) score += 2;
                });
            });

            // Score by actor matches
            actors.forEach(actor => {
                if (doc.actors.includes(actor)) score += 5;
            });

            // Score by recency (newer = better)
            const daysSince = (Date.now() - new Date(doc.date)) / (1000 * 60 * 60 * 24);
            if (daysSince < 30) score += 3;
            else if (daysSince < 90) score += 2;
            else if (daysSince < 180) score += 1;

            return { ...doc, relevanceScore: score };
        });

        // Sort by relevance
        relevant.sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Return top 5 most relevant
        return relevant.slice(0, 5);
    }

    /**
     * Extract keywords from text
     */
    extractKeywords(text) {
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being'];
        
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.includes(word));

        // Get unique words with frequency
        const freq = {};
        words.forEach(w => freq[w] = (freq[w] || 0) + 1);

        // Return top keywords
        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(e => e[0]);
    }

    /**
     * Delete document
     */
    deleteDocument(id) {
        this.documents = this.documents.filter(doc => doc.id !== id);
        this.saveDocuments();
    }

    /**
     * Update document
     */
    updateDocument(id, updates) {
        const index = this.documents.findIndex(doc => doc.id === id);
        if (index !== -1) {
            this.documents[index] = { ...this.documents[index], ...updates };
            this.saveDocuments();
            return this.documents[index];
        }
        return null;
    }

    /**
     * Get all documents
     */
    getAllDocuments() {
        return [...this.documents];
    }

    /**
     * Export documents as JSON
     */
    exportDocuments() {
        return JSON.stringify(this.documents, null, 2);
    }

    /**
     * Import documents from JSON
     */
    importDocuments(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (Array.isArray(imported)) {
                this.documents = [...this.documents, ...imported];
                this.saveDocuments();
                return imported.length;
            }
        } catch (e) {
            console.error('Error importing documents:', e);
            return 0;
        }
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            total: this.documents.length,
            byType: this.documents.reduce((acc, doc) => {
                acc[doc.type] = (acc[doc.type] || 0) + 1;
                return acc;
            }, {}),
            byActor: this.documents.reduce((acc, doc) => {
                doc.actors.forEach(actor => {
                    acc[actor] = (acc[actor] || 0) + 1;
                });
                return acc;
            }, {}),
            recent: this.documents.filter(doc => {
                const daysSince = (Date.now() - new Date(doc.date)) / (1000 * 60 * 60 * 24);
                return daysSince < 30;
            }).length
        };
    }
}

// Initialize global document manager
const docManager = new DocumentManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentManager;
}
