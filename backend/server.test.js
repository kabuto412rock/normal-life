const { describe, test, beforeAll, expect } = require('@jest/globals');

const {app, init} = require('./server')
const db = require('./models');
const Cost = db.costs;

const request = require('supertest');

const payload = {
  name: '蝦仁肉絲炒飯2',
  cash: 65,
  remark: '午餐'
}

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
    beforeAll(async () => {
      await init({force: true});
    })
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
  beforeAll(async () => {
    await init({force: true});
  })

  
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
  beforeAll(async () => {
    await init({force: true});
    await request(app).post(API_COST_URL).set('Accept', 'application/json')
    .send(payload)
  })
  test('成功刪除一筆', async () => { 
    let response = await request(app).delete(`${API_COST_URL}/1`).set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(response.body.msg).toEqual('The cost[1] delete success')
    expect(response.body.success).toEqual(1)
   })

  test('無法刪除不存在的花費並返回出錯格式', async() => {
    let response = await request(app).delete(`${API_COST_URL}/1000000`).set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(response.body.msg).toEqual('The cost delete fail...')
    expect(response.body.success).toEqual(0) 
  })
 })

describe('更新cost紀錄 [PATCH] /api/costs/1', () => { 
  const newName = 'OKO)///' 
  const newRemark = 'iafiiasoo';
  const newCash = 9999
  beforeAll(async () => {
    await init({force: true});
    await request(app).post(API_COST_URL).set('Accept', 'application/json')
    .send(payload)
  })

  test('僅更新名稱 name', async () => {
    const expectedId = 1
    let response = await request(app).patch(API_COST_URL+'/'+expectedId).set('Accept', 'application/json')
    .send({name: newName})

    expect(response.status).toEqual(200)
    expect(response.body.success).toEqual(1)
    expect(response.body.msg).toEqual(`The cost[${expectedId}] update success`)

    const costRow = await  Cost.findOne({id: expectedId});
    expect(costRow).toEqual(expect.objectContaining({
      id: 1,
      ...payload,
      name: newName
    }))
  })

  test('僅更新名稱 cash, remark', async () => {
    const expectedId = 1
    
    let response = await request(app).patch(API_COST_URL+'/'+expectedId).set('Accept', 'application/json')
    .send({cash: newCash, remark: newRemark})

    expect(response.status).toEqual(200)
    expect(response.body.success).toEqual(1)
    expect(response.body.msg).toEqual(`The cost[${expectedId}] update success`)
    const costRow = await  Cost.findOne({id: expectedId});
    expect(costRow).toEqual(expect.objectContaining({
      id: expectedId,
      name: newName,
      cash: newCash,
      remark: newRemark
    }))
  }) 
  
  
})
//  4. TODO:( ):添加現有API的測試(jest) - 查詢cost紀錄 需要可增加參數 limit, offset