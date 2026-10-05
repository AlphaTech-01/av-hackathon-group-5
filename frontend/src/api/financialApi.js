/**
 * API Service Layer
 * Interacts with FastAPI backend or local dataset fallback.
 */

import { RAW_DASHBOARD_DATA } from '../data/dashboardData';

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/financial-summary`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return { data, isLive: true };
  } catch (error) {
    console.info('Backend API unavailable. Using verified clean dataset fallback:', error.message);
    return { data: RAW_DASHBOARD_DATA, isLive: false };
  }
};

export const fetchAIRecommendations = async (useFallbackMode = false) => {
  if (useFallbackMode) {
    return getFallbackRecommendations();
  }
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('API failed');
    const res = await response.json();
    return { actions: res.actions, source: 'AI_GEMINI' };
  } catch (err) {
    return { actions: getFallbackRecommendations(), source: 'RULE_BASED_FALLBACK' };
  }
};

export const getFallbackRecommendations = () => [
  {
    priority: 1,
    action: "Pay off high-interest Credit Card debt of ₹68,000 immediately",
    reason: "Credit card carries a high 32.0% APR, incurring ₹1,813 in monthly interest costs. The liquid savings pool (₹8.60L) comfortably covers this payoff.",
    expected_impact: "Saves ₹21,760 in annual interest & boosts Health Score by +10.0 pts.",
    urgency: "HIGH"
  },
  {
    priority: 2,
    action: "Audit and dispute ₹1,85,000 utility charge spike (T0488)",
    reason: "March 2026 Mobile Utility bill is 154.1x higher than category median (₹1,200). Outlier isolated by cleaning engine.",
    expected_impact: "Protects cash flow from erroneous bill deduction.",
    urgency: "HIGH"
  },
  {
    priority: 3,
    action: "Increase Monthly Mutual Fund SIP by ₹15,000",
    reason: "Current savings rate is 22.38%. Increasing investments raises long-term wealth building towards 30%+ benchmark.",
    expected_impact: "Boosts long-term net worth & improves Savings score component.",
    urgency: "MEDIUM"
  }
];
