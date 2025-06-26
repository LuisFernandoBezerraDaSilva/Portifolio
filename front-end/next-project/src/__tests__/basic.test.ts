describe('Basic Test Suite', () => {
  test('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })
  
  test('should work with basic assertions', () => {
    const message = 'Hello World'
    expect(message).toBe('Hello World')
    expect(message).toHaveLength(11)
  })
})
