import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CostsService } from '../src/costs/costs.service';
const API_COST_URL = '/api/costs';
const payload = {
  name: '蝦仁肉絲炒飯',
  cash: 65,
  remark: '午餐',
};
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

// TODO:目前剩查詢測試沒改完
describe('查詢花費紀錄 [GET] ' + API_COST_URL, () => {
  let app: INestApplication;
  let costsService: CostsService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    costsService = app.get(CostsService);
  });

  test('無資料狀態下查資料成功', async () => {
    const response = await request(app.getHttpServer())
      .get(API_COST_URL)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(1);
    expect(response.body.costs).toHaveLength(0);
  });

  test('預填30筆資料查資料成功', async () => {
    const promises = [];
    for (let i = 0; i < 30; i++) {
      promises.push(costsService.create({ ...payload }));
    }
    await Promise.all(promises);

    const searchResponse1 = await request(app.getHttpServer())
      .get(API_COST_URL)
      .set('Accept', 'application/json');
    const costs = searchResponse1.body.costs;

    expect(searchResponse1.status).toEqual(200);
    expect(searchResponse1.body.success).toEqual(1);
    expect(costs).toHaveLength(30);

    for (let i = 0; i < 30; i++) {
      expect(costs[i].createdAt).toMatch(
        /^(\d{4})-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)?$/,
      );
      expect(costs[i].updatedAt).toMatch(
        /^(\d{4})-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)?$/,
      );
      expect(costs[i]).toEqual(
        expect.objectContaining({
          id: i + 1,
          ...payload,
        }),
      );
    }
  });

  test('使用limit=15, offset=5查詢資料後第5~20筆, 預設排序是用id', async () => {
    const expectdLimit = 15;
    const expectedOffset = 5;
    const queryParamsStr = new URLSearchParams({
      limit: `${expectdLimit}`,
      offset: `${expectedOffset}`,
    }).toString();
    const searchResponse = await request(app.getHttpServer())
      .get(API_COST_URL + '?' + queryParamsStr)
      .set('Accept', 'application/json');
    expect(searchResponse.status).toEqual(200);
    expect(searchResponse.body.success).toEqual(1);

    const costs = searchResponse.body.costs;
    expect(costs).toHaveLength(15);

    for (let i = 0; i < expectdLimit; i++) {
      expect(costs[i].createdAt).toMatch(
        /^(\d{4})-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)?$/,
      );
      expect(costs[i].updatedAt).toMatch(
        /^(\d{4})-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)?$/,
      );
      expect(costs[i]).toEqual(
        expect.objectContaining({
          id: i + expectedOffset + 1,
          ...payload,
        }),
      );
    }
  });
});

describe('新增每日花費 [POST] /api/costs', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('新增cost回應成功', async () => {
    const response = await request(app.getHttpServer())
      .post(API_COST_URL)
      .set('Accept', 'application/json')
      .send(payload);
    expect(response.body).toHaveProperty('success', 1);
    expect(response.body).toHaveProperty('dataValues');
    expect(response.body.dataValues).toHaveProperty('id', 1);
    expect(response.body.dataValues).toHaveProperty('createdAt');
    expect(response.body.dataValues).toHaveProperty('updatedAt');
  });

  it('新增資料後可以查到至少一筆資料', async () => {
    const response = await request(app.getHttpServer())
      .get(API_COST_URL)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(1);
    expect(response.body.costs).toHaveLength(1);
    expect(response.body.costs[0]).toEqual(
      expect.objectContaining({
        id: 1,
        ...payload,
      }),
    );
    expect(response.body.costs[0]).toHaveProperty('createdAt');
    expect(response.body.costs[0]).toHaveProperty('updatedAt');
  });
});
describe('刪除每日花費 [DELETE] /api/costs/:id', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await request(app.getHttpServer())
      .post(API_COST_URL)
      .set('Accept', 'application/json')
      .send(payload);
  });

  test('成功刪除一筆', async () => {
    const response = await request(app.getHttpServer())
      .delete(`${API_COST_URL}/1`)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.msg).toEqual('The cost[1] delete success');
    expect(response.body.success).toEqual(1);
  });

  test('無法刪除不存在的花費並返回出錯格式', async () => {
    const response = await request(app.getHttpServer())
      .delete(`${API_COST_URL}/1000000`)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.msg).toEqual('The cost delete fail...');
    expect(response.body.success).toEqual(0);
  });
});
describe('更新cost紀錄 [PATCH] /api/costs/1', () => {
  const newName = 'OKO)///';
  const newRemark = 'iafiiasoo';
  const newCash = 9999;
  let app: INestApplication;
  let costsService: CostsService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    costsService = app.get(CostsService);

    await request(app.getHttpServer())
      .post(API_COST_URL)
      .set('Accept', 'application/json')
      .send(payload);
  });

  test('僅更新名稱 name', async () => {
    const expectedId = 1;
    const response = await request(app.getHttpServer())
      .patch(API_COST_URL + '/' + expectedId)
      .set('Accept', 'application/json')
      .send({ name: newName });

    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(1);
    expect(response.body.msg).toEqual(`The cost[${expectedId}] update success`);

    const costRow = await costsService.findOne(expectedId);
    expect(costRow).toEqual(
      expect.objectContaining({
        id: 1,
        ...payload,
        name: newName,
      }),
    );
  });

  test('僅更新名稱 cash, remark', async () => {
    const expectedId = 1;

    const response = await request(app.getHttpServer())
      .patch(API_COST_URL + '/' + expectedId)
      .set('Accept', 'application/json')
      .send({ cash: newCash, remark: newRemark });

    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(1);
    expect(response.body.msg).toEqual(`The cost[${expectedId}] update success`);
    const costRow = await costsService.findOne(expectedId);
    expect(costRow).toEqual(
      expect.objectContaining({
        id: expectedId,
        name: newName,
        cash: newCash,
        remark: newRemark,
      }),
    );
  });
});
