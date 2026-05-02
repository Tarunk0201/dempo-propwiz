# Project Name

This project is a web application for immersive 360-degree photo and virtual tour experiences, built with React and Vite.

## Overview

This project provides an interactive way to explore panoramic images and virtual tours. It uses the Photo Sphere Viewer library to create a seamless and engaging user experience. The application is built with a modern technology stack, including React for the user interface, Vite for the build tooling, and Tailwind CSS for styling.

## Features

- **360-Degree Photo Viewing:** View panoramic images in a fully immersive 360-degree viewer.
- **Virtual Tours:** Create and navigate through virtual tours with interactive markers.
- **Gyroscope Support:** On mobile devices, users can look around by moving their device.
- **Stereo View:** Supports stereoscopic view for VR headsets.
- **Custom Markers:** Add custom markers to highlight points of interest in the panoramic images.

## Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast and modern build tool for web development.
- **Photo Sphere Viewer:** A JavaScript library for displaying 360-degree photos and virtual tours.
- **Three.js:** A 3D graphics library used by Photo Sphere Viewer.
- **Tailwind CSS:** A utility-first CSS framework for styling.
- **Lottie-react:** A library for rendering After Effects animations.
- **Lucide-react:** A library of beautiful and consistent icons.

## Project Structure

The project follows a standard Vite project structure:

```
/
|-- public/
|   |-- assets/
|       |-- ... (static assets like images, etc.)
|-- src/
|   |-- assets/
|       |-- ... (static assets like images, etc.)
|   |-- components/
|   |   |-- ... (React components)
|   |-- App.jsx
|   |-- main.jsx
|-- index.html
|-- package.json
|-- vite.config.js
|-- README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd your-repository
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`. The server will automatically reload when you make changes to the code.

### Building for Production

To build the project for production, run the following command:

```bash
npm run build
```

This will create a `dist` directory with the production-ready files.

### Linting

To lint the code, run the following command:

```bash
npm run lint
```

This will check the code for any linting errors.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have any suggestions or find any bugs.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
