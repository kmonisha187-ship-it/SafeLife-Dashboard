import {
    kpiData, funnelData, channelPerformance, segmentData,
    propensityDonors, lapseRiskData, cityData, campaigns
} from './data.js';

import { initAuth } from './auth.js';

// --- Global Chart Instances ---
let channelChartInstance = null;
let segmentChartInstance = null;

// --- Animation Utilities ---
function animateValue(obj, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const p = (timestamp - startTimestamp) / duration;
        const progress = Math.min(p, 1);
        const easeProgress = progress * (2 - progress);

        const currentVal = end % 1 !== 0
            ? (start + easeProgress * (end - start)).toFixed(2)
            : Math.floor(start + easeProgress * (end - start));

        obj.innerHTML = `${Number(currentVal).toLocaleString('en-US')}${suffix}`;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// --- Component Rendering ---

function renderKPIs() {
    const section = document.getElementById('kpi-section');
    section.innerHTML = '';

    kpiData.forEach(kpi => {
        const card = document.createElement('div');
        card.className = 'kpi-card';
        card.innerHTML = `
            <div class="kpi-icon"><i data-lucide="${kpi.icon}" size="20"></i></div>
            <div class="kpi-data">
                <h3>${kpi.label}</h3>
                <div class="kpi-value" id="${kpi.id}">0</div>
            </div>
        `;
        section.appendChild(card);
    });

    lucide.createIcons();

    kpiData.forEach(kpi => {
        const el = document.getElementById(kpi.id);
        const isDecimal = kpi.value % 1 !== 0;
        const suffix = kpi.id === 'kpi-conversion' ? '%' : '';
        animateValue(el, 0, kpi.value, 1500, suffix);
    });
}

function initChannelChart() {
    const ctx = document.getElementById('channelChart').getContext('2d');
    const data = channelPerformance;

    channelChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Conversion Rate (%)',
                data: data.data,
                backgroundColor: [
                    'rgba(230, 57, 70, 0.8)',
                    'rgba(42, 157, 143, 0.8)',
                    'rgba(252, 163, 17, 0.8)'
                ],
                borderRadius: 4,
                borderSkipped: false,
                barThickness: 'flex'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: { label: (ctx) => `${ctx.raw}% Conversion` }
                }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function renderFunnel() {
    const container = document.getElementById('funnel-chart');
    container.innerHTML = '';

    const steps = [
        { label: 'Sent', value: funnelData.sent, width: 100, color: '#e63946' },
        { label: 'Opened', value: funnelData.opened, width: 75, color: '#d62828' },
        { label: 'Responded', value: funnelData.responded, width: 45, color: '#2a9d8f' },
        { label: 'Donated', value: funnelData.donated, width: 25, color: '#21867a' }
    ];

    steps.forEach((step, idx) => {
        const stepDiv = document.createElement('div');
        stepDiv.style.display = 'flex';
        stepDiv.style.alignItems = 'center';
        stepDiv.style.justifyContent = 'space-between';
        stepDiv.style.marginBottom = '8px';
        stepDiv.style.fontSize = '0.75rem';

        stepDiv.innerHTML = `
            <span style="width: 60px; color: var(--text-secondary);">${step.label}</span>
            <div style="flex: 1; display: flex; justify-content: flex-end; padding-right: 10px;">
                <div style="width: ${step.width}%; background-color: ${step.color}; height: 20px; border-radius: 4px; transition: width 1s ease-out;"></div>
            </div>
            <span style="font-weight: 600; min-width: 50px; text-align: right;">${step.value.toLocaleString()}</span>
        `;
        container.appendChild(stepDiv);
    });
}

function initSegmentIntelligence() {
    const ctx = document.getElementById('segmentChart').getContext('2d');
    const selector = document.getElementById('segment-selector');
    const insightText = document.getElementById('insight-text');

    const updateSegment = (segmentKey) => {
        const data = segmentData[segmentKey];
        insightText.textContent = data.insight;

        if (segmentChartInstance) {
            segmentChartInstance.data.datasets[0].data = data.chartData;
            segmentChartInstance.update();
        } else {
            segmentChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['SMS', 'WhatsApp', 'Email'],
                    datasets: [{
                        data: data.chartData,
                        backgroundColor: ['#e63946', '#2a9d8f', '#fca311'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { position: 'right', labels: { boxWidth: 10, usePointStyle: true, font: { size: 10 } } }
                    }
                }
            });
        }
    };

    selector.addEventListener('change', (e) => updateSegment(e.target.value));
    updateSegment('first-time'); // Initial render
}

async function renderPredictivePanels() {
    // 1. Propensity Table
    const tbody = document.querySelector('#propensity-table tbody');
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:10px;">Loading Live AI Prediction...</td></tr>';

    let donorsToRender = propensityDonors; // Default static fallback
    let liveLapseScore = lapseRiskData.score;

    try {
        // --- FETCH LIVE DATA FROM YOUR NEW AWS BACKEND ---
        const response = await fetch('https://uhfr087to9.execute-api.us-east-1.amazonaws.com/prod/predict?donor_id=XYZ');

        if (response.ok) {
            const apiData = await response.json();

            // Map the API JSON to our frontend table format
            const liveDonor = {
                id: apiData.Donor_ID,
                channel: apiData.Best_Channel,
                score: apiData.Donation_Probability,
                status: apiData.Donation_Probability >= 0.8 ? 'high' : (apiData.Donation_Probability >= 0.5 ? 'medium' : 'low')
            };

            // Replace the first static donor with our live fetched donor
            donorsToRender = [liveDonor, ...propensityDonors.slice(1)];

            // Override the lapse risk score with the live data (multiplied by 100 for percentage)
            liveLapseScore = Math.round(apiData.Lapse_Risk_Score * 100);
        }
    } catch (e) {
        console.warn("Could not fetch live API data, using static fallback", e);
    }

    // Render the table with the live data injected
    tbody.innerHTML = '';
    donorsToRender.forEach((donor, index) => {
        const tr = document.createElement('tr');
        // Highlight the live fetched row
        const rowStyle = index === 0 ? "background: rgba(42, 157, 143, 0.15);" : "";
        tr.style = rowStyle;

        tr.innerHTML = `
            <td style="font-weight: 500; font-family: monospace;">${donor.id} ${index === 0 ? '<span style="font-size:0.6rem; color:#2a9d8f;">(LIVE)</span>' : ''}</td>
            <td>${donor.channel}</td>
            <td><span class="badge ${donor.status}">${donor.score}</span></td>
        `;
        tbody.appendChild(tr);
    });

    // 2. Lapse Risk
    const lapseContainer = document.getElementById('lapse-stats');
    lapseContainer.innerHTML = `
        <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="font-size: 2rem; font-weight: 800; color: #ffb3c1; line-height: 1;">${liveLapseScore}</span>
            <span style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Score</span>
        </div>
        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.9); margin-bottom: 0.25rem;">
            <strong>Est. Lapse:</strong> ${lapseRiskData.month}
        </div>
        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.9);">
            <strong>Action By:</strong> <span style="color: #ffb3c1;">${lapseRiskData.actionDate}</span>
        </div>
    `;
}

function renderHeatmap() {
    const container = document.getElementById('map-container');
    container.innerHTML = '';

    // Create specific map tooltip
    let tooltip = document.querySelector('.map-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        document.body.appendChild(tooltip);
    }

    const maxDonations = Math.max(...cityData.map(c => c.donations));

    cityData.forEach(city => {
        let intensityClass = 'low';
        // Base mapping to specific colors for visual flair
        let color = '#457b9d'; // Muted Blue
        let bgColor = 'rgba(69, 123, 157, 0.2)';
        let fill = 'none';

        if (city.donations > maxDonations * 0.7) {
            intensityClass = 'high';
            color = '#e63946'; // Red
            bgColor = 'rgba(230, 57, 70, 0.3)';
            fill = 'rgba(230, 57, 70, 0.4)';
        } else if (city.donations > maxDonations * 0.4) {
            intensityClass = 'medium';
            color = '#fca311'; // Orange
            bgColor = 'rgba(252, 163, 17, 0.3)';
            fill = 'rgba(252, 163, 17, 0.4)';
        }

        const dot = document.createElement('div');
        dot.className = `map-pin-container ${intensityClass}`;
        dot.style.left = `${city.x}%`;
        dot.style.top = `${city.y}%`;

        dot.innerHTML = `
            <i data-lucide="map-pin" size="24" style="color: ${color}; fill: ${fill};"></i>
            <div class="pulse-ring" style="background: ${bgColor};"></div>
        `;

        dot.addEventListener('mouseenter', (e) => {
            const rect = dot.getBoundingClientRect();
            tooltip.innerHTML = `
                <div style="font-weight:700; border-bottom:1px solid #eee; padding-bottom:4px; margin-bottom:4px;">${city.name}</div>
                <div style="display:flex; justify-content:space-between;"><span>Donations:</span> <strong>${city.donations.toLocaleString()}</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>Conv Rate:</span> <strong>${city.conversion}%</strong></div>
            `;
            // Position carefully above the pin
            tooltip.style.left = `${rect.left + window.scrollX - 45}px`;
            tooltip.style.top = `${rect.top + window.scrollY - 70}px`;
            tooltip.classList.add('visible');
        });

        dot.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });

        container.appendChild(dot);
    });

    lucide.createIcons();
}

function renderComparison() {
    const sel1 = document.getElementById('compare-1');
    const sel2 = document.getElementById('compare-2');
    const results = document.getElementById('compare-results');

    const update = () => {
        const c1 = campaigns[sel1.value];
        const c2 = campaigns[sel2.value];

        // Format without spaces inside <div ... > to avoid printing raw text
        results.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr auto 1fr; gap:0.5rem; align-items:center; text-align:center;">
                <div style="background:var(--surface); padding:0.5rem; border-radius:var(--radius-sm); border:1px solid rgba(0,0,0,0.05);">
                    <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">Donations</div>
                    <div style="font-size:1.1rem; font-weight:700; color:${c1.donations > c2.donations ? 'var(--success)' : 'var(--text-primary)'};">${c1.donations.toLocaleString()}</div>
                    <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; margin-top:0.5rem;">Conversion</div>
                    <div style="font-size:0.9rem; font-weight:600; color:${c1.conversion > c2.conversion ? 'var(--success)' : 'var(--text-primary)'};">${c1.conversion}%</div>
                </div>
                <div style="color:var(--text-muted); font-size:0.8rem; font-weight:600;">VS</div>
                <div style="background:var(--surface); padding:0.5rem; border-radius:var(--radius-sm); border:1px solid rgba(0,0,0,0.05);">
                    <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">Donations</div>
                    <div style="font-size:1.1rem; font-weight:700; color:${c2.donations > c1.donations ? 'var(--success)' : 'var(--text-primary)'};">${c2.donations.toLocaleString()}</div>
                    <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; margin-top:0.5rem;">Conversion</div>
                    <div style="font-size:0.9rem; font-weight:600; color:${c2.conversion > c1.conversion ? 'var(--success)' : 'var(--text-primary)'};">${c2.conversion}%</div>
                </div>
            </div >
                `;
    };

    sel1.addEventListener('change', update);
    sel2.addEventListener('change', update);
    update();
}

function initModal() {
    const modal = document.getElementById('report-modal');
    const btnOpen = document.getElementById('btn-generate-report');
    const btnClose = document.getElementById('btn-close-modal');
    const content = document.getElementById('report-content');

    btnOpen.addEventListener('click', () => {
        // Formatted cleanly without spacial errors
        content.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom: 1.5rem;">
                <div style="background:rgba(230,57,70,0.1); padding:1rem; border-radius:var(--radius-md);">
                    <h4 style="color:#d62828; margin-bottom:0.25rem; font-size:0.85rem;">Best Performing Channel</h4>
                    <p style="font-size:0.95rem;"><strong>WhatsApp</strong> drove 42% of total donations this cycle.</p>
                </div>
                <div style="background:rgba(42,157,143,0.1); padding:1rem; border-radius:var(--radius-md);">
                    <h4 style="color:#21867a; margin-bottom:0.25rem; font-size:0.85rem;">Optimal Outreach Time</h4>
                    <p style="font-size:0.95rem;"><strong>Evening (6 PM - 8 PM)</strong> yielded the highest engagement rates.</p>
                </div>
                <div style="background:rgba(252,163,17,0.1); padding:1rem; border-radius:var(--radius-md);">
                    <h4 style="color:#e09210; margin-bottom:0.25rem; font-size:0.85rem;">AI Recommendation</h4>
                    <p style="font-size:0.95rem;">Shift SMS budget to WhatsApp for <em>First-Time Donors</em> to potentially increase yield by ~12%.</p>
                </div>
            </div >
                `;
        modal.classList.add('active');
    });

    btnClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    const btnDownload = document.getElementById('btn-download-pdf');
    btnDownload.addEventListener('click', () => {
        // Capture the entire dashboard layout instead of just the modal
        const modal = document.getElementById('report-modal');

        // Temporarily hide the modal so it doesn't block the dashboard view in the PDF
        modal.classList.remove('active');
        const scrollTop = window.scrollY;
        // Scroll to top effectively fixes html2canvas clipping large divs
        window.scrollTo(0, 0);

        // Small timeout to allow css transition to hide modal before capturing
        setTimeout(() => {
            html2canvas(document.body, {
                scale: 2,
                backgroundColor: '#f0f2f5',
                useCORS: true,
                scrollY: 0,
                scrollX: 0,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight
            }).then(canvas => {
                // Restore scroll
                window.scrollTo(0, scrollTop);
                // Restore modal if needed, or keep it closed

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;

                // We normalize paper width: A4 landscape is 297mm, portrait is 210mm
                const isWide = canvas.width > canvas.height;
                const baseWidthMm = isWide ? 297 : 210;
                
                // Keep the exact aspect ratio of the captured canvas
                const calculatedHeightMm = (canvas.height * baseWidthMm) / canvas.width;

                const pdf = new jsPDF({ 
                    orientation: isWide ? 'landscape' : 'portrait', 
                    unit: 'mm', 
                    format: [baseWidthMm, calculatedHeightMm] 
                });

                pdf.addImage(imgData, 'PNG', 0, 0, baseWidthMm, calculatedHeightMm);
                pdf.save("SafeLife_Full_Dashboard.pdf");
            });
        }, 300);
    });
}

function simulateRealTimeUpdates() {
    setInterval(() => {
        // 1. Mutate KPIs
        kpiData.forEach(kpi => {
            const el = document.getElementById(kpi.id);
            if (!el) return;
            
            let currentVal = parseFloat(kpi.value);
            let newVal = currentVal;
            
            if (kpi.id === 'kpi-conversion') {
                newVal = Math.min(20, Math.max(1, currentVal + (Math.random() * 0.4 - 0.2)));
                kpi.value = newVal.toFixed(2);
            } else {
                newVal = currentVal + Math.floor(Math.random() * 15);
                kpi.value = newVal;
            }
            
            const suffix = kpi.id === 'kpi-conversion' ? '%' : '';
            let dVal = el.innerText.replace(/,/g, '').replace('%', '');
            let dNum = parseFloat(dVal);
            if(isNaN(dNum)) dNum = currentVal;
            
            animateValue(el, dNum, parseFloat(kpi.value), 1000, suffix);
        });

        // 2. Mutate Funnel
        funnelData.sent += Math.floor(Math.random() * 50);
        funnelData.opened += Math.floor(Math.random() * 25);
        funnelData.responded += Math.floor(Math.random() * 10);
        funnelData.donated += Math.floor(Math.random() * 5);
        renderFunnel();

        // 3. Mutate Channel Chart
        if (channelChartInstance) {
            channelPerformance.data = channelPerformance.data.map(val => {
                return Math.max(1, Math.min(25, val + (Math.random() * 1.5 - 0.75)));
            });
            channelChartInstance.update();
        }

        // 4. Mutate Heatmap
        cityData.forEach(city => {
            city.donations += Math.floor(Math.random() * 20);
            let cConv = parseFloat(city.conversion);
            city.conversion = Math.max(1, Math.min(15, cConv + (Math.random() * 0.4 - 0.2))).toFixed(1);
        });
        renderHeatmap();

        // 5. Re-fetch predictive data (if API is live, otherwise it mutates the live/fallback data)
        renderPredictivePanels();

    }, 120000); // 2 minutes
}

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize authentication check immediately
    initAuth();

    // Delay slightly to ensure fonts and libraries (Chart.js, Lucide) are ready
    setTimeout(() => {
        lucide.createIcons();
        renderKPIs();
        renderFunnel();
        initChannelChart();
        initSegmentIntelligence();
        renderPredictivePanels();
        renderHeatmap();
        renderComparison();
        initModal();
        simulateRealTimeUpdates();
    }, 100);
});
