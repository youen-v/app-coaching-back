module.exports = (err, req, res, next) => {
  // Par défaut
  const status = err.status || 500;
  const type = err.name || 'InternalServerError';
  const message = err.message || 'Une erreur inattendue est survenue.';

  // Log plus propre
  console.error(`[${type}] ${message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Structure de réponse uniforme
  res.status(status).json({
    success: false,
    error: {
      type,
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
};

