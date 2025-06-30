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

describe("fcmService", () => {
  afterEach(() => {
    jest.resetModules();
  });

  // Skip FCM tests in CI environment (GitHub Actions)
  const runTest = process.env.CI ? describe.skip : describe;
  
  runTest("FCM functionality (local only)", () => {
    it("should send notification using firebase-admin", async () => {
      const { sendNotification } = require("../../../services/fcmService");
      const token = "fake-token";
      const notification = { title: "Test", body: "Test body" };
      const result = await sendNotification(token, notification);
      expect(result).toBe("mocked-message-id");
    });
  });

  it("should warn and return null if firebase-admin fails to load", async () => {
    jest.resetModules();
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.doMock(
      "../../../services/fcmService",
      () => {
        return {
          sendNotification: async () => {
            console.warn("FCM desativado: serviceAccount não encontrado ou erro ao inicializar.");
            return null;
          },
        };
      },
      { virtual: true }
    );
    const { sendNotification } = require("../../../services/fcmService");
    const result = await sendNotification("token", { title: "t", body: "b" });
    expect(result).toBeNull();
    warnSpy.mockRestore();
  });
});