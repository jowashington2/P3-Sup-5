const request = require('supertest');
const app = require('./server');

describe('POST /', () => {
  it('should respond with the content in the body’s "content" field', async () => {
    const response = await request(app)
      .post('/')
      .send({ content: 'Hello, World!', extra: 'Ignored' })
      .expect('Content-Type', /json/)
      .expect(200);
      
    expect(response.body).toEqual({ content: 'Hello, World!' });
  });

  it('should create a file and write the content to it', async () => {
    const fs = require('fs');
    const filename = 'output.txt';

    // Send the POST request
    await request(app)
      .post('/')
      .send({ content: 'Hello, World!' });

    // Check that the file exists and has the correct content
    const fileContent = fs.readFileSync(filename, 'utf8');
    expect(fileContent).toBe('Hello, World!');

    // Clean up
    fs.unlinkSync(filename);
  });

  it('should save the JSON body into the database', async () => {
    const mongoose = require('mongoose');
    const DataModel = require('./models/dataModel');

    // Clear the collection before test
    await DataModel.deleteMany({});

    // Send the POST request
    const requestBody = { content: 'Hello, World!', extra: 'Ignored' };
    await request(app).post('/').send(requestBody);

    // Check that the data is saved in the database
    const savedData = await DataModel.findOne({ content: 'Hello, World!' });
    expect(savedData).toMatchObject(requestBody);
  });
});
