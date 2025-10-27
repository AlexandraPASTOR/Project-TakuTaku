import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API TakuTaku',
      version: '1.0.0',
      description: 'Documentation de l\'API de l\'application TakuTaku',
    },
    servers: [
      { url: 'https://project-takutaku.onrender.com' },
    ],
    tags: [
      { name: 'Abonnement' },
      { name: 'Anime' },
      { name: 'Auth' },
      { name: 'Episode' },
      { name: 'Favorite' },
      { name: 'Genre' },
      { name: 'History' },
      { name: 'Note' },
      { name: 'ProfilPicture' },
      { name: 'Season' },
      { name: 'Type' },
      { name: 'User' },
      { name: 'Root' },
    ],
  },
  apis: ['./src/docs/**/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
