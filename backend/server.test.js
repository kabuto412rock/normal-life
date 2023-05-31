const { describe, test, beforeAll } = require('@jest/globals');

const {app, init} = require('./server')
const request = require('supertest');


describe('test /users api', () => { 
  beforeAll(async () => {
    await init();
  })
  test('test response', async function () {
    const response = await request(app).get('/users').set('Accept', 'application/json')
    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/html/)
    expect(response.text).toEqual('respond with a resource')
  })
})

describe('查詢花費紀錄 [GET] /api/costs', () => { 
    //  
    let response; 
    beforeAll(async() => {
      response = await request(app).get('/api/costs').set('Accept', 'application/json')
    })

  test('should response have fieldsuccess', async () => { 
    expect(response.status).toEqual(200)
    expect(response.body.success).toEqual(true)
  })

  test('should response empty costs ', async () => { 
    expect(response.body.costs).toHaveLength(0);
    
   })
 })
