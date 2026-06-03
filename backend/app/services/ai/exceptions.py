"""AI service errors with user-safe messages for API responses."""


class AIServiceError(Exception):
    """Base error for AI pipeline failures."""

    def __init__(self, message: str, *, user_message: str | None = None) -> None:
        super().__init__(message)
        self.user_message = user_message or message


class AIConfigurationError(AIServiceError):
    """Missing or invalid provider configuration."""


class AIAuthenticationError(AIServiceError):
    """Invalid or rejected API key."""


class AINetworkError(AIServiceError):
    """Network or upstream timeout failure."""


class AIEmptyResponseError(AIServiceError):
    """Provider returned no usable content."""


class AIResponseError(AIServiceError):
    """Response could not be parsed or failed validation."""
