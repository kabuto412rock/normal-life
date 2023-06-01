const { describe, test, beforeAll, expect } = require('@jest/globals');

const {app, init} = require('./server')
const request = require('supertest');

beforeAll(async () => {
  await init();
})

const API_COST_URL = '/api/costs'
describe('test /users api', () => { 

  test('test response', async function () {
    const response = await request(app).get('/users').set('Accept', 'application/json')
    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/html/)
    expect(response.text).toEqual('respond with a resource')
  })
})

describe('查詢花費紀錄 [GET] '+API_COST_URL, () => { 
    //  
    let response; 
    beforeAll(async() => {
      response = await request(app).get(API_COST_URL).set('Accept', 'application/json')
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
    let response = await request(app).post(API_COST_URL).set('Accept', 'application/json')
    .send(payload)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('dataValues')
    expect(response.body.dataValues).toHaveProperty('id', 1)
    expect(response.body.dataValues).toHaveProperty('createdAt')
    expect(response.body.dataValues).toHaveProperty('updatedAt')
  })

  test('新增資料後可以查到至少一筆資料', async () => { 
    let response = await request(app).get(API_COST_URL).set('Accept', 'application/json')
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
describe('刪除每日花費 [DELETE] /api/costs/:id', () => { 
  
  test('should delete one', async () => { 
    let response = await request(app).delete(`${API_COST_URL}/1`).set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(response.body.msg).toEqual('The cost[1] delete success')
    expect(response.body.success).toEqual(1)
   })
 })

//  3. TODO:( ):添加現有API的測試(jest) - 更新cost紀錄
//  4. TODO:( ):添加現有API的測試(jest) - 查詢cost紀錄 需要可增加參數 limit, offset