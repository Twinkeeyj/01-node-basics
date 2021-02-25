const authUser=require("../controllers/auth.controller")


describe('Should test /users api', () => {
  describe('Should test GET /users route', () => {
    it('Should test that without token 401 status code is returned', async () => {
      const response = await request(app).get('/users');
      expect(response.statusCode).toBe(401);
    });
  });
});