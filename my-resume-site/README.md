# Matthew Eng's Resume Website

This is a personal portfolio website built with React that showcases my resume and links to my Rutgers University profile.

## Features

- Responsive design
- Dark mode toggle
- Resume sections including Education, Skills, Work Experience, and Projects
- Contact information
- Link to Rutgers Newark homepage
- Downloadable resume PDF
- Rutgers-themed color scheme

## Setup Instructions

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. View the site at http://localhost:3000

## Adding Required Files

### Resume PDF
To enable the resume download functionality:
1. Convert your resume to PDF format
2. Name the file `resume.pdf`
3. Place the file in the `public` folder of this project
4. The download link in the About section will automatically link to this file

## Customizing Content

You can customize the content of this website by editing the following files:

- `src/components/Header.js` - Update your name and title
- `src/components/About.js` - Edit your About Me section
- `src/components/Resume.js` - Update your education, skills, work experience, and projects
- `src/components/Contact.js` - Edit your contact information
- `src/components/Footer.js` - Update copyright information

## Deployment

To build the site for production:

1. Run `npm run build`
2. Upload the contents of the `build` folder to your hosting provider

## Technologies Used

- React
- CSS
- Local Storage (for dark mode preference)

## Created By

Matthew Eng
