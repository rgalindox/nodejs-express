/**
 * Reports routes.
 */
app.get("/reports", reportController.getReports);

/**
 * Report routes.
 * app.get("/report/:id", passportConfig.isAuthenticated, passportConfig.isSubscribed, reportController.getReport);
 */
app.get("/report/:id", passportConfig.isAuthenticated, reportController.getReport);