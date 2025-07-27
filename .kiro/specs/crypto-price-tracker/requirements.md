# Requirements Document

## Introduction

This feature implements a cryptocurrency price tracking application that fetches real-time INR prices for specific tokens via the ZebPay API, converts fixed token amounts to INR values, and displays them in a sortable table format within a README.md file. The system includes automated refresh capabilities through GitHub Actions or similar automation methods.

## Requirements

### Requirement 1

**User Story:** As a cryptocurrency investor, I want to view real-time INR prices for my selected tokens, so that I can track the current market value of my holdings.

#### Acceptance Criteria

1. WHEN the application runs THEN the system SHALL fetch current INR prices for specified tokens from ZebPay API
2. WHEN API data is retrieved THEN the system SHALL display token prices in INR format
3. IF API request fails THEN the system SHALL handle errors gracefully and display appropriate error messages
4. WHEN price data is available THEN the system SHALL calculate INR equivalent for fixed token amounts

### Requirement 2

**User Story:** As a user managing multiple cryptocurrencies, I want to see my token holdings converted to INR values in a table format, so that I can easily compare the worth of different tokens.

#### Acceptance Criteria

1. WHEN token data is processed THEN the system SHALL display results in a tabular format within README.md
2. WHEN displaying data THEN the table SHALL include columns for token name, price, withdrawal fees (native), and withdrawal fees (INR)
3. WHEN calculating values THEN the system SHALL convert fixed token amounts to their INR equivalent
4. WHEN updating README.md THEN the system SHALL preserve existing content and only update the price table section

### Requirement 3

**User Story:** As a user analyzing market data, I want to sort the cryptocurrency table by different criteria, so that I can organize information according to my analysis needs.

#### Acceptance Criteria

1. WHEN viewing the table THEN the system SHALL provide sorting functionality for all table headers
2. WHEN user clicks on token name header THEN the table SHALL sort alphabetically by token name
3. WHEN user clicks on price header THEN the table SHALL sort numerically by token price
4. WHEN user clicks on withdrawal fees headers THEN the table SHALL sort numerically by respective fee amounts
5. WHEN sorting is applied THEN the system SHALL maintain data integrity across all columns

### Requirement 4

**User Story:** As a busy investor, I want the price data to refresh automatically on a weekly schedule, so that I always have current information without manual intervention.

#### Acceptance Criteria

1. WHEN one week passes THEN the system SHALL automatically trigger a price refresh
2. WHEN automated refresh runs THEN the system SHALL fetch new data and update the README.md file
3. WHEN using GitHub Actions THEN the system SHALL configure appropriate workflow triggers
4. IF automation fails THEN the system SHALL log errors and attempt retry mechanisms
5. WHEN automation completes THEN the system SHALL commit updated README.md to the repository

### Requirement 5

**User Story:** As a user who wants immediate updates, I want to manually trigger a price refresh, so that I can get the latest data on demand.

#### Acceptance Criteria

1. WHEN user triggers manual refresh THEN the system SHALL immediately fetch current price data
2. WHEN manual refresh is initiated THEN the system SHALL update the README.md table with new data
3. WHEN refresh button/action is available THEN the system SHALL provide clear indication of refresh status
4. IF manual refresh fails THEN the system SHALL display error messages to the user
5. WHEN refresh completes THEN the system SHALL show confirmation of successful update

### Requirement 6

**User Story:** As a developer maintaining the application, I want proper error handling and logging, so that I can troubleshoot issues and ensure system reliability.

#### Acceptance Criteria

1. WHEN API calls are made THEN the system SHALL implement proper timeout and retry mechanisms
2. WHEN errors occur THEN the system SHALL log detailed error information for debugging
3. WHEN rate limits are encountered THEN the system SHALL handle API rate limiting gracefully
4. IF ZebPay API is unavailable THEN the system SHALL provide fallback behavior or clear error messaging
5. WHEN system runs THEN the system SHALL validate configuration and token list before processing
