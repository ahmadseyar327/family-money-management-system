const axios = require('axios');

const URL = 'https://family-money-management-system.onrender.com/api/auth/login';

async function test() {
    const scenarios = [
        { name: 'Lower Match', email: 'ahmad@example.com' },
        { name: 'Upper Match', email: 'Ahmad@example.com' }
    ];

    for (const s of scenarios) {
        console.log(`--- Testing ${s.name}: ${s.email} ---`);
        try {
            const res = await axios.post(URL, {
                email: s.email,
                password: 'wrong' // We expect 401 for both if it reaches logic
            });
            console.log('Success:', res.data);
        } catch (err) {
            if (err.response) {
                console.log(`Error ${err.response.status}:`, err.response.data);
            } else {
                console.log('Error:', err.message);
            }
        }
    }
}

test();
