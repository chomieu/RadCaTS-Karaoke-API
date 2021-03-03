# RadCaTS Karaoke

## Table of Contents
1. [Description](#description)
2. [Authors](#authors)
3. [Technologies](#technologies)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [Tests](#tests)
8. [License](#license)
## Description
A full-featured social karaoke app that dynamically loads content using the YouTube Music API, allows for custom lyric file generation, provides a hub for group sessions, and incorporates 3D elements. Built for the University of Washington's Winter 2020/21 Coding Bootcamp.

## Authors

| Name | Email  | Github  | LinkedIn |
| :--: | :----: | :-----: | :------: |
| Samuel Fox | -- | [![Github](./assets/github.png)](https://github.com/samuelfox1) | [![LinkedIn](./assets/linkedin.png)](https://www.linkedin.com/in/samuel-fox-tacoma/) |
| Timothy M. Keller | -- | [![Github](./assets/github.png)](https://github.com/tmkeller) | [![LinkedIn](./assets/linkedin.png)](https://linkedin.com/in/tim-keller-3ab55bb1/) |
| Chomie Usaneerungrueng | -- | [![Github](./assets/github.png)](https://github.com/chomieu) | [![LinkedIn](./assets/linkedin.png)](https://www.linkedin.com/in/chomieu/) |
| Rita Zhu | -- | [![Github](./assets/github.png)](https://github.com/zhuxiaoyu1019) | [![LinkedIn](./assets/linkedin.png)](https://www.linkedin.com/in/rita-z-2495b01a1//) |
<br>

## Technologies
![javascript](https://img.shields.io/badge/javascript-100%25-yellow)

### Notable Dependencies
- Axios: For querying other APIs.
- BCrypt: Encryption and decryption algorithms.
- Cloudinary: Provides cloud storage functionality for audio files.
- CORS: Enable CORS between this and other APIs.
- dotenv: Support for environment variables to hide API keys and other sensitive data.
- Express: Framework for this web application's server environment.
- FFMPEG: Allows MPEG conversion and streaming.
- JSON Web Token: Enables decoding and transmission of JSON web tokens.
- LRC.js: Parser for LRC files.
- Mongoose: Object modeling for the MongoDB database.
- Morgan: Middleware to log HTTP requests.
- YouTube Music API: Permits us to pull audio from YouTube videos.
- YTDL Core: YouTube downloading module.

## Installation
Clone from git into your chosen directory and install dependencies with npm i. Frontend and backend are located in separate repositories and should be installed on separate servers. The backend requires a local MongoDB installation. Both can be run with npm start.
[Frontend Repository](https://github.com/chomieu/RadCaTS-Karaoke)
[Backend Repository](https://github.com/chomieu/RadCaTS-Karaoke-API)

## Usage
The landing page will prompt the user to create or sign in with login credentials. Next you will be prompted to find a song. This page searches our Cloudinary storage for matches to the user input, then loads it or attempts to download it if not there. Next, you will be prompted to generate a lyrics file if one is not present using our lyrics file generator. Finally, the user moves to the actual session where the play button controls music playback and lyrics are displayed onscreen. Other users can join this session by entering the session URL, and the site provides functionality to share URLs with other users through email.

## Contributing
Fork our git, and contact the repository owner about pull requests.

## Tests
No testing suite is designated at this time.

## License
No license is provided for this software