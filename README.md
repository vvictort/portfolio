## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Project Structure

The `src/components/` directory is organized by component role to ensure maintainability and separation of concerns:

```text
src/components/
├── astro/       # Astro-specific components (.astro files)
├── layout/      # Application-wide wrappers and layout components (e.g., Navigation, SmoothScroll)
├── sections/    # Main page-level payload sections (e.g., AboutSection, DestinationsSection)
└── ui/          # Generic, reusable UI widgets and components (e.g., FlightBoard, InteractiveMap)
```

Additionally, dynamic data for the portfolio (such as the list of projects) is kept separate from the React components in a centralized file:

- `src/data/projects.json`
