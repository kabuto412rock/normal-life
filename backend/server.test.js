const { describe, test, beforeAll, expect } = require('@jest/globals');

const {app, init} = require('./server')
const request = require('supertest');

beforeAll(async () => {
  await init();
})

describe('test /users api', () => { 

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

  test('無資料狀態下查資料成功', async () => { 
    expect(response.status).toEqual(200)
    expect(response.body.success).toEqual(true)
    expect(response.body.costs).toHaveLength(0);
  })

 })

describe('新增每日花費 [POST] /api/costs', () => { 
  const payload = {
    name: '蝦仁肉絲炒飯2',
    cash: 65,
    remark: '午餐'
  }
  
  test('新增cost回應成功', async () => { 
    let response = await request(app).post('/api/costs').set('Accept', 'application/json')
    .send(payload)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('dataValues')
    expect(response.body.dataValues).toHaveProperty('id', 1)
    expect(response.body.dataValues).toHaveProperty('createdAt')
    expect(response.body.dataValues).toHaveProperty('updatedAt')
  })

  test('新增資料後可以查到至少一筆資料', async () => { 
    let response = await request(app).get('/api/costs').set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(response.body.success).toEqual(true)
    expect(response.body.costs).toHaveLength(1)
    expect(response.body.costs[0]).toEqual(expect.objectContaining({
      id: 1,
      ...payload,
    }))
    expect(response.body.costs[0]).toHaveProperty('createdAt')
    expect(response.body.costs[0]).toHaveProperty('updatedAt')
  })
  
 })

//  TODO:刪除測試 、更新測試