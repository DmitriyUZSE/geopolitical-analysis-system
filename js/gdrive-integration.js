/**
 * Google Drive Integration for Document Management
 * Automatically indexes Word documents from Google Drive folders
 */

class GoogleDriveDocumentSystem {
    constructor() {
        this.accessToken = null;
        this.folderId = null;
        this.documents = [];
        this.isAuthenticated = false;
        
        // Google API configuration
        this.CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Will be configured in settings
        this.API_KEY = 'YOUR_GOOGLE_API_KEY';
        this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
        this.SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
    }

    /**
     * Initialize Google Drive API
     */
    async initialize(clientId, apiKey) {
        this.CLIENT_ID = clientId;
        this.API_KEY = apiKey;
        
        return new Promise((resolve, reject) => {
            gapi.load('client:auth2', async () => {
                try {
                    await gapi.client.init({
                        apiKey: this.API_KEY,
                        clientId: this.CLIENT_ID,
                        discoveryDocs: this.DISCOVERY_DOCS,
                        scope: this.SCOPES
                    });
                    
                    this.isAuthenticated = gapi.auth2.getAuthInstance().isSignedIn.get();
                    resolve(this.isAuthenticated);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Sign in to Google
     */
    async signIn() {
        try {
            await gapi.auth2.getAuthInstance().signIn();
            this.isAuthenticated = true;
            this.accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
            return true;
        } catch (error) {
            console.error('Sign in error:', error);
            return false;
        }
    }

    /**
     * Sign out
     */
    async signOut() {
        await gapi.auth2.getAuthInstance().signOut();
        this.isAuthenticated = false;
        this.accessToken = null;
    }

    /**
     * Select folder to monitor
     */
    async selectFolder() {
        // Open Google Picker to select folder
        const picker = new google.picker.PickerBuilder()
            .setOAuthToken(this.accessToken)
            .setDeveloperKey(this.API_KEY)
            .setCallback(this.pickerCallback.bind(this))
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .setSelectableMimeTypes('application/vnd.google-apps.folder')
            .build();
        
        picker.setVisible(true);
    }

    pickerCallback(data) {
        if (data.action === google.picker.Action.PICKED) {
            this.folderId = data.docs[0].id;
            localStorage.setItem('gdrive_folder_id', this.folderId);
            this.indexDocuments();
        }
    }

    /**
     * Index all documents in folder recursively
     */
    async indexDocuments(folderId = null) {
        if (!folderId) folderId = this.folderId;
        if (!folderId) throw new Error('No folder selected');

        const documents = [];
        
        try {
            // Get all files in folder
            const response = await gapi.client.drive.files.list({
                q: `'${folderId}' in parents`,
                fields: 'files(id, name, mimeType, modifiedTime, size)',
                pageSize: 1000
            });

            const files = response.result.files;

            for (const file of files) {
                if (file.mimeType === 'application/vnd.google-apps.folder') {
                    // Recursively index subfolders
                    const subDocs = await this.indexDocuments(file.id);
                    documents.push(...subDocs);
                    
                } else if (this.isSupportedDocument(file.mimeType)) {
                    // Extract and index document
                    const doc = await this.extractDocument(file);
                    documents.push(doc);
                }
            }

            this.documents = documents;
            this.saveIndex();
            
            return documents;
            
        } catch (error) {
            console.error('Indexing error:', error);
            throw error;
        }
    }

    /**
     * Check if file type is supported
     */
    isSupportedDocument(mimeType) {
        const supported = [
            'application/vnd.google-apps.document',  // Google Docs
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // .docx
            'application/msword',  // .doc
            'text/plain',  // .txt
            'application/pdf'  // .pdf
        ];
        return supported.includes(mimeType);
    }

    /**
     * Extract text from document
     */
    async extractDocument(file) {
        try {
            let text = '';
            
            if (file.mimeType === 'application/vnd.google-apps.document') {
                // Google Doc - export as plain text
                const response = await gapi.client.drive.files.export({
                    fileId: file.id,
                    mimeType: 'text/plain'
                });
                text = response.body;
                
            } else {
                // Other formats - download and extract
                const response = await fetch(
                    `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`
                        }
                    }
                );
                
                const blob = await response.blob();
                
                if (file.mimeType.includes('word')) {
                    text = await this.extractFromDocx(blob);
                } else if (file.mimeType === 'text/plain') {
                    text = await blob.text();
                } else if (file.mimeType === 'application/pdf') {
                    text = await this.extractFromPDF(blob);
                }
            }

            // Extract metadata
            const metadata = this.extractMetadata(text, file.name);

            return {
                id: file.id,
                title: file.name,
                content: text,
                mimeType: file.mimeType,
                modifiedTime: file.modifiedTime,
                size: file.size,
                ...metadata,
                source: 'google_drive',
                indexed_at: new Date().toISOString()
            };
            
        } catch (error) {
            console.error(`Error extracting ${file.name}:`, error);
            return null;
        }
    }

    /**
     * Extract text from .docx file
     */
    async extractFromDocx(blob) {
        // Use mammoth.js library to extract text from docx
        try {
            const arrayBuffer = await blob.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value;
        } catch (e) {
            console.error('DOCX extraction error:', e);
            return '';
        }
    }

    /**
     * Extract text from PDF
     */
    async extractFromPDF(blob) {
        // Use pdf.js library
        try {
            const arrayBuffer = await blob.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let text = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(' ') + '\n';
            }
            
            return text;
        } catch (e) {
            console.error('PDF extraction error:', e);
            return '';
        }
    }

    /**
     * Extract metadata from document text
     */
    extractMetadata(text, filename) {
        // Extract actors mentioned
        const actors = ['USA', 'China', 'Russia', 'India', 'Germany', 'Japan', 'France', 'UK'];
        const foundActors = actors.filter(actor => 
            text.toUpperCase().includes(actor) || filename.toUpperCase().includes(actor)
        );

        // Extract date from filename or content
        const dateMatch = filename.match(/\d{4}[-_]\d{2}[-_]\d{2}/) || 
                         text.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
        
        // Classify document type
        let type = 'report';
        if (filename.toLowerCase().includes('memo')) type = 'memo';
        else if (filename.toLowerCase().includes('analysis')) type = 'analysis';
        else if (filename.toLowerCase().includes('brief')) type = 'brief';
        else if (filename.toLowerCase().includes('news')) type = 'news';

        // Extract tags/keywords
        const keywords = this.extractKeywords(text);

        return {
            actors: foundActors,
            date: dateMatch ? new Date(dateMatch[0]).toISOString() : new Date().toISOString(),
            type,
            tags: keywords.slice(0, 10),
            wordCount: text.split(/\s+/).length
        };
    }

    /**
     * Extract keywords from text
     */
    extractKeywords(text) {
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were'];
        
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 4 && !stopWords.includes(word));

        const freq = {};
        words.forEach(w => freq[w] = (freq[w] || 0) + 1);

        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(e => e[0]);
    }

    /**
     * Save index to local storage
     */
    saveIndex() {
        try {
            // Store in IndexedDB for large datasets
            const request = indexedDB.open('GeopoliticalDocs', 1);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('documents')) {
                    db.createObjectStore('documents', { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['documents'], 'readwrite');
                const store = transaction.objectStore('documents');
                
                this.documents.forEach(doc => {
                    store.put(doc);
                });
            };
        } catch (e) {
            console.error('IndexedDB error:', e);
        }
    }

    /**
     * Load index from storage
     */
    async loadIndex() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('GeopoliticalDocs', 1);
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['documents'], 'readonly');
                const store = transaction.objectStore('documents');
                const getAllRequest = store.getAll();
                
                getAllRequest.onsuccess = () => {
                    this.documents = getAllRequest.result;
                    resolve(this.documents);
                };
            };
            
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Search documents
     */
    searchDocuments(query, filters = {}) {
        let results = [...this.documents];

        if (query) {
            const q = query.toLowerCase();
            results = results.filter(doc => 
                doc.title.toLowerCase().includes(q) ||
                doc.content.toLowerCase().includes(q) ||
                doc.tags.some(tag => tag.includes(q))
            );
        }

        if (filters.actors && filters.actors.length > 0) {
            results = results.filter(doc => 
                filters.actors.some(actor => doc.actors.includes(actor))
            );
        }

        if (filters.type) {
            results = results.filter(doc => doc.type === filters.type);
        }

        return results;
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            total: this.documents.length,
            totalSize: this.documents.reduce((sum, doc) => sum + (doc.size || 0), 0),
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
            lastIndexed: this.documents.length > 0 
                ? new Date(Math.max(...this.documents.map(d => new Date(d.indexed_at))))
                : null
        };
    }
}

// Initialize global instance
const gdriveSystem = new GoogleDriveDocumentSystem();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleDriveDocumentSystem;
}
