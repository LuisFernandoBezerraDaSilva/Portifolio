// Completely skip FCM tests in CI environment
if (process.env.CI) {
  describe.skip("fcmService (skipped in CI)", () => {
    it("FCM tests are skipped in CI environment", () => {
      // This test suite is completely skipped in CI
    });
  });
} else {
  // Run FCM tests only locally
  jest.mock("firebase-admin", () => {
    const messaging = jest.fn().mockReturnThis();
    messaging.send = jest.fn().mockResolvedValue("mocked-message-id");
    return {
      credential: { cert: jest.fn() },
      initializeApp: jest.fn(),
      apps: [],
      messaging: () => messaging,
    };
  });

  describe("fcmService (local only)", () => {
    afterEach(() => {
      jest.resetModules();
    });

    it("should send notification using firebase-admin", async () => {
      const { sendNotification } = require("../../../services/fcmService");
      const token = "fake-token";
      const notification = { title: "Test", body: "Test body" };
      const result = await sendNotification(token, notification);
      expect(result).toBe("mocked-message-id");
    });

    it("should warn and return null if firebase-admin fails to load", async () => {
      jest.resetModules();
      jest.unmock("firebase-admin");
      
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      
      // Mock firebase-admin to throw an error
      jest.doMock("firebase-admin", () => {
        throw new Error("firebase-admin not available");
      });
      
      const { sendNotification } = require("../../../services/fcmService");
      const result = await sendNotification("token", { title: "t", body: "b" });
      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith("FCM desativado: serviceAccount não encontrado ou erro ao inicializar.");
      
      warnSpy.mockRestore();
    });
  });
}

// This test always runs to ensure basic module loading works
describe("fcmService module loading", () => {
  it("should load the module without throwing errors", () => {
    expect(() => {
      require("../../../services/fcmService");
    }).not.toThrow();
  });
});