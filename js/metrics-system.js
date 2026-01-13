/**
 * Metrics System - Quantitative Baseline with Real Data
 * Stores actual numbers behind ordinal values
 */

const QUANTITATIVE_BASELINE = {
    "USA": {
        "economic_diversification": {
            "ordinal": "very_high",
            "metrics": {
                "economic_complexity_index": 1.58,
                "export_concentration_hhi": 0.042,
                "sector_distribution": {
                    "services": 79.4,
                    "manufacturing": 10.9,
                    "agriculture": 0.9,
                    "other": 8.8
                },
                "top_exports": {
                    "refined_petroleum": 6.2,
                    "aircraft": 4.8,
                    "cars": 3.9,
                    "computers": 3.2,
                    "integrated_circuits": 2.8
                }
            },
            "sources": [
                "Observatory of Economic Complexity 2023",
                "World Bank WDI 2024",
                "BEA National Accounts"
            ],
            "last_updated": "2024-12-01"
        },
        
        "fiscal_resilience": {
            "ordinal": "medium",
            "metrics": {
                "debt_to_gdp": 122.3,
                "fiscal_deficit_pct_gdp": 6.3,
                "primary_balance_pct_gdp": -3.7,
                "interest_payments_pct_revenue": 12.8,
                "reserve_currency_advantage": true,
                "sovereign_rating": "AA+",
                "10y_bond_yield": 4.2
            },
            "sources": [
                "IMF Fiscal Monitor Oct 2024",
                "US Treasury",
                "Fed Reserve"
            ],
            "last_updated": "2024-11-15"
        },
        
        "trade_integration_depth": {
            "ordinal": "high",
            "metrics": {
                "trade_openness_pct_gdp": 27.2,
                "trade_value_usd_bn": 7420,
                "exports_usd_bn": 3051,
                "imports_usd_bn": 4369,
                "top_partners": {
                    "China": { "share": 14.8, "value_bn": 1098 },
                    "Canada": { "share": 12.3, "value_bn": 913 },
                    "Mexico": { "share": 11.2, "value_bn": 831 },
                    "Japan": { "share": 4.6, "value_bn": 341 },
                    "Germany": { "share": 3.9, "value_bn": 289 }
                },
                "fdi_stock_pct_gdp": 48.3,
                "gvc_participation_index": 0.58
            },
            "sources": [
                "IMF DOTS 2024",
                "WTO Trade Statistics",
                "UNCTAD FDI Database"
            ],
            "last_updated": "2024-10-20"
        },
        
        "military_capability_tier": {
            "ordinal": "very_high",
            "metrics": {
                "defense_spending_usd_bn": 877,
                "pct_of_gdp": 3.5,
                "pct_of_global_total": 39.2,
                "active_personnel": 1328000,
                "reserve_personnel": 799500,
                "major_systems": {
                    "aircraft_carriers": 11,
                    "destroyers": 69,
                    "submarines": 68,
                    "fighter_aircraft": 1957,
                    "tanks": 4657,
                    "nuclear_warheads": 5244
                },
                "global_bases": 750,
                "power_projection_score": 0.94
            },
            "sources": [
                "SIPRI Military Expenditure Database 2024",
                "IISS Military Balance 2024",
                "DoD Reports"
            ],
            "last_updated": "2024-09-01"
        }
    },
    
    "China": {
        "economic_diversification": {
            "ordinal": "high",
            "metrics": {
                "economic_complexity_index": 1.18,
                "export_concentration_hhi": 0.068,
                "sector_distribution": {
                    "services": 54.5,
                    "manufacturing": 27.4,
                    "agriculture": 7.1,
                    "construction": 6.9,
                    "other": 4.1
                },
                "top_exports": {
                    "computers": 9.8,
                    "broadcasting_equipment": 8.2,
                    "telephones": 5.4,
                    "integrated_circuits": 4.6,
                    "office_machine_parts": 2.9
                }
            },
            "sources": [
                "Observatory of Economic Complexity 2023",
                "World Bank WDI 2024"
            ],
            "last_updated": "2024-11-20"
        },
        
        "trade_integration_depth": {
            "ordinal": "very_high",
            "metrics": {
                "trade_openness_pct_gdp": 37.8,
                "trade_value_usd_bn": 6304,
                "exports_usd_bn": 3511,
                "imports_usd_bn": 2793,
                "top_partners": {
                    "USA": { "share": 15.7, "value_bn": 990 },
                    "ASEAN": { "share": 14.2, "value_bn": 895 },
                    "EU": { "share": 13.8, "value_bn": 870 },
                    "Japan": { "share": 6.4, "value_bn": 404 },
                    "South_Korea": { "share": 5.9, "value_bn": 372 }
                },
                "gvc_participation_index": 0.64,
                "belt_road_partner_countries": 152
            },
            "sources": [
                "China Customs 2024",
                "IMF DOTS",
                "WTO"
            ],
            "last_updated": "2024-10-15"
        },
        
        "technology_production_capacity": {
            "ordinal": "high",
            "metrics": {
                "semiconductor_production_pct_global": 16.3,
                "advanced_chips_7nm_below": "limited",
                "5g_base_stations": 3280000,
                "ai_patent_filings_2023": 38210,
                "ev_production_units": 9500000,
                "solar_panel_production_pct_global": 80.2,
                "rd_expenditure_pct_gdp": 2.55,
                "rd_expenditure_usd_bn": 458
            },
            "sources": [
                "China Ministry of S&T",
                "WIPO Patent Database",
                "SIA Semiconductor Stats"
            ],
            "last_updated": "2024-12-10"
        },
        
        "energy_autonomy": {
            "ordinal": "low",
            "metrics": {
                "energy_self_sufficiency_pct": 30.2,
                "oil_imports_pct_consumption": 70.8,
                "gas_imports_pct_consumption": 45.6,
                "coal_production_mt": 4560,
                "coal_self_sufficient": true,
                "top_oil_suppliers": {
                    "Saudi_Arabia": 16.2,
                    "Russia": 15.8,
                    "Iraq": 11.3,
                    "Angola": 7.9,
                    "Brazil": 6.4
                },
                "renewable_capacity_gw": 1392,
                "nuclear_capacity_gw": 57
            },
            "sources": [
                "IEA Energy Statistics 2024",
                "China NEA Reports",
                "BP Statistical Review"
            ],
            "last_updated": "2024-11-05"
        }
    }
};

/**
 * Impact Calculator - Converts actions to quantitative impacts
 */
class ImpactCalculator {
    /**
     * Calculate impact of tariffs on trade integration
     */
    static calculateTariffImpact(params) {
        const {
            tariff_rate,  // e.g., 0.25 for 25%
            affected_products_share,  // e.g., 0.30 for 30% of trade
            price_elasticity = -1.5,  // default elasticity
            duration_years,
            partner_share,  // Share of trade with affected partner
            baseline_trade_openness
        } = params;

        // Calculate volume reduction
        const volume_reduction = tariff_rate * price_elasticity * affected_products_share;
        
        // Calculate share impact
        const partner_share_impact = volume_reduction * partner_share;
        
        // Calculate overall trade openness impact
        const trade_openness_impact = partner_share_impact * baseline_trade_openness;

        // Adjust for duration (longer = more substitution = larger impact)
        const duration_multiplier = Math.min(1 + (duration_years - 1) * 0.1, 1.5);
        
        return {
            volume_reduction_pct: volume_reduction * 100,
            partner_share_change: partner_share_impact * 100,
            trade_openness_change: trade_openness_impact * duration_multiplier,
            new_ordinal: this.calculateNewOrdinal(
                baseline_trade_openness + trade_openness_impact,
                'trade_openness_pct_gdp'
            ),
            confidence: this.calculateConfidence(params)
        };
    }

    /**
     * Calculate impact of sanctions on fiscal resilience
     */
    static calculateSanctionsImpact(params) {
        const {
            export_affected_pct,
            export_revenue_share_of_budget,
            alternative_markets_capacity,
            baseline_deficit,
            baseline_debt
        } = params;

        const revenue_loss = export_affected_pct * export_revenue_share_of_budget;
        const mitigated_loss = revenue_loss * (1 - alternative_markets_capacity);
        
        const new_deficit = baseline_deficit + mitigated_loss;
        const debt_trajectory = baseline_debt + (mitigated_loss * 3); // 3-year projection

        return {
            revenue_loss_pct: mitigated_loss * 100,
            new_deficit_pct_gdp: new_deficit,
            projected_debt_pct_gdp: debt_trajectory,
            new_ordinal: this.calculateNewOrdinal(new_deficit, 'fiscal_deficit_pct_gdp'),
            confidence: 0.65
        };
    }

    /**
     * Map quantitative value to ordinal scale
     */
    static calculateNewOrdinal(value, metric_type) {
        const thresholds = {
            'trade_openness_pct_gdp': {
                'very_low': [0, 20],
                'low': [20, 35],
                'medium': [35, 50],
                'high': [50, 70],
                'very_high': [70, 150]
            },
            'fiscal_deficit_pct_gdp': {
                'very_high': [0, 2],     // Low deficit = high resilience
                'high': [2, 4],
                'medium': [4, 6],
                'low': [6, 9],
                'very_low': [9, 20]      // High deficit = low resilience
            },
            'debt_to_gdp': {
                'very_high': [0, 40],    // Low debt = high resilience
                'high': [40, 70],
                'medium': [70, 90],
                'low': [90, 120],
                'very_low': [120, 300]
            }
        };

        const scale = thresholds[metric_type];
        if (!scale) return 'medium';

        for (const [ordinal, [min, max]] of Object.entries(scale)) {
            if (value >= min && value < max) return ordinal;
        }

        return 'medium';
    }

    /**
     * Calculate confidence score based on data quality
     */
    static calculateConfidence(params) {
        let confidence = 0.5;

        // Increase confidence if we have detailed data
        if (params.price_elasticity) confidence += 0.1;
        if (params.duration_years) confidence += 0.1;
        if (params.affected_products_share) confidence += 0.15;
        if (params.alternative_markets_capacity !== undefined) confidence += 0.15;

        return Math.min(confidence, 0.95);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUANTITATIVE_BASELINE, ImpactCalculator };
}
