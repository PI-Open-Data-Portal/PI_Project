import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:8080/apiV1';

export default function () {
  // 1. GET Case Studies
  const caseRes = http.get(`${BASE_URL}/casestudy`);
  check(caseRes, { 'GET /casestudy status 200': (r) => r.status === 200 });

  // 2. GET Case Study by ID (exemplo com id=1)
  const caseByIdRes = http.get(`${BASE_URL}/casestudy/1`);
  check(caseByIdRes, { 'GET /casestudy/1 status 200': (r) => r.status === 200 });

  // 3. GET ContainerDetails
  const containerRes = http.get(`${BASE_URL}/ContainerDetails`);
  check(containerRes, { 'GET /ContainerDetails status 200': (r) => r.status === 200 });

  // 4. GET Error Reports
  const errorReportsRes = http.get(`${BASE_URL}/errorReports`);
  check(errorReportsRes, { 'GET /errorReports status 200': (r) => r.status === 200 });

  // 5. POST Error Report (sem autenticação)
  const errorPayload = {
    message: `Load test error from VU ${__VU}`,
    severity: 'medium',
  };

  // 6. GET Users (se público)
  const usersRes = http.get(`${BASE_URL}/auth/users`);
  check(usersRes, { 'GET /auth/users status 200': (r) => r.status === 200 });

  sleep(1);
}
