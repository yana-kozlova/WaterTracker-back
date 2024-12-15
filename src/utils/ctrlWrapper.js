const ctrlWrapper = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'InternalServerError';

      const errorResponse = {
        status,
        message,
        data: {
          message: error.message || '',
        },
      };

      res.status(status).json(errorResponse);
    }
  };
  return func;
};

export default ctrlWrapper;
