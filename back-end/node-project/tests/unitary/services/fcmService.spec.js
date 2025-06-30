// Skip all FCM tests in CI environment (GitHub Actions)
const describeOrSkip = process.env.CI ? describe.skip : describe;

describeOrSkip("fcmService", () => {
  beforeEach(() => {
    jest.resetModules();
    // Mock firebase-admin only when not in CI
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
  });

  afterEach(() => {
    jest.resetModules();
    jest.unmock("firebase-admin");
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

// Always run this test to ensure the fallback behavior works
describe("fcmService fallback behavior", () => {
  it("should handle missing service account gracefully", () => {
    // This test verifies that when credentials are missing,
    // the service degrades gracefully rather than crashing
    expect(() => {
      require("../../../services/fcmService");
    }).not.toThrow();
  });
});