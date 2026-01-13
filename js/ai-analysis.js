/**
 * AI Analysis Engine - Claude API Integration
 * Analyzes scenarios using Claude with document context
 */

class AIAnalysisEngine {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiEndpoint = 'https://api.anthropic.com/v1/messages';
        this.model = 'claude-sonnet-4-20250514';
    }

    /**
     * Analyze scenario with AI
     */
    async analyzeScenario(scenarioDescription, actors = [], baseline = null) {
        try {
            // Get relevant documents from knowledge base
            const relevantDocs = docManager.getRelevantDocuments(scenarioDescription, actors);
            
            // Build context from documents
            const documentContext = this.buildDocumentContext(relevantDocs);
            
            // Build system prompt
            const systemPrompt = this.buildSystemPrompt(baseline);
            
            // Build user prompt
            const userPrompt = this.buildUserPrompt(scenarioDescription, documentContext, actors);
            
            // Call Claude API
            const response = await this.callClaudeAPI(systemPrompt, userPrompt);
            
            // Parse response
            const analysis = this.parseAnalysisResponse(response);
            
            return {
                success: true,
                analysis: analysis,
                documentsUsed: relevantDocs.length,
                confidence: this.calculateConfidence(analysis, relevantDocs)
            };
            
        } catch (error) {
            console.error('AI Analysis error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Call Claude API
     */
    async callClaudeAPI(systemPrompt, userPrompt) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.model,
                max_tokens: 4000,
                system: systemPrompt,
                messages: [{
                    role: 'user',
                    content: userPrompt
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    /**
     * Build system prompt for Claude
     */
    buildSystemPrompt(baseline) {
        return `You are a geopolitical analysis expert specializing in scenario modeling and cascade effects.

Your task is to analyze geopolitical scenarios and predict how they will affect country parameters.

PARAMETER SYSTEM:
Each country has 20 parameters across 5 domains:
- Economic: economic_diversification, fiscal_resilience, trade_integration_depth, technology_production_capacity, energy_autonomy
- Political: institutional_stability, regime_legitimacy_basis, policy_implementation_capacity, elite_cohesion, social_contract_strength
- Security: military_capability_tier, alliance_dependency, strategic_depth, domestic_security_control, cyber_defensive_capacity
- Resources: resource_leverage_potential, financial_system_centrality, infrastructure_connectivity
- Social: demographic_pressure, ideological_mobilization_capacity

ORDINAL SCALE:
Each parameter uses values: very_low, low, medium, high, very_high

${baseline ? `\nCURRENT BASELINE:\n${JSON.stringify(baseline, null, 2)}` : ''}

YOUR ANALYSIS MUST:
1. Consider the ACTION DETAILS (tariff rates, duration, products, conditions)
2. Use PROVIDED DOCUMENTS as evidence
3. Predict SPECIFIC parameter changes with REASONING
4. Estimate CASCADE EFFECTS (secondary and tertiary impacts)
5. Output in STRICT JSON format

OUTPUT FORMAT:
{
  "analysis": {
    "summary": "Brief analysis of the scenario",
    "direct_effects": [
      {
        "actor": "USA",
        "parameter": "trade_integration_depth",
        "current": "high",
        "new": "medium",
        "reasoning": "Detailed explanation with numbers and evidence",
        "confidence": 0.75,
        "evidence_used": ["Document IDs or quotes"]
      }
    ],
    "predicted_cascades": {
      "tier2": [...],
      "tier3": [...]
    },
    "risks": [
      {
        "type": "escalation_risk",
        "description": "...",
        "probability": "medium"
      }
    ]
  }
}`;
    }

    /**
     * Build user prompt
     */
    buildUserPrompt(scenarioDescription, documentContext, actors) {
        return `SCENARIO TO ANALYZE:
${scenarioDescription}

ACTORS INVOLVED:
${actors.join(', ')}

RELEVANT INTELLIGENCE DOCUMENTS:
${documentContext}

TASK:
Analyze this scenario and predict parameter changes. Consider:
1. What are the ACTION DETAILS (%, duration, products)?
2. Which parameters will be DIRECTLY affected?
3. What are the SECONDARY effects (cascades)?
4. What are the RISKS?

Respond ONLY with the JSON format specified in the system prompt.`;
    }

    /**
     * Build document context from relevant docs
     */
    buildDocumentContext(documents) {
        if (documents.length === 0) {
            return "No relevant documents found in knowledge base.";
        }

        let context = '';
        documents.forEach((doc, index) => {
            context += `\n--- DOCUMENT ${index + 1} (Relevance: ${doc.relevanceScore}) ---\n`;
            context += `Title: ${doc.title}\n`;
            context += `Date: ${new Date(doc.date).toLocaleDateString()}\n`;
            context += `Type: ${doc.type}\n`;
            context += `Actors: ${doc.actors.join(', ')}\n`;
            context += `Content:\n${doc.content.substring(0, 2000)}${doc.content.length > 2000 ? '...' : ''}\n`;
        });

        return context;
    }

    /**
     * Parse Claude's JSON response
     */
    parseAnalysisResponse(responseText) {
        try {
            // Extract JSON from response (Claude might add text around it)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const parsed = JSON.parse(jsonMatch[0]);
            
            // Validate structure
            if (!parsed.analysis || !parsed.analysis.direct_effects) {
                throw new Error('Invalid response structure');
            }

            return parsed.analysis;
            
        } catch (e) {
            console.error('Parse error:', e);
            // Return fallback structure
            return {
                summary: responseText,
                direct_effects: [],
                error: 'Failed to parse structured response'
            };
        }
    }

    /**
     * Calculate overall confidence score
     */
    calculateConfidence(analysis, documents) {
        let score = 0.5; // Base confidence

        // Increase if documents available
        if (documents.length > 0) {
            score += 0.1 * Math.min(documents.length, 3);
        }

        // Increase if effects have reasoning
        if (analysis.direct_effects && analysis.direct_effects.length > 0) {
            const avgConfidence = analysis.direct_effects.reduce((sum, e) => sum + (e.confidence || 0.5), 0) / analysis.direct_effects.length;
            score = (score + avgConfidence) / 2;
        }

        return Math.min(score, 0.95); // Cap at 0.95
    }

    /**
     * Quick analysis (without documents)
     */
    async quickAnalyze(action, actor1, actor2, details = '') {
        const prompt = `Analyze this geopolitical action and suggest parameter changes:

Actor: ${actor1}
Action: ${action}
Target: ${actor2}
Details: ${details}

Predict which parameters will change and by how much. Consider economic, political, and security impacts.

Respond in JSON format with parameter changes.`;

        try {
            const response = await this.callClaudeAPI(
                'You are a geopolitical analyst. Analyze actions and predict parameter changes.',
                prompt
            );
            return this.parseAnalysisResponse(response);
        } catch (e) {
            return { error: e.message };
        }
    }
}

// Note: API key should be stored securely
// For production, use environment variables or backend proxy
let aiEngine = null;

function initAIEngine(apiKey) {
    if (!apiKey) {
        console.warn('No API key provided - AI analysis disabled');
        return false;
    }
    aiEngine = new AIAnalysisEngine(apiKey);
    return true;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIAnalysisEngine, initAIEngine };
}
