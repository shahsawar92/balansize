import nextRouterMock from 'next-router-mock';
import '@testing-library/jest-dom/extend-expect';
// Allow router mocks.
// eslint-disable-next-line no-undef
jest.mock('next/router', () => nextRouterMock);
