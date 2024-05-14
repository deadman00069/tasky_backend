class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: any[]; // Specify the type of error details array

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack: string = ""
  ) {
    // Call the parent constructor (Error class)
    super(message);

    // Assign values to custom properties
    this.statusCode = statusCode;
    this.data = null; // Additional data related to the error (default: null)
    this.message = message;
    this.success = false; // Indicator of success/failure (default: false)
    this.errors = errors;

    // Assign stack trace (or capture it if not provided)
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
