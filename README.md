# # Image Compressor

This is a simple web-based image compressor application built with React. It allows users to upload images, compress them, and compare the original and compressed images side-by-side.

## Features

- **Image Upload**: Easily upload images for compression.
- **Image Compression**: Compress images to reduce file size.
- **Side-by-Side Comparison**: Compare the original and compressed images visually.
- **Download Compressed Image**: Download the compressed image.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool that provides a lightning-fast development experience.
- **HTML Canvas API**: Used for image manipulation and compression.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed.

- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn (v1.22 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/atharvabaodhankar/image-compressor.git
   cd image-compressor
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

```
image-compressor/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ImageCompareSlider.jsx
│   ├── utils/
│   │   └── imageProcessing.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE). (Note: A LICENSE file is not included in the current project structure, but it's good practice to add one.)
