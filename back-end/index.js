const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const routes = require('./routes/route');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', routes);

const server = app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

module.exports = { prisma, server };