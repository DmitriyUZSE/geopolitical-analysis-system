/**
 * Geopolitical Cascade Engine
 * Автоматический расчёт каскадных эффектов на основе формальных правил
 */

class CascadeEngine {
    constructor() {
        this.scale = ["very_low", "low", "medium", "high", "very_high"];
        this.rules = this.loadRules();
        this.crossActorRules = this.loadCrossActorRules();
        this.actorRelationships = this.loadActorRelationships();
    }

    /**
     * Загрузка каузальных правил для одного актора
     */
    loadRules() {
        return {
            // ЭКОНОМИЧЕСКИЕ ПРАВИЛА
            "trade_integration_depth_decrease": [
                {
                    param: "alliance_dependency",
                    effect: "increase",
                    mag: 1,
                    conf: 0.75,
                    delay: 1,
                    logic: "Loss of trade requires alternative alliances for critical supplies"
                },
                {
                    param: "fiscal_resilience",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.65,
                    delay: 1,
                    condition: (actor) => actor.export_dependence > 0.3,
                    logic: "Export-oriented economies lose revenue from trade disruption"
                }
            ],

            "trade_integration_depth_increase": [
                {
                    param: "economic_diversification",
                    effect: "increase",
                    mag: 1,
                    conf: 0.60,
                    delay: 2,
                    logic: "Increased trade exposure encourages economic diversification"
                }
            ],

            "economic_diversification_decrease": [
                {
                    param: "fiscal_resilience",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    logic: "Concentration in few sectors increases vulnerability to shocks"
                }
            ],

            "economic_diversification_increase": [
                {
                    param: "fiscal_resilience",
                    effect: "increase",
                    mag: 1,
                    conf: 0.70,
                    delay: 2,
                    logic: "Diversification creates alternative revenue streams"
                }
            ],

            "fiscal_resilience_decrease": [
                {
                    param: "policy_implementation_capacity",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.65,
                    delay: 1,
                    logic: "Fiscal crisis limits state capacity to implement policy"
                },
                {
                    param: "social_contract_strength",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.60,
                    delay: 2,
                    logic: "Budget cuts and austerity damage social contract"
                },
                {
                    param: "military_capability_tier",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.55,
                    delay: 2,
                    logic: "Fiscal constraints force defense spending cuts"
                }
            ],

            "fiscal_resilience_increase": [
                {
                    param: "policy_implementation_capacity",
                    effect: "increase",
                    mag: 1,
                    conf: 0.60,
                    delay: 1,
                    logic: "Fiscal space enables more ambitious policy implementation"
                }
            ],

            "technology_production_capacity_increase": [
                {
                    param: "resource_leverage_potential",
                    effect: "increase",
                    mag: 1,
                    conf: 0.80,
                    delay: 1,
                    logic: "Technological leadership creates dependencies from other countries"
                },
                {
                    param: "economic_diversification",
                    effect: "increase",
                    mag: 1,
                    conf: 0.65,
                    delay: 2,
                    logic: "Tech sector growth diversifies economy beyond traditional sectors"
                }
            ],

            "technology_production_capacity_decrease": [
                {
                    param: "trade_integration_depth",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    logic: "Loss of tech competitiveness reduces trade participation"
                }
            ],

            "energy_autonomy_decrease": [
                {
                    param: "alliance_dependency",
                    effect: "increase",
                    mag: 1,
                    conf: 0.80,
                    delay: 1,
                    logic: "Energy dependence requires alliances for supply security"
                },
                {
                    param: "fiscal_resilience",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    condition: (actor) => actor.energy_import_share > 0.5,
                    logic: "High energy import costs drain fiscal resources"
                }
            ],

            "energy_autonomy_increase": [
                {
                    param: "alliance_dependency",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.75,
                    delay: 1,
                    logic: "Energy independence reduces need for external guarantees"
                }
            ],

            // ПОЛИТИЧЕСКИЕ ПРАВИЛА
            "regime_legitimacy_basis_decrease": [
                {
                    param: "social_contract_strength",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.75,
                    delay: 1,
                    logic: "Legitimacy crisis undermines trust in governance"
                },
                {
                    param: "elite_cohesion",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.55,
                    delay: 1,
                    probability: 0.60,
                    logic: "Regime weakness triggers elite factionalism and competition"
                },
                {
                    param: "policy_implementation_capacity",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.65,
                    delay: 2,
                    logic: "Illegitimate regimes face bureaucratic resistance"
                }
            ],

            "regime_legitimacy_basis_increase": [
                {
                    param: "social_contract_strength",
                    effect: "increase",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    logic: "Enhanced legitimacy strengthens social cohesion"
                }
            ],

            "elite_cohesion_decrease": [
                {
                    param: "institutional_stability",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    logic: "Elite splits destabilize institutional structures"
                },
                {
                    param: "policy_implementation_capacity",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.65,
                    delay: 1,
                    logic: "Factional conflict paralyzes decision-making"
                }
            ],

            "elite_cohesion_increase": [
                {
                    param: "policy_implementation_capacity",
                    effect: "increase",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    logic: "Elite unity enables coordinated policy execution"
                }
            ],

            "social_contract_strength_decrease": [
                {
                    param: "domestic_security_control",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.60,
                    delay: 2,
                    condition: (actor, change) => change.mag >= 2,
                    logic: "Social contract breakdown leads to protests and instability"
                },
                {
                    param: "regime_legitimacy_basis",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.55,
                    delay: 2,
                    logic: "Popular discontent challenges regime legitimacy"
                }
            ],

            "institutional_stability_decrease": [
                {
                    param: "policy_implementation_capacity",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.75,
                    delay: 1,
                    logic: "Unstable institutions cannot execute policy effectively"
                },
                {
                    param: "fiscal_resilience",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.60,
                    delay: 2,
                    logic: "Institutional crisis reduces investor confidence and tax collection"
                }
            ],

            "policy_implementation_capacity_decrease": [
                {
                    param: "economic_diversification",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.50,
                    delay: 3,
                    logic: "Weak state capacity prevents industrial policy execution"
                }
            ],

            // БЕЗОПАСНОСТЬ
            "military_capability_tier_increase": [
                {
                    param: "fiscal_resilience",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.75,
                    delay: 1,
                    condition: (actor) => actor.defense_spending_ratio > 0.03,
                    logic: "Militarization diverts resources from civilian economy"
                }
            ],

            "military_capability_tier_decrease": [
                {
                    param: "alliance_dependency",
                    effect: "increase",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    logic: "Military weakness increases reliance on external security guarantees"
                }
            ],

            "alliance_dependency_increase": [
                {
                    param: "policy_implementation_capacity",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.55,
                    delay: 1,
                    condition: (actor) => actor.alliance_type === "asymmetric",
                    logic: "Dependence on allies constrains policy autonomy"
                }
            ],

            "alliance_dependency_decrease": [
                {
                    param: "military_capability_tier",
                    effect: "increase",
                    mag: 1,
                    conf: 0.65,
                    delay: 2,
                    logic: "Strategic autonomy requires indigenous defense capabilities"
                }
            ],

            "domestic_security_control_decrease": [
                {
                    param: "regime_legitimacy_basis",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    logic: "Loss of territorial control undermines regime legitimacy"
                },
                {
                    param: "institutional_stability",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.65,
                    delay: 1,
                    logic: "Internal instability threatens institutional order"
                },
                {
                    param: "fiscal_resilience",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.60,
                    delay: 2,
                    logic: "Insecurity disrupts economic activity and tax collection"
                }
            ],

            "strategic_depth_decrease": [
                {
                    param: "alliance_dependency",
                    effect: "increase",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    logic: "Lack of strategic depth requires external security guarantees"
                }
            ],

            "cyber_defensive_capacity_decrease": [
                {
                    param: "infrastructure_connectivity",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.55,
                    delay: 2,
                    logic: "Cyber vulnerabilities reduce willingness to expand digital infrastructure"
                }
            ],

            // РЕСУРСЫ И ГЕО-ЭКОНОМИКА
            "resource_leverage_potential_decrease": [
                {
                    param: "fiscal_resilience",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.80,
                    delay: 1,
                    condition: (actor) => actor.resource_export_dependence > 0.4,
                    logic: "Petrostates depend on resource rents for budget revenue"
                }
            ],

            "financial_system_centrality_decrease": [
                {
                    param: "resource_leverage_potential",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    logic: "Financial marginalization reduces economic leverage"
                }
            ],

            "infrastructure_connectivity_decrease": [
                {
                    param: "trade_integration_depth",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.75,
                    delay: 1,
                    logic: "Poor connectivity limits trade participation"
                }
            ],

            // СОЦИАЛЬНЫЕ ФАКТОРЫ
            "demographic_pressure_increase": [
                {
                    param: "fiscal_resilience",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.70,
                    delay: 2,
                    logic: "Demographic challenges strain pensions and healthcare spending"
                },
                {
                    param: "social_contract_strength",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.60,
                    delay: 2,
                    condition: (actor, change) => change.includes("youth"),
                    logic: "Youth unemployment creates social discontent"
                }
            ],

            "ideological_mobilization_capacity_decrease": [
                {
                    param: "regime_legitimacy_basis",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.55,
                    delay: 2,
                    logic: "Loss of unifying narrative weakens regime support"
                }
            ]
        };
    }

    /**
     * Загрузка правил межакторных взаимодействий
     */
    loadCrossActorRules() {
        return {
            "alliance_dependency_increase": [
                {
                    target_actors: "alliance_partners",
                    target_param: "alliance_dependency",
                    effect: "increase",
                    mag: 1,
                    conf: 0.70,
                    delay: 1,
                    logic: "Alliance strengthening creates mutual dependency"
                }
            ],

            "military_capability_tier_increase": [
                {
                    target_actors: "neighbors",
                    target_param: "military_capability_tier",
                    effect: "increase",
                    mag: 1,
                    conf: 0.50,
                    delay: 2,
                    probability: 0.55,
                    logic: "Military buildup provokes defensive response from neighbors"
                },
                {
                    target_actors: "neighbors",
                    target_param: "alliance_dependency",
                    effect: "increase",
                    mag: 1,
                    conf: 0.65,
                    delay: 1,
                    logic: "Threat from neighbor drives search for external guarantees"
                }
            ],

            "trade_integration_depth_decrease": [
                {
                    target_actors: "major_trade_partners",
                    target_param: "trade_integration_depth",
                    effect: "decrease",
                    mag: 1,
                    conf: 0.85,
                    delay: 0,
                    logic: "Trade disruption is symmetric - both sides lose integration"
                }
            ],

            "technology_production_capacity_increase": [
                {
                    target_actors: "peer_competitors",
                    target_param: "technology_production_capacity",
                    effect: "increase",
                    mag: 1,
                    conf: 0.60,
                    delay: 2,
                    probability: 0.65,
                    logic: "Tech breakthrough by competitor triggers catch-up investments"
                }
            ]
        };
    }

    /**
     * Загрузка отношений между акторами
     */
    loadActorRelationships() {
        return {
            alliances: {
                "NATO": ["USA", "United_Kingdom", "France", "Germany"],
                "US_BILATERAL": ["USA", "Japan", "South_Korea"],
                "INFORMAL": ["USA", "India"]
            },
            trade_partners: {
                "USA": ["China", "Germany", "Japan", "South_Korea"],
                "China": ["USA", "Japan", "South_Korea", "Germany"],
                "Germany": ["France"]
            },
            neighbors: {
                "China": ["Russia", "India", "Japan", "South_Korea"],
                "Russia": ["China"],
                "India": ["China"],
                "Japan": ["China", "South_Korea"],
                "South_Korea": ["China", "Japan"]
            },
            competitors: {
                "USA": ["China", "Russia"],
                "China": ["USA"],
                "Russia": ["USA"]
            }
        };
    }

    /**
     * Основной метод расчёта каскада
     */
    computeCascade(scenario, baseline) {
        const results = {
            tier1: [],
            tier2: [],
            tier3: [],
            tier4: []
        };

        // Копируем baseline для отслеживания изменений
        const state = JSON.parse(JSON.stringify(baseline));

        // TIER 1: Прямые изменения из сценария
        if (scenario.overrides) {
            Object.keys(scenario.overrides).forEach(actor => {
                Object.keys(scenario.overrides[actor]).forEach(param => {
                    const override = scenario.overrides[actor][param];
                    results.tier1.push({
                        actor,
                        parameter: param,
                        baseline: baseline[actor][param],
                        new_value: override,
                        confidence: 0.85,
                        mechanism: "Direct scenario override",
                        tier: 1
                    });
                    state[actor][param] = override;
                });
            });
        }

        // TIER 2: Применить правила к Tier 1
        results.tier1.forEach(change => {
            const triggered = this.getTrigger edRules(change, state);
            triggered.forEach(effect => {
                if (this.shouldApplyEffect(effect, change, state)) {
                    results.tier2.push(effect);
                    state[effect.actor][effect.parameter] = effect.new_value;
                }
            });
        });

        // TIER 3: Применить правила к Tier 2
        results.tier2.forEach(change => {
            const triggered = this.getTriggeredRules(change, state);
            triggered.forEach(effect => {
                if (this.shouldApplyEffect(effect, change, state)) {
                    results.tier3.push(effect);
                    state[effect.actor][effect.parameter] = effect.new_value;
                }
            });
        });

        // TIER 4: Обнаружить петли обратной связи
        results.tier4 = this.detectFeedbackLoops(results, state);

        return results;
    }

    /**
     * Получить триггеры для изменения параметра
     */
    getTriggeredRules(change, state) {
        const key = `${change.parameter}_${this.getDirection(change.baseline, change.new_value)}`;
        const rules = this.rules[key] || [];
        const effects = [];

        rules.forEach(rule => {
            const current = state[change.actor][rule.param];
            const newVal = this.shift(current, rule.effect, rule.mag);
            
            if (newVal !== current) {
                effects.push({
                    actor: change.actor,
                    parameter: rule.param,
                    baseline: current,
                    new_value: newVal,
                    confidence: (change.confidence * rule.conf * 0.7).toFixed(2),
                    mechanism: rule.logic,
                    triggered_by: `${change.actor}.${change.parameter}`,
                    tier: change.tier + 1,
                    delay: rule.delay || 0
                });
            }
        });

        return effects;
    }

    /**
     * Проверить, следует ли применять эффект
     */
    shouldApplyEffect(effect, trigger, state) {
        // Проверить вероятность
        if (trigger.probability && Math.random() > trigger.probability) {
            return false;
        }

        // Проверить условие
        if (trigger.condition) {
            const actor = state[effect.actor];
            if (!trigger.condition(actor, trigger)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Получить направление изменения
     */
    getDirection(from, to) {
        const fromIdx = this.scale.indexOf(from);
        const toIdx = this.scale.indexOf(to);
        return toIdx > fromIdx ? "increase" : "decrease";
    }

    /**
     * Сдвинуть значение по ординальной шкале
     */
    shift(current, direction, magnitude) {
        const idx = this.scale.indexOf(current);
        const newIdx = direction === "increase"
            ? Math.min(idx + magnitude, this.scale.length - 1)
            : Math.max(idx - magnitude, 0);
        return this.scale[newIdx];
    }

    /**
     * Обнаружить петли обратной связи
     */
    detectFeedbackLoops(results, state) {
        const loops = [];
        const changes = [...results.tier1, ...results.tier2, ...results.tier3];

        // Подсчёт, сколько раз затронут каждый параметр
        const paramCount = {};
        changes.forEach(c => {
            const key = `${c.actor}.${c.parameter}`;
            paramCount[key] = (paramCount[key] || 0) + 1;
        });

        // Обнаружить повторяющиеся изменения
        Object.keys(paramCount).forEach(key => {
            if (paramCount[key] > 1) {
                loops.push({
                    type: "potential_feedback",
                    description: `${key} affected ${paramCount[key]} times - possible feedback loop`,
                    risk: "medium",
                    confidence: 0.60
                });
            }
        });

        // Специфические паттерны петель
        if (this.detectFiscalDeathSpiral(changes)) {
            loops.push({
                type: "fiscal_death_spiral",
                description: "Fiscal resilience declining - risk of cascading economic crisis",
                risk: "high",
                confidence: 0.75
            });
        }

        if (this.detectSecurityDilemma(changes)) {
            loops.push({
                type: "security_dilemma",
                description: "Military buildup triggering counter-buildup - arms race dynamics",
                risk: "high",
                confidence: 0.70
            });
        }

        if (this.detectLegitimacyCollapse(changes)) {
            loops.push({
                type: "legitimacy_collapse",
                description: "Legitimacy crisis triggering protests, further undermining legitimacy",
                risk: "very_high",
                confidence: 0.80
            });
        }

        return loops;
    }

    detectFiscalDeathSpiral(changes) {
        return changes.some(c => 
            c.parameter === "fiscal_resilience" && 
            c.new_value.includes("low")
        );
    }

    detectSecurityDilemma(changes) {
        const militaryIncreases = changes.filter(c => 
            c.parameter === "military_capability_tier" && 
            this.getDirection(c.baseline, c.new_value) === "increase"
        );
        return militaryIncreases.length > 1;
    }

    detectLegitimacyCollapse(changes) {
        return changes.some(c => 
            c.parameter === "regime_legitimacy_basis" && 
            c.new_value === "very_low"
        );
    }
}

// Export для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CascadeEngine;
}
