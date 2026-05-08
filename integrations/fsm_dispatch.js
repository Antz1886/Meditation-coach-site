/**
 * Mind-Craft Coach - Zoho FSM Dispatch Logic
 * Triggers a coach dispatch event when "Talk to a Pro" is clicked.
 */

async function dispatchCoach(userData) {
    const WEBHOOK_URL = 'YOUR_ZOHO_FSM_WEBHOOK_URL'; // Placeholder

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'COACH_DISPATCH',
                timestamp: new Date().toISOString(),
                user: userData,
                priority: 'HIGH' // Sessions are treated like wellness dispatches
            })
        });
        return await response.json();
    } catch (err) {
        console.error('FSM Dispatch failed:', err);
    }
}

document.getElementById('talk-pro').addEventListener('click', () => {
    alert('Dispatching a professional coach to your session... (Simulation)');
    // In production, call dispatchCoach({ id: 'user_123', status: 'critical_stress' });
});
