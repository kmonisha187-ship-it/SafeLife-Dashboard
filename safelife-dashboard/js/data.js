export const kpiData = [
    { id: 'kpi-campaigns', label: 'Campaigns', value: 142, icon: 'megaphone' },
    { id: 'kpi-messages', label: 'Messages', value: 85400, icon: 'send' },
    { id: 'kpi-responses', label: 'Responses', value: 12850, icon: 'message-circle-reply' },
    { id: 'kpi-donations', label: 'Donations', value: 4205, icon: 'droplet' },
    { id: 'kpi-conversion', label: 'Conversion', value: 4.92, icon: 'percent' }
];

export const funnelData = {
    sent: 85400,
    opened: 42700,
    responded: 12850,
    donated: 4205
};

export const channelPerformance = {
    labels: ['SMS', 'WhatsApp', 'Email'],
    data: [4.5, 6.7, 1.8]
};

export const segmentData = {
    'first-time': { chartData: [4.5, 6.2, 1.5], insight: "WhatsApp drives a 6.2% conversion rate for first-time donors, outperforming email." },
    'repeat': { chartData: [2.5, 7.8, 4.2], insight: "Repeat donors show a strong affinity for WhatsApp communications." },
    'rare': { chartData: [8.5, 9.2, 6.5], insight: "Urgent SMS alerts perform exceptionally well (8.5%) for rare blood groups." },
    'high-frequency': { chartData: [1.5, 3.2, 8.5], insight: "High-frequency donors prefer detailed Email newsletters." },
    'inactive': { chartData: [5.2, 2.1, 0.8], insight: "SMS reactivation campaigns offer the best return for inactive donors." }
};

export const propensityDonors = [
    { id: "D-8891", channel: "WhatsApp", score: 0.92, status: 'high' },
    { id: "D-3422", channel: "SMS", score: 0.85, status: 'high' },
    { id: "D-1198", channel: "Email", score: 0.71, status: 'medium' },
    { id: "D-5561", channel: "WhatsApp", score: 0.65, status: 'medium' },
    { id: "D-9012", channel: "SMS", score: 0.42, status: 'low' },
];

export const lapseRiskData = {
    score: 84,
    month: "April 2026",
    actionDate: "March 5, 2026",
    donorsAtRisk: 1240
};

// Precisely mapped relative to 604x696 India SVG bounding box
export const cityData = [
    { name: "Delhi", x: 34, y: 28, donations: 8500, conversion: 7.2 },
    { name: "Mumbai", x: 23, y: 62, donations: 9200, conversion: 6.8 },
    { name: "Bangalore", x: 33, y: 81, donations: 11050, conversion: 8.5 },
    { name: "Chennai", x: 42, y: 79, donations: 6800, conversion: 5.4 },
    { name: "Kolkata", x: 70, y: 52, donations: 7400, conversion: 4.8 },
    { name: "Hyderabad", x: 38, y: 64, donations: 8100, conversion: 6.1 },
    { name: "Pune", x: 27, y: 63, donations: 4200, conversion: 5.9 },
    { name: "Ahmedabad", x: 19, y: 47, donations: 3800, conversion: 3.5 }
];

export const campaigns = {
    "summer23": { name: "Summer '23", donations: 1205, conversion: 4.2 },
    "monsoon23": { name: "Monsoon '23", donations: 980, conversion: 3.8 },
    "winter23": { name: "Winter '23", donations: 2150, conversion: 6.5 }
};
