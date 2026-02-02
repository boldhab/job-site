# Frontend Guidelines

## Project Structure

This project follows a feature-based folder structure with clear separation of concerns.

## Code Style

- Use functional components with hooks
- Follow React best practices
- Use ESLint and Prettier for code formatting
- Write meaningful component and variable names

## State Management

- Use Context API for global state (Auth, Theme, Notifications)
- Use Redux for complex state management (optional)
- Use local state for component-specific data

## API Layer

- All API calls go through the `api/` folder
- Use Axios for HTTP requests
- Handle errors consistently
- Use interceptors for JWT token management

## Routing

- Use React Router for navigation
- Implement route guards for protected routes
- Use role-based access control

## Styling

- Use CSS modules or styled-components
- Follow BEM naming convention
- Support dark/light theme
