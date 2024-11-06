import axios from 'axios';
import { faker } from '@faker-js/faker';

const makeRequest = async () => {
    const data = {
        authorizationNumber: faker.string.alphanumeric(9).toUpperCase(),
        movementDate: faker.date.future().toISOString().split('T')[0] + 'T00:00:00',
        accountFrom: faker.finance.accountNumber(),
        accountTo: faker.finance.accountNumber(),
        destinationBank: `${faker.finance.bic()}`,
        currency: faker.finance.currency().code,
        amount: faker.number.int({ min: 1, max: 1000000 })
    };

    try {
        const response = await axios.post('http://localhost:3001/api/movements', data);
        console.log('Response:', response.status);
    } catch (error: any) {
        console.error('Error:', error.response ? error.response.status : error.message);
    }
};

const makeRequests = async () => {
    const requests = Array.from({ length: 100 }, () => makeRequest());
    await Promise.all(requests);
};

makeRequests();