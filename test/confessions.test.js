const assert = require('node:assert/strict')
const test = require('node:test')
const app = require('../app')

let server
let baseUrl

function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
    ...options
  })
}

test.before(async () => {
  server = await new Promise((resolve) => {
    const activeServer = app.listen(0, () => resolve(activeServer))
  })
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

test.after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
})

test('creates and retrieves a confession', async () => {
  const createResponse = await request('/api/v1/confessions', {
    method: 'POST',
    body: JSON.stringify({ text: 'The deploy was green after the refactor.', category: 'bug' })
  })
  const created = await createResponse.json()

  assert.equal(createResponse.status, 201)
  assert.equal(created.id, 1)
  assert.equal(created.category, 'bug')

  const getResponse = await request(`/api/v1/confessions/${created.id}`)
  assert.equal(getResponse.status, 200)
  assert.equal((await getResponse.json()).text, created.text)
})

test('lists and filters confessions', async () => {
  await request('/api/v1/confessions', {
    method: 'POST',
    body: JSON.stringify({ text: 'Deadlines are a forcing function.', category: 'deadline' })
  })

  const listResponse = await request('/api/v1/confessions')
  const list = await listResponse.json()
  assert.equal(listResponse.status, 200)
  assert.equal(list.count, 2)

  const categoryResponse = await request('/api/v1/confessions/category/bug')
  const categoryItems = await categoryResponse.json()
  assert.equal(categoryResponse.status, 200)
  assert.equal(categoryItems.length, 1)
  assert.equal(categoryItems[0].category, 'bug')
})

test('rejects invalid input and categories', async () => {
  const missingTextResponse = await request('/api/v1/confessions', {
    method: 'POST',
    body: JSON.stringify({ category: 'bug' })
  })
  assert.equal(missingTextResponse.status, 400)
  assert.deepEqual(await missingTextResponse.json(), { msg: 'need text' })

  const invalidCategoryResponse = await request('/api/v1/confessions', {
    method: 'POST',
    body: JSON.stringify({ text: 'Valid text', category: 'other' })
  })
  assert.equal(invalidCategoryResponse.status, 400)
  assert.equal(await invalidCategoryResponse.text(), 'category not in stuff')

  const invalidFilterResponse = await request('/api/v1/confessions/category/other')
  assert.equal(invalidFilterResponse.status, 400)
})

test('protects and performs deletion', async () => {
  const deniedResponse = await request('/api/v1/confessions/1', { method: 'DELETE' })
  assert.equal(deniedResponse.status, 403)

  const deleteResponse = await request('/api/v1/confessions/1', {
    method: 'DELETE',
    headers: { 'x-delete-token': 'supersecret123' }
  })
  assert.equal(deleteResponse.status, 200)
  assert.equal((await deleteResponse.json()).msg, 'ok')

  const missingResponse = await request('/api/v1/confessions/1')
  assert.equal(missingResponse.status, 404)
})
