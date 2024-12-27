export const validateBody = (schema) => async (req, res, next) => {
  console.log(req.body);
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    console.log(err);
    const errors = err.details?.reduce((acc, detail) => {
      const key = detail.path[0];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(detail.message);
      return acc;
    }, {});

    const errorResponse = {
      status: 400,
      message: 'BedRequestError',
      data: {
        message: 'Bed Request',
        errors,
      },
    };

    res.status(400).json(errorResponse);
  }
};

export default validateBody;
