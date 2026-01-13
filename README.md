# 🌍 Geopolitical Analysis System

Система для анализа геополитических сценариев с автоматическим расчётом каскадных эффектов.

## 🚀 Возможности

- **Baseline Explorer**: Просмотр текущих параметров 10 стран
- **Scenario Builder**: Создание сценариев через действия акторов
- **Cascade Engine**: Автоматический расчёт Tier 1-4 эффектов
- **Математическая модель**: 70+ каузальных правил
- **Feedback Loop Detection**: Обнаружение системных рисков

## 📊 Архитектура
```
/data
  ├── baseline.json           # Базовое состояние (10 акторов × 20 параметров)
  ├── interaction_rules.json  # Библиотека каузальных правил
  └── scenarios.json          # Предзагруженные сценарии

/index.html                   # Веб-интерфейс + Cascade Engine (встроен)
```

## 🎯 Как использовать

### Live Demo
🔗 [Открыть дашборд](https://твой-username.github.io/geopolitical-analysis-system)

### Локально
1. Скачай репозиторий
2. Открой `index.html` в браузере
3. Всё работает offline!

## 🧠 Cascade Engine

Система использует формальные каузальные правила для расчёта:

**Tier 1**: Прямые изменения параметров  
**Tier 2**: Вторичные адаптации (confidence × 0.7)  
**Tier 3**: Стратегические переориентации (confidence × 0.7²)  
**Tier 4**: Системные риски и петли обратной связи  

### Примеры правил:
```javascript
trade_integration_depth ↓ → alliance_dependency ↑
fiscal_resilience ↓ → policy_capacity ↓ → social_contract ↓
military_capability ↑ → fiscal_resilience ↓
```

## 📈 Параметры (20 штук)

**Экономика**: Economic Diversification, Fiscal Resilience, Trade Integration, Tech Production, Energy Autonomy

**Политика**: Institutional Stability, Regime Legitimacy, Policy Capacity, Elite Cohesion, Social Contract

**Безопасность**: Military Capability, Alliance Dependency, Strategic Depth, Domestic Security, Cyber Defense

**Ресурсы**: Resource Leverage, Financial Centrality, Infrastructure

**Социум**: Demographics, Ideological Mobilization

## 🔧 Технологии

- Vanilla JavaScript (no frameworks)
- Bootstrap 5 (UI)
- Embedded Cascade Engine (математическая модель)
- GitHub Pages (хостинг)

## 📝 Лицензия

MIT License - используй свободно!

## 🤝 Contribution

Проект в активной разработке. Pull requests приветствуются!

---

**Автор**: [Твоё имя]  
**Дата создания**: Январь 2025
```

---

## СТРУКТУРА ПРОЕКТА В GITHUB

После всех шагов у тебя будет:
```
geopolitical-analysis-system/
│
├── index.html                    # Главный файл (дашборд)
├── README.md                     # Описание проекта
│
└── data/
    ├── baseline.json             # Базовые данные
    ├── interaction_rules.json    # Правила каскадов
    └── scenarios.json            # Сценарии
