import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * Centralized error factory for consistent error messages
 * Provides standardized error creation across the application
 */
export class ErrorFactory {
  /**
   * Creates a NotFoundException with standardized message
   * @param entityType - Type of entity (e.g., 'User', 'Invoice')
   * @param identifier - Optional identifier (ID, email, etc.)
   */
  static notFound(entityType: string, identifier?: string): NotFoundException {
    const message = identifier
      ? `${entityType} with ID '${identifier}' not found`
      : `${entityType} not found`;
    return new NotFoundException(message);
  }

  /**
   * Creates a ConflictException with standardized message
   * @param entityType - Type of entity
   * @param field - Field that conflicts (e.g., 'email')
   * @param value - Optional value that conflicts
   */
  static conflict(entityType: string, field: string, value?: string): ConflictException {
    const message = value
      ? `${entityType} with ${field} '${value}' already exists`
      : `${entityType} with this ${field} already exists`;
    return new ConflictException(message);
  }

  /**
   * Creates a BadRequestException
   * @param message - Error message
   */
  static badRequest(message: string): BadRequestException {
    return new BadRequestException(message);
  }

  /**
   * Creates an UnauthorizedException
   * @param message - Error message (defaults to 'Unauthorized')
   */
  static unauthorized(message: string = 'Unauthorized'): UnauthorizedException {
    return new UnauthorizedException(message);
  }

  /**
   * Creates a ForbiddenException
   * @param action - Action attempted
   * @param resource - Resource type
   */
  static forbidden(action?: string, resource?: string): ForbiddenException {
    const message = action && resource
      ? `You don't have permission to ${action} ${resource}`
      : 'Access forbidden';
    return new ForbiddenException(message);
  }

  /**
   * Creates standardized validation error
   * @param field - Field name
   * @param constraint - Validation constraint that failed
   */
  static validationError(field: string, constraint: string): BadRequestException {
    return new BadRequestException(`${field} ${constraint}`);
  }

  /**
   * Creates standardized error for expired codes/tokens
   * @param tokenType - Type of token (e.g., 'verification code', 'reset token')
   */
  static expired(tokenType: string): BadRequestException {
    return new BadRequestException(`${tokenType} has expired`);
  }

  /**
   * Creates standardized error for invalid codes/tokens
   * @param tokenType - Type of token
   */
  static invalid(tokenType: string): BadRequestException {
    return new BadRequestException(`Invalid ${tokenType}`);
  }

  /**
   * Creates error for account status issues
   * @param status - Account status
   * @param reason - Reason for the issue
   */
  static accountStatus(status: string, reason?: string): UnauthorizedException {
    const message = reason
      ? `Account is ${status}: ${reason}`
      : `Account is ${status}`;
    return new UnauthorizedException(message);
  }

  /**
   * Creates error for business rule violations
   * @param rule - Business rule that was violated
   */
  static businessRule(rule: string): BadRequestException {
    return new BadRequestException(`Business rule violation: ${rule}`);
  }

  /**
   * Creates generic internal server error with logging
   * @param operation - Operation that failed
   * @param error - Original error
   */
  static internalError(operation: string, error?: Error): InternalServerErrorException {
    const message = `Failed to ${operation}`;
    // Error details would be logged separately
    return new InternalServerErrorException(message);
  }
}

