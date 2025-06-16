const logger = require('../../../services/logService');
const winston = require('winston');

jest.mock('winston', () => {
  const mLogger = {
    error: jest.fn(),
    info: jest.fn(),
  };
  return {
    createLogger: jest.fn(() => mLogger),
    format: {
      combine: jest.fn(),
      timestamp: jest.fn(),
      errors: jest.fn(),
      splat: jest.fn(),
      json: jest.fn(),
    },
    transports: {
      Console: jest.fn(),
      File: jest.fn(),
    },
  };
});

describe('logService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call logger.error with error message and stack', () => {
    const error = new Error('Test error');
    logger.error = jest.fn(); // mock the error method

    logger.logError(error);

    expect(logger.error).toHaveBeenCalledWith(error.message, expect.objectContaining({
      error: error.message,
      detail: error.stack,
    }));
  });

  it('should call logger.error with extra properties if present', () => {
    const error = new Error('Another error');
    error.custom = 'customValue';
    logger.error = jest.fn();

    logger.logError(error);

    expect(logger.error).toHaveBeenCalledWith(
      error.message,
      expect.objectContaining({
        error: error.message,
        detail: error.stack,
        custom: 'customValue',
      })
    );
  });
});